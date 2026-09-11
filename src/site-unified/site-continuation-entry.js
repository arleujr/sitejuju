import { initFullLoveScene } from './full-love-scene.js';

const story = document.querySelector('[data-story]');
const shell = document.querySelector('[data-love-continuation-shell]');
const root = document.querySelector('[data-love-continuation-root]');
const defaultHandoffMount = document.querySelector('[data-next-scene-root]');
const transitionVideoFrame = document.querySelector('[data-transition-video-frame]');

let scene = null;
let preview = null;
let prepareRaf = 0;
let activated = false;
let activating = false;
let reversing = false;
let releaseInputLock = null;
let inputLockWatchdog = 0;
let handoffScrollY = 0;
let continuationTopY = 0;
let reverseArmAt = 0;
let touchStartY = null;
let touchStartedAtTop = false;

function ensureScene() {
  if (scene || !shell || !root) return scene;

  // Regra única do projeto: arquivos físicos em public/assets,
  // URLs no navegador sempre começam em /assets.
  scene = initFullLoveScene(root, { assetBase: '/assets' });
  shell.classList.add('is-prepared');
  window.fullLoveScene = scene;
  return scene;
}

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

function buildFirstFramePreview() {
  const smileRoot = scene?.trioScene?.smileScene?.root;
  if (!smileRoot) return null;

  scene.trioScene.smileScene.refresh?.();

  const previewHost = document.createElement('div');
  previewHost.className = 'love-trio main-continuation-preview';
  previewHost.setAttribute('aria-hidden', 'true');

  const smileMount = document.createElement('div');
  smileMount.className = 'love-trio__smile';

  const clone = smileRoot.cloneNode(true);
  clone.classList.add('main-continuation-preview__smile');
  forcePreviewFrameZero(clone);

  smileMount.appendChild(clone);
  previewHost.appendChild(smileMount);
  return previewHost;
}

function resetPreviewToFrameZero(node = preview) {
  const smileClone = node?.querySelector?.('.main-continuation-preview__smile');
  if (smileClone) forcePreviewFrameZero(smileClone);
}

function installPreview(mount = defaultHandoffMount) {
  if (!mount) return null;
  if (!preview) preview = buildFirstFramePreview();
  if (!preview) return null;

  resetPreviewToFrameZero(preview);
  if (preview.parentElement !== mount) mount.replaceChildren(preview);
  mount.classList.add('is-preview-ready');
  mount.setAttribute('aria-hidden', 'false');
  mount.closest('[data-transition-video-frame]')?.classList.add('has-next-preview');
  return preview;
}

function prepare(event) {
  if (activated || reversing) return;
  ensureScene();

  const mount = event?.detail?.mount || defaultHandoffMount;
  cancelAnimationFrame(prepareRaf);

  prepareRaf = requestAnimationFrame(() => {
    scene?.refresh?.();
    prepareRaf = requestAnimationFrame(() => {
      scene?.trioScene?.smileScene?.refresh?.();
      installPreview(mount);
      document.dispatchEvent(new CustomEvent('nextscene:preview-ready', {
        detail: { mount, preview }
      }));
    });
  });
}

function lockNavigationInput() {
  if (releaseInputLock) return releaseInputLock;

  const html = document.documentElement;
  const body = document.body;
  const previousHtmlOverscroll = html.style.overscrollBehaviorY;
  const previousBodyOverscroll = body.style.overscrollBehaviorY;
  html.style.overscrollBehaviorY = 'none';
  body.style.overscrollBehaviorY = 'none';

  const prevent = (event) => event.preventDefault();
  const preventKeys = (event) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'].includes(event.key)) {
      event.preventDefault();
    }
  };

  window.addEventListener('wheel', prevent, { passive: false, capture: true });
  window.addEventListener('touchmove', prevent, { passive: false, capture: true });
  window.addEventListener('keydown', preventKeys, true);

  // Rede de segurança: nenhuma falha de animação/browser pode deixar o site
  // permanentemente sem scroll. As transições normais terminam bem antes disso.
  clearTimeout(inputLockWatchdog);
  inputLockWatchdog = window.setTimeout(() => releaseInputLock?.(), 2600);

  releaseInputLock = () => {
    window.removeEventListener('wheel', prevent, true);
    window.removeEventListener('touchmove', prevent, true);
    window.removeEventListener('keydown', preventKeys, true);
    clearTimeout(inputLockWatchdog);
    inputLockWatchdog = 0;
    html.style.overscrollBehaviorY = previousHtmlOverscroll;
    body.style.overscrollBehaviorY = previousBodyOverscroll;
    releaseInputLock = null;
  };

  return releaseInputLock;
}

function nextPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function waitForAnimation(animation, timeoutMs = 1300) {
  if (!animation?.finished) return Promise.resolve();
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    animation.finished.then(finish, finish);
  });
}

// Rebase de scroll precisa ser instantâneo em TODOS os navegadores.
// O projeto usa scroll-behavior:smooth na navegação normal; alguns engines
// ainda podem aplicar isso a scrollTo() se não neutralizarmos temporariamente.
function jumpWithoutSmooth(top) {
  const html = document.documentElement;
  const body = document.body;
  const previousHtml = html.style.scrollBehavior;
  const previousBody = body.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  body.style.scrollBehavior = 'auto';
  window.scrollTo(0, top);
  html.style.scrollBehavior = previousHtml;
  body.style.scrollBehavior = previousBody;
}

function makeOverlay(node) {
  const overlay = document.createElement('div');
  overlay.className = 'site-handoff-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  if (node) overlay.appendChild(node);
  document.body.appendChild(overlay);
  return overlay;
}

async function activate(event) {
  if (activated || activating || reversing || !shell || !story) return;
  activating = true;
  ensureScene();

  const handoffMount = event?.detail?.mount || defaultHandoffMount;
  const currentPreview = installPreview(handoffMount) || preview;
  const unlock = lockNavigationInput();

  // Guardamos o ponto real da V2. Ele será a âncora da volta.
  handoffScrollY = window.scrollY;

  // O mesmo frame que cresceu dentro do player vira uma película fullscreen.
  const overlay = makeOverlay(currentPreview);

  shell.classList.add('is-active');
  shell.setAttribute('aria-hidden', 'false');

  document.dispatchEvent(new CustomEvent('nextscene:activated', {
    detail: { root: shell, scene, scrollY: handoffScrollY }
  }));

  document.documentElement.classList.add('is-love-continuation-active');

  // V3.5 — NÃO rebaseia mais o documento inteiro para window.scrollY = 0.
  // A continuação permanece no fluxo normal, logo depois de Trabalho. Enquanto
  // a película fullscreen cobre a viewport, posicionamos o scroll no topo REAL
  // da seção. As cenas já calculam o progresso pelo próprio getBoundingClientRect,
  // então este ponto funciona como "zero local" sem desmontar Hero/Rotina/Trabalho.
  await nextPaint();
  continuationTopY = Math.max(0, window.scrollY + shell.getBoundingClientRect().top);
  jumpWithoutSmooth(continuationTopY);
  await nextPaint();

  scene?.refresh?.();
  continuationTopY = Math.max(0, window.scrollY + shell.getBoundingClientRect().top);
  jumpWithoutSmooth(continuationTopY);
  await nextPaint();

  activated = true;
  activating = false;
  reverseArmAt = performance.now() + 650;
  overlay.classList.add('is-leaving');

  window.setTimeout(() => {
    overlay.remove();
    handoffMount?.replaceChildren();
    handoffMount?.classList.remove('is-preview-ready');
    unlock?.();
    document.dispatchEvent(new CustomEvent('nextscene:entered', {
      detail: { root: shell, scene }
    }));
  }, 190);
}

function canReverseNow() {
  return activated && !activating && !reversing && performance.now() >= reverseArmAt;
}

async function reverseToPreviousScene() {
  if (!canReverseNow() || !shell || !story || !transitionVideoFrame) return;
  reversing = true;
  const unlock = lockNavigationInput();

  ensureScene();
  if (!preview) preview = buildFirstFramePreview();
  resetPreviewToFrameZero(preview);

  // Primeiro cobrimos a cena real com o MESMO frame 0 em fullscreen.
  const overlay = makeOverlay(preview);
  overlay.classList.add('is-returning');
  await nextPaint();

  // A V2 volta por trás da película, já no estado pequeno do player.
  // Desligamos temporariamente a transition do frame real para que ele não
  // anime escondido e desalinhe o alvo do overlay.
  const previousInlineTransition = transitionVideoFrame.style.transition;
  transitionVideoFrame.style.transition = 'none';

  // Prepara o player real por trás da película, mas mantém a continuação no
  // fluxo até o scroll já estar de volta ao ponto do player. Como a continuação
  // fica DEPOIS de Trabalho, removê-la nesse momento não altera a geometria do
  // alvo nem força reconstrução do conteúdo anterior.
  document.dispatchEvent(new CustomEvent('nextscene:returning', {
    detail: { root: shell, scene, scrollY: handoffScrollY }
  }));

  jumpWithoutSmooth(handoffScrollY);
  await nextPaint();

  document.documentElement.classList.remove('is-love-continuation-active');
  shell.classList.remove('is-active');
  shell.setAttribute('aria-hidden', 'true');
  await nextPaint();

  const target = transitionVideoFrame.getBoundingClientRect();
  const frameStyle = getComputedStyle(transitionVideoFrame);
  const targetRadius = frameStyle.borderRadius || '20px';
  const targetShadow = frameStyle.boxShadow || 'none';

  // WAAPI garante que a volta percorra exatamente o sentido inverso:
  // viewport inteiro -> retângulo do player.
  // Usa o tamanho que o overlay realmente ocupa (100dvh no CSS), não
  // window.innerHeight. Em mobile esses valores podem divergir com a barra
  // do navegador e gerar um pequeno salto justamente na volta.
  const viewportRect = overlay.getBoundingClientRect();

  const keyframes = [
    {
      left: '0px',
      top: '0px',
      width: `${viewportRect.width}px`,
      height: `${viewportRect.height}px`,
      borderRadius: '0px',
      boxShadow: 'none',
      transform: 'translate3d(0,0,0)'
    },
    {
      left: `${target.left}px`,
      top: `${target.top}px`,
      width: `${target.width}px`,
      height: `${target.height}px`,
      borderRadius: targetRadius,
      boxShadow: targetShadow,
      transform: 'translate3d(0,0,0)'
    }
  ];

  if (typeof overlay.animate === 'function') {
    const animation = overlay.animate(keyframes, {
      duration: 820,
      easing: 'cubic-bezier(.16,1,.3,1)',
      fill: 'forwards'
    });
    // Alguns WebViews/iOS antigos já deixaram animation.finished pendurado
    // depois de uma troca rápida de estado. O timeout garante que a aplicação
    // nunca fique eternamente com wheel/touch bloqueados.
    await waitForAnimation(animation, 1250);
  } else {
    // Fallback raro: chega ao mesmo estado final sem deixar a ponte travada.
    Object.assign(overlay.style, {
      left: `${target.left}px`,
      top: `${target.top}px`,
      width: `${target.width}px`,
      height: `${target.height}px`,
      borderRadius: targetRadius,
      boxShadow: targetShadow
    });
    await nextPaint();
  }

  // O preview volta para o player antes de removermos a película. Assim não há
  // nenhum frame vazio entre o final da animação e o DOM real da V2.
  installPreview(defaultHandoffMount);
  transitionVideoFrame.style.transition = previousInlineTransition;
  overlay.remove();
  activated = false;
  reversing = false;
  reverseArmAt = 0;

  // Primeiro devolvemos o controle ao runtime antigo; só depois de um paint
  // liberamos wheel/touch. Isso impede que o mesmo gesto que pediu a volta
  // atravesse a emenda e dispare outra navegação antes do estado estabilizar.
  document.dispatchEvent(new CustomEvent('nextscene:returned', {
    detail: { root: shell, scene, scrollY: handoffScrollY }
  }));
  await nextPaint();
  unlock?.();
}

function atContinuationTop(tolerance = 8) {
  if (!shell || !activated) return false;
  // O topo local de Sorriso é o topo do shell, independentemente do scrollY
  // global da página. Isso permite manter o documento único e comprido.
  return shell.getBoundingClientRect().top >= -tolerance;
}

// Desktop / trackpad: subir além do topo local de Sorriso faz a emenda voltar.
function onReverseWheel(event) {
  if (!canReverseNow() || event.deltaY >= -3 || !shell) return;
  const top = shell.getBoundingClientRect().top;
  // Intercepta também o gesto que CRUZARIA o topo. Assim um wheel forte ou
  // trackpad não chega a revelar Trabalho por um frame antes da animação reversa.
  const projectedTop = top - event.deltaY;
  if (top >= -8 || projectedTop >= -8) {
    event.preventDefault();
    reverseToPreviousScene();
  }
}

// Teclado segue a mesma lógica de navegação vertical.
function onReverseKey(event) {
  if (!canReverseNow() || !atContinuationTop(8)) return;
  if (event.key === 'ArrowUp' || event.key === 'PageUp' || event.key === 'Home') {
    event.preventDefault();
    reverseToPreviousScene();
  }
}

// Mobile: puxar a página para baixo no topo equivale a rolar para cima.
function onReverseTouchStart(event) {
  if (!canReverseNow()) return;
  touchStartY = event.touches?.[0]?.clientY ?? null;
  touchStartedAtTop = atContinuationTop(5);
}

function onReverseTouchMove(event) {
  if (!canReverseNow() || touchStartY == null) return;
  const y = event.touches?.[0]?.clientY ?? touchStartY;
  // Se o gesto começou alguns pixels abaixo, ele também pode completar a
  // volta na mesma puxada assim que alcançar o topo real da página.
  const reachedTop = touchStartedAtTop || atContinuationTop(5);
  if (reachedTop && y - touchStartY >= 34) {
    event.preventDefault();
    touchStartY = null;
    touchStartedAtTop = false;
    reverseToPreviousScene();
  }
}

function onReverseTouchEnd() {
  touchStartY = null;
  touchStartedAtTop = false;
}

window.addEventListener('wheel', onReverseWheel, { passive: false });
window.addEventListener('keydown', onReverseKey, true);
window.addEventListener('touchstart', onReverseTouchStart, { passive: true });
window.addEventListener('touchmove', onReverseTouchMove, { passive: false });
window.addEventListener('touchend', onReverseTouchEnd, { passive: true });
window.addEventListener('touchcancel', onReverseTouchEnd, { passive: true });

document.addEventListener('nextscene:prepare', prepare);
document.addEventListener('nextscene:ready', activate);

window.loveContinuation = {
  prepare,
  activate() {
    activate({ detail: { mount: defaultHandoffMount } });
  },
  reverse: reverseToPreviousScene,
  get scene() { return scene; },
  get preview() { return preview; },
  get active() { return activated; },
  get continuationTopY() { return continuationTopY; }
};
