import { initSmileScene } from './smile-scene.js';
import { initStyleScene } from './style-scene.js';
import { initGymScene } from './gym-scene.js';
import { createScrollFrameDriver } from './performance-runtime.js';

/**
 * Cena completa: Sorriso -> Estilo -> Academia.
 * Desktop preserva a V3P1 aprovada.
 * Mobile V4P5 preserva o palco único da V4P3 e corrige somente a borda do lado de academia-04.
 */
export function initLoveTrioScene(root, options = {}) {
  if (!root) throw new Error('initLoveTrioScene(root): root é obrigatório.');

  const assetBase = (options.assetBase || '/assets').replace(/\/$/, '');
  const host = document.createElement('section');
  host.className = 'love-trio';
  host.innerHTML = `
    <div class="love-trio__smile" data-love-trio-smile></div>
    <div class="love-trio__style" data-love-trio-style></div>
    <div class="love-trio__gym" data-love-trio-gym></div>
  `;
  root.appendChild(host);

  const smileScene = initSmileScene(host.querySelector('[data-love-trio-smile]'), { assetBase });
  const styleScene = initStyleScene(host.querySelector('[data-love-trio-style]'), { assetBase });
  const gymScene = initGymScene(host.querySelector('[data-love-trio-gym]'), { assetBase });

  const MOBILE_MAX = 860;
  const SEGMENTS = { smile: 3.55, style: 4.85, gym: 3.70 };
  const TOTAL_SCROLL_UNITS = SEGMENTS.smile + SEGMENTS.style + SEGMENTS.gym;
  const TOTAL_TRACK_UNITS = TOTAL_SCROLL_UNITS + 1;

  let baseMobileHeight = 0;
  let baseMobileWidth = window.innerWidth;
  let isMobile = window.innerWidth <= MOBILE_MAX;
  let layoutRaf = 0;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function setExternalProgress(scene, value) {
    if (!scene?.root) return;
    scene.root.dataset.loveTrioProgress = String(clamp(value, 0, 1));
  }

  function clearExternalProgress() {
    [smileScene, styleScene, gymScene].forEach((scene) => {
      scene?.root?.removeAttribute('data-love-trio-progress');
    });
    host.removeAttribute('data-mobile-act');
  }

  function syncMobileTrack(force = false) {
    const nowMobile = window.innerWidth <= MOBILE_MAX;
    const modeChanged = nowMobile !== isMobile;
    isMobile = nowMobile;

    if (!nowMobile) {
      baseMobileHeight = 0;
      baseMobileWidth = window.innerWidth;
      host.style.removeProperty('--love-trio-mobile-track-h');
      host.style.removeProperty('height');
      clearExternalProgress();
      return modeChanged;
    }

    const width = Math.round(window.innerWidth);
    const widthChanged = Math.abs(width - baseMobileWidth) > 24;
    if (!force && baseMobileHeight && !widthChanged && !modeChanged) return false;

    // Congela a altura usada no comprimento do documento. Quando só a barra
    // do navegador Android muda de altura, o trilho NÃO é recalculado.
    baseMobileHeight = Math.max(480, Math.round(window.innerHeight || 0));
    baseMobileWidth = width;
    const track = Math.round(baseMobileHeight * TOTAL_TRACK_UNITS);
    host.style.setProperty('--love-trio-mobile-track-h', `${track}px`);
    host.style.height = `${track}px`;
    return true;
  }

  function updateMobileProgress() {
    if (!isMobile || !baseMobileHeight) return;

    const travelled = clamp(-host.getBoundingClientRect().top, 0, baseMobileHeight * TOTAL_SCROLL_UNITS);
    const smileDistance = SEGMENTS.smile * baseMobileHeight;
    const styleDistance = SEGMENTS.style * baseMobileHeight;
    const gymDistance = SEGMENTS.gym * baseMobileHeight;

    setExternalProgress(smileScene, travelled / smileDistance);
    setExternalProgress(styleScene, (travelled - smileDistance) / styleDistance);
    setExternalProgress(gymScene, (travelled - smileDistance - styleDistance) / gymDistance);

    // No mobile o controlador é quem altera o progresso externo. Renderizamos
    // os três atos no mesmo frame para não existir um frame de atraso quando
    // o usuário cruza Sorriso -> Estilo -> Academia rapidamente.
    smileScene.render?.();
    styleScene.render?.();
    gymScene.render?.();

    host.dataset.mobileAct = travelled < smileDistance
      ? 'smile'
      : travelled < smileDistance + styleDistance
        ? 'style'
        : 'gym';
  }

  function fitMobileHorizontalEdges() {
    cancelAnimationFrame(layoutRaf);
    layoutRaf = requestAnimationFrame(() => {
      const items = host.querySelectorAll('.smile-v5__item, .style-v1__item, .gym-v1__item');
      items.forEach((item) => {
        item.style.removeProperty('--love-trio-mobile-right-nudge-x');
        // V4P5: não muda mais a origem do transform. O scrapbook mantém
        // exatamente a composição da V4P3/V4P4; só deslocamos PARA A ESQUERDA
        // os elementos que realmente estourariam a borda do lado onde fica
        // academia-04 (a borda direita da viewport).
        item.style.removeProperty('transform-origin');
      });

      if (window.innerWidth > MOBILE_MAX) return;

      host.querySelectorAll('.smile-v5__canvas, .style-v1__canvas, .gym-v1__canvas').forEach((canvas) => {
        const canvasWidth = canvas.clientWidth || 1;
        // Gutter real do lado de academia-04. Além de impedir corte da moldura,
        // deixa alguns pixels para rotação, sombra e fasteners de borda.
        const safeRight = Math.max(14, Math.round(canvasWidth * 0.035));
        const allowedRight = canvasWidth - safeRight;

        canvas.querySelectorAll('.smile-v5__item, .style-v1__item, .gym-v1__item').forEach((item) => {
          const w = item.offsetWidth;
          const h = item.offsetHeight;
          if (!w || !h) return;

          const left = item.offsetLeft;
          const centerX = left + w / 2;
          const centerRatio = centerX / canvasWidth;

          // IMPORTANTE: só atua no lado de academia-04. Nada do lado esquerdo
          // recebe nudge ou mudança de transform-origin.
          if (centerRatio < 0.56) return;

          const cs = getComputedStyle(item);
          const scaleRaw = cs.scale;
          const scaleValue = Number.parseFloat(scaleRaw && scaleRaw !== 'none' ? scaleRaw : '1') || 1;
          const angle = (Number.parseFloat(item.dataset.rot || '0') || 0) * Math.PI / 180;
          const cos = Math.abs(Math.cos(angle));
          const sin = Math.abs(Math.sin(angle));

          // Caixa rotacionada/escalada em torno do CENTRO, que é exatamente
          // como a cena é desenhada. Isso é mais confiável do que tentar
          // adivinhar o bounding box usando uma origem artificial na direita.
          const halfExtentX = scaleValue * ((w / 2) * cos + (h / 2) * sin);
          const renderedRight = centerX + halfExtentX;
          const overflowRight = renderedRight - allowedRight;

          if (overflowRight > 0.25) {
            // 3px extras evitam que antialias/sombra ainda pareçam cortados.
            const nudge = -(overflowRight + 3);
            item.style.setProperty('--love-trio-mobile-right-nudge-x', `${nudge.toFixed(2)}px`);
          }
        });
      });
    });
  }

  function onResize() {
    const changed = syncMobileTrack(false);
    if (changed) {
      smileScene.refresh?.();
      styleScene.refresh?.();
      gymScene.refresh?.();
      fitMobileHorizontalEdges();
    }
    updateMobileProgress();
  }

  syncMobileTrack(true);
  fitMobileHorizontalEdges();
  updateMobileProgress();
  const frameDriver = createScrollFrameDriver(updateMobileProgress, { root: host, rootMargin: '125% 0px' });

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });
  host.querySelectorAll('img').forEach((img) => img.addEventListener('load', fitMobileHorizontalEdges, { passive: true }));

  return {
    root: host,
    smileScene,
    styleScene,
    gymScene,
    refresh() {
      syncMobileTrack(true);
      smileScene.refresh?.();
      styleScene.refresh?.();
      gymScene.refresh?.();
      fitMobileHorizontalEdges();
      updateMobileProgress();
    },
    destroy() {
      frameDriver.destroy();
      cancelAnimationFrame(layoutRaf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      host.querySelectorAll('img').forEach((img) => img.removeEventListener('load', fitMobileHorizontalEdges));
      smileScene.destroy?.();
      styleScene.destroy?.();
      gymScene.destroy?.();
      host.remove();
    },
  };
}
