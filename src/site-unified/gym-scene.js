import { createScrollFrameDriver, createViewportFrameDriver } from './performance-runtime.js';

const PHOTO_MANIFEST = {
  'academia-01': { file: 'academia-01.webp', width: 1080, height: 1920 },
  'academia-02': { file: 'academia-02.webp', width: 900, height: 1600 },
  'academia-03': { file: 'academia-03.webp', width: 900, height: 1600 },
  'academia-04': { file: 'academia-04.webp', width: 900, height: 1600 },
  'academia-05': { file: 'academia-05.webp', width: 1200, height: 1600 },
  'academia-06': { file: 'academia-06.webp', width: 1080, height: 1920 },
  'academia-07': { file: 'academia-07.webp', width: 1080, height: 1920 },
  'academia-08': { file: 'academia-08.webp', width: 900, height: 1600 },
  'academia-09': { file: 'academia-09.webp', width: 960, height: 1280 },
  'academia-10': { file: 'academia-10.webp', width: 720, height: 1280 },
  'academia-11': { file: 'academia-11.webp', width: 900, height: 1600 },
  'academia-12': { file: 'academia-12.webp', width: 900, height: 1600 },
  'academia-13': { file: 'academia-13.webp', width: 1200, height: 1600 },
  'academia-14': { file: 'academia-14.webp', width: 1200, height: 1600 },
  'academia-15': { file: 'academia-15.webp', width: 900, height: 1600 },
  'academia-16': { file: 'academia-16.webp', width: 903, height: 900 },
  'academia-17': { file: 'academia-17.webp', width: 900, height: 1600 },
  'academia-18': { file: 'academia-18.webp', width: 900, height: 1600 },
  'academia-19': { file: 'academia-19.webp', width: 1080, height: 1920 },
  'academia-20': { file: 'academia-20.webp', width: 1080, height: 1439 },
};

const STAGES = [
  {
    id: 'a01',
    photos: [
      { id:'academia-01', rot:-1.1, enter:[-34,-8], exit:[-38,-10] },
      { id:'academia-02', rot:1.0, enter:[-24,-12], exit:[-30,-12] },
      { id:'academia-03', rot:-0.8, enter:[0,-28], exit:[0,-30] },
      { id:'academia-04', rot:1.1, enter:[24,-12], exit:[30,-12] },
      { id:'academia-05', rot:-1.2, enter:[-16,24], exit:[-22,26] },
      { id:'academia-06', rot:1.3, enter:[24,22], exit:[30,24] },
    ],
    deco: [
      { key:'cat-01', file:'cat-01.png', rot:-2, enter:[-24,18], exit:[-28,20] },
      { key:'cat-02', file:'cat-02.png', rot:3, enter:[28,-10], exit:[32,-12] },
      { key:'cat-03', file:'cat-03.png', rot:0, enter:[0,22], exit:[0,26] },
      { key:'dog01', file:'dog01.png', rot:2, enter:[26,18], exit:[30,22] },
      { key:'halter02', file:'halter02.png', rot:-4, enter:[10,22], exit:[14,26] },
      { key:'garrafa', file:'garrafa.png', rot:-3, enter:[-26,0], exit:[-30,0] },
      { key:'heart', file:'heart.png', rot:0, enter:[8,10], exit:[12,12] },
    ],
  },
  {
    id: 'a02',
    photos: [
      { id:'academia-07', rot:-1.2, enter:[-34,-8], exit:[-38,-10] },
      { id:'academia-08', rot:1.2, enter:[-20,-12], exit:[-24,-14] },
      { id:'academia-09', rot:-0.9, enter:[0,-28], exit:[0,-30] },
      { id:'academia-10', rot:1.0, enter:[18,-16], exit:[22,-18] },
      { id:'academia-11', rot:-1.1, enter:[30,-8], exit:[34,-10] },
      { id:'academia-12', rot:1.2, enter:[-18,24], exit:[-22,26] },
      { id:'academia-13', rot:-0.7, enter:[22,24], exit:[26,26] },
    ],
    deco: [
      { key:'vceumsabor', file:'vceumsabor.png', rot:-1, enter:[0,24], exit:[0,28], kind:'title' },
      { key:'cat-04', file:'cat-04.png', rot:-1, enter:[-26,18], exit:[-30,22] },
      { key:'cat-05', file:'cat-05.png', rot:3, enter:[28,16], exit:[32,20] },
      { key:'cat-06', file:'cat-06.png', rot:0, enter:[26,-14], exit:[30,-18] },
      { key:'fire', file:'fire.png', rot:2, enter:[-10,22], exit:[-12,26] },
      { key:'luva', file:'luva.png', rot:-3, enter:[-28,0], exit:[-32,0] },
      { key:'halter01', file:'halter01.jpg', rot:3, enter:[28,0], exit:[32,0] },
      { key:'heart2', file:'heart2.png', rot:0, enter:[10,20], exit:[14,24] },
    ],
  },
  {
    id: 'a03',
    photos: [
      { id:'academia-14', rot:-1.0, enter:[-34,-8], exit:[-38,-10] },
      { id:'academia-15', rot:1.1, enter:[-20,-12], exit:[-24,-14] },
      { id:'academia-17', rot:-0.8, enter:[18,-14], exit:[22,-16] },
      { id:'academia-18', rot:1.1, enter:[30,-8], exit:[34,-10] },
      { id:'academia-19', rot:-1.2, enter:[-24,24], exit:[-28,26] },
      { id:'academia-20', rot:1.0, enter:[28,22], exit:[32,24] },
      { id:'academia-16', rot:-0.4, enter:[0,28], exit:[0,30] },
    ],
    deco: [
      { key:'cat-07', file:'cat-07.png', rot:1, enter:[0,-24], exit:[0,-28] },
      { key:'rat01', file:'rat01.png', rot:-2, enter:[-28,20], exit:[-32,24] },
      { key:'rat02', file:'rat02.png', rot:2, enter:[-16,22], exit:[-20,26] },
      { key:'rat03', file:'rat03.png', rot:-1, enter:[16,22], exit:[20,26] },
      { key:'rat04', file:'rat04.png', rot:2, enter:[28,0], exit:[32,0] },
      { key:'rat05', file:'rat05.png', rot:-2, enter:[-28,0], exit:[-32,0] },
      { key:'trofeu', file:'trofeu.jpg', rot:0, enter:[0,18], exit:[0,22] },
    ],
  },
];

const TIMELINE = {
  a1HoldEnd: .20,
  a1OutEnd: .30,
  a2InEnd: .40,
  a2HoldEnd: .61,
  a2OutEnd: .71,
  a3InEnd: .81,
  a3HoldEnd: 1.00,
};

function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
function between(v,a,b){ return clamp((v-a)/(b-a),0,1); }
function ease(t){ return t*t*(3-2*t); }

function setMotionData(el, c){
  el.dataset.rot=String(c.rot||0);
  el.dataset.enterX=String(c.enter?.[0]||0);
  el.dataset.enterY=String(c.enter?.[1]||0);
  el.dataset.exitX=String(c.exit?.[0]||0);
  el.dataset.exitY=String(c.exit?.[1]||0);
}

function createPhotoItem(c, assetBase, loadNow=false){
  const p=PHOTO_MANIFEST[c.id];
  const el=document.createElement('div');
  el.className='gym-v1__item is-photo';
  el.dataset.item=c.id;
  setMotionData(el,c);
  el.innerHTML=`<figure class="gym-v1__photo" style="aspect-ratio:${p.width}/${p.height}">
    <span class="gym-v1__frame" aria-hidden="true"></span>
    <img class="gym-v1__photo-img" data-src="${assetBase}/academia/${p.file}" alt="Foto ${c.id}" loading="lazy" decoding="async" />
    <span class="gym-v1__gloss" aria-hidden="true"></span>
  </figure>`;
  const photoImg=el.querySelector('.gym-v1__photo-img');
  if(loadNow && photoImg?.dataset.src){
    photoImg.src=photoImg.dataset.src;
    photoImg.removeAttribute('data-src');
    photoImg.loading='eager';
  }
  const gloss=el.querySelector('.gym-v1__gloss');
  const idx=Number((c.id.match(/(\d+)$/)||[0,1])[1]);
  gloss?.style.setProperty('--gloss-duration',`${8.3+(idx%6)*.9}s`);
  gloss?.style.setProperty('--gloss-delay',`${-((idx*1.31)%7.6)}s`);
  return el;
}

function createDecoItem(c, assetBase, loadNow=false){
  const el=document.createElement('div');
  el.className=`gym-v1__item ${c.kind==='title'?'is-title':'is-deco'}`;
  el.dataset.item=c.key;
  setMotionData(el,c);
  el.innerHTML=`<img class="gym-v1__img" data-src="${assetBase}/love-scene-academia/kit/${c.file}" alt="" aria-hidden="true" draggable="false" />`;
  const img=el.querySelector('.gym-v1__img');
  if(loadNow && img?.dataset.src){img.src=img.dataset.src;img.removeAttribute('data-src');}
  return el;
}

function buildSpread(stage, assetBase, loadNow=false){
  const spread=document.createElement('section');
  spread.className=`gym-v1__spread gym-v1__spread--${stage.id}`;
  stage.photos.forEach(p=>spread.appendChild(createPhotoItem(p,assetBase,loadNow)));
  stage.deco.forEach(d=>spread.appendChild(createDecoItem(d,assetBase,loadNow)));
  return spread;
}

function loadSpread(spread){
  spread?.querySelectorAll('img[data-src]').forEach(img=>{
    img.src=img.dataset.src;
    img.removeAttribute('data-src');
  });
}

function hide(items){
  items.forEach(item=>{
    const r=parseFloat(item.dataset.rot||'0');
    item.style.opacity='0';
    item.style.transform=`translate(0vw,0vh) rotate(${r}deg)`;
  });
}
function hold(items){
  items.forEach(item=>{
    const r=parseFloat(item.dataset.rot||'0');
    item.style.opacity='1';
    item.style.transform=`translate(0vw,0vh) rotate(${r}deg)`;
  });
}
function move(items,t,mode){
  const e=ease(t);
  const mobile=window.innerWidth<=860;

  const mobileVector=(vx,vy)=>{
    if(!mobile) return [vx,vy];
    const sx=Math.sign(vx);
    const sy=Math.sign(vy);
    if(sx&&sy) return [sx*112,sy*76];
    if(sx) return [sx*116,0];
    if(sy) return [0,sy*112];
    return [0,0];
  };

  items.forEach(item=>{
    const r=parseFloat(item.dataset.rot||'0');
    const ex=parseFloat(item.dataset.enterX||'0');
    const ey=parseFloat(item.dataset.enterY||'0');
    const ox=parseFloat(item.dataset.exitX||'0');
    const oy=parseFloat(item.dataset.exitY||'0');
    const [inX,inY]=mobileVector(ex,ey);
    const [outX,outY]=mobileVector(ox,oy);
    const x=mode==='in'?inX*(1-e):outX*e;
    const y=mode==='in'?inY*(1-e):outY*e;
    item.style.opacity='1';
    item.style.transform=`translate(${x}vw,${y}vh) rotate(${r}deg)`;
  });
}

function updateScene(host,map){
  const section=host.querySelector('.gym-v1__section');
  const externalProgress=Number.parseFloat(host.dataset.loveTrioProgress||'');
  let p;
  if(window.innerWidth<=860&&Number.isFinite(externalProgress)){
    p=clamp(externalProgress,0,1);
  }else{
    const rect=section.getBoundingClientRect();
    const max=Math.max(1,rect.height-window.innerHeight);
    p=clamp(-rect.top/max,0,1);
  }
  if(p>.10) loadSpread(map.a02.root);
  if(p>.48) loadSpread(map.a03.root);
  Object.values(map).forEach(s=>hide(s.items));

  if(p<=TIMELINE.a1HoldEnd){
    hold(map.a01.items);
  } else if(p<=TIMELINE.a1OutEnd){
    move(map.a01.items,between(p,TIMELINE.a1HoldEnd,TIMELINE.a1OutEnd),'out');
  } else if(p<=TIMELINE.a2InEnd){
    move(map.a02.items,between(p,TIMELINE.a1OutEnd,TIMELINE.a2InEnd),'in');
  } else if(p<=TIMELINE.a2HoldEnd){
    hold(map.a02.items);
  } else if(p<=TIMELINE.a2OutEnd){
    move(map.a02.items,between(p,TIMELINE.a2HoldEnd,TIMELINE.a2OutEnd),'out');
  } else if(p<=TIMELINE.a3InEnd){
    move(map.a03.items,between(p,TIMELINE.a2OutEnd,TIMELINE.a3InEnd),'in');
  } else {
    hold(map.a03.items);
  }
}

export function initGymScene(root, options={}){
  if(!root) throw new Error('initGymScene(root): root é obrigatório.');
  const assetBase=(options.assetBase||'/assets').replace(/\/$/,'');
  const host=document.createElement('section');
  host.className='gym-v1';
  host.innerHTML=`<div class="gym-v1__section"><div class="gym-v1__sticky"><div class="gym-v1__scene-stage"><div class="gym-v1__paper" aria-hidden="true"></div><div class="gym-v1__canvas"><img class="gym-v1__tapago" src="${assetBase}/love-scene-academia/kit/tapago.png" alt="Amo receber os tá pago" draggable="false" /></div></div></div></div>`;
  const canvas=host.querySelector('.gym-v1__canvas');
  const map={};
  STAGES.forEach((stage,index)=>{
    const spread=buildSpread(stage,assetBase,index===0);
    canvas.appendChild(spread);
    map[stage.id]={root:spread,items:[...spread.querySelectorAll('.gym-v1__item')]};
  });
  root.appendChild(host);

  const cleanups=[];
  host.querySelectorAll('.gym-v1__photo-img').forEach(img=>{
    const item=img.closest('.gym-v1__item');
    const onLoad=()=>item?.classList.add('is-loaded');
    const onError=()=>item?.classList.add('is-error');
    img.addEventListener('load',onLoad);
    img.addEventListener('error',onError);
    cleanups.push(()=>{img.removeEventListener('load',onLoad);img.removeEventListener('error',onError);});
    if(img.hasAttribute('src') && img.complete) img.naturalWidth?onLoad():onError();
  });

  const render=()=>updateScene(host,map);
  const frameDriver=createScrollFrameDriver(render,{root:host,rootMargin:'125% 0px'});
  const viewportDriver=createViewportFrameDriver(()=>frameDriver.flush());
  cleanups.push(()=>viewportDriver.destroy());

  return {
    root:host,
    render,
    refresh(){frameDriver.flush();},
    destroy(){frameDriver.destroy();cleanups.splice(0).forEach(fn=>fn());host.remove();}
  };
}
