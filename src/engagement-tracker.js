const cfg = window.__LOVE_ANALYTICS__ || {};
const API_BASE = String(cfg.apiBase || '/api').replace(/\/$/, '');
const ENABLED = cfg.enabled !== false;
const VISIT_KEY = 'love-story-visit-id-v1';
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

function randomId(){
  if(globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function storageGet(key){try{return localStorage.getItem(key)}catch{return null}}
function storageSet(key,value){try{localStorage.setItem(key,value)}catch{}}
function getVisitId(){
  let id=storageGet(VISIT_KEY);
  if(!id){id=randomId();storageSet(VISIT_KEY,id)}
  return id;
}
function getRecipient(){
  const url=new URL(location.href);
  const fromUrl=(url.searchParams.get('r')||'').trim().slice(0,80);
  if(fromUrl){storageSet(RECIPIENT_KEY,fromUrl);return fromUrl}
  return storageGet(RECIPIENT_KEY)||'public';
}
function deviceClass(){
  const touch=navigator.maxTouchPoints>0;
  if(matchMedia('(max-width: 860px)').matches) return touch?'mobile':'small-screen';
  return touch?'tablet':'desktop';
}
function post(path,payload,{beacon=false}={}){
  if(!ENABLED) return Promise.resolve(null);
  const url=`${API_BASE}${path}`;
  const body=JSON.stringify(payload);
  if(beacon && navigator.sendBeacon){
    try{return Promise.resolve(navigator.sendBeacon(url,new Blob([body],{type:'application/json'})))}catch{}
  }
  return fetch(url,{method:'POST',headers:{'content-type':'application/json'},body,keepalive:true})
    .then(r=>r.ok?r.json().catch(()=>null):Promise.reject(new Error(`HTTP ${r.status}`)));
}

const visitId=getVisitId();
const recipient=getRecipient();
let bestScore=-1;
let bestPayload=null;
let lastSentAt=0;
let timer=0;

function isUsable(el){
  if(!el) return false;
  const style=getComputedStyle(el);
  if(style.display==='none'||style.visibility==='hidden') return false;
  if(el.getAttribute('aria-hidden')==='true') return false;
  const shell=el.closest('[data-love-continuation-shell]');
  if(shell?.getAttribute('aria-hidden')==='true') return false;
  return true;
}
function stageProgress(el){
  const r=el.getBoundingClientRect();
  const vh=Math.max(1,window.innerHeight);
  const travel=Math.max(1,r.height-vh);
  if(r.top>vh) return 0;
  if(r.bottom<=0) return 100;
  if(r.height<=vh) return r.top<=vh*.55 && r.bottom>=vh*.45 ? 50 : (r.top<0?100:0);
  return Math.round(Math.max(0,Math.min(1,-r.top/travel))*100);
}
function activeStage(){
  const center=window.innerHeight*.5;
  let best=null;
  STAGES.forEach((stage,index)=>{
    const el=document.querySelector(stage.selector);
    if(!isUsable(el)) return;
    const r=el.getBoundingClientRect();
    const intersects=r.top<=center && r.bottom>=center;
    if(!intersects) return;
    if(stage.id==='routine'){
      const work=document.querySelector('[data-work-gallery]');
      if(work?.classList.contains('is-active')) return;
    }
    best={stage,index,el};
  });
  return best;
}
function snapshot(){
  const current=activeStage();
  if(!current) return null;
  const local=stageProgress(current.el);
  const score=current.index*100+local;
  return {
    visitId,recipient,
    stageIndex:current.index,
    stageId:current.stage.id,
    stageLabel:current.stage.label,
    stageProgress:local,
    score,
    completed:current.stage.id==='continua',
  };
}
function maybeSend(force=false,beacon=false){
  const snap=snapshot();
  if(!snap) return;
  if(snap.score>bestScore){bestScore=snap.score;bestPayload=snap}
  if(!bestPayload) return;
  const now=Date.now();
  if(!force && now-lastSentAt<5000) return;
  lastSentAt=now;
  post('/progress',bestPayload,{beacon}).catch(()=>{});
}
function scheduleTick(){
  clearTimeout(timer);
  timer=setTimeout(()=>maybeSend(false,false),350);
}

post('/visit',{visitId,recipient,device:deviceClass(),path:location.pathname}).catch(()=>{});
window.addEventListener('scroll',scheduleTick,{passive:true});
window.addEventListener('resize',scheduleTick,{passive:true});
document.addEventListener('nextscene:entered',()=>setTimeout(()=>maybeSend(true,false),150));
document.addEventListener('love:vote',event=>{
  const vote=event.detail?.vote;
  if(vote!=='yes'&&vote!=='no') return;
  post('/vote',{visitId,recipient,vote})
    .then(()=>document.dispatchEvent(new CustomEvent('love:vote-saved',{detail:{vote}})))
    .catch(()=>document.dispatchEvent(new CustomEvent('love:vote-error',{detail:{vote}})));
});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden') maybeSend(true,true);
});
window.addEventListener('pagehide',()=>maybeSend(true,true));
setTimeout(()=>maybeSend(true,false),900);

export { visitId, recipient };
