(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function i(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(a){if(a.ep)return;a.ep=!0;const s=i(a);fetch(a.href,s)}})();const Ce="modulepreload",Ye=function(e){return"/"+e},he={},se=function(t,i,r){let a=Promise.resolve();if(i&&i.length>0){let h=function(y){return Promise.all(y.map(u=>Promise.resolve(u).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};var c=h;document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),d=o?.nonce||o?.getAttribute("nonce");a=h(i.map(y=>{if(y=Ye(y),y in he)return;he[y]=!0;const u=y.endsWith(".css"),v=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${y}"]${v}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":Ce,u||(m.as="script"),m.crossOrigin="",m.href=y,d&&m.setAttribute("nonce",d),document.head.appendChild(m),u)return new Promise((g,l)=>{m.addEventListener("load",g),m.addEventListener("error",()=>l(new Error(`Unable to preload CSS for ${y}`)))})}))}function s(o){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=o,window.dispatchEvent(d),!d.defaultPrevented)throw o}return a.then(o=>{for(const d of o||[])d.status==="rejected"&&s(d.reason);return t().catch(s)})},ye="love-story-replay-v1";try{if(history&&"scrollRestoration"in history&&(history.scrollRestoration="manual"),sessionStorage.getItem(ye)==="1"){sessionStorage.removeItem(ye);const e=()=>window.scrollTo(0,0);e(),requestAnimationFrame(()=>requestAnimationFrame(e)),window.addEventListener("load",e,{once:!0})}}catch{}const I="M50 88 C42 80 7 58 7 31 C7 11 31 2 50 22 C69 2 93 11 93 31 C93 58 58 80 50 88 Z",Re=[{left:8,delay:-.5,duration:10.8,size:20,drift:2,opacity:.52,glyph:"♡"},{left:16,delay:-4.4,duration:13.2,size:14,drift:-3,opacity:.34,glyph:"♥"},{left:24,delay:-2.1,duration:11.7,size:16,drift:4,opacity:.42,glyph:"♡"},{left:34,delay:-6.2,duration:14.1,size:12,drift:-2,opacity:.28,glyph:"♥"},{left:43,delay:-1.6,duration:12.4,size:18,drift:3,opacity:.46,glyph:"♡"},{left:52,delay:-5,duration:15,size:13,drift:-4,opacity:.3,glyph:"♥"},{left:61,delay:-3,duration:10.9,size:17,drift:2,opacity:.4,glyph:"♡"},{left:69,delay:-7.4,duration:13.7,size:12,drift:-3,opacity:.26,glyph:"♥"},{left:77,delay:-2.7,duration:11.5,size:16,drift:4,opacity:.41,glyph:"♡"},{left:86,delay:-6.7,duration:12.8,size:14,drift:-2,opacity:.33,glyph:"♥"},{left:93,delay:-4,duration:10.6,size:18,drift:3,opacity:.48,glyph:"♡"}];function Be(){return Re.map((e,t)=>`
    <span
      class="hero-float-heart hero-float-heart--${t%3}"
      style="--left:${e.left}%; --delay:${e.delay}s; --dur:${e.duration}s; --size:${e.size}px; --drift:${e.drift}vw; --alpha:${e.opacity};"
    >${e.glyph}</span>
  `).join("")}const ze=[{id:"carnaval",src:"/assets/jujucarnaval02.jpeg",alt:"Arleu e Juliana no carnaval",label:"Dois Gostosos",side:"left",x:16,y:25,size:38,rotate:-5,depth:1.05},{id:"formatura",src:"/assets/jujuformatura.jpeg",alt:"Arleu e Juliana na formatura",label:"🥵🥵🥵",side:"right-top",x:82,y:20,size:28,rotate:6,depth:.9},{id:"casamento",src:"/assets/jujucasamento.jpg",alt:"Arleu e Juliana em uma celebração",label:"Juntos",side:"right-bottom",x:80,y:61,size:27,rotate:-4,depth:1}];function Je(e,t){return`
    <article
      class="memory-heart memory-heart--${e.side}"
      data-memory-heart
      data-id="${e.id}"
      data-x="${e.x}"
      data-y="${e.y}"
      data-rotate="${e.rotate}"
      data-depth="${e.depth}"
      style="--size:${e.size}vmin; --delay:${t*-1.7}s; --tilt:${e.rotate}deg"
      tabindex="0"
      aria-label="Memória: ${e.label}. Você pode arrastar este coração."
    >
      <div class="memory-heart__float">
        <div class="memory-heart__surface">
          <svg class="memory-heart__svg" viewBox="0 0 100 90" role="img" aria-label="${e.alt}">
            <defs>
              <clipPath id="clip-${e.id}">
                <path d="${I}" />
              </clipPath>
              <filter id="soft-${e.id}" x="-30%" y="-30%" width="160%" height="170%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".16" />
              </filter>
            </defs>
            <g filter="url(#soft-${e.id})">
              <g clip-path="url(#clip-${e.id})" class="memory-heart__photo-layer">
                <image class="memory-heart__photo-bg" href="${e.src}" x="-4" y="-4" width="108" height="98" preserveAspectRatio="xMidYMid slice" />
                <image class="memory-heart__photo" href="${e.src}" x="4" y="3" width="92" height="82" preserveAspectRatio="xMidYMid meet" />
              </g>
              <path class="memory-heart__wash" d="${I}" />
              <path class="memory-heart__outline memory-heart__outline--a" d="${I}" />
              <path class="memory-heart__outline memory-heart__outline--b" d="${I}" />
            </g>
          </svg>
          <span class="memory-heart__tag">${e.label}<i>♡</i></span>
        </div>
      </div>
    </article>
  `}const He=document.querySelector("#app");He.innerHTML=`
  <div class="prelove-flow" data-prelove-flow>
  <main class="site-shell">
    <section class="hero" id="inicio" aria-labelledby="hero-title">
      <div class="paper-noise" aria-hidden="true"></div>
      <canvas class="love-canvas" data-love-canvas aria-hidden="true"></canvas>
      <div class="cursor-aura" data-cursor-aura aria-hidden="true"><i></i></div>
      <div class="paper-seam paper-seam--one" aria-hidden="true"></div>
      <div class="paper-seam paper-seam--two" aria-hidden="true"></div>

      <header class="topbar topbar--minimal">
        <a class="tiny-mark" href="#inicio" aria-label="Arleu e Juliana, início">A <span>♡</span> J</a>
        <span class="topbar__heart" aria-hidden="true">♡</span>
      </header>

      <div class="decor-layer" aria-hidden="true">
        <span class="paint-heart paint-heart--1">♥</span>
        <span class="paint-heart paint-heart--2">♥</span>
        <span class="paint-heart paint-heart--3">♥</span>
        <span class="paint-heart paint-heart--4">♥</span>
        <span class="paint-heart paint-heart--5">♥</span>
        <span class="scribble scribble--1">♡</span>
        <span class="scribble scribble--2">♡</span>
        <span class="scribble scribble--3">♡</span>
        <span class="spark spark--1">✦</span>
        <span class="spark spark--2">✧</span>
      </div>

      <div class="hero-float-field" aria-hidden="true">
        ${Be()}
      </div>

      <div class="note note--left" data-parallax=".18">
        você faz tudo<br />mais leve <span>♡</span>
      </div>
      <div class="note note--bottom-left" data-parallax=".11">
        colecionando<br />momentos<br />com você <span>♡</span>
      </div>
      <div class="note note--right" data-parallax=".15">
        você é<br />o meu lugar <span>♡</span>
      </div>
      <div class="note note--bottom-right" data-parallax=".1">
        grandes planos<br />com você <span>♡</span>
      </div>

      <div class="memory-field" aria-label="Memórias flutuantes">
        ${ze.map(Je).join("")}
      </div>

      <div class="hero-copy" data-parallax=".06">
        <span class="hero-copy__doodle" aria-hidden="true">♡</span>
        <h1 id="hero-title">Arleu <em>&</em><br />Juliana</h1>
        <div class="hero-copy__underline" aria-hidden="true"></div>
        <p class="hero-copy__subtitle">Uma história de amor.</p>
        <button class="start-button" type="button" data-start>
          <span>Começar</span>
          <span class="start-button__heart" aria-hidden="true">♡</span>
        </button>
      </div>

      <div class="love-line" aria-hidden="true">
        <span></span><i>♡</i><span></span>
      </div>

      <p class="ordinary-note ordinary-note--heart-only" aria-hidden="true">♡</p>
      <div class="flower" aria-hidden="true">
        <i></i><i></i><i></i><i></i><b></b>
      </div>

      <div class="scroll-cue" data-scroll-start aria-hidden="true">
        <span>role para continuar</span>
        <i>↓</i>
      </div>

      <div class="heart-portal" data-heart-portal aria-hidden="true">
        <svg viewBox="0 0 100 90" focusable="false">
          <path d="${I}" />
        </svg>
        <div class="heart-portal__grain"></div>
      </div>
    </section>

    <section class="chapter-one" id="ato-1" aria-label="O começo da nossa história">
      <div class="encounter-stage" data-encounter-stage>
        <div class="party-photo-bg" aria-hidden="true"></div>
        <div class="party-photo-overlay" aria-hidden="true"></div>
        <div class="encounter-love-wash" aria-hidden="true"></div>
        <div class="encounter-sky" aria-hidden="true"></div>
        <div class="encounter-vignette" aria-hidden="true"></div>
        <div class="party-stage" aria-hidden="true">
          <span class="stage-rig"></span>
          <span class="stage-screen stage-screen--left"></span>
          <span class="stage-screen stage-screen--center"></span>
          <span class="stage-screen stage-screen--right"></span>
          <span class="stage-deck"></span>
          <span class="stage-fog"></span>
        </div>
        <div class="party-beams" aria-hidden="true">
          <i class="beam beam--1"></i>
          <i class="beam beam--2"></i>
          <i class="beam beam--3"></i>
          <i class="beam beam--4"></i>
          <i class="beam beam--5"></i>
          <i class="beam beam--6"></i>
        </div>
        <div class="party-bokeh" aria-hidden="true">
          <i class="bokeh bokeh--1"></i><i class="bokeh bokeh--2"></i><i class="bokeh bokeh--3"></i><i class="bokeh bokeh--4"></i>
          <i class="bokeh bokeh--5"></i><i class="bokeh bokeh--6"></i><i class="bokeh bokeh--7"></i><i class="bokeh bokeh--8"></i>
        </div>
        <div class="party-tents" aria-hidden="true">
          <span class="party-tent party-tent--left"></span>
          <span class="party-tent party-tent--center"></span>
          <span class="party-tent party-tent--right"></span>
        </div>
        <div class="party-lights" aria-hidden="true">
          <div class="light-wire light-wire--one">
            <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
          </div>
          <div class="light-wire light-wire--two">
            <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
          </div>
          <div class="light-wire light-wire--three">
            <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
          </div>
        </div>

        <div class="party-crowd" aria-hidden="true">
          <i class="crowd-person crowd-person--1"></i>
          <i class="crowd-person crowd-person--2"></i>
          <i class="crowd-person crowd-person--3"></i>
          <i class="crowd-person crowd-person--4"></i>
          <i class="crowd-person crowd-person--5"></i>
          <i class="crowd-person crowd-person--6"></i>
          <i class="crowd-person crowd-person--7"></i>
          <i class="crowd-person crowd-person--8"></i>
          <i class="crowd-person crowd-person--9"></i>
        </div>

        <div class="wet-floor" aria-hidden="true">
          <span class="puddle puddle--1"></span>
          <span class="puddle puddle--2"></span>
          <span class="puddle puddle--3"></span>
          <span class="puddle puddle--4"></span>
          <span class="puddle puddle--5"></span>
          <span class="floor-glow floor-glow--1"></span>
          <span class="floor-glow floor-glow--2"></span>
          <span class="floor-glow floor-glow--3"></span>
          <span class="floor-glow floor-glow--4"></span>
        </div>

        <canvas class="rain-canvas rain-canvas--back" data-rain-back aria-hidden="true"></canvas>

        <div class="encounter-date" data-scene-date>
          <strong><span class="editorial-heart editorial-heart--title">Nosso primeiro beijo</span></strong>
          <span class="encounter-date__written" data-scene-date-line>19 de outubro de 2024</span>
          <i>♡</i>
        </div>

        <div class="scene-copy-stack" aria-label="Texto da lembrança">
          <div class="scene-copy scene-copy--bad" data-scene-copy="bad">
            <span>Uma festa que tinha tudo para ser</span>
            <strong>estragada pela chuva.</strong>
          </div>

          <div class="scene-copy scene-copy--saved" data-scene-copy="saved">
            <span>Foi salva por ela e sua irmã,</span>
            <strong>com uma <span class="editorial-heart editorial-heart--inline">energia e uma alegria contagiantes.</span></strong>
          </div>

          <div class="scene-copy scene-copy--final" data-scene-copy="final">
            <span>E, mesmo depois de um dilúvio,</span>
            <strong>ela continuava sendo <em><span class="editorial-heart editorial-heart--final">a mais linda da festa!</span></em></strong>
            <i>♡</i>
          </div>
        </div>

        <div class="encounter-characters" aria-label="Nossa lembrança daquele primeiro encontro">
          <div class="love-aura" aria-hidden="true">
            <span class="love-blob love-blob--1"></span>
            <span class="love-blob love-blob--2"></span>
            <span class="love-blob love-blob--3"></span>
            <span class="love-heart-particle love-heart-particle--1">♥</span>
            <span class="love-heart-particle love-heart-particle--2">♥</span>
            <span class="love-heart-particle love-heart-particle--3">♥</span>
            <span class="love-heart-particle love-heart-particle--4">♥</span>
            <span class="love-ring"></span>
          </div>
          <figure class="encounter-pose encounter-pose--together" data-pose="together">
            <img src="/assets/encontro-01-juntos.png" alt="Arleu e Juliana juntos na festa" />
          </figure>
          <figure class="encounter-pose encounter-pose--question" data-pose="question">
            <img src="/assets/encontro-02-pergunta.png" alt="Arleu perguntando a Juliana: Juliana, me dá um beijo?" />
          </figure>
          <div class="kiss-heart-anchor" aria-hidden="true">
            <div class="kiss-heart"><span></span></div>
          </div>
          <figure class="encounter-pose encounter-pose--kiss" data-pose="kiss">
            <img src="/assets/encontro-03-beijo.png" alt="Arleu e Juliana se beijando" />
          </figure>
          <figure class="encounter-pose encounter-pose--cuddle" data-pose="cuddle">
            <img src="/assets/encontro-04-abraco.png" alt="Arleu e Juliana abraçadinhos depois do beijo" />
          </figure>
        </div>

        <div class="rain-splash-layer" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i><i></i>
        </div>
        <canvas class="rain-canvas rain-canvas--front" data-rain-front aria-hidden="true"></canvas>

        <div class="encounter-scroll-hint" aria-hidden="true">
          <span>continue rolando</span>
          <i>↓</i>
        </div>
      </div>
    </section>


    <section class="chapter-tear" id="transicao-ato-2" aria-label="Transição para o próximo capítulo">
      <div class="tear-stage" data-tear-stage>
        <div class="tear-next-page" data-tear-next aria-hidden="true"></div>
        <div class="tear-old-page" data-tear-page aria-hidden="true">
          <div class="tear-snapshot" data-tear-snapshot></div>
          <div class="tear-edge" data-tear-edge></div>
        </div>
      </div>
    </section>


    <section class="story site-unified-story" data-story aria-label="Nossa rotina">
      <section class="chat-scene" data-scene aria-label="E depois disso começamos a conversar">
        <div class="chat-app">
          <header class="chat-header">
            <div class="chat-header__profile">
              <strong>Juju <span aria-hidden="true">❤️</span></strong>
            </div>
            <div class="chat-header__icons" aria-hidden="true">
              <span class="icon-button">
                <svg viewBox="0 0 24 24"><path d="M15 10l4.6-2.6A1 1 0 0121 8.3v7.4a1 1 0 01-1.4.9L15 14M4 6h9a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"/></svg>
              </span>
              <span class="icon-button">
                <svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z" opacity="0"/><path d="M8 10a4 4 0 108 0M12 6v8M8.5 19h7"/></svg>
              </span>
            </div>
          </header>
    
          <div class="scene-title" data-title>
            <span class="scene-title__ornament" aria-hidden="true"><i></i><b>♥</b><i></i></span>
            <img src="/assets/titulo-abertura.png" alt="E depois disso começamos a conversar..." decoding="async" fetchpriority="high" />
          </div>
    
          <div class="chat-viewport" data-chat-viewport>
            <div class="chat-thread" data-thread>
              <article class="message message--outgoing" data-event data-at="0.070">
                <div class="bubble bubble--outgoing">Bom dia, Linda <span class="checks" aria-hidden="true">✓✓</span></div>
              </article>
    
              <article class="message message--typing" data-transient data-start="0.115" data-end="0.145" aria-hidden="true">
                <div class="bubble bubble--incoming typing-dots"><i></i><i></i><i></i></div>
              </article>
    
              <article class="message message--incoming" data-event data-at="0.145">
                <div class="bubble bubble--incoming">Bom dia</div>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.195">
                <figure class="media-card media-card--portrait media-card--xl">
                  <img src="/assets/rotina/rotina-01.jpeg" alt="Foto rotina 01" decoding="async" />
                  <span class="media-fallback">rotina-01.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.235">
                <figure class="media-card media-card--portrait media-card--sm">
                  <img src="/assets/rotina/rotina-02.jpeg" alt="Foto rotina 02" decoding="async" />
                  <span class="media-fallback">rotina-02.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.275">
                <figure class="media-card media-card--three-four media-card--lg">
                  <img src="/assets/rotina/rotina-03.jpeg" alt="Foto rotina 03" decoding="async" />
                  <span class="media-fallback">rotina-03.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media message--cluster" data-event data-at="0.315">
                <div class="media-grid media-grid--two">
                  <figure class="media-card media-card--portrait media-card--grid-small">
                    <img src="/assets/rotina/rotina-04.jpeg" alt="Foto rotina 04" decoding="async" />
                    <span class="media-fallback">rotina-04.jpeg</span>
                  </figure>
                  <figure class="media-card media-card--portrait media-card--grid-small">
                    <img src="/assets/rotina/rotina-05.jpeg" alt="Foto rotina 05" decoding="async" />
                    <span class="media-fallback">rotina-05.jpeg</span>
                  </figure>
                </div>
              </article>
    
              <article class="message message--incoming message--bridge-typing" data-transient data-start="0.355" data-end="0.395">
                <div class="typing-status">
                  <span>Juju ❤️ está digitando</span>
                  <span class="typing-dots typing-dots--inline" aria-hidden="true"><i></i><i></i><i></i></span>
                </div>
              </article>
    
              <article class="message message--incoming" data-event data-at="0.405">
                <div class="bubble bubble--incoming">dia corrido por aqui</div>
              </article>
    
              <article class="message message--outgoing" data-event data-at="0.440">
                <div class="bubble bubble--outgoing">Ficou linda. <span class="checks" aria-hidden="true">✓✓</span></div>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.480">
                <figure class="media-card media-card--portrait media-card--xl">
                  <img src="/assets/rotina/rotina-06.jpeg" alt="Foto rotina 06" decoding="async" fetchpriority="low" />
                  <span class="media-fallback">rotina-06.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.515">
                <figure class="media-card media-card--portrait media-card--sm">
                  <img src="/assets/rotina/rotina-07.jpeg" alt="Foto rotina 07" decoding="async" fetchpriority="low" />
                  <span class="media-fallback">rotina-07.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.550">
                <figure class="media-card media-card--three-four media-card--lg">
                  <img src="/assets/rotina/rotina-08.jpeg" alt="Foto rotina 08" decoding="async" fetchpriority="low" />
                  <span class="media-fallback">rotina-08.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media message--cluster" data-event data-at="0.585">
                <div class="media-grid media-grid--two">
                  <figure class="media-card media-card--portrait media-card--grid-small">
                    <img src="/assets/rotina/rotina-09.jpg" alt="Foto rotina 09" decoding="async" fetchpriority="low" />
                    <span class="media-fallback">rotina-09.jpg</span>
                  </figure>
                  <figure class="media-card media-card--portrait media-card--grid-small">
                    <img src="/assets/rotina/rotina-10.jpeg" alt="Foto rotina 10" decoding="async" fetchpriority="low" />
                    <span class="media-fallback">rotina-10.jpeg</span>
                  </figure>
                </div>
              </article>
    
              <article class="message message--incoming message--bridge-typing" data-transient data-start="0.625" data-end="0.665">
                <div class="typing-status">
                  <span>Juju ❤️ está digitando</span>
                  <span class="typing-dots typing-dots--inline" aria-hidden="true"><i></i><i></i><i></i></span>
                </div>
              </article>
    
              <article class="message message--incoming" data-event data-at="0.675">
                <div class="bubble bubble--incoming">estou irritada</div>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.710">
                <figure class="media-card media-card--portrait media-card--xl">
                  <img src="/assets/rotina/rotina-11.jpeg" alt="Foto rotina 11" decoding="async" fetchpriority="low" />
                  <span class="media-fallback">rotina-11.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.785">
                <figure class="media-card media-card--portrait media-card--sm">
                  <img src="/assets/rotina/rotina-12.jpeg" alt="Foto rotina 12" decoding="async" fetchpriority="low" />
                  <span class="media-fallback">rotina-12.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.820">
                <figure class="media-card media-card--portrait media-card--lg">
                  <img src="/assets/rotina/rotina-13.jpeg" alt="Foto rotina 13" decoding="async" fetchpriority="low" />
                  <span class="media-fallback">rotina-13.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media message--cluster" data-event data-at="0.855">
                <div class="media-grid media-grid--two">
                  <figure class="media-card media-card--portrait media-card--grid-small">
                    <img src="/assets/rotina/rotina-14.jpeg" alt="Foto rotina 14" decoding="async" fetchpriority="low" />
                    <span class="media-fallback">rotina-14.jpeg</span>
                  </figure>
                  <figure class="media-card media-card--portrait media-card--grid-small">
                    <img src="/assets/rotina/rotina-15.jpeg" alt="Foto rotina 15" decoding="async" fetchpriority="low" />
                    <span class="media-fallback">rotina-15.jpeg</span>
                  </figure>
                </div>
              </article>
    
              <article class="message message--outgoing" data-event data-at="0.890">
                <div class="bubble bubble--outgoing">Me perdoa, gatinha. <span class="checks" aria-hidden="true">✓✓</span></div>
              </article>
    
              <article class="message message--incoming message--bridge-typing" data-transient data-start="0.920" data-end="0.942">
                <div class="typing-status">
                  <span>Juju ❤️ está digitando</span>
                  <span class="typing-dots typing-dots--inline" aria-hidden="true"><i></i><i></i><i></i></span>
                </div>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.945">
                <figure class="media-card media-card--portrait media-card--xl">
                  <img src="/assets/rotina/rotina-16.jpeg" alt="Foto rotina 16" decoding="async" fetchpriority="low" />
                  <span class="media-fallback">rotina-16.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.960">
                <figure class="media-card media-card--portrait media-card--sm">
                  <img src="/assets/rotina/rotina-17.jpeg" alt="Foto rotina 17" decoding="async" fetchpriority="low" />
                  <span class="media-fallback">rotina-17.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.973">
                <figure class="media-card media-card--portrait media-card--lg">
                  <img src="/assets/rotina/rotina-18.jpeg" alt="Foto rotina 18" decoding="async" fetchpriority="low" />
                  <span class="media-fallback">rotina-18.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming" data-event data-at="0.986">
                <div class="bubble bubble--incoming">Vou dormir. Boa noite, lindo</div>
              </article>
    
              <article class="message message--outgoing" data-event data-at="0.996">
                <div class="bubble bubble--outgoing">boa noite, Jujuba ❤️ <span class="checks" aria-hidden="true">✓✓</span></div>
              </article>
            </div>
          </div>
    
          <footer class="chat-composer">
            <button class="composer-button composer-plus" type="button" data-plus aria-label="Abrir galeria">
              <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            </button>
            <div class="composer-field" aria-hidden="true"></div>
            <span class="composer-button composer-button--accent" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 19V5M7 10l5-5 5 5"/></svg>
            </span>
          </footer>
    
          <section class="work-gallery" data-work-gallery aria-hidden="true">
            <div class="gallery-scrim" data-gallery-scrim></div>
            <div class="gallery-sheet" data-gallery-sheet>
              <div class="gallery-handle" aria-hidden="true"></div>
              <div class="gallery-grid" data-gallery-grid></div>
            </div>
    
            <div class="work-viewer" data-viewer aria-hidden="true">
              <button class="viewer-control viewer-back" type="button" data-viewer-back aria-label="Voltar para a galeria">
                <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>
              </button>
              <button class="viewer-control viewer-prev" type="button" data-viewer-prev aria-label="Foto anterior">
                <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>
              </button>
              <div class="viewer-media" data-viewer-media>
                <img data-viewer-img alt="Foto de trabalho" decoding="async" />
                <span class="viewer-fallback" data-viewer-fallback></span>
              </div>
              <button class="viewer-control viewer-next" type="button" data-viewer-next aria-label="Próxima foto">
                <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
              </button>
    
              <div class="transition-video-stage" data-transition-video-stage aria-hidden="true">
                <div class="transition-video-frame" data-transition-video-frame>
                  <div class="transition-video-poster" aria-hidden="true">
                    <span class="transition-video-poster__grain"></span>
                    <span class="transition-video-poster__vignette"></span>
                  </div>
                  <button class="transition-play" type="button" data-transition-play aria-label="Abrir em tela cheia">
                    <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M25 18l24 14-24 14z"/></svg>
                  </button>
                  <div class="transition-video-progress" aria-hidden="true"><i></i></div>
    
                  <!--
                    PLAYER / HANDOFF ÚNICO
                    ----------------------
                    O frame 0 real de Sorriso é montado aqui ainda com o player
                    pequeno. Ele permanece congelado, expande com o próprio
                    player e mascara o reset invisível de scroll para a cena nova.
                  -->
                  <div class="transition-next-scene" data-next-scene-root aria-hidden="true"></div>
                </div>
              </div>
            </div>
    
            <div class="romance-overlay" data-romance-overlay aria-hidden="true">
              <div class="romance-copy romance-copy--gallery">
                <div class="romance-copy__reveal">
                  <img src="/assets/romance/trabalho-frase-01-user.png" alt="" decoding="async" fetchpriority="low" />
                </div>
              </div>
              <div class="romance-copy romance-copy--viewer-a">
                <div class="romance-copy__reveal">
                  <img src="/assets/romance/trabalho-frase-02-user.png" alt="" decoding="async" fetchpriority="low" />
                </div>
              </div>
              <div class="romance-copy romance-copy--viewer-b">
                <div class="romance-copy__reveal">
                  <img src="/assets/romance/trabalho-frase-03-user.png" alt="" decoding="async" fetchpriority="low" />
                </div>
              </div>
    
              <div class="romance-hearts" aria-hidden="true">
                <span class="romance-heart romance-heart--1">♥</span>
                <span class="romance-heart romance-heart--2">♥</span>
                <span class="romance-heart romance-heart--3">♥</span>
                <span class="romance-heart romance-heart--4">♥</span>
                <span class="romance-heart romance-heart--5">♥</span>
                <span class="romance-heart romance-heart--6">♥</span>
                <span class="romance-heart romance-heart--7">♥</span>
                <span class="romance-heart romance-heart--8">♥</span>
              </div>
    
              <svg class="love-arrow" viewBox="0 0 360 78" role="presentation" aria-hidden="true">
                <g fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 46 C110 18, 232 60, 334 28"/>
                  <path d="M18 46 l17 -16 M18 46 l22 7"/>
                  <path d="M334 28 l-20 -8 M334 28 l-13 17"/>
                </g>
                <path d="M289 23c-7-12-26-7-26 8 0 17 26 29 26 29s26-12 26-29c0-15-19-20-26-8z" fill="currentColor" opacity=".72"/>
              </svg>
            </div>
          </section>
    
          <button class="sound-hint" type="button" data-sound-hint aria-label="Ativar som" title="Ativar som">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5zM17 9.5a4 4 0 010 5M19.5 7a7.5 7.5 0 010 10"/></svg>
          </button>
        </div>
      </section>
    </section>
  </main>
  </div>

  <section class="love-continuation-shell" data-love-continuation-shell aria-hidden="true">
    <div data-love-continuation-root></div>
  </section>

  <audio id="title-chime" preload="auto" src="/assets/sounds/notification.mp3"></audio>
  <audio id="background-music" preload="auto" loop src="/assets/sounds/musica-fundo.mp3"></audio>
`;se(()=>import("./runtime-fIR2cY1K.js"),[]).then(()=>se(()=>import("./site-continuation-entry-Di1xX2KN.js"),[])).catch(e=>console.error("[site-unified] Falha ao iniciar a continuação:",e));se(()=>import("./engagement-tracker-mLYOEXWV.js"),[]).catch(e=>console.warn("[analytics] indisponível:",e));const x=document.querySelector(".hero"),T=document.querySelector("[data-start]"),C=window.matchMedia("(prefers-reduced-motion: reduce)").matches,Ie=[...document.querySelectorAll("[data-parallax]")],ie=[...document.querySelectorAll("[data-memory-heart]")];function Se(e,t,i="35% 0px"){if(!e||typeof t!="function")return{stop(){}};let r=0,a=!1,s=!("IntersectionObserver"in window),c=null;const o=u=>{a&&(t(u),r=requestAnimationFrame(o))},d=()=>{a||document.hidden||!s||(a=!0,r=requestAnimationFrame(o))},h=()=>{!a&&!r||(a=!1,r&&cancelAnimationFrame(r),r=0)},y=()=>{document.hidden?h():d()};return document.addEventListener("visibilitychange",y),"IntersectionObserver"in window?(c=new IntersectionObserver(([u])=>{s=!!u?.isIntersecting,s?d():h()},{root:null,rootMargin:i,threshold:0}),c.observe(e)):d(),{start:d,stop(){h(),c?.disconnect(),document.removeEventListener("visibilitychange",y)}}}function Ee(){return window.innerWidth<=860?1.5:2}const _=document.querySelector("[data-heart-portal]"),E=document.querySelector("#ato-1");let j=!1,W=!0;function de(e){document.body.classList.toggle("is-intro-locked",e)}de(!0);function ve(){if(!E)return;W=!1,de(!1);const e=document.documentElement,t=e.style.scrollBehavior;e.style.scrollBehavior="auto",window.scrollTo(0,E.offsetTop),requestAnimationFrame(()=>{e.style.scrollBehavior=t})}let q=0,O=!1,$=0,Y=!1;function Ne(e){return!e||e.paused||e.ended||e.readyState<2?!1:e.dataset.videoRole==="segundo-video-final"?!!e.closest(".viv4-bridge__final-screen")?.classList.contains("is-video-only"):!0}function Oe(){return[...document.querySelectorAll("video")].some(Ne)}function K(){!O&&!q||(O=!1,$=0,q&&cancelAnimationFrame(q),q=0,document.documentElement.classList.remove("is-auto-journey"))}function _e(e){if(q=0,!O)return;$||($=e);const t=Math.min(40,Math.max(0,e-$));if($=e,!document.hidden&&!Y&&!Oe()){const i=Math.max(480,window.visualViewport?.height||window.innerHeight||720),r=window.innerWidth<=860,o=Math.max(r?430:560,Math.min(r?760:1080,i*(r?.82:.96))),d=Math.max(0,document.documentElement.scrollHeight-window.innerHeight),h=Math.min(d,window.scrollY+o*t/1e3);if(h>window.scrollY+.05)window.scrollTo(0,h);else if(window.scrollY>=d-2){K();return}}q=requestAnimationFrame(_e)}function fe(){C||(K(),O=!0,$=0,document.documentElement.classList.add("is-auto-journey"),q=requestAnimationFrame(_e))}function G(e){O&&(e&&e.isTrusted===!1||K())}window.addEventListener("wheel",G,{passive:!0,capture:!0});window.addEventListener("touchstart",G,{passive:!0,capture:!0});window.addEventListener("pointerdown",G,{passive:!0,capture:!0});window.addEventListener("keydown",G,{capture:!0});document.addEventListener("nextscene:transition-start",()=>{Y=!0});document.addEventListener("nextscene:ready",()=>{Y=!0});document.addEventListener("nextscene:entered",()=>{Y=!1,$=performance.now()});document.addEventListener("nextscene:returning",()=>{Y=!0});document.addEventListener("nextscene:returned",()=>{Y=!1,$=performance.now()});function Q(e=T,t={}){if(j||!E)return;const i=!!t.autoJourney;if(j=!0,C||!_){ve(),E.classList.add("is-entered"),j=!1,i&&fe();return}const r=e?.getBoundingClientRect?.()||{left:window.innerWidth/2,top:window.innerHeight/2,width:0,height:0};_.style.setProperty("--portal-x",`${r.left+r.width/2}px`),_.style.setProperty("--portal-y",`${r.top+r.height/2}px`),document.body.classList.add("is-transitioning"),x.classList.add("hero--starting"),_.classList.remove("is-settled"),_.classList.add("is-active"),window.setTimeout(()=>{_.classList.add("is-settled"),ve(),E.classList.add("is-entered"),requestAnimationFrame(()=>{requestAnimationFrame(()=>{_.classList.remove("is-active","is-settled"),x.classList.remove("hero--starting"),document.body.classList.remove("is-transitioning"),j=!1,i&&fe()})})},980)}T?.addEventListener("click",()=>Q(T,{autoJourney:!0}));function Z(){return j||!W?!1:window.scrollY<=Math.max(8,window.innerHeight*.02)}function De(){j||W||window.scrollY>1||(K(),W=!0,E?.classList.remove("is-entered"),x?.classList.remove("hero--starting"),_?.classList.remove("is-active","is-settled","is-revealing"),document.body.classList.remove("is-transitioning"),de(!0),window.scrollY!==0&&window.scrollTo(0,0))}function Ve(e){!Z()||e.deltaY<=0||e.target.closest?.("[data-memory-heart]")||(e.preventDefault(),Q(T))}window.addEventListener("wheel",Ve,{passive:!1});let N=null;window.addEventListener("touchstart",e=>{Z()&&(e.target.closest?.("[data-memory-heart], [data-start]")||(N=e.touches?.[0]?.clientY??null))},{passive:!0});window.addEventListener("touchend",e=>{if(N==null||!Z())return;const t=e.changedTouches?.[0]?.clientY??N,i=N-t;N=null,i>54&&Q(T)},{passive:!0});window.addEventListener("keydown",e=>{Z()&&["ArrowDown","PageDown"," ","Spacebar"].includes(e.key)&&(e.preventDefault(),Q(T))});window.addEventListener("scroll",()=>{De(),document.body.classList.contains("is-intro-locked")&&(j||window.scrollY!==0&&window.scrollTo(0,0))},{passive:!0});C||(x?.addEventListener("pointermove",e=>{const t=x.getBoundingClientRect(),i=(e.clientX-t.left)/t.width-.5,r=(e.clientY-t.top)/t.height-.5;Ie.forEach(a=>{const s=Number(a.dataset.parallax||.1);a.style.setProperty("--px",`${i*s*70}px`),a.style.setProperty("--py",`${r*s*55}px`)}),ie.forEach(a=>{const s=Number(a.dataset.depth||1);a.style.setProperty("--heart-px",`${i*s*16}px`),a.style.setProperty("--heart-py",`${r*s*12}px`),a.style.setProperty("--heart-rx",`${-r*s*3.5}deg`),a.style.setProperty("--heart-ry",`${i*s*4.5}deg`)}),document.documentElement.style.setProperty("--mouse-x",`${i}`),document.documentElement.style.setProperty("--mouse-y",`${r}`)}),x?.addEventListener("pointerleave",()=>{ie.forEach(e=>{e.style.setProperty("--heart-px","0px"),e.style.setProperty("--heart-py","0px"),e.style.setProperty("--heart-rx","0deg"),e.style.setProperty("--heart-ry","0deg")})}));const F=document.querySelector("[data-love-canvas]"),A=document.querySelector("[data-cursor-aura]");if(F&&!C){const e=F.getContext("2d",{alpha:!0}),t={x:innerWidth*.5,y:innerHeight*.5,active:!1,down:!1},i=[],r=[];let a=1,s=1,c=1,o=0;const d=()=>{const g=x.getBoundingClientRect();a=Math.min(window.devicePixelRatio||1,Ee()),s=Math.max(1,g.width),c=Math.max(1,g.height),F.width=Math.round(s*a),F.height=Math.round(c*a),F.style.width=`${s}px`,F.style.height=`${c}px`,e.setTransform(a,0,0,a,0,0)},h=(g,l,n=1)=>{i.push({x:g,y:l,r:4,a:.24*n,speed:1.8+n*1.5}),i.length>12&&i.shift()},y=(g,l,n=0,f=0)=>{r.push({x:g,y:l,vx:n+(Math.random()-.5)*.55,vy:f+(Math.random()-.5)*.55-.18,life:1,size:1.2+Math.random()*2.4,spin:(Math.random()-.5)*.08,angle:Math.random()*Math.PI*2}),r.length>70&&r.splice(0,r.length-70)},u=(g,l,n,f,M)=>{e.save(),e.translate(g,l),e.rotate(f),e.scale(n/18,n/18),e.beginPath(),e.moveTo(0,5),e.bezierCurveTo(-10,-3,-9,-12,0,-7),e.bezierCurveTo(9,-12,10,-3,0,5),e.strokeStyle=`rgba(206,68,85,${M})`,e.lineWidth=1.35,e.stroke(),e.restore()},v=g=>{e.clearRect(0,0,s,c);for(let l=0;l<3;l+=1){const n=g*23e-5+l*2.1,f=c*(.22+l*.27),M=t.active?(t.x-s*.5)*(.035+l*.008):0,S=t.active?(t.y-c*.5)*(.025+l*.006):0;e.beginPath(),e.moveTo(-60,f+Math.sin(n)*17),e.bezierCurveTo(s*.26+Math.sin(n*1.2)*70,f-42+S,s*.72+M,f+54-S,s+60,f+Math.cos(n*.9)*19),e.strokeStyle=`rgba(202,55,72,${.033+l*.012})`,e.lineWidth=1.1+l*.35,e.stroke()}for(let l=i.length-1;l>=0;l-=1){const n=i[l];n.r+=n.speed,n.a*=.972,e.beginPath(),e.arc(n.x,n.y,n.r,0,Math.PI*2),e.strokeStyle=`rgba(206,68,85,${n.a})`,e.lineWidth=1.2,e.stroke(),n.a<.008&&i.splice(l,1)}for(let l=r.length-1;l>=0;l-=1){const n=r[l];n.x+=n.vx,n.y+=n.vy,n.vx*=.985,n.vy*=.985,n.life*=.982,n.angle+=n.spin,u(n.x,n.y,n.size*4.5,n.angle,Math.max(0,n.life*.32)),n.life<.04&&r.splice(l,1)}};x.addEventListener("pointermove",g=>{const l=x.getBoundingClientRect(),n=g.clientX-l.left,f=g.clientY-l.top,M=n-t.x,S=f-t.y;t.x=n,t.y=f,t.active=!0,A&&g.pointerType!=="touch"&&(A.classList.add("is-visible"),A.style.setProperty("--cursor-x",`${g.clientX}px`),A.style.setProperty("--cursor-y",`${g.clientY}px`));const R=performance.now();R-o>34&&Math.abs(M)+Math.abs(S)>4&&(y(n,f,M*.02,S*.02),o=R)}),x.addEventListener("pointerdown",g=>{const l=x.getBoundingClientRect();t.down=!0,h(g.clientX-l.left,g.clientY-l.top,1.25);for(let n=0;n<5;n+=1)y(g.clientX-l.left,g.clientY-l.top);A?.classList.add("is-down")});const m=()=>{t.down=!1,A?.classList.remove("is-down")};x.addEventListener("pointerup",m),x.addEventListener("pointercancel",m),x.addEventListener("pointerleave",()=>{t.active=!1,A?.classList.remove("is-visible","is-down")}),d(),window.addEventListener("resize",d,{passive:!0}),Se(x,v,"20% 0px")}const L=document.querySelector("[data-encounter-stage]"),be=document.querySelector("[data-scene-date]"),Xe=document.querySelector("[data-scene-date-line]"),B=document.querySelector('[data-pose="together"]'),z=document.querySelector('[data-pose="question"]'),J=document.querySelector('[data-pose="kiss"]'),H=document.querySelector('[data-pose="cuddle"]'),we=document.querySelector('[data-scene-copy="bad"]'),xe=document.querySelector('[data-scene-copy="saved"]'),Pe=document.querySelector('[data-scene-copy="final"]'),pe=e=>Math.max(0,Math.min(1,e)),k=(e,t,i)=>pe((e-t)/(i-t));let w=0,re=!1;function $e(){if(re=!1,!E||!L)return;const e=E.offsetTop,t=Math.max(1,L.clientHeight||window.innerHeight),i=Math.max(1,E.offsetHeight-t),r=pe((window.scrollY-e)/i);if((r===0||r===1)&&Math.abs(r-w)<1e-4)return;w=r,L.style.setProperty("--encounter-progress",w.toFixed(4));const a=w<.3?"together":w<.58?"question":w<.84?"kiss":"cuddle";B?.style.setProperty("--pose-opacity",a==="together"?"1":"0"),B?.style.setProperty("--pose-x","0vw"),B?.style.setProperty("--pose-y","0vh"),B?.style.setProperty("--pose-scale","1"),B?.style.setProperty("--pose-blur","0px"),z?.style.setProperty("--pose-opacity",a==="question"?"1":"0"),z?.style.setProperty("--pose-x",".4vw"),z?.style.setProperty("--pose-y","0vh"),z?.style.setProperty("--pose-scale","1"),z?.style.setProperty("--pose-blur","0px"),J?.style.setProperty("--pose-opacity",a==="kiss"?"1":"0"),J?.style.setProperty("--pose-x",".2vw"),J?.style.setProperty("--pose-y","0vh"),J?.style.setProperty("--pose-scale","1"),J?.style.setProperty("--pose-blur","0px"),H?.style.setProperty("--pose-opacity",a==="cuddle"?"1":"0"),H?.style.setProperty("--pose-x","0vw"),H?.style.setProperty("--pose-y","0vh"),H?.style.setProperty("--pose-scale","1"),H?.style.setProperty("--pose-blur","0px");const s=1,c=k(w,.02,.16);be?.style.setProperty("--scene-opacity",`${s}`),be?.style.setProperty("--scene-y",`${k(w,.18,.36)*-10}px`),Xe?.style.setProperty("--date-write",`${c.toFixed(3)}`);const o=k(w,.06,.16);we?.style.setProperty("--scene-opacity",`${o}`),we?.style.setProperty("--scene-y",`${(1-o)*20}px`);const d=k(w,.32,.46);xe?.style.setProperty("--scene-opacity",`${d}`),xe?.style.setProperty("--scene-y",`${(1-d)*20}px`);const h=k(w,.62,.78);Pe?.style.setProperty("--scene-opacity",`${h}`),Pe?.style.setProperty("--scene-y",`${(1-h)*24}px`);const y=k(w,.18,.7);L.style.setProperty("--scene-warmth",y.toFixed(3)),L.style.setProperty("--party-energy",k(w,.04,.82).toFixed(3)),L.style.setProperty("--rain-force",`${(.66+w*.34).toFixed(3)}`);const u=k(w,.66,.91);L.style.setProperty("--kiss-heart-opacity",u.toFixed(3)),L.style.setProperty("--kiss-heart-scale",`${(.05+u*1.58).toFixed(3)}`),L.style.setProperty("--hint-opacity",`${(1-k(w,0,.14)).toFixed(3)}`)}function ue(){re||(re=!0,requestAnimationFrame($e))}window.addEventListener("scroll",ue,{passive:!0});window.addEventListener("resize",ue,{passive:!0});ue();function Ae(e,t={}){if(!e||C)return;const i=e.getContext("2d",{alpha:!0}),r=[],a={density:t.density??115,minSpeed:t.minSpeed??9,maxSpeed:t.maxSpeed??18,minLen:t.minLen??8,maxLen:t.maxLen??25,alpha:t.alpha??.28,width:t.width??1,wind:t.wind??-1.6};let s=1,c=1,o=1;const d=(u,v=!0)=>{u.x=Math.random()*s*1.15-s*.06,u.y=v?Math.random()*c:-40-Math.random()*120,u.speed=a.minSpeed+Math.random()*(a.maxSpeed-a.minSpeed),u.len=a.minLen+Math.random()*(a.maxLen-a.minLen),u.alpha=a.alpha*(.45+Math.random()*.7),u.offset=Math.random()*6.28},h=()=>{const u=e.getBoundingClientRect();s=Math.max(1,u.width),c=Math.max(1,u.height),o=Math.min(window.devicePixelRatio||1,Ee()),e.width=Math.round(s*o),e.height=Math.round(c*o),i.setTransform(o,0,0,o,0,0);const v=Math.max(45,Math.round(a.density*(s/1440)));for(;r.length<v;){const m={};d(m,!0),r.push(m)}r.length=v},y=u=>{i.clearRect(0,0,s,c);const v=.78+w*.42;i.lineCap="round";for(const m of r){m.y+=m.speed*v,m.x+=a.wind*v,(m.y>c+60||m.x<-100)&&d(m,!1);const g=.84+Math.sin(u*.003+m.offset)*.16;i.beginPath(),i.moveTo(m.x,m.y),i.lineTo(m.x+a.wind*1.8,m.y+m.len*v),i.strokeStyle=`rgba(255,239,238,${m.alpha*g})`,i.lineWidth=a.width,i.stroke()}};h(),window.addEventListener("resize",h,{passive:!0}),Se(e,y,"45% 0px")}Ae(document.querySelector("[data-rain-back]"),{density:120,minSpeed:6,maxSpeed:12,minLen:7,maxLen:18,alpha:.19,width:.85,wind:-1.1});Ae(document.querySelector("[data-rain-front]"),{density:88,minSpeed:12,maxSpeed:22,minLen:16,maxLen:34,alpha:.38,width:1.15,wind:-2.1});const Le=document.querySelector("#transicao-ato-2"),b=document.querySelector("[data-tear-stage]"),We=document.querySelector("[data-tear-page]"),ne=document.querySelector("[data-tear-snapshot]"),V=document.querySelector("[data-tear-next]"),ke=document.querySelector("[data-tear-edge]"),U=document.querySelector("[data-story]"),Me=U?.querySelector(".chat-scene");let oe=!1,ce=!1,le=!1,X=null;b&&b.parentElement!==document.body&&document.body.appendChild(b);function je(e,t){if(!e)return null;const i=e.cloneNode(!0);i.classList.add(t);const r=[...e.querySelectorAll("canvas")];return[...i.querySelectorAll("canvas")].forEach((s,c)=>{const o=r[c];if(o)try{s.width=o.width,s.height=o.height,s.getContext("2d")?.drawImage(o,0,0)}catch{}}),i}function Ue(){if(ce||!ne||!L)return;$e();const e=je(L,"tear-snapshot-stage");e&&(e.removeAttribute("data-encounter-stage"),ne.replaceChildren(e),ce=!0)}function Ke(){if(le||!V||!Me)return;const e=je(Me,"tear-next-stage-clone");if(!e)return;const t=getComputedStyle(U);["--paper","--ink","--sage","--header-h","--composer-h","--chat-dim","--composer-dim"].forEach(i=>{const r=t.getPropertyValue(i);r&&V.style.setProperty(i,r)}),e.removeAttribute("data-scene"),e.setAttribute("aria-hidden","true"),V.replaceChildren(e),le=!0}function me(){b&&(b.style.setProperty("--tear-y","103%"),b.style.setProperty("--tear-lift","0vh"),b.style.setProperty("--tear-tilt","0deg"),b.style.setProperty("--tear-progress","0"),b.style.setProperty("--tear-edge-opacity","0"))}function Ge(){if(oe=!1,!Le||!b||!We||!U)return;const e=Math.max(1,b.clientHeight||window.innerHeight),t=Le.offsetTop-e,i=U.offsetTop,r=Math.max(1,i-t),a=pe((window.scrollY-t)/r);if(!(window.scrollY>=t&&window.scrollY<i)){const v=window.scrollY<t?"before":"after";if(X===v)return;X=v,b.classList.remove("is-active"),v==="before"&&me();return}X="active",Ue(),Ke(),b.classList.add("is-active");const c=k(a,.02,.91),o=c*c*(3-2*c),d=103-o*121,h=-o*3.2,y=-o*.38,u=c<=.01||c>=.995?0:1;b.style.setProperty("--tear-y",`${d.toFixed(3)}%`),b.style.setProperty("--tear-lift",`${h.toFixed(3)}vh`),b.style.setProperty("--tear-tilt",`${y.toFixed(3)}deg`),b.style.setProperty("--tear-progress",o.toFixed(4)),b.style.setProperty("--tear-edge-opacity",`${u}`),ke&&(ke.style.opacity=`${u}`)}function ge(){oe||(oe=!0,requestAnimationFrame(Ge))}window.addEventListener("scroll",ge,{passive:!0});window.addEventListener("resize",()=>{ce=!1,le=!1,X=null,ne?.replaceChildren(),V?.replaceChildren(),me(),ge()},{passive:!0});me();ge();const Qe=ie;Qe.forEach(e=>{const t=Number(e.dataset.x),i=Number(e.dataset.y),r=Number(e.dataset.rotate);let a=0,s=0,c=0,o=0,d=!1,h=null,y=0,u=0,v=0,m=0,g=0,l=0,n=0,f=null;const M=()=>{const p=x.getBoundingClientRect();e.style.left=`${t/100*p.width}px`,e.style.top=`${i/100*p.height}px`},S=()=>{const p=Math.max(-9,Math.min(9,c*.04));e.style.setProperty("--drag-x",`${a}px`),e.style.setProperty("--drag-y",`${s}px`),e.style.setProperty("--drag-rotate",`${r+p}deg`)},R=()=>{c*=.89,o*=.89,a+=c,s+=o;const p=x.getBoundingClientRect(),P=e.getBoundingClientRect(),D=P.left+c,ae=P.right+c,te=P.top+o,Te=P.bottom+o;(D<-P.width*.25||ae>p.right+P.width*.25)&&(c*=-.5),(te<p.top-P.height*.25||Te>p.bottom+P.height*.25)&&(o*=-.5),S(),Math.abs(c)+Math.abs(o)>.18?f=requestAnimationFrame(R):f=null},qe=p=>{p.button!==void 0&&p.button!==0||(f&&cancelAnimationFrame(f),f=null,d=!0,h=p.pointerId,e.classList.add("is-dragging"),e.setPointerCapture?.(h),y=p.clientX,u=p.clientY,v=a,m=s,g=p.clientX,l=p.clientY,n=performance.now())},Fe=p=>{if(!d||p.pointerId!==h)return;const P=performance.now(),D=Math.max(8,P-n),ae=p.clientX-y,te=p.clientY-u;a=v+ae,s=m+te,c=(p.clientX-g)/D*16,o=(p.clientY-l)/D*16,g=p.clientX,l=p.clientY,n=P,S()},ee=p=>{if(!(!d||p.pointerId!==void 0&&p.pointerId!==h)){d=!1,e.classList.remove("is-dragging");try{e.releasePointerCapture?.(h)}catch{}h=null,C||(f=requestAnimationFrame(R))}};e.addEventListener("pointerdown",qe),e.addEventListener("pointermove",Fe),e.addEventListener("pointerup",ee),e.addEventListener("pointercancel",ee),e.addEventListener("lostpointercapture",ee),e.addEventListener("keydown",p=>{const P=p.shiftKey?24:10;if(p.key==="ArrowLeft")a-=P;else if(p.key==="ArrowRight")a+=P;else if(p.key==="ArrowUp")s-=P;else if(p.key==="ArrowDown")s+=P;else return;p.preventDefault(),S()}),M(),window.addEventListener("resize",M,{passive:!0})});
