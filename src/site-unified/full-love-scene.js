import { initLoveTrioScene } from './combined-scene.js';
import { initVivenciasScene } from './vivencias-scene.js';
import { createScrollFrameDriver } from './performance-runtime.js';

const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const ease=(t)=>{t=clamp(t);return t*t*(3-2*t);};

function forceGymFinalFrame(clone){
  clone.querySelectorAll('img[data-src]').forEach((img)=>{
    img.src=img.dataset.src;
    img.removeAttribute('data-src');
  });

  clone.querySelectorAll('.gym-v1__item').forEach((item)=>{
    const rot=Number.parseFloat(item.dataset.rot||'0')||0;
    item.style.opacity='0';
    item.style.transform=`translate(0vw,0vh) rotate(${rot}deg)`;
  });

  clone.querySelectorAll('.gym-v1__spread--a03 .gym-v1__item').forEach((item)=>{
    const rot=Number.parseFloat(item.dataset.rot||'0')||0;
    item.style.opacity='1';
    item.style.transform=`translate(0vw,0vh) rotate(${rot}deg)`;
    if(item.classList.contains('is-photo')) item.classList.add('is-loaded');
  });
}

function prepareVivenciasBackdrop(layer){
  if(!layer) return;
  // Remove a prévia estática da Vivências. Durante a emenda mostramos apenas
  // um backdrop coerente com a paleta da cena seguinte; a Vivências REAL
  // assume logo em seguida. Isso evita a "tela vazia" com placeholders.
  layer.replaceChildren();
  layer.classList.add('full-love__chapter-link-next--backdrop');
}

/**
 * História completa: Sorriso -> Estilo -> Academia -> Vivências.
 *
 * V2 da emenda Academia/Vivências:
 * - não fixa mais a Vivências REAL durante a transição;
 * - usa dois frames estáticos dentro de uma única sticky;
 * - a transição é uma função pura do scroll, portanto é 100% reversível;
 * - no fim, o frame estático e a Vivências real ficam no mesmo frame 0.
 */
export function initFullLoveScene(root, options={}){
  if(!root) throw new Error('initFullLoveScene(root): root é obrigatório.');

  const assetBase=(options.assetBase||'/assets').replace(/\/$/,'');

  const host=document.createElement('section');
  host.className='full-love';
  host.innerHTML=`
    <div class="full-love__trio" data-full-love-trio></div>

    <section class="full-love__chapter-link" data-full-love-link aria-hidden="true">
      <div class="full-love__chapter-link-sticky">
        <div class="full-love__chapter-link-next" data-full-love-next></div>
        <div class="full-love__chapter-link-current love-trio" data-full-love-current></div>
      </div>
    </section>

    <div class="full-love__vivencias" data-full-love-vivencias></div>
  `;
  root.appendChild(host);

  const trioMount=host.querySelector('[data-full-love-trio]');
  const link=host.querySelector('[data-full-love-link]');
  const currentLayer=host.querySelector('[data-full-love-current]');
  const nextLayer=host.querySelector('[data-full-love-next]');
  const vivMount=host.querySelector('[data-full-love-vivencias]');

  const trioScene=initLoveTrioScene(trioMount,{assetBase});
  const vivenciasScene=initVivenciasScene(vivMount,{assetBase:`${assetBase}/vivencias`});

  // Enquanto a ponte está na tela, a cena real fica exatamente no frame 0.
  vivenciasScene.setProgress?.(0);

  let previewRaf=0;
  let resizeRaf=0;
  let destroyed=false;
  let previewsReady=false;
  let mobileBaseH=0;
  let mobileBaseW=window.innerWidth;
  let wasMobile=window.innerWidth<=860;
  let vivenciasReleased=false;

  function linkNearViewport(){
    const rect=link.getBoundingClientRect();
    const vh=window.innerWidth<=860&&mobileBaseH?mobileBaseH:Math.max(1,window.innerHeight);
    return rect.top<vh*2.6&&rect.bottom>-vh*1.4;
  }

  function buildPreviews(){
    if(destroyed||previewsReady) return;

    const gymRoot=trioScene.gymScene?.root;
    const vivRoot=vivenciasScene.root;
    if(!gymRoot||!vivRoot) return;

    const gymClone=gymRoot.cloneNode(true);
    gymClone.classList.add('full-love__gym-preview');
    forceGymFinalFrame(gymClone);

    currentLayer.replaceChildren(gymClone);
    prepareVivenciasBackdrop(nextLayer);
    previewsReady=true;
  }

  function queuePreviews(){
    cancelAnimationFrame(previewRaf);
    previewRaf=requestAnimationFrame(()=>{
      previewRaf=requestAnimationFrame(buildPreviews);
    });
  }

  function syncMobileLink(force=false){
    const mobile=window.innerWidth<=860;
    const modeChanged=mobile!==wasMobile;
    wasMobile=mobile;

    if(!mobile){
      mobileBaseH=0;
      mobileBaseW=window.innerWidth;
      link.style.removeProperty('--full-love-link-h');
      link.style.removeProperty('--full-love-link-mt');
      link.style.removeProperty('--full-love-link-mb');
      link.style.removeProperty('--full-love-mobile-vh');
      return modeChanged;
    }

    const width=Math.round(window.innerWidth);
    const widthChanged=Math.abs(width-mobileBaseW)>24;
    if(!force&&mobileBaseH&&!widthChanged&&!modeChanged) return false;

    // Congela o comprimento da ponte. A abertura/fechamento da barra do
    // navegador Android não pode recalcular a emenda no meio do gesto.
    mobileBaseH=Math.max(480,Math.round(window.innerHeight||0));
    mobileBaseW=width;
    link.style.setProperty('--full-love-link-h',`${mobileBaseH*2.4}px`);
    link.style.setProperty('--full-love-link-mt',`${-mobileBaseH}px`);
    link.style.setProperty('--full-love-link-mb',`${-mobileBaseH}px`);
    link.style.setProperty('--full-love-mobile-vh',`${mobileBaseH}px`);
    return true;
  }

  function linkProgress(){
    const rect=link.getBoundingClientRect();
    const viewportH=window.innerWidth<=860 && mobileBaseH ? mobileBaseH : window.innerHeight;
    const max=Math.max(1,link.offsetHeight-viewportH);
    return clamp(-rect.top/max,0,1);
  }

  function setVivenciasReleased(released){
    if(released===vivenciasReleased) return;
    vivenciasReleased=released;
    if(released){
      vivenciasScene.clearProgress?.();
    }else{
      vivenciasScene.setProgress?.(0);
    }
  }

  function update(){
    if(destroyed) return;

    const vivTop=vivMount.getBoundingClientRect().top;
    const nearLink=linkNearViewport();

    // Saltos rápidos de scroll (trackpad/scrollbar) podem atravessar a ponte em
    // um único frame. Mesmo longe do link, sincronizamos o estado da Vivências
    // para nunca deixá-la presa no frame 0. O clone visual só é criado perto.
    if(!nearLink){
      setVivenciasReleased(vivTop<=1);
      return;
    }

    buildPreviews();
    const p=linkProgress();

    // Pequena retenção do frame final da Academia e saída limpa para a esquerda.
    const slide=ease(clamp((p-.16)/.58));
    currentLayer.style.transform=`translate3d(${-108*slide}%,0,0)`;

    // A Vivências já existe inteira por baixo. Um parallax mínimo tira a
    // sensação de "troca de página" sem usar transparência/crossfade.
    const nextX=2.5*(1-slide);
    const nextScale=1.01-(.01*slide);
    nextLayer.style.transform=`translate3d(${nextX}%,0,0) scale(${nextScale})`;

    // Libera a Vivências real um pouco antes do fim da sticky para que a
    // transição emende direto com a cena seguinte, sem um quadro intermediário.
    setVivenciasReleased(vivTop<=1 && p>=.90);

  }

  function onResize(){
    cancelAnimationFrame(resizeRaf);
    resizeRaf=requestAnimationFrame(()=>{
      const geometryChanged=syncMobileLink(false);
      // No Android a barra do navegador dispara resize só de altura. Não
      // reconstruímos a ponte nesse caso, pois isso era uma fonte de flicker.
      if(window.innerWidth<=860&&!geometryChanged) return;
      trioScene.refresh?.();
      vivenciasScene.refresh?.();

      previewsReady=false;
      currentLayer.replaceChildren();
      nextLayer.classList.remove('full-love__chapter-link-next--backdrop');
      nextLayer.replaceChildren();
      setVivenciasReleased(false);
      if(linkNearViewport()) queuePreviews();
      frameDriver?.schedule?.();
    });
  }

  syncMobileLink(true);
  const frameDriver=createScrollFrameDriver(update,{root:host,rootMargin:'1000px 0px'});
  window.addEventListener('resize',onResize,{passive:true});
  window.addEventListener('orientationchange',onResize,{passive:true});

  return{
    root:host,
    trioScene,
    vivenciasScene,
    refresh(){
      syncMobileLink(true);
      trioScene.refresh?.();
      vivenciasScene.refresh?.();
      previewsReady=false;
      currentLayer.replaceChildren();
      nextLayer.classList.remove('full-love__chapter-link-next--backdrop');
      nextLayer.replaceChildren();
      setVivenciasReleased(false);
      if(linkNearViewport()) queuePreviews();
      frameDriver.schedule();
    },
    destroy(){
      destroyed=true;
      frameDriver.destroy();
      cancelAnimationFrame(previewRaf);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener('resize',onResize);
      window.removeEventListener('orientationchange',onResize);
      trioScene.destroy?.();
      vivenciasScene.destroy?.();
      host.remove();
    }
  };
}
