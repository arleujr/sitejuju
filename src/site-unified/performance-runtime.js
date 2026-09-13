/**
 * Scheduler global para cenas dirigidas por scroll.
 *
 * Todas as cenas compartilham UM único listener de scroll e UM único frame
 * por atualização. Cada driver continua podendo dormir fora da viewport via
 * IntersectionObserver, mas não cria mais listeners globais concorrentes.
 *
 * Isso é especialmente importante neste site: Sorriso, Estilo, Academia,
 * Vivências e a conversa podem coexistir no DOM sem disputar vários rAFs
 * independentes a cada pixel rolado.
 */
const drivers = new Set();
let globalRaf = 0;
let listening = false;

function cancelGlobalFrame() {
  if (!globalRaf) return;
  cancelAnimationFrame(globalRaf);
  globalRaf = 0;
}

function flushScheduledDrivers() {
  globalRaf = 0;
  if (document.hidden) return;

  drivers.forEach((driver) => {
    if (driver.destroyed || !driver.nearViewport || !driver.pending) return;
    driver.pending = false;
    try {
      driver.render();
    } catch (error) {
      // Uma cena com asset/estado inesperado não deve derrubar as demais.
      console.error('[scroll-runtime] Falha ao renderizar cena:', error);
    }
  });
}

function requestGlobalFrame() {
  if (document.hidden || globalRaf) return;
  globalRaf = requestAnimationFrame(flushScheduledDrivers);
}

function scheduleAll() {
  if (document.hidden) return;
  let hasWork = false;
  drivers.forEach((driver) => {
    if (driver.destroyed || !driver.nearViewport) return;
    driver.pending = true;
    hasWork = true;
  });
  if (hasWork) requestGlobalFrame();
}

function onVisibilityChange() {
  if (document.hidden) {
    cancelGlobalFrame();
    if (viewportRaf) cancelAnimationFrame(viewportRaf);
    viewportRaf = 0;
    return;
  }
  scheduleAll();
  if ([...viewportDrivers].some((driver) => driver.pending && !driver.destroyed)) {
    requestViewportFrame();
  }
}

function ensureGlobalListeners() {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', scheduleAll, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
}

function maybeReleaseGlobalListeners() {
  if (!listening || drivers.size) return;
  listening = false;
  cancelGlobalFrame();
  window.removeEventListener('scroll', scheduleAll);
  document.removeEventListener('visibilitychange', onVisibilityChange);
}

export function createScrollFrameDriver(render, options = {}) {
  if (typeof render !== 'function') throw new TypeError('render precisa ser uma função');

  const root = options.root || null;
  const rootMargin = options.rootMargin || '125% 0px';
  const driver = {
    render,
    pending: false,
    destroyed: false,
    nearViewport: !root || !('IntersectionObserver' in window),
    observer: null,
  };

  drivers.add(driver);
  ensureGlobalListeners();

  if (root && 'IntersectionObserver' in window) {
    driver.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      driver.nearViewport = Boolean(entry?.isIntersecting);
      if (driver.nearViewport) {
        driver.pending = true;
        requestGlobalFrame();
      } else {
        driver.pending = false;
      }
    }, { root: null, rootMargin, threshold: 0 });
    driver.observer.observe(root);
  }

  function schedule() {
    if (driver.destroyed || document.hidden || !driver.nearViewport) return;
    driver.pending = true;
    requestGlobalFrame();
  }

  function flush() {
    if (driver.destroyed || document.hidden) return;
    driver.pending = false;
    render();
  }

  if (driver.nearViewport) schedule();

  return {
    schedule,
    flush,
    destroy() {
      if (driver.destroyed) return;
      driver.destroyed = true;
      driver.pending = false;
      driver.observer?.disconnect();
      driver.observer = null;
      drivers.delete(driver);
      maybeReleaseGlobalListeners();
    },
  };
}

// ---------------------------------------------------------------------------
// Resize/orientation scheduler compartilhado
// ---------------------------------------------------------------------------
const viewportDrivers = new Set();
let viewportRaf = 0;
let viewportListening = false;

function flushViewportDrivers() {
  viewportRaf = 0;
  if (document.hidden) return;
  viewportDrivers.forEach((driver) => {
    if (driver.destroyed || !driver.pending) return;
    driver.pending = false;
    try {
      driver.render();
    } catch (error) {
      console.error('[viewport-runtime] Falha ao atualizar cena:', error);
    }
  });
}

function requestViewportFrame() {
  if (document.hidden || viewportRaf) return;
  viewportRaf = requestAnimationFrame(flushViewportDrivers);
}

function scheduleViewportDrivers(source = 'window') {
  let hasWork = false;
  viewportDrivers.forEach((driver) => {
    if (driver.destroyed) return;
    if (source === 'visual' && !driver.visualViewport) return;
    driver.pending = true;
    hasWork = true;
  });
  if (hasWork) requestViewportFrame();
}

function onWindowViewportChange() {
  scheduleViewportDrivers('window');
}

function onVisualViewportChange() {
  scheduleViewportDrivers('visual');
}

function ensureViewportListeners() {
  if (viewportListening) return;
  viewportListening = true;
  window.addEventListener('resize', onWindowViewportChange, { passive: true });
  window.addEventListener('orientationchange', onWindowViewportChange, { passive: true });
  window.visualViewport?.addEventListener?.('resize', onVisualViewportChange, { passive: true });
}

function maybeReleaseViewportListeners() {
  if (!viewportListening || viewportDrivers.size) return;
  viewportListening = false;
  if (viewportRaf) cancelAnimationFrame(viewportRaf);
  viewportRaf = 0;
  window.removeEventListener('resize', onWindowViewportChange);
  window.removeEventListener('orientationchange', onWindowViewportChange);
  window.visualViewport?.removeEventListener?.('resize', onVisualViewportChange);
}

export function createViewportFrameDriver(render, options = {}) {
  if (typeof render !== 'function') throw new TypeError('render precisa ser uma função');

  const driver = {
    render,
    visualViewport: Boolean(options.visualViewport),
    pending: false,
    destroyed: false,
  };

  viewportDrivers.add(driver);
  ensureViewportListeners();

  function schedule() {
    if (driver.destroyed) return;
    driver.pending = true;
    requestViewportFrame();
  }

  return {
    schedule,
    flush() {
      if (driver.destroyed) return;
      driver.pending = false;
      render();
    },
    destroy() {
      if (driver.destroyed) return;
      driver.destroyed = true;
      driver.pending = false;
      viewportDrivers.delete(driver);
      maybeReleaseViewportListeners();
    },
  };
}
