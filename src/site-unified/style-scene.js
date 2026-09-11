import { createScrollFrameDriver } from './performance-runtime.js';

const PHOTO_MANIFEST = {
  'estilo-01': { file: 'estilo-01.webp', width: 900, height: 1600 },
  'estilo-02': { file: 'estilo-02.webp', width: 900, height: 1600 },
  'estilo-03': { file: 'estilo-03.webp', width: 900, height: 1600 },
  'estilo-04': { file: 'estilo-04.webp', width: 900, height: 1600 },
  'estilo-05': { file: 'estilo-05.webp', width: 900, height: 1600 },
  'estilo-06': { file: 'estilo-06.webp', width: 900, height: 1600 },
  'estilo-07': { file: 'estilo-07.webp', width: 900, height: 1600 },
  'estilo-08': { file: 'estilo-08.webp', width: 900, height: 1600 },
  'estilo-09': { file: 'estilo-09.webp', width: 900, height: 1600 },
  'estilo-10': { file: 'estilo-10.webp', width: 1200, height: 1600, cutout: true },
  'estilo-11': { file: 'estilo-11.webp', width: 720, height: 1280 },
  'estilo-12': { file: 'estilo-12.webp', width: 900, height: 1600 },
  'estilo-13': { file: 'estilo-13.webp', width: 900, height: 1600 },
  'estilo-14': { file: 'estilo-14.webp', width: 574, height: 1259, cutout: true },
  'estilo-15': { file: 'estilo-15.webp', width: 900, height: 1600 },
  'estilo-16': { file: 'estilo-16.webp', width: 406, height: 503 },
  'estilo-17': { file: 'estilo-17.webp', width: 1200, height: 1600, cutout: true },
  'estilo-18': { file: 'estilo-18.webp', width: 1200, height: 1600 },
  'estilo-19': { file: 'estilo-19.webp', width: 900, height: 1600 },
  'estilo-20': { file: 'estilo-20.webp', width: 900, height: 1600 },
  'estilo-21': { file: 'estilo-21.webp', width: 1080, height: 1920 },
  'estilo-22': { file: 'estilo-22.webp', width: 540, height: 960, cutout: true },
  'estilo-23': { file: 'estilo-23.webp', width: 540, height: 960 },
};

const STAGES = [
  {
    id: 's01',
    photos: [
      { id: 'estilo-01', rot: -1.4, enter: [34, -8], exit: [-36, -6], fasteners: [['pin.png','tc',0], ['laco-04.png','tr',6]] },
      { id: 'estilo-02', rot: 1.2, enter: [34, -4], exit: [36, -12], fasteners: [['laco-02.png','tc',0]] },
      { id: 'estilo-03', rot: 0.9, enter: [34, 8], exit: [36, 10], fasteners: [['laco-03.png','tc',2]] },
      { id: 'estilo-10', rot: -0.6, enter: [36, 12], exit: [34, 16], fasteners: [['pin.png','tl',0]] },
      { id: 'estilo-11', rot: -1.5, enter: [0, 28], exit: [-8, 26], fasteners: [['laco-05.png','tc',0]] },
      { id: 'estilo-16', rot: 1.6, enter: [10, 24], exit: [6, 24], fasteners: [['pin.png','tc',0]] },
    ],
    deco: [
      { key: 'styleicon', file: 'styleicon.png', rot: -4, enter: [-18, 10], exit: [-20, 12] },
      { key: 'teamo', file: 'teamo.png', rot: 2, enter: [-22, 18], exit: [-24, 20] },
      { key: 'vogue', file: 'vogue.png', rot: 2, enter: [24, -10], exit: [28, -10] },
      { key: 'tiger02', file: 'tiger02.png', rot: 0, enter: [-26, 18], exit: [-30, 22] },
      { key: 'boca02', file: 'boca02.png', rot: -6, enter: [14, -18], exit: [16, -20] },
      { key: 'camera', file: 'camera.png', rot: -4, enter: [14, 18], exit: [18, 20] },
      { key: 'flor-02', file: 'flor-02.png', rot: 4, enter: [22, 12], exit: [24, 16] },
      { key: 'coracao-01', file: 'coracao-01.png', rot: 0, enter: [10, 8], exit: [12, 8] },
      { key: 'pin', file: 'pin.png', rot: -4, enter: [0, 16], exit: [0, 18] },
    ],
  },
  {
    id: 's02',
    photos: [
      { id: 'estilo-04', rot: -1.3, enter: [-34, -8], exit: [-38, -10], fasteners: [['pin.png','tc',0]] },
      { id: 'estilo-05', rot: 1.1, enter: [-26, -14], exit: [-30, -14], fasteners: [['laco-05.png','tc',0]] },
      { id: 'estilo-06', rot: 1.4, enter: [34, -8], exit: [38, -8], fasteners: [['pin.png','tc',0]] },
      { id: 'estilo-07', rot: -0.8, enter: [0, -28], exit: [0, -30], fasteners: [['laco-03.png','tc',3]] },
      { id: 'estilo-12', rot: -1.2, enter: [-24, 24], exit: [-28, 24], fasteners: [['laco-02.png','tc',0]] },
      { id: 'estilo-14', rot: 1.8, enter: [26, 22], exit: [30, 24], fasteners: [['pin.png','tl',0]] },
    ],
    deco: [
      { key: 'channel', file: 'channel.png', rot: -3, enter: [-20, -14], exit: [-24, -16] },
      { key: 'prada', file: 'prada.png', rot: 2, enter: [26, 12], exit: [30, 16] },
      { key: 'relogio', file: 'relogio.png', rot: 4, enter: [26, -12], exit: [30, -14] },
      { key: 'vogue02', file: 'vogue02.png', rot: -2, enter: [0, 24], exit: [0, 26] },
      { key: 'model-02', file: 'model-02.png', rot: 0, enter: [-12, 22], exit: [-16, 24] },
      { key: 'model-04', file: 'model-04.png', rot: 0, enter: [12, 20], exit: [16, 22] },
      { key: 'catfashion', file: 'catfashion.png', rot: -4, enter: [-18, 18], exit: [-20, 22] },
      { key: 'flor-04', file: 'flor-04.png', rot: 6, enter: [24, 16], exit: [26, 18] },
      { key: 'coracao-02', file: 'coracao-02.png', rot: 0, enter: [10, -10], exit: [12, -12] },
      { key: 'laco-05', file: 'laco-05.png', rot: 6, enter: [-16, -20], exit: [-20, -24] },
      { key: 'vcdeixatudomaisbonito', file: 'vcdeixatudomaisbonito.png', rot: -1, enter: [0, -24], exit: [0, -26] },
      { key: 'ficardecanto-01', file: 'ficardecanto-01.png', rot: 0, enter: [24, 18], exit: [30, 22] },
      { key: 'flor-01', file: 'flor-01.png', rot: -4, enter: [-20, 20], exit: [-24, 24] },
    ],
  },
  {
    id: 's03',
    photos: [
      { id: 'estilo-08', rot: -1.2, enter: [-34, -6], exit: [-38, -6], fasteners: [['pin.png','tc',0]] },
      { id: 'estilo-09', rot: 1.4, enter: [-20, -10], exit: [-24, -12], fasteners: [['laco-03.png','tc',0]] },
      { id: 'estilo-17', rot: -0.7, enter: [0, -26], exit: [0, -28], fasteners: [['laco-01.png','tr',4]] },
      { id: 'estilo-18', rot: 1.1, enter: [26, -10], exit: [30, -12], fasteners: [['laco-02.png','tc',0]] },
      { id: 'estilo-19', rot: -1.4, enter: [-18, 22], exit: [-22, 24], fasteners: [['laco-04.png','tc',0]] },
      { id: 'estilo-22', rot: 1.8, enter: [28, 22], exit: [32, 24], fasteners: [['pin.png','tl',0]] },
    ],
    deco: [
      { key: 'dontflash', file: 'dontflash.png', rot: 0, enter: [-20, 18], exit: [-24, 20] },
      { key: 'coke', file: 'coke.png', rot: -2, enter: [12, 18], exit: [16, 20] },
      { key: 'coke2', file: 'coke2.png', rot: -6, enter: [14, 24], exit: [18, 26] },
      { key: 'botas', file: 'botas.png', rot: 0, enter: [18, -18], exit: [22, -20] },
      { key: 'boca', file: 'boca.png', rot: -7, enter: [0, -18], exit: [0, -20] },
      { key: 'coracao-04', file: 'coracao-04.png', rot: 2, enter: [22, 14], exit: [24, 16] },
      { key: 'revistas', file: 'revistas.png', rot: -3, enter: [0, 20], exit: [0, 22] },
      { key: 'cinema', file: 'cinema.jpg', rot: -2, enter: [-26, 24], exit: [-30, 26] },
      { key: 'flor-03', file: 'flor-03.png', rot: 4, enter: [26, 16], exit: [30, 18] },
      { key: 'laco-03', file: 'laco-03.png', rot: 6, enter: [4, 26], exit: [4, 28] },
      { key: 'model-01', file: 'model-01.png', rot: 0, enter: [-20, 14], exit: [-24, 16] },
    ],
  },
  {
    id: 's04',
    photos: [
      { id: 'estilo-13', rot: -1.2, enter: [-34, -10], exit: [-38, -12], fasteners: [['pin.png','tc',0]] },
      { id: 'estilo-15', rot: 1.1, enter: [-16, -8], exit: [-20, -10], fasteners: [['laco-04.png','tc',0]] },
      { id: 'estilo-20', rot: -0.6, enter: [10, -10], exit: [14, -12], fasteners: [['pin.png','tc',0]] },
      { id: 'estilo-21', rot: 0.8, enter: [28, -10], exit: [32, -12], fasteners: [['laco-05.png','tc',0]] },
      { id: 'estilo-23', rot: -1.2, enter: [0, 24], exit: [0, 28], fasteners: [['pin.png','tc',0]] },
    ],
    deco: [
      { key: 'botas-02', file: 'botas-02.png', rot: -4, enter: [-24, 18], exit: [-28, 20] },
      { key: 'cantoinferiordireito', file: 'cantoinferiordireito.png', rot: 0, enter: [26, 22], exit: [30, 24] },
      { key: 'model-03', file: 'model-03.png', rot: -3, enter: [-20, 12], exit: [-24, 14] },
      { key: 'model-05', file: 'model-05.png', rot: 3, enter: [12, 12], exit: [14, 14] },
      { key: 'model-06', file: 'model-06.png', rot: 0, enter: [18, 12], exit: [22, 14] },
      { key: 'flor-05', file: 'flor-05.png', rot: -6, enter: [-28, 4], exit: [-30, 6] },
      { key: 'tiger', file: 'tiger.png', rot: 0, enter: [30, 0], exit: [34, 0] },
      { key: 'camera', file: 'camera.png', rot: -5, enter: [-18, 20], exit: [-22, 24] },
      { key: 'teamo', file: 'teamo.png', rot: 2, enter: [12, 22], exit: [16, 24] },
      { key: 'styleicon', file: 'styleicon.png', rot: 0, enter: [18, 24], exit: [22, 26] },
    ],
  },
];

const TIMELINE = {
  s1HoldEnd: 0.14,
  s1OutEnd: 0.22,
  s2InEnd: 0.30,
  s2HoldEnd: 0.44,
  s2OutEnd: 0.52,
  s3InEnd: 0.60,
  s3HoldEnd: 0.74,
  s3OutEnd: 0.82,
  s4InEnd: 0.90,
  s4HoldEnd: 0.95,
  finalOutEnd: 1.00,
};

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function between(v, a, b) { return clamp((v - a) / (b - a), 0, 1); }
function ease(t) { return t * t * (3 - 2 * t); }

function setMotionData(el, config) {
  el.dataset.rot = String(config.rot || 0);
  el.dataset.enterX = String(config.enter?.[0] || 0);
  el.dataset.enterY = String(config.enter?.[1] || 0);
  el.dataset.exitX = String(config.exit?.[0] || 0);
  el.dataset.exitY = String(config.exit?.[1] || 0);
}

function createPhotoItem(config, assetBase, loadNow = false) {
  const photo = PHOTO_MANIFEST[config.id];
  const el = document.createElement('div');
  el.className = 'style-v1__item is-photo';
  el.dataset.item = config.id;
  setMotionData(el, config);
  el.innerHTML = `
    <figure class="style-v1__photo" data-cutout="${photo.cutout ? 'true' : 'false'}" style="aspect-ratio:${photo.width}/${photo.height}">
      <span class="style-v1__frame" aria-hidden="true"></span>
      <img class="style-v1__photo-img" data-src="${assetBase}/estilo/${photo.file}" alt="Foto ${config.id}" loading="lazy" decoding="async" />
      <span class="style-v1__gloss" aria-hidden="true"></span>
    </figure>`;
  const fig = el.querySelector('.style-v1__photo');
  const photoImg = el.querySelector('.style-v1__photo-img');
  if (loadNow && photoImg?.dataset.src) {
    photoImg.src = photoImg.dataset.src;
    photoImg.removeAttribute('data-src');
    photoImg.loading = 'eager';
  }
  const gloss = el.querySelector('.style-v1__gloss');
  const idx = Number((config.id.match(/(\d+)$/) || [0, 1])[1]);
  gloss?.style.setProperty('--gloss-duration', `${8 + (idx % 6) * 0.85}s`);
  gloss?.style.setProperty('--gloss-delay', `${-((idx * 1.27) % 7.2)}s`);
  (config.fasteners || []).forEach(([file, anchor, rot]) => {
    const img = document.createElement('img');
    img.className = `style-v1__fastener style-v1__fastener--${anchor}`;
    img.src = `${assetBase}/love-scene-estilo/kit/${file}`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.draggable = false;
    img.style.transform = `rotate(${rot || 0}deg)`;
    fig.appendChild(img);
  });
  return el;
}

function createImageDeco(config, assetBase, loadNow = false) {
  const el = document.createElement('div');
  el.className = `style-v1__item ${config.kind === 'title' ? 'is-title' : 'is-deco'}`;
  el.dataset.item = config.key;
  setMotionData(el, config);
  el.innerHTML = `<img class="style-v1__img" data-src="${assetBase}/love-scene-estilo/kit/${config.file}" alt="" aria-hidden="true" draggable="false" />`;
  const img = el.querySelector('.style-v1__img');
  if (loadNow && img?.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
  return el;
}

function buildSpread(stage, assetBase, loadNow = false) {
  const spread = document.createElement('section');
  spread.className = `style-v1__spread style-v1__spread--${stage.id}`;
  (stage.photos || []).forEach((photo) => spread.appendChild(createPhotoItem(photo, assetBase, loadNow)));
  (stage.deco || []).forEach((deco) => spread.appendChild(createImageDeco(deco, assetBase, loadNow)));
  return spread;
}

function loadSpread(spread) {
  spread?.querySelectorAll('img[data-src]').forEach((img) => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
}

function hide(items) {
  items.forEach((item) => {
    const rot = parseFloat(item.dataset.rot || '0');
    item.style.opacity = '0';
    item.style.transform = `translate(0vw, 0vh) rotate(${rot}deg)`;
  });
}
function hold(items) {
  items.forEach((item) => {
    const rot = parseFloat(item.dataset.rot || '0');
    item.style.opacity = '1';
    item.style.transform = `translate(0vw, 0vh) rotate(${rot}deg)`;
  });
}
function move(items, t, mode) {
  const et = ease(t);
  const mobile = window.innerWidth <= 860;

  const mobileVector = (vx, vy) => {
    if (!mobile) return [vx, vy];
    const sx = Math.sign(vx);
    const sy = Math.sign(vy);
    if (sx && sy) return [sx * 112, sy * 76];
    if (sx) return [sx * 116, 0];
    if (sy) return [0, sy * 112];
    return [0, 0];
  };

  items.forEach((item) => {
    const rot = parseFloat(item.dataset.rot || '0');
    const ex = parseFloat(item.dataset.enterX || '0');
    const ey = parseFloat(item.dataset.enterY || '0');
    const ox = parseFloat(item.dataset.exitX || '0');
    const oy = parseFloat(item.dataset.exitY || '0');
    const [inX, inY] = mobileVector(ex, ey);
    const [outX, outY] = mobileVector(ox, oy);
    const x = mode === 'in' ? inX * (1 - et) : outX * et;
    const y = mode === 'in' ? inY * (1 - et) : outY * et;
    item.style.opacity = '1';
    item.style.transform = `translate(${x}vw, ${y}vh) rotate(${rot}deg)`;
  });
}

function updateScene(host, spreadMap) {
  const section = host.querySelector('.style-v1__section');
  const stage = host.querySelector('.style-v1__scene-stage');
  const externalProgress = Number.parseFloat(host.dataset.loveTrioProgress || '');
  let p;
  if (window.innerWidth <= 860 && Number.isFinite(externalProgress)) {
    p = clamp(externalProgress, 0, 1);
  } else {
    const rect = section.getBoundingClientRect();
    const max = Math.max(1, rect.height - window.innerHeight);
    p = clamp(-rect.top / max, 0, 1);
  }

  if (p > 0.07) loadSpread(spreadMap.s02.root);
  if (p > 0.36) loadSpread(spreadMap.s03.root);
  if (p > 0.64) loadSpread(spreadMap.s04.root);

  Object.values(spreadMap).forEach((spread) => hide(spread.items));
  stage.style.transform = 'translate3d(0,0,0)';

  if (p <= TIMELINE.s1HoldEnd) {
    hold(spreadMap.s01.items);
  } else if (p <= TIMELINE.s1OutEnd) {
    move(spreadMap.s01.items, between(p, TIMELINE.s1HoldEnd, TIMELINE.s1OutEnd), 'out');
  } else if (p <= TIMELINE.s2InEnd) {
    move(spreadMap.s02.items, between(p, TIMELINE.s1OutEnd, TIMELINE.s2InEnd), 'in');
  } else if (p <= TIMELINE.s2HoldEnd) {
    hold(spreadMap.s02.items);
  } else if (p <= TIMELINE.s2OutEnd) {
    move(spreadMap.s02.items, between(p, TIMELINE.s2HoldEnd, TIMELINE.s2OutEnd), 'out');
  } else if (p <= TIMELINE.s3InEnd) {
    move(spreadMap.s03.items, between(p, TIMELINE.s2OutEnd, TIMELINE.s3InEnd), 'in');
  } else if (p <= TIMELINE.s3HoldEnd) {
    hold(spreadMap.s03.items);
  } else if (p <= TIMELINE.s3OutEnd) {
    move(spreadMap.s03.items, between(p, TIMELINE.s3HoldEnd, TIMELINE.s3OutEnd), 'out');
  } else if (p <= TIMELINE.s4InEnd) {
    move(spreadMap.s04.items, between(p, TIMELINE.s3OutEnd, TIMELINE.s4InEnd), 'in');
  } else if (p <= TIMELINE.s4HoldEnd) {
    hold(spreadMap.s04.items);
  } else {
    hold(spreadMap.s04.items);
    const t = between(p, TIMELINE.s4HoldEnd, TIMELINE.finalOutEnd);
    stage.style.transform = `translate3d(${118 * ease(t)}vw, 0, 0)`;
  }
}

export function initStyleScene(root, options = {}) {
  if (!root) throw new Error('initStyleScene(root): root é obrigatório.');
  const assetBase = (options.assetBase || '/assets').replace(/\/$/, '');
  const host = document.createElement('section');
  host.className = 'style-v1';
  host.innerHTML = `
    <div class="style-v1__section">
      <div class="style-v1__sticky">
        <div class="style-v1__next-bg" aria-hidden="true"></div>
        <div class="style-v1__scene-stage">
          <div class="style-v1__paper" aria-hidden="true"></div>
          <img class="style-v1__center-title" src="${assetBase}/love-scene-estilo/kit/amocomovc-estilosa.png" alt="Eu amo como você é estilosa" draggable="false" />
          <div class="style-v1__canvas"></div>
        </div>
      </div>
    </div>`;

  const canvas = host.querySelector('.style-v1__canvas');
  const spreadMap = {};
  STAGES.forEach((stage, index) => {
    const spread = buildSpread(stage, assetBase, index === 0);
    canvas.appendChild(spread);
    spreadMap[stage.id] = { root: spread, items: [...spread.querySelectorAll('.style-v1__item')] };
  });
  root.appendChild(host);

  const cleanups = [];
  host.querySelectorAll('.style-v1__photo-img').forEach((img) => {
    const item = img.closest('.style-v1__item');
    const onLoad = () => item?.classList.add('is-loaded');
    const onError = () => item?.classList.add('is-error');
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    cleanups.push(() => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    });
    if (img.hasAttribute('src') && img.complete) img.naturalWidth ? onLoad() : onError();
  });

  const render = () => updateScene(host, spreadMap);
  const frameDriver = createScrollFrameDriver(render, { root: host, rootMargin: '125% 0px' });

  const onResize = () => frameDriver.flush();
  window.addEventListener('resize', onResize, { passive: true });
  cleanups.push(() => window.removeEventListener('resize', onResize));

  return {
    root: host,
    render,
    refresh() { frameDriver.flush(); },
    destroy() {
      frameDriver.destroy();
      cleanups.splice(0).forEach((fn) => fn());
      host.remove();
    }
  };
}
