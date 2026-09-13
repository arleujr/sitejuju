import { initFullLoveScene } from './full-love-scene.js';

/**
 * Continuação única Trabalho -> Sorriso.
 *
 * A cena seguinte já nasce no fluxo real do documento. O player de Trabalho
 * pode mostrar uma cópia visual do primeiro frame de Sorriso, mas não move DOM,
 * não fixa seções, não rebaseia scroll e não assume uma segunda navegação.
 * Assim, descer e subir pela emenda usa exatamente o mesmo scroll da página.
 */
export function initSiteContinuation() {
  const shell = document.querySelector('[data-love-continuation-shell]');
  const root = document.querySelector('[data-love-continuation-root]');
  const defaultHandoffMount = document.querySelector('[data-next-scene-root]');

  if (!shell || !root) return null;

  const scene = initFullLoveScene(root, { assetBase: '/assets' });
  shell.classList.add('is-prepared');
  shell.setAttribute('aria-hidden', 'false');
  window.fullLoveScene = scene;

  let preview = null;
  let prepareRaf = 0;
  let entered = false;

  function forcePreviewFrameZero(clone) {
    clone.querySelectorAll('.smile-v5__spread').forEach((spread, index) => {
      if (index > 0) spread.remove();
    });

    clone.querySelectorAll('.smile-v5__item').forEach((item) => {
      const rot = Number.parseFloat(item.dataset.rot || '0') || 0;
      item.style.opacity = '1';
      item.style.transform = `translate(0vw, 0vh) rotate(${rot}deg)`;
    });

    clone.querySelectorAll('img[data-src]').forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.loading = 'eager';
    });

    clone.querySelectorAll('.smile-v5__photo-img').forEach((img) => {
      img.closest('.smile-v5__item')?.classList.add('is-loaded');
    });

    clone.querySelector('.smile-v5__scene-stage')?.style.setProperty('transform', 'translate3d(0,0,0)');
  }

  function cloneFirstSmileFrame(smileRoot) {
    const sourceSection = smileRoot.querySelector('.smile-v5__section');
    const sourceSticky = sourceSection?.querySelector(':scope > .smile-v5__sticky');
    const sourceStage = sourceSticky?.querySelector(':scope > .smile-v5__scene-stage');
    const sourceCanvas = sourceStage?.querySelector(':scope > .smile-v5__canvas');
    const firstSpread = sourceCanvas?.querySelector(':scope > .smile-v5__spread');

    if (!sourceSection || !sourceSticky || !sourceStage || !sourceCanvas || !firstSpread) {
      return smileRoot.cloneNode(true);
    }

    const clone = smileRoot.cloneNode(false);
    const section = sourceSection.cloneNode(false);
    const sticky = sourceSticky.cloneNode(false);
    const nextBg = sourceSticky.querySelector(':scope > .smile-v5__next-style-bg');
    if (nextBg) sticky.appendChild(nextBg.cloneNode(true));

    const stage = sourceStage.cloneNode(false);
    [...sourceStage.children].forEach((child) => {
      if (child === sourceCanvas) return;
      stage.appendChild(child.cloneNode(true));
    });

    const canvas = sourceCanvas.cloneNode(false);
    canvas.appendChild(firstSpread.cloneNode(true));
    stage.appendChild(canvas);
    sticky.appendChild(stage);
    section.appendChild(sticky);
    clone.appendChild(section);
    return clone;
  }

  function buildFirstFramePreview() {
    const smileRoot = scene?.trioScene?.smileScene?.root;
    if (!smileRoot) return null;

    scene.trioScene.smileScene.refresh?.();

    const previewHost = document.createElement('div');
    previewHost.className = 'love-trio main-continuation-preview';
    previewHost.setAttribute('aria-hidden', 'true');

    const smileMount = document.createElement('div');
    smileMount.className = 'love-trio__smile';

    const clone = cloneFirstSmileFrame(smileRoot);
    clone.classList.add('main-continuation-preview__smile');
    forcePreviewFrameZero(clone);

    smileMount.appendChild(clone);
    previewHost.appendChild(smileMount);
    return previewHost;
  }

  function installPreview(mount = defaultHandoffMount) {
    if (!mount) return null;
    if (!preview) preview = buildFirstFramePreview();
    if (!preview) return null;

    const smileClone = preview.querySelector('.main-continuation-preview__smile');
    if (smileClone) forcePreviewFrameZero(smileClone);

    if (preview.parentElement !== mount) mount.replaceChildren(preview);
    mount.classList.add('is-preview-ready');
    return preview;
  }

  function prepare(event) {
    const mount = event?.detail?.mount || defaultHandoffMount;
    cancelAnimationFrame(prepareRaf);
    prepareRaf = requestAnimationFrame(() => {
      scene.refresh?.();
      prepareRaf = requestAnimationFrame(() => {
        installPreview(mount);
        document.dispatchEvent(new CustomEvent('nextscene:preview-ready', {
          detail: { mount, preview },
        }));
      });
    });
  }

  function activate(event) {
    const mount = event?.detail?.mount || defaultHandoffMount;
    installPreview(mount);
    shell.classList.add('is-active');
    shell.setAttribute('aria-hidden', 'false');

    document.dispatchEvent(new CustomEvent('nextscene:activated', {
      detail: { root: shell, scene },
    }));

    // Não existe handoff físico para esperar. A continuação já está no fluxo.
    entered = true;
    document.dispatchEvent(new CustomEvent('nextscene:entered', {
      detail: { root: shell, scene },
    }));
  }

  document.addEventListener('nextscene:prepare', prepare);
  document.addEventListener('nextscene:ready', activate);

  const api = {
    prepare,
    activate() {
      return activate({ detail: { mount: defaultHandoffMount } });
    },
    get scene() { return scene; },
    get preview() { return preview; },
    get active() { return entered; },
  };

  window.loveContinuation = api;
  return api;
}
