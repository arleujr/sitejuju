(() => {
  const story = document.querySelector('[data-story]');
  const title = document.querySelector('[data-title]');
  const chatScene = document.querySelector('[data-scene]');
  const viewport = document.querySelector('[data-chat-viewport]');
  const events = [...document.querySelectorAll('[data-event]')];
  const transients = [...document.querySelectorAll('[data-transient]')];
  const soundHint = document.querySelector('[data-sound-hint]');
  const mediaCards = [...document.querySelectorAll('.media-card')];
  const titleChime = document.getElementById('title-chime');
  const backgroundMusic = document.getElementById('background-music');

  const plusButton = document.querySelector('[data-plus]');
  const gallery = document.querySelector('[data-work-gallery]');
  const gallerySheet = document.querySelector('[data-gallery-sheet]');
  const galleryGrid = document.querySelector('[data-gallery-grid]');
  const romanceOverlay = document.querySelector('[data-romance-overlay]');
  const viewer = document.querySelector('[data-viewer]');
  const viewerMedia = document.querySelector('[data-viewer-media]');
  const viewerImg = document.querySelector('[data-viewer-img]');
  const viewerFallback = document.querySelector('[data-viewer-fallback]');
  const viewerPrev = document.querySelector('[data-viewer-prev]');
  const viewerNext = document.querySelector('[data-viewer-next]');
  const viewerBack = document.querySelector('[data-viewer-back]');
  const transitionVideoStage = document.querySelector('[data-transition-video-stage]');
  const transitionPlay = document.querySelector('[data-transition-play]');
  const transitionVideoFrame = document.querySelector('[data-transition-video-frame]');
  const nextSceneRoot = document.querySelector('[data-next-scene-root]');

  if (!story || !viewport) return;

  const CHAT_END = 0.65;
  const GALLERY_OPEN = 0.690;
  const WORK_COUNT = 20;
  const EXTENSIONS = ['webp', 'jpeg', 'jpg', 'png'];
  const mobileMedia = window.matchMedia('(max-width: 700px)');

  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const smooth = (t) => t * t * (3 - 2 * t);

  let raf = 0;
  let measureRaf = 0;
  let storyTop = 0;
  let travel = 1;
  let viewportHeight = Math.max(1, viewport.clientHeight || window.innerHeight);
  let layoutDirty = true;
  let lastRomanceState = '';
  let audioEnabled = false;
  let backgroundWanted = false;
  let backgroundFadeRaf = 0;
  const activeVideos = new Set();
  const BACKGROUND_VOLUME = 0.38;
  let titleChimed = false;
  let viewerIndex = 0;
  let previousAutoIndex = 0;
  let manualViewerOpen = false;
  let manualGalleryOpen = false;
  let manualGalleryScroll = 0;
  let manualOpenScroll = 0;
  let suppressAutoViewer = false;
  let suppressAtScroll = 0;
  let touchStartX = null;
  let storyAdvanced = false;
  let nextScenePrepareDispatched = false;
  let sceneSuspended = false;
  let returnedFromContinuation = false;
  let suppressAutoViewerPermanent = false;
  let viewerSequenceCompleted = false;
  let lastScrollY = window.scrollY;
  let snapToGridLock = false;
  let manualVideoOpen = false;
  let videoAdvanceTimer = 0;
  let autoFullscreenTriggered = false;
  let itemResizeObserver = null;
  let previousChatP = 0;
  let renderBoundary = null;
  const playedTypingChimes = new Set();
  const viewedIndices = new Set();
  const itemVisibility = new WeakMap();
  const itemHeights = new WeakMap();

  const allItems = [...events, ...transients].sort((a, b) => itemStart(a) - itemStart(b));
  const typingChimePoints = transients
    .filter((node) => node.classList.contains('message--bridge-typing'))
    .map((node) => Number(node.dataset.end || 0))
    .filter(Boolean)
    .sort((a, b) => a - b);

  function itemStart(node) {
    return node.hasAttribute('data-transient')
      ? Number(node.dataset.start || 0)
      : Number(node.dataset.at || 0);
  }


  function galleryTimings() {
    const mobile = mobileMedia.matches;
    return {
      // No desktop a grade fica mais tempo parada para a pessoa olhar as 20 fotos.
      viewerOpen: mobile ? 0.722 : 0.735,
      viewerSequence: mobile ? 0.742 : 0.758,
      videoStage: mobile ? 0.982 : 0.984,
      videoPress: mobile ? 0.993 : 0.994,
      gridAnchor: mobile ? 0.704 : 0.708,
      manualReleasePx: viewportHeight * (mobile ? 0.85 : 1.25),
      suppressReleasePx: viewportHeight * (mobile ? 0.70 : 0.95),
    };
  }

  // Cada foto de trabalho corresponde a um único trecho do scroll.
  // Ao navegar por clique/swipe, sincronizamos o scroll com o índice atual.
  // Isso impede o scroll automático de voltar para uma foto anterior e
  // elimina a sensação de fotos repetidas.
  function scrollToViewerIndex(index) {
    const { viewerSequence, videoStage } = galleryTimings();
    const safeIndex = clamp(index, 0, WORK_COUNT - 1);
    const bucket = (safeIndex + 0.35) / WORK_COUNT;
    const progress = viewerSequence + bucket * (videoStage - viewerSequence);
    const target = storyTop + travel * progress;

    previousAutoIndex = safeIndex;
    manualOpenScroll = target;
    window.scrollTo({ top: target, behavior: 'auto' });
  }

  function scrollToGalleryStart(behavior = 'smooth') {
    const { gridAnchor } = galleryTimings();
    const target = storyTop + travel * gridAnchor;
    manualGalleryOpen = true;
    manualGalleryScroll = target;
    suppressAutoViewer = true;
    suppressAtScroll = target;
    gallery?.classList.remove('is-manual-viewer', 'is-auto-viewer');
    gallery?.classList.add('is-active', 'is-grid-ready', 'is-copy-visible', 'is-manual-gallery');
    gallery?.setAttribute('aria-hidden', 'false');
    viewer?.setAttribute('aria-hidden', 'true');
    gallery?.style.setProperty('--viewer-opacity', '0');
    gallery?.style.setProperty('--viewer-scale', '0.92');
    gallery?.style.setProperty('--sheet-opacity', '1');
    gallery?.style.setProperty('--sheet-scale', '1');
    syncRomanceOverlay(true, false);
    window.scrollTo({ top: target, behavior });
  }

  function workBase(index) {
    return `/assets/trabalho/trabalho-${String(index + 1).padStart(2, '0')}`;
  }

  function syncRomanceOverlay(active, showViewer, progress = 0) {
    if (!gallery) return;
    const galleryState = active && !showViewer;
    const viewerFirstHalf = active && showViewer && viewerIndex < 10;
    const viewerSecondHalf = active && showViewer && viewerIndex >= 10;
    const galleryDelay = mobileMedia.matches ? 0.012 : 0.016;
    const galleryCopyReady = galleryState && (manualGalleryOpen || suppressAutoViewerPermanent || progress >= GALLERY_OPEN + galleryDelay);
    const state = `${active ? 1 : 0}${galleryState ? 1 : 0}${galleryCopyReady ? 1 : 0}${viewerFirstHalf ? 1 : 0}${viewerSecondHalf ? 1 : 0}`;

    if (state === lastRomanceState) return;
    lastRomanceState = state;
    gallery.classList.toggle('is-romance-gallery', galleryState);
    gallery.classList.toggle('is-romance-gallery-copy-ready', galleryCopyReady);
    gallery.classList.toggle('is-romance-viewer-a', viewerFirstHalf);
    gallery.classList.toggle('is-romance-viewer-b', viewerSecondHalf);
    romanceOverlay?.setAttribute('aria-hidden', active ? 'false' : 'true');
  }

  function tryImage(img, index, onFail) {
    const base = workBase(index);
    let extIndex = 0;
    const attempt = () => {
      img.onerror = () => {
        extIndex += 1;
        if (extIndex < EXTENSIONS.length) attempt();
        else {
          img.removeAttribute('src');
          img.classList.remove('is-loaded');
          onFail?.();
        }
      };
      img.onload = () => img.classList.add('is-loaded');
      img.src = `${base}.${EXTENSIONS[extIndex]}`;
    };
    attempt();
  }

  function buildGallery() {
    if (!galleryGrid || galleryGrid.children.length) return;
    for (let i = 0; i < WORK_COUNT; i += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-thumb';
      button.dataset.index = String(i);
      button.setAttribute('aria-label', `Abrir foto ${i + 1}`);

      const img = document.createElement('img');
      img.alt = `Foto de trabalho ${i + 1}`;
      img.decoding = 'async';
      img.loading = 'lazy';
      img.fetchPriority = 'low';
      const fallback = document.createElement('span');
      fallback.className = 'gallery-thumb__fallback';
      fallback.textContent = String(i + 1).padStart(2, '0');
      button.append(img, fallback);
      galleryGrid.append(button);

      tryImage(img, i, () => button.classList.add('is-fallback'));
      img.addEventListener('load', () => button.classList.remove('is-fallback'));
      let pointerStartX = 0;
      let pointerStartY = 0;
      let pointerMoved = false;

      button.addEventListener('pointerdown', (e) => {
        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
        pointerMoved = false;
      });
      button.addEventListener('pointermove', (e) => {
        if (Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY) > 9) pointerMoved = true;
      }, { passive: true });
      button.addEventListener('pointercancel', () => { pointerMoved = true; });
      button.addEventListener('pointerup', (e) => {
        const moved = pointerMoved || Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY) > 9;
        if (!moved) openViewerManual(i);
      });
      button.addEventListener('click', (e) => e.preventDefault());
    }
  }

  mediaCards.forEach((card, index) => {
    const img = card.querySelector('img');
    if (!img) return;
    img.decoding = 'async';
    if (index >= 5) img.fetchPriority = 'low';
    const mark = () => card.classList.toggle('is-loaded', img.naturalWidth > 0);
    if (img.complete) mark();
    img.addEventListener('load', mark, { once: true });
    img.addEventListener('error', () => card.classList.remove('is-loaded'), { once: true });
  });

  function measure() {
    viewportHeight = Math.max(1, viewport.clientHeight || window.innerHeight);
    storyTop = story.offsetTop;
    // A matemática usa a mesma altura do sticky visual.
    // Em mobile, window.innerHeight muda com a barra do navegador enquanto
    // a cena usa svh; misturar os dois gerava micro-saltos na emenda.
    const stickyHeight = Math.max(1, chatScene?.clientHeight || window.innerHeight);
    travel = Math.max(1, story.offsetHeight - stickyHeight);
    layoutDirty = true;
    render(true);
  }

  function requestMeasure() {
    if (sceneSuspended || measureRaf) return;
    measureRaf = requestAnimationFrame(() => {
      measureRaf = 0;
      measure();
    });
  }

  function isVisible(node, chatP) {
    if (node.hasAttribute('data-transient')) {
      const start = Number(node.dataset.start || 0);
      const end = Number(node.dataset.end || 1);
      return chatP >= start && chatP < end;
    }
    return chatP >= Number(node.dataset.at || 0);
  }

  function applyVisibility(chatP) {
    let changed = false;
    allItems.forEach((node) => {
      const next = isVisible(node, chatP);
      if (itemVisibility.get(node) === next) return;
      itemVisibility.set(node, next);
      node.classList.toggle('is-visible', next);
      changed = true;
    });
    if (changed) layoutDirty = true;
    return changed;
  }

  function itemHeight(node) {
    const cached = itemHeights.get(node);
    if (Number.isFinite(cached) && cached > 0) return cached;
    const measured = node.offsetHeight || 0;
    if (measured > 0) itemHeights.set(node, measured);
    return measured;
  }

  function layoutStack() {
    if (!layoutDirty) return;

    const mobile = mobileMedia.matches;
    const bottomInset = mobile ? 30 : 40;
    const topThreshold = mobile ? 24 : 36;
    const fadeDistance = mobile ? 96 : 118;
    const gap = mobile ? 12 : 14;
    const hiddenY = viewportHeight - 8;

    let cursor = viewportHeight - bottomInset;

    for (let i = allItems.length - 1; i >= 0; i -= 1) {
      const node = allItems[i];
      if (!itemVisibility.get(node)) continue;

      const height = itemHeight(node);
      cursor -= height;
      const y = cursor;
      cursor -= gap;

      let opacity = 1;
      let blur = 0;

      if (y + height < topThreshold) {
        opacity = 0;
        blur = 1.2;
      } else if (y < topThreshold) {
        const t = clamp((y + height - topThreshold) / fadeDistance);
        opacity = smooth(t);
        blur = (1 - opacity) * 1.1;
      }

      node.style.setProperty('--stack-y', `${y.toFixed(1)}px`);
      node.style.setProperty('--age-opacity', opacity.toFixed(3));
      node.style.setProperty('--age-blur', `${blur.toFixed(2)}px`);
    }

    allItems.forEach((node) => {
      if (itemVisibility.get(node)) return;
      node.style.setProperty('--stack-y', `${hiddenY.toFixed(1)}px`);
      node.style.setProperty('--age-opacity', '0');
      node.style.setProperty('--age-blur', '2px');
    });

    layoutDirty = false;
  }

  if ('ResizeObserver' in window) {
    itemResizeObserver = new ResizeObserver((entries) => {
      let changed = false;
      entries.forEach((entry) => {
        const box = Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize;
        const height = box?.blockSize || entry.target.offsetHeight || 0;
        if (height > 0 && itemHeights.get(entry.target) !== height) {
          itemHeights.set(entry.target, height);
          changed = true;
        }
      });
      if (changed) {
        layoutDirty = true;
        requestRender();
      }
    });
    allItems.forEach((node) => itemResizeObserver.observe(node));
  }

  function markViewed(index) {
    viewedIndices.add(clamp(index, 0, WORK_COUNT - 1));
    if (viewedIndices.size >= WORK_COUNT) {
      viewerSequenceCompleted = true;
    }
  }

  function markViewedRange(from, to) {
    const a = Math.min(from, to);
    const b = Math.max(from, to);
    for (let i = a; i <= b; i += 1) markViewed(i);
  }

  function setViewerIndex(index, animate = true) {
    const nextIndex = clamp(index, 0, WORK_COUNT - 1);
    const direction = nextIndex === viewerIndex ? 0 : (nextIndex > viewerIndex ? 1 : -1);
    viewerIndex = nextIndex;
    if (nextIndex >= WORK_COUNT - 2) prepareNextScene();
    if (viewerFallback) viewerFallback.textContent = '';

    if (viewerImg) {
      viewerImg.decoding = 'async';
      viewerImg.fetchPriority = 'high';
      viewerImg.classList.remove('is-loaded');
      tryImage(viewerImg, viewerIndex, () => viewerImg.classList.remove('is-loaded'));
    }

    if (animate && viewerMedia && direction !== 0) {
      viewerMedia.style.transition = 'none';
      viewerMedia.style.transform = `translate3d(${direction * 46}px,0,0) scale(.992)`;
      viewerMedia.style.opacity = '.48';
      requestAnimationFrame(() => {
        viewerMedia.style.transition = 'transform .48s cubic-bezier(.16,1,.3,1), opacity .38s ease';
        viewerMedia.style.transform = 'translate3d(0,0,0) scale(1)';
        viewerMedia.style.opacity = '1';
      });
    }

    const viewerShowing = viewer?.getAttribute('aria-hidden') === 'false';
    if (viewerShowing) syncRomanceOverlay(true, true);
  }


  function clearVideoAdvanceTimer() {
    if (!videoAdvanceTimer) return;
    clearTimeout(videoAdvanceTimer);
    videoAdvanceTimer = 0;
  }

  function prepareNextScene() {
    if (nextScenePrepareDispatched) return;
    nextScenePrepareDispatched = true;
    document.dispatchEvent(new CustomEvent('nextscene:prepare', {
      detail: { mount: nextSceneRoot }
    }));
  }

  function setVideoStageVisible(visible, pressing = false, fullscreen = false) {
    if (!gallery || !transitionVideoStage) return;
    gallery.classList.toggle('is-video-stage', visible);
    gallery.classList.toggle('is-video-pressing', visible && pressing);
    gallery.classList.toggle('is-video-fullscreen', visible && fullscreen);
    if (!visible) {
      gallery.classList.remove('is-next-scene-ready');
      nextSceneRoot?.setAttribute('aria-hidden', 'true');
    }
    transitionVideoStage.setAttribute('aria-hidden', visible ? 'false' : 'true');

    // O frame de Sorriso normalmente já foi pré-montado alguns instantes
    // antes. Este call é apenas a garantia para entradas manuais/diretas.
    if (visible) prepareNextScene();
  }

  function openTransitionVideoManual() {
    clearVideoAdvanceTimer();
    manualVideoOpen = true;
    manualViewerOpen = true;
    manualOpenScroll = window.scrollY;
    viewerSequenceCompleted = true;
    suppressAutoViewerPermanent = true;
    autoFullscreenTriggered = false;
    gallery?.classList.add('is-active', 'is-manual-viewer');
    gallery?.classList.remove('is-auto-viewer', 'is-video-fullscreen', 'is-video-pressing', 'is-next-scene-ready');
    nextSceneRoot?.setAttribute('aria-hidden', 'true');
    gallery?.setAttribute('aria-hidden', 'false');
    viewer?.setAttribute('aria-hidden', 'false');
    setVideoStageVisible(true, false, false);
    syncRomanceOverlay(false, false);
  }

  function closeTransitionVideoToLastPhoto() {
    clearVideoAdvanceTimer();
    manualVideoOpen = false;
    autoFullscreenTriggered = false;
    setVideoStageVisible(false, false, false);
    suppressAutoViewerPermanent = false;
    manualViewerOpen = true;
    setViewerIndex(WORK_COUNT - 1, false);
    scrollToViewerIndex(WORK_COUNT - 1);
    viewer?.setAttribute('aria-hidden', 'false');
    gallery?.classList.add('is-active', 'is-manual-viewer');
    syncRomanceOverlay(true, true);
  }

  // O “vídeo” é só a ponte para a próxima cena. Primeiro ele aparece
  // pausado, o play reage como se tivesse sido pressionado e, só então,
  // o quadro cresce até ocupar o viewport inteiro. A próxima cena continua
  // DENTRO desse fullscreen — não existe mais uma tela preta extra abaixo.
  function triggerVideoPressAndAdvance() {
    if (!transitionVideoStage || storyAdvanced || gallery?.classList.contains('is-video-fullscreen')) return;
    clearVideoAdvanceTimer();
    document.dispatchEvent(new CustomEvent('nextscene:transition-start'));
    manualVideoOpen = true;
    setVideoStageVisible(true, true, false);

    // 1) deixa o “clique/play” ser percebido
    videoAdvanceTimer = window.setTimeout(() => {
      gallery?.classList.remove('is-video-pressing');
      gallery?.classList.add('is-video-fullscreen');

      // 2) espera a expansão para tela cheia terminar e libera o mount
      //    onde a próxima conversa/cena será encaixada depois.
      videoAdvanceTimer = window.setTimeout(() => finishTransitionToNextScene(), 860);
    }, 420);
  }


  function finishTransitionToNextScene() {
    clearVideoAdvanceTimer();
    manualVideoOpen = true;
    autoFullscreenTriggered = true;
    gallery?.classList.remove('is-video-pressing');
    gallery?.classList.add('is-active', 'is-video-stage', 'is-video-fullscreen', 'is-next-scene-ready');
    gallery?.setAttribute('aria-hidden', 'false');
    viewer?.setAttribute('aria-hidden', 'false');
    nextSceneRoot?.setAttribute('aria-hidden', 'false');
    syncRomanceOverlay(false, false);

    // Hook simples para a próxima cena. Um módulo futuro pode ouvir:
    // document.addEventListener('nextscene:ready', ...).
    document.dispatchEvent(new CustomEvent('nextscene:ready', {
      detail: { mount: nextSceneRoot }
    }));
  }

  function goViewerNext() {
    if (manualVideoOpen) {
      triggerVideoPressAndAdvance();
      return;
    }
    if (viewerIndex >= WORK_COUNT - 1) {
      openTransitionVideoManual();
      return;
    }
    manualViewerOpen = true;
    manualOpenScroll = window.scrollY;
    const nextIndex = viewerIndex + 1;
    setViewerIndex(nextIndex, true);
    markViewed(nextIndex);
    scrollToViewerIndex(nextIndex);
  }

  function goViewerPrev() {
    if (gallery?.classList.contains('is-next-scene-ready')) return;
    if (manualVideoOpen) {
      closeTransitionVideoToLastPhoto();
      return;
    }
    if (viewerIndex <= 0) return;
    manualViewerOpen = true;
    manualOpenScroll = window.scrollY;
    const prevIndex = viewerIndex - 1;
    setViewerIndex(prevIndex, true);
    markViewed(prevIndex);
    scrollToViewerIndex(prevIndex);
  }

  function openViewerManual(index) {
    clearVideoAdvanceTimer();
    manualVideoOpen = false;
    autoFullscreenTriggered = false;
    setVideoStageVisible(false, false, false);
    storyAdvanced = false;
    manualViewerOpen = true;
    gallery?.classList.add('is-active');
    gallery?.setAttribute('aria-hidden', 'false');
    manualOpenScroll = window.scrollY;
    suppressAutoViewer = false;
    suppressAutoViewerPermanent = false;
    setViewerIndex(index, true);
    markViewed(index);
    scrollToViewerIndex(index);
    gallery?.classList.add('is-manual-viewer');
    viewer?.setAttribute('aria-hidden', 'false');
    syncRomanceOverlay(true, true);
  }

  function returnToGalleryGrid() {
    clearVideoAdvanceTimer();
    manualVideoOpen = false;
    autoFullscreenTriggered = false;
    setVideoStageVisible(false, false, false);
    manualViewerOpen = false;
    if (viewerSequenceCompleted) suppressAutoViewerPermanent = true;
    // A seta de cima volta de verdade para a “tela inicial” da galeria,
    // inclusive reposicionando o scroll naquele momento da história.
    scrollToGalleryStart('smooth');
  }

  function renderGallery(p) {
    if (!gallery || !gallerySheet) return;
    const { viewerOpen: VIEWER_OPEN, viewerSequence: VIEWER_SEQUENCE, videoStage: VIDEO_STAGE, videoPress: VIDEO_PRESS, manualReleasePx, suppressReleasePx } = galleryTimings();

    // Depois de voltar de Sorriso, o player fica exatamente no estado anterior
    // ao play. A primeira rolagem decide naturalmente o próximo sentido:
    // subir = volta para a última foto; descer = entra em Sorriso novamente.
    if (returnedFromContinuation && manualVideoOpen) {
      const delta = window.scrollY - lastScrollY;
      if (delta < -3) {
        returnedFromContinuation = false;
        closeTransitionVideoToLastPhoto();
        lastScrollY = window.scrollY;
        return;
      }
      if (delta > 3) {
        returnedFromContinuation = false;
        lastScrollY = window.scrollY;
        requestAnimationFrame(triggerVideoPressAndAdvance);
        return;
      }
    }

    if (storyAdvanced && p < 0.93) storyAdvanced = false;

    // A transição agora se comporta como um clique real: o indicador encosta
    // no +, o botão afunda e a galeria abre de uma vez por uma animação curta.
    const autoTrigger = p >= GALLERY_OPEN && !storyAdvanced;
    const completedGrid = suppressAutoViewerPermanent && p >= GALLERY_OPEN;
    const active = !storyAdvanced && (manualGalleryOpen || autoTrigger || completedGrid);

    if (plusButton) {
      plusButton.classList.toggle('is-auto-click', autoTrigger && !manualGalleryOpen);
      plusButton.classList.toggle('is-manual-click', manualGalleryOpen);
    }

    gallery.classList.toggle('is-active', active);
    gallery.classList.toggle('is-grid-ready', active);
    gallery.classList.toggle('is-copy-visible', active);
    gallery.classList.toggle('is-manual-gallery', manualGalleryOpen);
    gallery.setAttribute('aria-hidden', active ? 'false' : 'true');

    const forceGrid = (manualGalleryOpen || suppressAutoViewerPermanent) && !manualViewerOpen;
    const viewerT = forceGrid ? 0 : smooth(clamp((p - VIEWER_OPEN) / 0.012));
    gallery.style.setProperty('--viewer-opacity', viewerT.toFixed(4));
    gallery.style.setProperty('--viewer-scale', (0.88 + 0.12 * viewerT).toFixed(4));
    gallery.style.setProperty('--sheet-opacity', forceGrid ? '1' : (1 - 0.94 * viewerT).toFixed(4));
    gallery.style.setProperty('--sheet-scale', forceGrid ? '1' : (1 - 0.035 * viewerT).toFixed(4));

    const chatFade = smooth(clamp((p - GALLERY_OPEN) / 0.03));
    story.style.setProperty('--chat-dim', (1 - 0.72 * chatFade).toFixed(3));
    story.style.setProperty('--composer-dim', (1 - 0.88 * chatFade).toFixed(3));

    if (manualGalleryOpen && Math.abs(window.scrollY - manualGalleryScroll) > manualReleasePx) {
      manualGalleryOpen = false;
      gallery.classList.remove('is-manual-gallery');
    }

    if (manualViewerOpen && !manualVideoOpen && Math.abs(window.scrollY - manualOpenScroll) > 70) {
      manualViewerOpen = false;
      gallery.classList.remove('is-manual-viewer');
    }
    if (suppressAutoViewer && Math.abs(window.scrollY - suppressAtScroll) > suppressReleasePx) suppressAutoViewer = false;

    // Depois que a pessoa já viu a sequência inteira, subir a página não
    // atravessa novamente todo o “tempo morto” das 20 fotos. Ela volta direto
    // para a tela inicial da galeria.
    const scrollingUp = window.scrollY < lastScrollY - 2;
    if (suppressAutoViewerPermanent && scrollingUp && p > VIEWER_OPEN + 0.012 && !manualViewerOpen && !snapToGridLock) {
      snapToGridLock = true;
      scrollToGalleryStart('auto');
      setTimeout(() => { snapToGridLock = false; }, 180);
      lastScrollY = window.scrollY;
      return;
    }

    const autoViewer = !storyAdvanced && p >= VIEWER_OPEN && !suppressAutoViewer && !suppressAutoViewerPermanent && !forceGrid;
    if (autoViewer && p >= VIDEO_STAGE - 0.008) prepareNextScene();
    const autoVideoStage = autoViewer && p >= VIDEO_STAGE;
    const autoVideoPress = autoVideoStage && p >= VIDEO_PRESS;
    const showViewer = manualViewerOpen || autoViewer;
    if (autoViewer) markViewed(0);
    viewer?.setAttribute('aria-hidden', showViewer ? 'false' : 'true');
    gallery.classList.toggle('is-auto-viewer', autoViewer && !manualViewerOpen);

    if (!manualVideoOpen) setVideoStageVisible(autoVideoStage, autoVideoPress, false);

    // No fluxo normal por scroll, continuar depois do cartão de “vídeo”
    // simula o clique no play e expande a tela. Se a pessoa chegou por seta,
    // o cartão espera o clique real dela.
    if (autoVideoPress && !manualVideoOpen && !autoFullscreenTriggered) {
      autoFullscreenTriggered = true;
      requestAnimationFrame(triggerVideoPressAndAdvance);
    } else if (!autoVideoPress && p < VIDEO_PRESS - 0.004) {
      autoFullscreenTriggered = false;
    }

    if (!storyAdvanced && !manualViewerOpen && !suppressAutoViewerPermanent && p >= VIEWER_SEQUENCE && p < VIDEO_STAGE) {
      const t = clamp((p - VIEWER_SEQUENCE) / Math.max(0.0001, VIDEO_STAGE - VIEWER_SEQUENCE));
      const autoIndex = Math.min(WORK_COUNT - 1, Math.floor(t * WORK_COUNT));
      if (autoIndex !== previousAutoIndex || viewerIndex !== autoIndex) {
        const animate = p > VIEWER_SEQUENCE + 0.002;
        markViewedRange(previousAutoIndex, autoIndex);
        setViewerIndex(autoIndex, animate);
        previousAutoIndex = autoIndex;
      }
      if (autoIndex === WORK_COUNT - 1) viewerSequenceCompleted = true;
    } else if (autoVideoStage && viewerIndex !== WORK_COUNT - 1) {
      setViewerIndex(WORK_COUNT - 1, false);
      previousAutoIndex = WORK_COUNT - 1;
      viewerSequenceCompleted = true;
    } else if (!manualViewerOpen && !suppressAutoViewerPermanent && p >= VIEWER_OPEN && p < VIEWER_SEQUENCE && viewerIndex !== 0) {
      setViewerIndex(0, false);
      previousAutoIndex = 0;
    }

    syncRomanceOverlay(active && !autoVideoStage && !manualVideoOpen, showViewer && !autoVideoStage && !manualVideoOpen, p);
    lastScrollY = window.scrollY;
  }

  function render(force = false) {
    raf = 0;
    const rawProgress = (window.scrollY - storyTop) / travel;
    const boundary = rawProgress <= 0 ? 'before' : rawProgress >= 1 ? 'after' : null;

    // O runtime da conversa não precisa recalcular a pilha inteira enquanto o
    // usuário está no Hero/Ato I ou muito depois de Trabalho. Renderizamos uma
    // vez o frame-limite e voltamos a acordar assim que o scroll entra na seção.
    if (!force && boundary && boundary === renderBoundary) {
      lastScrollY = window.scrollY;
      return;
    }
    renderBoundary = boundary;

    const p = clamp(rawProgress);
    const chatP = clamp(p / CHAT_END);

    applyVisibility(chatP);
    layoutStack();

    // Continuidade Hero -> Rotina:
    // o primeiro pixel revelado pelo rasgo ainda parece uma página da mesma obra.
    // O título já existe no frame zero; o chrome do chat entra aos poucos.
    const entrySettle = smooth(clamp(chatP / 0.045));
    const entryChrome = smooth(clamp((chatP - 0.022) / 0.075));
    const entryRomance = 1 - smooth(clamp((chatP - 0.010) / 0.095));
    chatScene?.style.setProperty('--entry-chrome', entryChrome.toFixed(4));
    chatScene?.style.setProperty('--entry-romance', entryRomance.toFixed(4));

    const titleOut = smooth(clamp((chatP - 0.118) / 0.027));
    if (title) {
      const opacity = 1 - titleOut;
      const y = 7 * (1 - entrySettle) - 18 * titleOut;
      const scale = 0.984 + 0.016 * entrySettle - 0.008 * titleOut;
      title.style.opacity = `${opacity.toFixed(3)}`;
      title.style.transform = `translate3d(-50%, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      title.style.filter = `blur(${(0.8 * titleOut).toFixed(2)}px)`;
    }

    renderGallery(p);

    if (!force) {
      maybePlayChime(chatP);
      maybePlayTypingChimes(chatP);
    } else {
      previousChatP = chatP;
    }
  }

  function requestRender() {
    if (sceneSuspended || raf) return;
    raf = requestAnimationFrame(() => render());
  }

  function suspendStoryRuntime() {
    if (sceneSuspended) return;
    sceneSuspended = true;
    clearVideoAdvanceTimer();
    if (raf) cancelAnimationFrame(raf);
    if (measureRaf) cancelAnimationFrame(measureRaf);
    raf = 0;
    measureRaf = 0;

    // A V2 não é destruída: ela apenas dorme enquanto a continuação está ativa.
    // Isso mantém a ida leve e, ao mesmo tempo, permite uma volta 100% reversível.
    itemResizeObserver?.disconnect();
    window.removeEventListener('scroll', requestRender);
    window.removeEventListener('resize', requestMeasure);
    window.visualViewport?.removeEventListener?.('resize', requestMeasure);
    mobileMedia.removeEventListener?.('change', requestMeasure);
  }

  function resumeStoryRuntime() {
    if (!sceneSuspended) return;
    sceneSuspended = false;

    allItems.forEach((node) => itemResizeObserver?.observe(node));
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestMeasure, { passive: true });
    window.visualViewport?.addEventListener?.('resize', requestMeasure, { passive: true });
    mobileMedia.addEventListener?.('change', requestMeasure);

    layoutDirty = true;
    renderBoundary = null;
    lastScrollY = window.scrollY;
    requestMeasure();
  }

  document.addEventListener('nextscene:activated', suspendStoryRuntime);

  // Estado usado por trás da película fullscreen durante a volta. O player já
  // reaparece pequeno no DOM antigo antes de a película começar a encolher.
  document.addEventListener('nextscene:returning', (event) => {
    clearVideoAdvanceTimer();
    storyAdvanced = false;
    manualGalleryOpen = false;
    manualViewerOpen = true;
    manualVideoOpen = true;
    suppressAutoViewer = false;
    suppressAutoViewerPermanent = false;
    autoFullscreenTriggered = false;
    returnedFromContinuation = false;

    const restoreScroll = Number(event?.detail?.scrollY);
    if (Number.isFinite(restoreScroll)) manualOpenScroll = restoreScroll;

    gallery?.classList.remove(
      'is-auto-viewer',
      'is-video-fullscreen',
      'is-video-pressing',
      'is-next-scene-ready',
      'is-manual-gallery'
    );
    gallery?.classList.add('is-active', 'is-manual-viewer');
    gallery?.setAttribute('aria-hidden', 'false');
    viewer?.setAttribute('aria-hidden', 'false');
    setVideoStageVisible(true, false, false);
    nextSceneRoot?.setAttribute('aria-hidden', 'false');
    syncRomanceOverlay(false, false);

    // NÃO acorda o runtime aqui. Durante a película fullscreen -> player o
    // documento anterior acabou de voltar ao fluxo e o scroll está sendo
    // restaurado. Se scroll/resize/measure voltarem neste ponto, eles competem
    // com a WAAPI e podem disparar renders usando uma geometria intermediária.
    // O runtime só acorda em nextscene:returned, depois da película terminar.
  });

  document.addEventListener('nextscene:returned', () => {
    resumeStoryRuntime();
    returnedFromContinuation = true;
    lastScrollY = window.scrollY;
    requestRender();
  });

  function fadeBackgroundTo(target, duration = 360, pauseAtZero = false) {
    if (!backgroundMusic) return;
    cancelAnimationFrame(backgroundFadeRaf);
    const start = backgroundMusic.volume;
    const startedAt = performance.now();
    const safeTarget = clamp(target, 0, 1);

    const tick = (now) => {
      const p = clamp((now - startedAt) / Math.max(1, duration));
      const eased = p * p * (3 - 2 * p);
      backgroundMusic.volume = start + (safeTarget - start) * eased;
      if (p < 1) {
        backgroundFadeRaf = requestAnimationFrame(tick);
        return;
      }
      backgroundFadeRaf = 0;
      backgroundMusic.volume = safeTarget;
      if (pauseAtZero && safeTarget <= 0.001) backgroundMusic.pause();
    };
    backgroundFadeRaf = requestAnimationFrame(tick);
  }

  async function resumeBackgroundMusic({ immediate = false } = {}) {
    if (!backgroundMusic || !audioEnabled || !backgroundWanted) return;
    backgroundMusic.muted = false;
    backgroundMusic.loop = true;
    if (backgroundMusic.paused) {
      backgroundMusic.volume = 0;
      try {
        await backgroundMusic.play();
      } catch (_) {
        return;
      }
    }
    fadeBackgroundTo(BACKGROUND_VOLUME, immediate ? 80 : 520, false);
  }

  // V3.8.8: a trilha permanece tocando durante os vídeos.
  // Os vídeos continuam com o próprio áudio em volume integral.

  function configureVideoAudio(video) {
    if (!(video instanceof HTMLVideoElement)) return;
    video.defaultMuted = false;
    video.muted = false;
    video.volume = 1;
    video.removeAttribute('muted');
  }

  function onVideoPlay(event) {
    const video = event.target;
    if (!(video instanceof HTMLVideoElement)) return;
    configureVideoAudio(video);
    activeVideos.add(video);
    // Não pausa nem abaixa a música de fundo durante o vídeo.
    resumeBackgroundMusic();
  }

  function onVideoStopped(event) {
    const video = event.target;
    if (!(video instanceof HTMLVideoElement)) return;
    activeVideos.delete(video);
    // A trilha já continua tocando; apenas garantimos o estado caso o navegador
    // a tenha suspendido por alguma política/visibility change.
    window.setTimeout(() => resumeBackgroundMusic(), 80);
  }

  document.addEventListener('play', onVideoPlay, true);
  document.addEventListener('pause', onVideoStopped, true);
  document.addEventListener('ended', onVideoStopped, true);

  const videoAudioObserver = new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches?.('video')) configureVideoAudio(node);
      node.querySelectorAll?.('video').forEach(configureVideoAudio);
    }));
  });
  videoAudioObserver.observe(document.documentElement, { childList: true, subtree: true });
  document.querySelectorAll('video').forEach(configureVideoAudio);

  async function enableAudio() {
    if (audioEnabled) {
      backgroundWanted = true;
      resumeBackgroundMusic();
      return;
    }

    let unlocked = false;

    // A música é o principal desbloqueio de áudio. O primeiro clique/toque
    // (normalmente "Começar") permite áudio audível nos navegadores modernos.
    if (backgroundMusic) {
      try {
        backgroundMusic.muted = false;
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0;
        await backgroundMusic.play();
        unlocked = true;
      } catch (_) {}
    }

    // Mantém os chimes existentes preparados sem produzir um som extra ao
    // desbloquear a experiência.
    if (titleChime) {
      try {
        const oldVolume = titleChime.volume;
        titleChime.muted = false;
        titleChime.volume = 0;
        await titleChime.play();
        titleChime.pause();
        titleChime.currentTime = 0;
        titleChime.volume = oldVolume || 1;
        unlocked = true;
      } catch (_) {}
    }

    // Mesmo que o arquivo da música ainda não tenha sido colocado, marcamos o
    // áudio como habilitado após a interação para os vídeos entrarem sem muted.
    audioEnabled = true;
    backgroundWanted = true;
    soundHint?.classList.add('is-active');
    soundHint?.setAttribute('aria-label', 'Som ativado');
    soundHint?.setAttribute('title', 'Som ativado');
    document.querySelectorAll('video').forEach(configureVideoAudio);
    if (unlocked) resumeBackgroundMusic({ immediate: true });
    maybePlayChime(clamp(((window.scrollY - storyTop) / travel) / CHAT_END));
  }

  function playChime() {
    if (!titleChime || !audioEnabled) return;
    try {
      titleChime.currentTime = 0;
      titleChime.play().catch(() => {});
    } catch (_) {}
  }

  function maybePlayChime(chatP) {
    if (!audioEnabled || titleChimed) return;
    if (chatP >= 0.06) {
      playChime();
      titleChimed = true;
    }
  }


  function maybePlayTypingChimes(chatP) {
    if (!audioEnabled) {
      previousChatP = chatP;
      return;
    }
    typingChimePoints.forEach((point, index) => {
      if (playedTypingChimes.has(index)) return;
      if (previousChatP < point && chatP >= point) {
        playChime();
        playedTypingChimes.add(index);
      }
    });
    previousChatP = chatP;
  }

  plusButton?.addEventListener('click', () => {
    clearVideoAdvanceTimer();
    manualVideoOpen = false;
    autoFullscreenTriggered = false;
    setVideoStageVisible(false, false, false);
    storyAdvanced = false;
    manualGalleryOpen = true;
    manualGalleryScroll = window.scrollY;
    plusButton.classList.add('is-manual-click');
    gallery?.classList.add('is-active', 'is-grid-ready', 'is-copy-visible', 'is-manual-gallery');
    gallery?.setAttribute('aria-hidden', 'false');
  });
  viewerPrev?.addEventListener('click', goViewerPrev);
  viewerNext?.addEventListener('click', goViewerNext);
  viewerBack?.addEventListener('click', returnToGalleryGrid);
  transitionPlay?.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerVideoPressAndAdvance();
  });
  transitionVideoFrame?.addEventListener('click', (e) => {
    if (e.target.closest?.('.transition-play')) return;
    triggerVideoPressAndAdvance();
  });
  viewer?.addEventListener('touchstart', (e) => {
    touchStartX = e.touches?.[0]?.clientX ?? null;
  }, { passive: true });
  viewer?.addEventListener('touchend', (e) => {
    if (touchStartX == null) return;
    const endX = e.changedTouches?.[0]?.clientX ?? touchStartX;
    const delta = endX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 38) return;
    manualViewerOpen = true;
    manualOpenScroll = window.scrollY;
    if (delta < 0) goViewerNext();
    else goViewerPrev();
  }, { passive: true });


  function syncGalleryScrollState() {
    if (!gallerySheet) return;
    const atBottom = gallerySheet.scrollTop + gallerySheet.clientHeight >= gallerySheet.scrollHeight - 3;
    gallerySheet.classList.toggle('is-at-bottom', atBottom);
  }
  gallerySheet?.addEventListener('scroll', syncGalleryScrollState, { passive: true });


  window.addEventListener('keydown', (e) => {
    if (!audioEnabled) enableAudio();
    if (gallery?.classList.contains('is-next-scene-ready')) return;
    if (viewer?.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'ArrowRight') goViewerNext();
      if (e.key === 'ArrowLeft') goViewerPrev();
      if (e.key === 'Escape') returnToGalleryGrid();
    }
  });

  soundHint?.addEventListener('click', enableAudio);
  window.addEventListener('pointerdown', () => {
    if (!audioEnabled) enableAudio();
  }, { once: true, passive: true });
  window.addEventListener('touchstart', () => {
    if (!audioEnabled) enableAudio();
  }, { once: true, passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!backgroundMusic) return;
    if (document.hidden) {
      backgroundMusic.pause();
    } else if (audioEnabled && backgroundWanted) {
      resumeBackgroundMusic();
    }
  });

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestMeasure, { passive: true });
  window.visualViewport?.addEventListener?.('resize', requestMeasure, { passive: true });
  mobileMedia.addEventListener?.('change', requestMeasure);

  buildGallery();
  setViewerIndex(0, false);
  syncGalleryScrollState();
  requestAnimationFrame(() => requestAnimationFrame(measure));
})();
