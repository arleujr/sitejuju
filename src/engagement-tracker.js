const cfg = window.__LOVE_ANALYTICS__ || {};
const API_BASE = String(cfg.apiBase || '/api').replace(/\/$/, '');
const ENABLED = cfg.enabled !== false;

const LEGACY_VISIT_KEY = 'love-story-visit-id-v1';
const DEVICE_KEY = 'love-story-device-id-v2';
const RECIPIENT_KEY = 'love-story-recipient-v1';

const STAGES = [
  { id:'hero', label:'Hero', selector:'#inicio' },
  { id:'first-kiss', label:'Primeiro beijo', selector:'#ato-1' },
  { id:'routine', label:'Rotina / conversa', selector:'[data-story]' },
  { id:'work', label:'Trabalho', selector:'[data-work-gallery]' },
  { id:'smile', label:'Sorriso', selector:'.smile-v5__section' },
  { id:'style', label:'Estilo', selector:'.style-v1__section' },
  { id:'gym', label:'Academia', selector:'.gym-v1__section' },
  { id:'vivencias', label:'Vivências', selector:'.viv4' },
  { id:'final-video', label:'Vídeo final', selector:'.viv4-bridge' },
  { id:'continua', label:'Continua...', selector:'.love-outro' },
];

function randomId(prefix = '') {
  const raw = globalThis.crypto?.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return prefix ? `${prefix}-${raw}` : raw;
}

function storageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}

function getDeviceId() {
  let id = storageGet(DEVICE_KEY);
  if (id) return id;

  // Reaproveita o identificador anônimo da versão anterior para não perder
  // continuidade de um navegador que já havia visitado o site.
  id = storageGet(LEGACY_VISIT_KEY) || randomId('dev');
  storageSet(DEVICE_KEY, id);
  return id;
}

function getRecipient() {
  const url = new URL(location.href);
  const fromUrl = (url.searchParams.get('r') || '').trim().slice(0, 80);
  if (fromUrl) {
    storageSet(RECIPIENT_KEY, fromUrl);
    return fromUrl;
  }
  return storageGet(RECIPIENT_KEY) || 'public';
}

function deviceClass() {
  const touch = navigator.maxTouchPoints > 0;
  if (matchMedia('(max-width: 860px)').matches) return touch ? 'mobile' : 'small-screen';
  return touch ? 'tablet' : 'desktop';
}

function browserName() {
  const ua = navigator.userAgent || '';
  if (/Edg\//.test(ua)) return 'Edge';
  if (/OPR\//.test(ua)) return 'Opera';
  if (/CriOS\//.test(ua)) return 'Chrome iOS';
  if (/FxiOS\//.test(ua)) return 'Firefox iOS';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Version\/.+Safari\//.test(ua)) return 'Safari';
  return 'Outro';
}

function osName() {
  const ua = navigator.userAgent || '';
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS / iPadOS';
  if (/Android/.test(ua)) return 'Android';
  if (/Windows/.test(platform) || /Windows NT/.test(ua)) return 'Windows';
  if (/Mac/.test(platform) || /Mac OS X/.test(ua)) return 'macOS';
  if (/CrOS/.test(ua)) return 'ChromeOS';
  if (/Linux/.test(platform) || /Linux/.test(ua)) return 'Linux';
  return 'Outro';
}

function clientTimezone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; }
}

function referrerOrigin() {
  if (!document.referrer) return '';
  try { return new URL(document.referrer).origin; } catch { return ''; }
}

function post(path, payload, { beacon = false } = {}) {
  if (!ENABLED) return Promise.resolve(null);
  const url = `${API_BASE}${path}`;
  const encoded = JSON.stringify(payload);

  if (beacon && navigator.sendBeacon) {
    try {
      // text/plain mantém o beacon como request simples mesmo quando o Worker
      // de analytics está em outro domínio. O corpo continua sendo JSON válido.
      const ok = navigator.sendBeacon(
        url,
        new Blob([encoded], { type:'text/plain;charset=UTF-8' }),
      );
      return Promise.resolve(ok);
    } catch {}
  }

  return fetch(url, {
    method:'POST',
    headers:{ 'content-type':'application/json' },
    body:encoded,
    keepalive:true,
  }).then((response) => response.ok
    ? response.json().catch(() => null)
    : Promise.reject(new Error(`HTTP ${response.status}`)));
}

const deviceId = getDeviceId();
const sessionId = randomId('acc'); // uma abertura/reload = um acesso individual
const recipient = getRecipient();

const identityPayload = {
  sessionId,
  deviceId,
  recipient,
  deviceClass:deviceClass(),
  browser:browserName(),
  os:osName(),
  locale:navigator.language || '',
  timezone:clientTimezone(),
  path:location.pathname,
  referrer:referrerOrigin(),
};

let accumulatedActiveMs = 0;
let visibleSince = document.visibilityState === 'visible' ? performance.now() : 0;

function activeSeconds() {
  let current = accumulatedActiveMs;
  if (visibleSince) current += Math.max(0, performance.now() - visibleSince);
  return Math.floor(current / 1000);
}

function pauseActiveClock() {
  if (!visibleSince) return;
  accumulatedActiveMs += Math.max(0, performance.now() - visibleSince);
  visibleSince = 0;
}

function resumeActiveClock() {
  if (!visibleSince && document.visibilityState === 'visible') visibleSince = performance.now();
}

let bestScore = -1;
let bestPayload = null;
let lastSentAt = 0;
let timer = 0;
let ended = false;

function isUsable(el) {
  if (!el) return false;
  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  if (el.getAttribute('aria-hidden') === 'true') return false;
  const shell = el.closest('[data-love-continuation-shell]');
  if (shell?.getAttribute('aria-hidden') === 'true') return false;
  return true;
}

function stageProgress(el) {
  const r = el.getBoundingClientRect();
  const vh = Math.max(1, window.innerHeight);
  const travel = Math.max(1, r.height - vh);
  if (r.top > vh) return 0;
  if (r.bottom <= 0) return 100;
  if (r.height <= vh) {
    return r.top <= vh * .55 && r.bottom >= vh * .45 ? 50 : (r.top < 0 ? 100 : 0);
  }
  return Math.round(Math.max(0, Math.min(1, -r.top / travel)) * 100);
}

function activeStage() {
  const center = window.innerHeight * .5;
  let best = null;
  STAGES.forEach((stage, index) => {
    const el = document.querySelector(stage.selector);
    if (!isUsable(el)) return;
    const r = el.getBoundingClientRect();
    if (!(r.top <= center && r.bottom >= center)) return;
    if (stage.id === 'routine') {
      const work = document.querySelector('[data-work-gallery]');
      if (work?.classList.contains('is-active')) return;
    }
    best = { stage, index, el };
  });
  return best;
}

function snapshot() {
  const current = activeStage();
  if (!current) return null;
  const local = stageProgress(current.el);
  const score = current.index * 100 + local;
  return {
    sessionId,
    deviceId,
    recipient,
    stageIndex:current.index,
    stageId:current.stage.id,
    stageLabel:current.stage.label,
    stageProgress:local,
    score,
    completed:current.stage.id === 'continua',
  };
}

function maybeSend(force = false, beacon = false) {
  const snap = snapshot();
  if (snap && snap.score > bestScore) {
    bestScore = snap.score;
    bestPayload = snap;
  }
  if (!bestPayload) return;

  const now = Date.now();
  if (!force && now - lastSentAt < 5000) return;
  lastSentAt = now;
  post('/progress', { ...bestPayload, activeSeconds:activeSeconds() }, { beacon }).catch(() => {});
}

function ping(beacon = false) {
  return post('/session/ping', {
    sessionId,
    deviceId,
    recipient,
    activeSeconds:activeSeconds(),
  }, { beacon }).catch(() => {});
}

function finishSession() {
  if (ended) return;
  ended = true;
  pauseActiveClock();
  maybeSend(true, true);
  post('/session/end', {
    sessionId,
    deviceId,
    recipient,
    activeSeconds:activeSeconds(),
  }, { beacon:true }).catch(() => {});
}

function scheduleTick() {
  clearTimeout(timer);
  timer = setTimeout(() => maybeSend(false, false), 350);
}

post('/session/start', identityPayload).catch(() => {});

window.addEventListener('scroll', scheduleTick, { passive:true });
window.addEventListener('resize', scheduleTick, { passive:true });
document.addEventListener('nextscene:entered', () => setTimeout(() => maybeSend(true, false), 150));

document.addEventListener('love:vote', (event) => {
  const vote = event.detail?.vote;
  if (vote !== 'yes' && vote !== 'no') return;
  post('/vote', {
    sessionId,
    deviceId,
    recipient,
    vote,
    activeSeconds:activeSeconds(),
  })
    .then(() => document.dispatchEvent(new CustomEvent('love:vote-saved', { detail:{ vote } })))
    .catch(() => document.dispatchEvent(new CustomEvent('love:vote-error', { detail:{ vote } })));
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    pauseActiveClock();
    maybeSend(true, true);
    ping(true);
  } else {
    resumeActiveClock();
  }
});

window.addEventListener('pagehide', (event) => {
  if (event.persisted) {
    pauseActiveClock();
    maybeSend(true, true);
    ping(true);
    return;
  }
  finishSession();
});

// Mantém último horário e tempo ativo razoavelmente precisos mesmo que o
// navegador móvel mate a aba sem disparar pagehide.
const heartbeat = setInterval(() => {
  if (document.visibilityState !== 'visible' || ended) return;
  ping(false);
}, 15000);

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Uma página restaurada do bfcache continua a mesma sessão e não cria
    // um acesso artificial novo.
    resumeActiveClock();
  }
});

setTimeout(() => maybeSend(true, false), 900);

export { deviceId, sessionId, recipient };
