import { createScrollFrameDriver, createViewportFrameDriver } from './performance-runtime.js';


const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const mix=(a,b,t)=>a+(b-a)*t;
const ease=(t)=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};

const TOP=[1,2,5,6,9,10,13];
const BOTTOM=[12,11,8,7,4,3];

const FIRST_VIDEO_FILE='vivencias-final.mp4';
const SECOND_VIDEO_FILE='videofinal.mp4';

const BG_COLORS=[
  [152,114,146],
  [171,134,168],
  [159,132,180],
  [189,155,176],
];

const END_COLORS=[
  [199,165,205],
  [224,180,186],
  [226,195,169],
  [178,152,210],
  [156,195,214],
];

function rgbBetween(colors,t){
  const x=clamp(t)*(colors.length-1);
  const i=Math.min(colors.length-2,Math.floor(x));
  const lt=x-i;
  return colors[i].map((v,j)=>Math.round(mix(v,colors[i+1][j],lt))).join(' ');
}

function makeCard(n,assetBase,index,lane){
  const fig=document.createElement('figure');
  fig.className='viv4__card';
  fig.dataset.photo=String(n);

  const rotations=lane==='top'?[-3,2,-1,3,-2,2,-1]:[2,-2,3,-1,2,-3];
  const yOffsets=lane==='top'?[-8,12,-2,10,-6,14,0]:[10,-7,13,-2,8,-11];

  fig.style.setProperty('--viv4-rot',`${rotations[index%rotations.length]}deg`);
  fig.style.setProperty('--viv4-y',`${yOffsets[index%yOffsets.length]}px`);
  fig.style.setProperty('--viv4-gloss-duration',`${8.2+(n%5)*.56}s`);
  fig.style.setProperty('--viv4-gloss-delay',`${.7+(n%7)*.63}s`);

  const media=document.createElement('div');
  media.className='viv4__media';

  const img=document.createElement('img');
  img.className='viv4__photo';
  img.alt='';
  img.decoding='async';
  img.loading='eager';
  img.dataset.src=`${assetBase}/vivencias-${String(n).padStart(2,'0')}.webp`;

  img.addEventListener('load',()=>{
    fig.classList.add('is-loaded');
    if(img.naturalWidth>img.naturalHeight*1.18)fig.classList.add('is-landscape');
  },{once:true});

  img.addEventListener('error',()=>{
    fig.classList.remove('is-loaded');
    img.removeAttribute('src');
  });

  const gloss=document.createElement('span');
  gloss.className='viv4__gloss';

  media.append(img,gloss);
  fig.append(media);
  return fig;
}

function loadRail(rail){
  rail.querySelectorAll('img[data-src]').forEach(img=>{
    if(!img.getAttribute('src'))img.src=img.dataset.src;
  });
}

function headlineY(el,y){
  if(!el)return;
  el.style.transform=`translate3d(0,${y}px,0)`;
}


function initViv4Bridge(root, assetBase, options={}){
  const bridge=document.createElement('section');
  bridge.className='viv4-bridge is-locked';

  // O segundo vídeo só existe enquanto a ponte está realmente ativa. Isso é
  // importante no iOS/Android: uma camada <video> fora de tela pode continuar
  // sendo composta pelo navegador sobre o primeiro vídeo.
  bridge.innerHTML=`
    <div class="viv4-bridge__sticky">
      <div class="viv4-bridge__final-screen">
        <div class="viv4-bridge__video-host"></div>
        <img
          class="viv4-bridge__balloon"
          src="${assetBase}/balaofala.png"
          alt=""
          draggable="false"
        />
      </div>
    </div>
  `;

  root.appendChild(bridge);

  const finalScreen=bridge.querySelector('.viv4-bridge__final-screen');
  const balloon=bridge.querySelector('.viv4-bridge__balloon');
  const videoHost=bridge.querySelector('.viv4-bridge__video-host');

  let secondVideo=null;
  let frameDriver=null;
  let destroyed=false;
  let last=-1;
  let lastP=0;
  let playAttempted=false;
  let unlocked=false;
  let hasAdvanced=false;
  let completed=false;
  let balloonFlashed=false;
  let balloonFlashTimer=0;

  function onSecondVideoEnded(){
    if(destroyed||completed)return;
    completed=true;
    playAttempted=false;
    bridge.classList.add('is-complete');
    options.onComplete?.();
  }

  function destroySecondVideo(){
    if(!secondVideo)return;
    secondVideo.removeEventListener('ended',onSecondVideoEnded);
    secondVideo.pause();
    secondVideo.removeAttribute('src');
    secondVideo.load();
    secondVideo.remove();
    secondVideo=null;
  }

  function createSecondVideo(){
    if(secondVideo)return secondVideo;

    secondVideo=document.createElement('video');
    secondVideo.className='viv4-bridge__video';
    secondVideo.controls=true;
    secondVideo.playsInline=true;
    secondVideo.preload='metadata';
    secondVideo.defaultMuted=false;
    secondVideo.muted=false;
    secondVideo.volume=1;
    secondVideo.loop=false;
    secondVideo.removeAttribute('loop');
    secondVideo.dataset.videoRole='segundo-video-final';
    secondVideo.src=`${assetBase}/${SECOND_VIDEO_FILE}`;
    secondVideo.addEventListener('ended',onSecondVideoEnded);
    videoHost.appendChild(secondVideo);
    return secondVideo;
  }

  function bridgeProgress(){
    const viewportH=Number.parseFloat(bridge.style.getPropertyValue('--viv4-bridge-vh'))||window.innerHeight;
    const scrollable=Math.max(1,bridge.offsetHeight-viewportH);
    return clamp(-bridge.getBoundingClientRect().top/scrollable);
  }

  function lock(){
    if(destroyed)return;
    unlocked=false;
    hasAdvanced=false;
    playAttempted=false;
    completed=false;
    balloonFlashed=false;
    if(balloonFlashTimer){
      clearTimeout(balloonFlashTimer);
      balloonFlashTimer=0;
    }
    last=-1;
    lastP=0;
    bridge.classList.add('is-locked');
    bridge.classList.remove('is-unlocked','is-complete');
    finalScreen.classList.remove('is-video-only','is-balloon-flash');
    finalScreen.style.transform='translate3d(0,100%,0)';
    destroySecondVideo();
    frameDriver?.schedule();
  }

  function unlock(){
    if(unlocked||destroyed)return;
    createSecondVideo();
    unlocked=true;
    hasAdvanced=false;
    playAttempted=false;
    balloonFlashed=false;
    if(balloonFlashTimer){
      clearTimeout(balloonFlashTimer);
      balloonFlashTimer=0;
    }
    finalScreen.classList.remove('is-balloon-flash');
    last=-1;
    lastP=0;
    bridge.classList.remove('is-locked');
    bridge.classList.add('is-unlocked');
    frameDriver?.schedule();
  }

  function setMobileViewportHeight(height){
    if(!Number.isFinite(height)||height<=0){
      bridge.style.removeProperty('--viv4-bridge-vh');
      bridge.style.removeProperty('--viv4-bridge-h');
      bridge.style.removeProperty('--viv4-bridge-mt');
      return;
    }
    bridge.style.setProperty('--viv4-bridge-vh',`${height}px`);
    bridge.style.setProperty('--viv4-bridge-h',`${Math.round(height*3.3)}px`);
    bridge.style.setProperty('--viv4-bridge-mt',`${Math.round(-height*1.3)}px`);
  }

  function update(){
    if(destroyed)return;

    if(!unlocked)return;

    const p=bridgeProgress();
    const direction=p-lastP;
    if(p>.08)hasAdvanced=true;

    // Voltou para o começo da ponte: devolve completamente o controle ao
    // primeiro vídeo e remove o segundo <video> do DOM. Reentrar funciona
    // como na primeira vez, sem camada fantasma no mobile.
    if(hasAdvanced&&direction<-.0001&&p<=.018){
      options.onReturn?.();
      lock();
      return;
    }

    if(Math.abs(p-last)>.0001){
      last=p;

      const enterSpan=window.innerWidth<=860?.50:.58;
      const enterT=ease(clamp(p/enterSpan));
      finalScreen.style.transform=`translate3d(0,${mix(100,0,enterT)}%,0)`;

      // O balão agora é só um lampejo de transição entre as duas telas.
      // Ele aparece por frações de segundo assim que a tela final começa a
      // entrar, sem ficar preso ao progresso do scroll.
      if(p>.08&&!balloonFlashed){
        balloonFlashed=true;
        finalScreen.classList.remove('is-balloon-flash');
        void finalScreen.offsetWidth;
        finalScreen.classList.add('is-balloon-flash');
        balloonFlashTimer=window.setTimeout(()=>{
          balloonFlashTimer=0;
          finalScreen.classList.remove('is-balloon-flash');
        },420);
      }

      if(p>.52&&!playAttempted&&secondVideo){
        playAttempted=true;
        secondVideo.muted=false;
        const play=secondVideo.play();
        if(play&&typeof play.catch==='function'){
          play.catch(()=>{
            // Não degradamos silenciosamente para vídeo mudo. Se o navegador
            // bloquear autoplay com som, os controles ficam disponíveis para
            // um toque/clique do usuário.
            if(!secondVideo)return;
            secondVideo.muted=false;
            secondVideo.volume=1;
            secondVideo.controls=true;
            secondVideo.dataset.audioBlocked='true';
          });
        }
      }

      // A ponte também é reversível internamente.
      if(p<.46&&playAttempted){
        playAttempted=false;
        if(secondVideo){
          secondVideo.pause();
          try{secondVideo.currentTime=0;}catch(_){}
        }
      }

      finalScreen.classList.toggle('is-video-only',p>.88);
    }

    lastP=p;
  }

  frameDriver=createScrollFrameDriver(update,{root:bridge,rootMargin:'110% 0px'});

  return{
    root:bridge,
    unlock,
    lock,
    setMobileViewportHeight,
    refresh(){last=-1;frameDriver?.flush();},
    destroy(){
      destroyed=true;
      frameDriver?.destroy();
      if(balloonFlashTimer) clearTimeout(balloonFlashTimer);
      destroySecondVideo();
      bridge.remove();
    }
  };
}

export function initVivenciasScene(root,options={}){
  if(!root)throw new Error('initVivenciasScene(root): root é obrigatório.');

  const assetBase=(options.assetBase||'/assets/vivencias').replace(/\/$/,'');

  const host=document.createElement('section');
  host.className='viv4';
  host.innerHTML=`
    <div class="viv4__sticky">
      <div class="viv4__stage">
        <div class="viv4__grain"></div>

        <div class="viv4__headline-viewport">
          <h2 class="viv4__headline viv4__headline--1">Me diverti muito</h2>
          <h2 class="viv4__headline viv4__headline--2">Vc é minha melhor companhia</h2>
        </div>

        <div class="viv4__rail-window viv4__rail-window--top">
          <div class="viv4__rail viv4__rail--top"></div>
        </div>

        <div class="viv4__rail-window viv4__rail-window--bottom">
          <div class="viv4__rail viv4__rail--bottom"></div>
        </div>

        <div class="viv4__ending" aria-hidden="true">
          <h2 class="viv4__ending-copy">e é só o começo da nossa história</h2>
          <div class="viv4__bubble">
            <div class="viv4__video-wrap">
              <video class="viv4__video" controls playsinline preload="none" data-video-role="primeiro-video-vivencias"></video>
              <div class="viv4__video-msg">
                <span>Coloque o vídeo em<br><strong>public/assets/vivencias/vivencias-final.mp4</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div class="viv4__progress"><span></span></div>
      </div>
    </div>
  `;

  const topRail=host.querySelector('.viv4__rail--top');
  const bottomRail=host.querySelector('.viv4__rail--bottom');
  const headlineViewport=host.querySelector('.viv4__headline-viewport');
  const headline1=host.querySelector('.viv4__headline--1');
  const headline2=host.querySelector('.viv4__headline--2');
  const ending=host.querySelector('.viv4__ending');
  const endingCopy=host.querySelector('.viv4__ending-copy');
  const bubble=host.querySelector('.viv4__bubble');
  const video=host.querySelector('.viv4__video');

  TOP.forEach((n,i)=>topRail.appendChild(makeCard(n,assetBase,i,'top')));
  BOTTOM.forEach((n,i)=>bottomRail.appendChild(makeCard(n,assetBase,i,'bottom')));

  root.appendChild(host);

  // Continuação nova: a tela atual permanece intacta; a ponte começa depois.
  const finalBridge=initViv4Bridge(root, assetBase,{
    onReturn:()=>resetFirstVideoCycle('bridge'),
    onComplete:()=>unlockOutro()
  });

  // Epílogo final do site. É uma seção real no fluxo, depois do último vídeo,
  // para continuar funcionando com scroll normal no desktop e no mobile.
  const outro=document.createElement('section');
  outro.className='love-outro is-locked';
  outro.setAttribute('aria-label','Continua');
  outro.setAttribute('aria-hidden','true');
  outro.innerHTML=`
    <div class="love-outro__inner">
      <h2 class="love-outro__title">Continua...</h2>
      <div class="love-outro__line" aria-hidden="true"></div>
      <p class="love-outro__question">Gostou??</p>
      <div class="love-outro__choices" role="group" aria-label="Gostou?">
        <button class="love-outro__vote" type="button" data-vote="yes">Sim</button>
        <button class="love-outro__vote" type="button" data-vote="no">Não</button>
      </div>
      <p class="love-outro__status" aria-live="polite"></p>
      <button class="love-outro__replay" type="button" data-replay>↻ Ver de novo</button>
      <p class="love-outro__heart" aria-hidden="true">♡</p>
    </div>
  `;
  root.appendChild(outro);

  const voteButtons=[...outro.querySelectorAll('[data-vote]')];
  const voteStatus=outro.querySelector('.love-outro__status');
  const replayButton=outro.querySelector('[data-replay]');
  let votePending=false;
  let outroRevealTimer=0;

  function lockOutro(){
    clearTimeout(outroRevealTimer);
    outro.classList.add('is-locked');
    outro.classList.remove('is-ready');
    outro.setAttribute('aria-hidden','true');
  }

  function unlockOutro(){
    if(destroyed||outro.classList.contains('is-ready'))return;

    outro.classList.remove('is-locked');
    outro.setAttribute('aria-hidden','false');
    requestAnimationFrame(()=>outro.classList.add('is-ready'));

    // O epílogo só entra depois do evento `ended` de videofinal.mp4.
    // Em vez de depender de mais scroll, levamos a tela preta ao viewport.
    outroRevealTimer=window.setTimeout(()=>{
      if(destroyed||!outro.classList.contains('is-ready'))return;
      const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      outro.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    },120);
  }

  function replayFromStart(){
    try{sessionStorage.setItem('love-story-replay-v1','1')}catch(_){}
    try{history.scrollRestoration='manual'}catch(_){}
    document.documentElement.style.scrollBehavior='auto';
    window.scrollTo(0,0);
    window.location.reload();
  }

  replayButton?.addEventListener('click',replayFromStart);

  function setVoteUi(vote,state='saved'){
    voteButtons.forEach((button)=>{
      button.classList.toggle('is-selected',button.dataset.vote===vote);
      button.disabled=state==='pending';
    });
    if(!voteStatus)return;
    if(state==='pending') voteStatus.textContent='Enviando...';
    else if(state==='saved') voteStatus.textContent='Voto enviado ♡';
    else if(state==='error') voteStatus.textContent='Não consegui enviar. Tenta de novo.';
  }

  voteButtons.forEach((button)=>button.addEventListener('click',()=>{
    if(votePending)return;
    const vote=button.dataset.vote;
    votePending=true;
    setVoteUi(vote,'pending');
    document.dispatchEvent(new CustomEvent('love:vote',{detail:{vote}}));
  }));

  const onVoteSaved=(event)=>{
    votePending=false;
    setVoteUi(event.detail?.vote,'saved');
  };
  const onVoteError=(event)=>{
    votePending=false;
    setVoteUi(event.detail?.vote,'error');
  };
  document.addEventListener('love:vote-saved',onVoteSaved);
  document.addEventListener('love:vote-error',onVoteError);

  let frameDriver=null;
  let destroyed=false;
  let videoAttached=false;
  let playStarted=false;
  let firstVideoFinished=false;
  let firstVideoGateActive=false;
  let gateScrollY=0;
  let restoringScroll=false;
  let autoStartAllowed=true;
  let replayAnchorScrollY=null;
  let mobileBaseH=0;
  let mobileBaseW=window.innerWidth;
  let last=-1;

  function preventGateInput(event){
    if(!firstVideoGateActive)return;

    if(event.type==='keydown'){
      const blocked=[
        'ArrowUp','ArrowDown','PageUp','PageDown',
        'Home','End',' ','Spacebar'
      ];
      if(!blocked.includes(event.key))return;
    }

    event.preventDefault();
  }

  function keepGateScroll(){
    if(!firstVideoGateActive || restoringScroll)return;

    if(Math.abs(window.scrollY-gateScrollY)>1){
      restoringScroll=true;
      window.scrollTo(0,gateScrollY);

      requestAnimationFrame(()=>{
        restoringScroll=false;
      });
    }
  }

  function lockForFirstVideo(){
    if(firstVideoGateActive || firstVideoFinished)return;

    firstVideoGateActive=true;
    gateScrollY=window.scrollY;

    window.addEventListener('wheel',preventGateInput,{passive:false});
    window.addEventListener('touchmove',preventGateInput,{passive:false});
    window.addEventListener('keydown',preventGateInput,{passive:false});
    window.addEventListener('scroll',keepGateScroll,{passive:true});
  }

  function releaseFirstVideoGate(){
    if(!firstVideoGateActive)return;

    firstVideoGateActive=false;

    window.removeEventListener('wheel',preventGateInput);
    window.removeEventListener('touchmove',preventGateInput);
    window.removeEventListener('keydown',preventGateInput);
    window.removeEventListener('scroll',keepGateScroll);
  }

  function showFirstVideoFrame(){
    if(!videoAttached)return;
    video.pause();

    const seek=()=>{
      try{
        // 0.01 força WebKit a compor o primeiro frame sem avançar visualmente.
        video.currentTime=Math.min(.01,Number.isFinite(video.duration)?Math.max(0,video.duration-.01):.01);
      }catch(_){}
    };

    if(video.readyState>=2)seek();
    else video.addEventListener('loadeddata',seek,{once:true});
  }

  function resetFirstVideoCycle(reason='scene'){
    if(destroyed)return;

    releaseFirstVideoGate();
    lockOutro();
    firstVideoFinished=false;
    playStarted=false;
    autoStartAllowed=reason!=='bridge';
    replayAnchorScrollY=reason==='bridge'?window.scrollY:null;
    finalBridge.lock();
    showFirstVideoFrame();
    last=-1;
    frameDriver?.schedule();
  }

  function finishFirstVideo(){
    if(firstVideoFinished)return;

    firstVideoFinished=true;
    playStarted=false;
    releaseFirstVideoGate();

    // Só depois do ended a próxima ponte passa a existir.
    finalBridge.unlock();
  }

  function startFirstVideo(){
    if(playStarted||firstVideoFinished||!autoStartAllowed)return;

    ensureVideoSource();
    playStarted=true;
    video.muted=false;
    video.volume=1;
    video.loop=false;

    try{video.currentTime=0;}catch(_){}
    lockForFirstVideo();

    const play=video.play();
    if(play&&typeof play.catch==='function'){
      play.catch(()=>{
        // Se autoplay for recusado, mantém o player visível e navegável.
        playStarted=false;
        releaseFirstVideoGate();
      });
    }
  }

  video.addEventListener('ended',finishFirstVideo);
  video.addEventListener('error',()=>{
    playStarted=false;
    releaseFirstVideoGate();
  });

  function externalProgress(){
    const raw=host.dataset.vivenciasProgress;
    if(raw!=null&&raw!==''){
      const n=Number(raw);
      if(Number.isFinite(n))return clamp(n);
    }
    return null;
  }

  function viewportHeight(){
    return window.innerWidth<=860&&mobileBaseH?mobileBaseH:window.innerHeight;
  }

  function syncMobileGeometry(force=false){
    const mobile=window.innerWidth<=860;
    if(!mobile){
      mobileBaseH=0;
      mobileBaseW=window.innerWidth;
      host.style.removeProperty('height');
      host.style.removeProperty('min-height');
      host.style.removeProperty('--viv4-mobile-vh');
      finalBridge.setMobileViewportHeight(null);
      return true;
    }

    const width=Math.round(window.innerWidth);
    const widthChanged=Math.abs(width-mobileBaseW)>24;
    if(!force&&mobileBaseH&&!widthChanged)return false;

    mobileBaseH=Math.max(480,Math.round(window.innerHeight||0));
    mobileBaseW=width;
    host.style.height=`${Math.round(mobileBaseH*9.3)}px`;
    host.style.minHeight=`${Math.round(mobileBaseH*9.3)}px`;
    host.style.setProperty('--viv4-mobile-vh',`${mobileBaseH}px`);
    finalBridge.setMobileViewportHeight(mobileBaseH);
    return true;
  }

  function progress(){
    const ext=externalProgress();
    if(ext!=null)return ext;
    const scrollable=Math.max(1,host.offsetHeight-viewportHeight());
    return clamp(-host.getBoundingClientRect().top/scrollable);
  }

  function setHeadlineState(p){
    const viewportH=(headlineViewport?.offsetHeight||360);
    const travel=viewportH + Math.max(80, viewportHeight() * .08);

    if(p<.22){
      headlineY(headline1,0);
    }else if(p<.295){
      const t=ease((p-.22)/.075);
      headlineY(headline1,-travel*t);
    }else{
      headlineY(headline1,-travel);
    }

    if(p<.335){
      headlineY(headline2,travel);
    }else if(p<.42){
      const t=ease((p-.335)/.085);
      headlineY(headline2,travel*(1-t));
    }else if(p<.57){
      headlineY(headline2,0);
    }else if(p<.655){
      const t=ease((p-.57)/.085);
      headlineY(headline2,-travel*t);
    }else{
      headlineY(headline2,-travel);
    }
  }

  function setRails(p){
    const vw=window.innerWidth;
    const railP=clamp(p/.735);
    const t=ease(railP);

    const topW=topRail.scrollWidth;
    const bottomW=bottomRail.scrollWidth;
    const edge=Math.max(20,vw*.055);

    const topStart=edge;
    const topEnd=vw-topW-edge;

    const bottomStart=vw-bottomW-edge;
    const bottomEnd=edge;

    let topX=mix(topStart,topEnd,t);
    let bottomX=mix(bottomStart,bottomEnd,t);

    if(p>.735){
      const out=ease((p-.735)/.075);
      topX-=vw*1.12*out;
      bottomX+=vw*1.12*out;
    }

    topRail.style.transform=`translate3d(${topX}px,-50%,0)`;
    bottomRail.style.transform=`translate3d(${bottomX}px,-50%,0)`;
  }

  function ensureVideoSource(){
    if(!videoAttached){
      // VÍDEO 1 — pertence à cena "e é só o começo da nossa história".
      video.src=`${assetBase}/${FIRST_VIDEO_FILE}`;
      video.playsInline=true;
      video.muted=false;
      video.volume=1;
      video.loop=false;
      video.preload='auto';
      video.classList.add('has-source');
      videoAttached=true;
    }
  }

  function setEndingCopyTransform(y = 0, scale = 1){
    if(window.innerWidth <= 860){
      endingCopy.style.transform=`translateX(-50%) translateY(calc(-50% + ${y}px)) scale(${scale})`;
    }else{
      endingCopy.style.transform=`translateX(-50%) translateY(${y}px) scale(${scale})`;
    }
  }

  function setFinalVideoTransform(t){
    const k=clamp(t);
    const travel=viewportHeight()*1.08;
    bubble.style.transform=`translate(-50%, calc(-50% + ${(1-k)*travel}px))`;
  }

  function update(){
    if(destroyed)return;

    const p=progress();

    // Se o usuário voltou da ponte seguinte, não dispara o vídeo de novo no
    // mesmo frame. Um gesto para baixo (ou voltar um pouco mais) rearma o ciclo.
    if(!autoStartAllowed&&!firstVideoFinished){
      if(p<.945){
        autoStartAllowed=true;
        replayAnchorScrollY=null;
      }else if(replayAnchorScrollY!=null&&window.scrollY>replayAnchorScrollY+3){
        autoStartAllowed=true;
        replayAnchorScrollY=null;
      }
    }

    // Terminou o vídeo e voltou dentro da própria Vivências sem ter avançado
    // na ponte final: restaura o ciclo e mostra novamente o primeiro frame.
    if(firstVideoFinished&&p<.945){
      resetFirstVideoCycle('scene');
    }

    if(Math.abs(p-last)>.0001){
      last=p;

      host.style.setProperty('--viv4-progress',String(Math.max(.01,p)));
      host.style.setProperty('--viv4-bg-rgb',rgbBetween(BG_COLORS,clamp(p/.74)));

      loadRail(topRail);
      loadRail(bottomRail);
      setHeadlineState(p);
      setRails(p);

      ending.style.transform='translateY(105%)';
      setEndingCopyTransform(0,1);
      setFinalVideoTransform(0);

      if(p>=.75&&p<.835){
        const t=ease((p-.75)/.085);
        ending.style.transform=`translateY(${(1-t)*105}%)`;
      }else if(p>=.835){
        ending.style.transform='translateY(0)';
        ending.style.setProperty('--viv4-end-rgb',rgbBetween(END_COLORS,clamp((p-.835)/.105)));

        // O card e a frase fazem UMA única animação contínua. O play não muda
        // position/transform do texto, evitando o salto que acontecia no mobile.
        if(p>.875){
          const t=ease(clamp((p-.875)/.09));

          if(window.innerWidth<=860){
            setEndingCopyTransform(-t*viewportHeight()*.34,1-t*.14);
          }else{
            setEndingCopyTransform(0,1-t*.06);
          }

          setFinalVideoTransform(t);

          if(p>.90)ensureVideoSource();
          if(p>=.972&&!firstVideoFinished&&autoStartAllowed)startFirstVideo();
        }
      }
    }

  }

  const onResize=()=>{
    // Em mobile, resize só de altura (barra do navegador) não recalcula o trilho.
    syncMobileGeometry(false);
    last=-1;
    frameDriver?.schedule();
  };
  const viewportDriver=createViewportFrameDriver(onResize);

  syncMobileGeometry(true);
  frameDriver=createScrollFrameDriver(update,{root:host,rootMargin:'125% 0px'});

  return{
    root:host,
    refresh(){syncMobileGeometry(false);last=-1;finalBridge.refresh?.();frameDriver?.schedule();},
    setProgress(value){
      host.dataset.vivenciasProgress=String(clamp(value));
      last=-1;
      frameDriver?.schedule();
    },
    clearProgress(){
      delete host.dataset.vivenciasProgress;
      last=-1;
      frameDriver?.schedule();
    },
    destroy(){
      destroyed=true;
      frameDriver?.destroy();
      releaseFirstVideoGate();
      viewportDriver.destroy();
      video.removeEventListener('ended',finishFirstVideo);
      video.pause();
      video.removeAttribute('src');
      video.load();
      document.removeEventListener('love:vote-saved',onVoteSaved);
      document.removeEventListener('love:vote-error',onVoteError);
      replayButton?.removeEventListener('click',replayFromStart);
      clearTimeout(outroRevealTimer);
      outro.remove();
      finalBridge.destroy();
      host.remove();
    }
  };
}
