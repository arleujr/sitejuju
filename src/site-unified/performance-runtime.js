/**
 * Scheduler leve para cenas dirigidas por scroll.
 *
 * Em vez de manter um requestAnimationFrame infinito por cena, o render só
 * acontece quando há scroll, resize/refresh explícito ou quando a cena volta
 * a ficar próxima da viewport. Isso reduz CPU/GPU em páginas longas e evita
 * vários loops disputando o mesmo frame durante as transições reversíveis.
 */
export function createScrollFrameDriver(render, options = {}) {
  if (typeof render !== 'function') throw new TypeError('render precisa ser uma função');

  const root = options.root || null;
  const rootMargin = options.rootMargin || '125% 0px';
  let raf = 0;
  let destroyed = false;
  let nearViewport = !root || !('IntersectionObserver' in window);
  let observer = null;

  function cancelPending() {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
  }

  function frame() {
    raf = 0;
    if (destroyed || document.hidden || !nearViewport) return;
    render();
  }

  function schedule() {
    if (destroyed || document.hidden || !nearViewport || raf) return;
    raf = requestAnimationFrame(frame);
  }

  function flush() {
    if (destroyed || document.hidden) return;
    cancelPending();
    render();
  }

  function onVisibilityChange() {
    if (document.hidden) {
      cancelPending();
      return;
    }
    schedule();
  }

  window.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);

  if (root && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      nearViewport = Boolean(entry?.isIntersecting);
      if (nearViewport) schedule();
      else cancelPending();
    }, { root: null, rootMargin, threshold: 0 });
    observer.observe(root);
  }

  // O primeiro frame não pode depender de um scroll do usuário.
  if (nearViewport) schedule();

  return {
    schedule,
    flush,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelPending();
      observer?.disconnect();
      observer = null;
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    },
  };
}
