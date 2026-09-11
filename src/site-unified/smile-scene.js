import { createScrollFrameDriver } from './performance-runtime.js';

const PHOTO_MANIFEST = {
  'sorriso-01': { file: 'sorriso-01.webp', width: 497, height: 1451, cutout: true },
  'sorriso-02': { file: 'sorriso-02.webp', width: 540, height: 960 },
  'sorriso-03': { file: 'sorriso-03.webp', width: 900, height: 1600 },
  'sorriso-04': { file: 'sorriso-04.webp', width: 1200, height: 1600, cutout: true },
  'sorriso-05': { file: 'sorriso-05.webp', width: 900, height: 1600, cutout: true },
  'sorriso-06': { file: 'sorriso-06.webp', width: 900, height: 1600, cutout: true },
  'sorriso-07': { file: 'sorriso-07.webp', width: 900, height: 1600 },
  'sorriso-08': { file: 'sorriso-08.webp', width: 900, height: 1600 },
  'sorriso-09': { file: 'sorriso-09.webp', width: 668, height: 900 },
  'sorriso-10': { file: 'sorriso-10.webp', width: 1600, height: 900 },
  'sorriso-11': { file: 'sorriso-11.webp', width: 900, height: 1600, cutout: true },
  'sorriso-12': { file: 'sorriso-12.webp', width: 1200, height: 1600 },
  'sorriso-13': { file: 'sorriso-13.webp', width: 1600, height: 900 },
  'sorriso-14': { file: 'sorriso-14.webp', width: 1080, height: 608 },
  'sorriso-15': { file: 'sorriso-15.webp', width: 738, height: 828, cutout: true },
  'sorriso-16': { file: 'sorriso-16.webp', width: 540, height: 960 },
  'sorriso-17': { file: 'sorriso-17.webp', width: 1080, height: 1920 },
  'sorriso-18': { file: 'sorriso-18.webp', width: 540, height: 960 },
};

const STAGES = [
  {
    id: 's01',
    photos: [
      { id: 'sorriso-04', rot: -1.2, enter: [34, -4], exit: [-36, -2], fasteners: [['tape-01.png', 'tc', -3], ['laco-01.png', 'tr', 6]] },
      { id: 'sorriso-01', rot: -2.6, enter: [-34, 8], exit: [28, 18], fasteners: [['tape-02.png', 'tc', 2]] },
      { id: 'sorriso-02', rot: 1.5, enter: [34, -4], exit: [36, -12], fasteners: [['tape-03.png', 'tc', -2]] },
      { id: 'sorriso-03', rot: 1.1, enter: [34, 10], exit: [34, 14], fasteners: [['tape-04.png', 'tc', 2]] },
      { id: 'sorriso-10', rot: -0.8, enter: [0, 28], exit: [0, 26], fasteners: [['tape-05.png', 'tc', 0]] },
      { id: 'sorriso-16', rot: 1.7, enter: [36, 8], exit: [30, 20], fasteners: [['tape-06.png', 'tc', 0]] },
    ],
    deco: [
      { key: 'flor-01', file: 'flor-01.png', rot: -9, enter: [-24, 8], exit: [-32, 12] },
      { key: 'rosa', file: 'rosa.png', rot: 4, enter: [-28, 18], exit: [-30, 24] },
      { key: 'angel-01', file: 'angel-01.png', rot: -2, enter: [-22, -10], exit: [8, -26] },
      { key: 'youaremysunshine', file: 'youaremysunshine.png', rot: 3, enter: [30, 0], exit: [36, 0] },
      { key: 'carta-01', file: 'carta-01.png', rot: 3, enter: [-24, 18], exit: [-30, 26] },
      { key: 'ribbon-01', file: 'ribbon-01.png', rot: 0, enter: [22, 10], exit: [28, 20] },
      { key: 'selo-01', file: 'selo-01.png', rot: 5, enter: [30, -6], exit: [36, -10] },
      { key: 'laco-01', file: 'laco-01.png', rot: 8, enter: [20, -14], exit: [26, -20] },
      { key: 'miniheart', file: 'miniheart.png', rot: 0, enter: [16, -8], exit: [18, -10] },
      { key: 'miniheart-02', file: 'miniheart-02.png', rot: 0, enter: [-10, 12], exit: [-10, 18] },
    ],
  },
  {
    id: 's02',
    photos: [
      { id: 'sorriso-05', rot: -1.1, enter: [-34, -4], exit: [-38, -4], fasteners: [['tape-01.png', 'tc', -4]] },
      { id: 'sorriso-06', rot: 1.2, enter: [34, -4], exit: [38, -2], fasteners: [['tape-02.png', 'tc', 4], ['laco-02.png', 'tr', 9]] },
      { id: 'sorriso-07', rot: 1.2, enter: [-28, -16], exit: [-34, -18], fasteners: [['tape-03.png', 'tc', -2]] },
      { id: 'sorriso-08', rot: -1.5, enter: [28, 14], exit: [34, 20], fasteners: [['tape-04.png', 'tc', 2]] },
      { id: 'sorriso-09', rot: -2.1, enter: [-28, 18], exit: [-34, 24], fasteners: [['tape-05.png', 'tc', 0]] },
      { id: 'sorriso-13', rot: 0.4, enter: [0, 28], exit: [0, 26], fasteners: [['tape-06.png', 'tc', 0]] },
    ],
    deco: [
      { key: 'pessoafavorita', file: 'pessoafavorita.png', rot: -2, enter: [18, -22], exit: [16, -24], kind: 'title' },
      { key: 'colar', file: 'colar.png', rot: -8, enter: [-18, -12], exit: [-24, -18] },
      { key: 'chave', file: 'chave.png', rot: 6, enter: [-20, 6], exit: [-24, 10] },
      { key: 'carta', file: 'carta.png', rot: 2, enter: [-24, 18], exit: [-28, 22] },
      { key: 'bear-01', file: 'bear-01.png', rot: 2, enter: [26, 6], exit: [30, 8] },
      { key: 'kiss-01', file: 'kiss-01.png', rot: -8, enter: [18, 0], exit: [24, 0] },
      { key: 'laco-02', file: 'laco-02.png', rot: 8, enter: [24, -16], exit: [28, -18] },
      { key: 'selo-02', file: 'selo-02.png', rot: 6, enter: [-12, 16], exit: [-16, 18] },
      { key: 'miniheart', file: 'miniheart.png', rot: 0, enter: [10, -8], exit: [14, -8] },
      { key: 'miniheart-02', file: 'miniheart-02.png', rot: 0, enter: [10, 8], exit: [16, 8] },
    ],
  },
  {
    id: 's03',
    photos: [
      { id: 'sorriso-11', rot: -1.3, enter: [-34, -4], exit: [-36, -4], fasteners: [['tape-01.png', 'tc', 3]] },
      { id: 'sorriso-12', rot: 1.3, enter: [-24, -18], exit: [-28, -20], fasteners: [['tape-02.png', 'tc', -4]] },
      { id: 'sorriso-14', rot: -0.7, enter: [-12, 28], exit: [-16, 28], fasteners: [['tape-03.png', 'tc', 0]] },
      { id: 'sorriso-15', rot: 1.5, enter: [30, -8], exit: [34, -10], fasteners: [['tape-04.png', 'tc', 3], ['laco-03.png', 'tr', 6]] },
      { id: 'sorriso-17', rot: 0.8, enter: [28, 10], exit: [34, 10], fasteners: [['tape-05.png', 'tc', -2]] },
      { id: 'sorriso-18', rot: -1.1, enter: [26, 22], exit: [32, 24], fasteners: [['tape-06.png', 'tc', 0]] },
    ],
    deco: [
      { key: 'anatomico', file: 'anatomico.png', rot: -4, enter: [18, -18], exit: [22, -20] },
      { key: 'lolipop', file: 'lolipop.png', rot: -2, enter: [22, 6], exit: [26, 8] },
      { key: 'lovesongstape', file: 'lovesongstape.png', rot: -6, enter: [-24, 12], exit: [-28, 16] },
      { key: 'angel-02', file: 'angel-02.png', rot: 2, enter: [24, -16], exit: [28, -20] },
      { key: 'rosa', file: 'rosa.png', rot: -4, enter: [-26, 2], exit: [-30, 6] },
      { key: 'flor-01', file: 'flor-01.png', rot: 0, enter: [26, 16], exit: [30, 18] },
      { key: 'carta', file: 'carta.png', rot: 4, enter: [24, -6], exit: [28, -10] },
      { key: 'laco-03', file: 'laco-03.png', rot: 7, enter: [0, 20], exit: [0, 24] },
      { key: 'selo-01', file: 'selo-01.png', rot: -4, enter: [10, 14], exit: [14, 18] },
      { key: 'miniheart', file: 'miniheart.png', rot: 0, enter: [12, 10], exit: [16, 12] },
      { key: 'miniheart-02', file: 'miniheart-02.png', rot: 0, enter: [-10, -8], exit: [-14, -10] },
    ],
  },
];

const TIMELINE = {
  s1HoldEnd: 0.19,
  s1OutEnd: 0.29,
  s2InEnd: 0.39,
  s2HoldEnd: 0.58,
  s2OutEnd: 0.68,
  s3InEnd: 0.78,
  s3HoldEnd: 0.91,
  finalOutEnd: 1.0,
};

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function between(v, a, b) { return clamp((v - a) / (b - a), 0, 1); }
function ease(t) { return t * t * (3 - 2 * t); }

function createPhotoItem(config, assetBase, loadNow = false) {
  const photo = PHOTO_MANIFEST[config.id];
  const el = document.createElement('div');
  el.className = 'smile-v5__item is-photo';
  el.dataset.item = config.id;
  el.dataset.kind = 'photo';
  el.dataset.rot = String(config.rot || 0);
  el.dataset.enterX = String(config.enter?.[0] || 0);
  el.dataset.enterY = String(config.enter?.[1] || 0);
  el.dataset.exitX = String(config.exit?.[0] || 0);
  el.dataset.exitY = String(config.exit?.[1] || 0);
  el.innerHTML = `
    <figure class="smile-v5__photo" data-cutout="${photo.cutout ? 'true' : 'false'}" style="aspect-ratio:${photo.width}/${photo.height}">
      <span class="smile-v5__frame" aria-hidden="true"></span>
      <img class="smile-v5__photo-img" data-src="${assetBase}/sorriso/${photo.file}" alt="Foto ${config.id}" loading="lazy" decoding="async" />
      <span class="smile-v5__gloss" aria-hidden="true"></span>
    </figure>`;
  const fig = el.querySelector('.smile-v5__photo');
  const photoImg = el.querySelector('.smile-v5__photo-img');
  if (loadNow && photoImg?.dataset.src) {
    photoImg.src = photoImg.dataset.src;
    photoImg.removeAttribute('data-src');
    photoImg.loading = 'eager';
  }
  const gloss = el.querySelector('.smile-v5__gloss');
  const photoIndex = Number((config.id.match(/(\d+)$/) || [0, 1])[1]);
  gloss?.style.setProperty('--gloss-duration', `${8.2 + (photoIndex % 5) * 0.9}s`);
  gloss?.style.setProperty('--gloss-delay', `${-((photoIndex * 1.37) % 7.4)}s`);
  (config.fasteners || []).forEach(([file, anchor, rot]) => {
    const img = document.createElement('img');
    img.className = `smile-v5__fastener smile-v5__fastener--${anchor}`;
    img.src = `${assetBase}/love-scene/kit/${file}`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.draggable = false;
    img.style.transform = `rotate(${rot || 0}deg)`;
    fig.appendChild(img);
  });
  return el;
}

function createDecoItem(config, assetBase, loadNow = false) {
  const el = document.createElement('div');
  el.className = `smile-v5__item ${config.kind === 'title' ? 'is-title' : 'is-deco'}`;
  el.dataset.item = config.key;
  el.dataset.kind = config.kind || 'deco';
  el.dataset.rot = String(config.rot || 0);
  el.dataset.enterX = String(config.enter?.[0] || 0);
  el.dataset.enterY = String(config.enter?.[1] || 0);
  el.dataset.exitX = String(config.exit?.[0] || 0);
  el.dataset.exitY = String(config.exit?.[1] || 0);
  el.innerHTML = `<img class="smile-v5__img" data-src="${assetBase}/love-scene/kit/${config.file}" alt="" aria-hidden="true" draggable="false" />`;
  const img = el.querySelector('.smile-v5__img');
  if (loadNow && img?.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
  return el;
}

function buildSpread(stage, assetBase, loadNow = false) {
  const spread = document.createElement('section');
  spread.className = `smile-v5__spread smile-v5__spread--${stage.id}`;
  if (stage.title) spread.appendChild(createDecoItem({ ...stage.title, kind: 'title' }, assetBase, loadNow));
  stage.photos.forEach((p) => spread.appendChild(createPhotoItem(p, assetBase, loadNow)));
  stage.deco.forEach((d) => spread.appendChild(createDecoItem(d, assetBase, loadNow)));
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

    /* No telefone cada item começa/termina realmente fora da viewport.
       Mantemos o quadrante/direção original, mas aumentamos o percurso. */
    if (sx && sy) return [sx * 112, sy * 76];
    if (sx) return [sx * 116, 0];
    if (sy) return [0, sy * 112];
    return [0, 0];
  };

  items.forEach((item) => {
    const rot = parseFloat(item.dataset.rot || '0');
    const x0 = parseFloat(item.dataset.enterX || '0');
    const y0 = parseFloat(item.dataset.enterY || '0');
    const x1 = parseFloat(item.dataset.exitX || '0');
    const y1 = parseFloat(item.dataset.exitY || '0');
    const [inX, inY] = mobileVector(x0, y0);
    const [outX, outY] = mobileVector(x1, y1);
    const x = mode === 'in' ? inX * (1 - et) : outX * et;
    const y = mode === 'in' ? inY * (1 - et) : outY * et;
    item.style.opacity = '1';
    item.style.transform = `translate(${x}vw, ${y}vh) rotate(${rot}deg)`;
  });
}

function updateScene(host, stageMap) {
  const section = host.querySelector('.smile-v5__section');
  const sceneStage = host.querySelector('.smile-v5__scene-stage');
  const externalProgress = Number.parseFloat(host.dataset.loveTrioProgress || '');
  let p;
  if (window.innerWidth <= 860 && Number.isFinite(externalProgress)) {
    p = clamp(externalProgress, 0, 1);
  } else {
    const rect = section.getBoundingClientRect();
    const max = Math.max(1, rect.height - window.innerHeight);
    p = clamp(-rect.top / max, 0, 1);
  }

  if (p > 0.10) loadSpread(stageMap.s02.root);
  if (p > 0.48) loadSpread(stageMap.s03.root);

  Object.values(stageMap).forEach((spread) => hide(spread.items));
  sceneStage.style.transform = 'translate3d(0,0,0)';

  if (p <= TIMELINE.s1HoldEnd) {
    hold(stageMap.s01.items);
  } else if (p <= TIMELINE.s1OutEnd) {
    move(stageMap.s01.items, between(p, TIMELINE.s1HoldEnd, TIMELINE.s1OutEnd), 'out');
  } else if (p <= TIMELINE.s2InEnd) {
    move(stageMap.s02.items, between(p, TIMELINE.s1OutEnd, TIMELINE.s2InEnd), 'in');
  } else if (p <= TIMELINE.s2HoldEnd) {
    hold(stageMap.s02.items);
  } else if (p <= TIMELINE.s2OutEnd) {
    move(stageMap.s02.items, between(p, TIMELINE.s2HoldEnd, TIMELINE.s2OutEnd), 'out');
  } else if (p <= TIMELINE.s3InEnd) {
    move(stageMap.s03.items, between(p, TIMELINE.s2OutEnd, TIMELINE.s3InEnd), 'in');
  } else if (p <= TIMELINE.s3HoldEnd) {
    hold(stageMap.s03.items);
  } else {
    hold(stageMap.s03.items);
    const t = between(p, TIMELINE.s3HoldEnd, TIMELINE.finalOutEnd);
    const x = -118 * ease(t);
    sceneStage.style.transform = `translate3d(${x}vw, 0, 0)`;
  }
}

export function initSmileScene(root, options = {}) {
  if (!root) throw new Error('root obrigatório');
  const assetBase = (options.assetBase || '/assets').replace(/\/$/, '');
  const host = document.createElement('section');
  host.className = 'smile-v5';
  host.innerHTML = `
    <div class="smile-v5__section">
      <div class="smile-v5__sticky">
        <div class="smile-v5__next-style-bg" aria-hidden="true"></div>
        <div class="smile-v5__scene-stage">
          <div class="smile-v5__paper" aria-hidden="true"></div>
          <img class="smile-v5__center-title" src="${assetBase}/love-scene/kit/amoseusorriso.png" alt="Amo o seu sorriso" draggable="false" />
          <div class="smile-v5__canvas"></div>
        </div>
      </div>
    </div>`;

  const canvas = host.querySelector('.smile-v5__canvas');
  const stageMap = {};
  STAGES.forEach((stage, index) => {
    const spread = buildSpread(stage, assetBase, index === 0);
    canvas.appendChild(spread);
    stageMap[stage.id] = { root: spread, items: [...spread.querySelectorAll('.smile-v5__item')] };
  });
  root.appendChild(host);

  const cleanups = [];
  host.querySelectorAll('.smile-v5__photo-img').forEach((img) => {
    const item = img.closest('.smile-v5__item');
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

  const render = () => updateScene(host, stageMap);
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
