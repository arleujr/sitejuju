import './styles.css';
import './site-unified/base.css';
import './site-unified/smile-scene.css';
import './site-unified/style-scene.css';
import './site-unified/gym-scene.css';
import './site-unified/combined-scene.css';
import './site-unified/mobile-scene.css';
import './site-unified/vivencias-scene.css';
import './site-unified/full-love-scene.css';
import './site-unified/site-continuation-bridge.css';
import './site-unified/end-feedback.css';
import './mobile-viewport-fix.css';
import { createScrollFrameDriver, createViewportFrameDriver } from './site-unified/performance-runtime.js';
import { initStoryRuntime } from './site-unified/runtime.js';
import { initSiteContinuation } from './site-unified/site-continuation-entry.js';

const REPLAY_SESSION_KEY='love-story-replay-v1';
try{
  if(history && 'scrollRestoration' in history) history.scrollRestoration='manual';
  if(sessionStorage.getItem(REPLAY_SESSION_KEY)==='1'){
    sessionStorage.removeItem(REPLAY_SESSION_KEY);
    const forceTop=()=>window.scrollTo(0,0);
    forceTop();
    requestAnimationFrame(()=>requestAnimationFrame(forceTop));
    window.addEventListener('load',forceTop,{once:true});
  }
}catch(_){}


const heartPath = 'M50 88 C42 80 7 58 7 31 C7 11 31 2 50 22 C69 2 93 11 93 31 C93 58 58 80 50 88 Z';


const floatingHeroHearts = [
  { left: 8,  delay: -0.5, duration: 10.8, size: 20, drift: 2,  opacity: .52, glyph: '♡' },
  { left: 16, delay: -4.4, duration: 13.2, size: 14, drift: -3, opacity: .34, glyph: '♥' },
  { left: 24, delay: -2.1, duration: 11.7, size: 16, drift: 4,  opacity: .42, glyph: '♡' },
  { left: 34, delay: -6.2, duration: 14.1, size: 12, drift: -2, opacity: .28, glyph: '♥' },
  { left: 43, delay: -1.6, duration: 12.4, size: 18, drift: 3,  opacity: .46, glyph: '♡' },
  { left: 52, delay: -5.0, duration: 15.0, size: 13, drift: -4, opacity: .30, glyph: '♥' },
  { left: 61, delay: -3.0, duration: 10.9, size: 17, drift: 2,  opacity: .40, glyph: '♡' },
  { left: 69, delay: -7.4, duration: 13.7, size: 12, drift: -3, opacity: .26, glyph: '♥' },
  { left: 77, delay: -2.7, duration: 11.5, size: 16, drift: 4,  opacity: .41, glyph: '♡' },
  { left: 86, delay: -6.7, duration: 12.8, size: 14, drift: -2, opacity: .33, glyph: '♥' },
  { left: 93, delay: -4.0, duration: 10.6, size: 18, drift: 3,  opacity: .48, glyph: '♡' },
];

function floatingHeroHeartsMarkup(){
  return floatingHeroHearts.map((heart, index)=>`
    <span
      class="hero-float-heart hero-float-heart--${index % 3}"
      style="--left:${heart.left}%; --delay:${heart.delay}s; --dur:${heart.duration}s; --size:${heart.size}px; --drift:${heart.drift}vw; --alpha:${heart.opacity};"
    >${heart.glyph}</span>
  `).join('');
}

const memoryHearts = [
  {
    id: 'carnaval',
    src: '/assets/jujucarnaval02.jpeg',
    alt: 'Arleu e Juliana no carnaval',
    label: 'Dois Gostosos',
    side: 'left',
    x: 16,
    y: 25,
    size: 38,
    rotate: -5,
    depth: 1.05,
  },
  {
    id: 'formatura',
    src: '/assets/jujuformatura.jpeg',
    alt: 'Arleu e Juliana na formatura',
    label: '🥵🥵🥵',
    side: 'right-top',
    x: 82,
    y: 20,
    size: 28,
    rotate: 6,
    depth: .9,
  },
  {
    id: 'casamento',
    src: '/assets/jujucasamento.jpg',
    alt: 'Arleu e Juliana em uma celebração',
    label: 'Juntos',
    side: 'right-bottom',
    x: 80,
    y: 61,
    size: 27,
    rotate: -4,
    depth: 1,
  },
  {
    id: 'coracoes',
    src: '/assets/hero-coracoes.jpg',
    alt: 'Uma memória especial',
    label: '❤️❤️❤️',
    side: 'left-bottom',
    x: 17,
    y: 58,
    size: 22,
    rotate: 4,
    depth: .95,
  },
];

function memoryHeartMarkup(memory, index) {
  return `
    <article
      class="memory-heart memory-heart--${memory.side}"
      data-memory-heart
      data-id="${memory.id}"
      data-x="${memory.x}"
      data-y="${memory.y}"
      data-rotate="${memory.rotate}"
      data-depth="${memory.depth}"
      style="--size:${memory.size}vmin; --delay:${index * -1.7}s; --tilt:${memory.rotate}deg"
      tabindex="0"
      aria-label="Memória: ${memory.label}. Você pode arrastar este coração."
    >
      <div class="memory-heart__float">
        <div class="memory-heart__surface">
          <svg class="memory-heart__svg" viewBox="0 0 100 90" role="img" aria-label="${memory.alt}">
            <defs>
              <clipPath id="clip-${memory.id}">
                <path d="${heartPath}" />
              </clipPath>
              <filter id="soft-${memory.id}" x="-30%" y="-30%" width="160%" height="170%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".16" />
              </filter>
            </defs>
            <g filter="url(#soft-${memory.id})">
              <g clip-path="url(#clip-${memory.id})" class="memory-heart__photo-layer">
                <image class="memory-heart__photo-bg" href="${memory.src}" x="-4" y="-4" width="108" height="98" preserveAspectRatio="xMidYMid slice" />
                <image class="memory-heart__photo" href="${memory.src}" x="4" y="3" width="92" height="82" preserveAspectRatio="xMidYMid meet" />
              </g>
              <path class="memory-heart__wash" d="${heartPath}" />
              <path class="memory-heart__outline memory-heart__outline--a" d="${heartPath}" />
              <path class="memory-heart__outline memory-heart__outline--b" d="${heartPath}" />
            </g>
          </svg>
          <span class="memory-heart__tag">${memory.label}<i>♡</i></span>
        </div>
      </div>
    </article>
  `;
}


const app = document.querySelector('#app');

app.innerHTML = `
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
        ${floatingHeroHeartsMarkup()}
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
        ${memoryHearts.map(memoryHeartMarkup).join('')}
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
          <path d="${heartPath}" />
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
                  <img src="/assets/rotina/rotina-01.jpeg" alt="Foto rotina 01" decoding="async"  loading="lazy" />
                  <span class="media-fallback">rotina-01.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.235">
                <figure class="media-card media-card--portrait media-card--sm">
                  <img src="/assets/rotina/rotina-02.jpeg" alt="Foto rotina 02" decoding="async"  loading="lazy" />
                  <span class="media-fallback">rotina-02.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.275">
                <figure class="media-card media-card--three-four media-card--lg">
                  <img src="/assets/rotina/rotina-03.jpeg" alt="Foto rotina 03" decoding="async"  loading="lazy" />
                  <span class="media-fallback">rotina-03.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media message--cluster" data-event data-at="0.315">
                <div class="media-grid media-grid--two">
                  <figure class="media-card media-card--portrait media-card--grid-small">
                    <img src="/assets/rotina/rotina-04.jpeg" alt="Foto rotina 04" decoding="async"  loading="lazy" />
                    <span class="media-fallback">rotina-04.jpeg</span>
                  </figure>
                  <figure class="media-card media-card--portrait media-card--grid-small">
                    <img src="/assets/rotina/rotina-05.jpeg" alt="Foto rotina 05" decoding="async"  loading="lazy" />
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
                  <img src="/assets/rotina/rotina-06.jpeg" alt="Foto rotina 06" decoding="async" fetchpriority="low"  loading="lazy" />
                  <span class="media-fallback">rotina-06.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.515">
                <figure class="media-card media-card--portrait media-card--sm">
                  <img src="/assets/rotina/rotina-07.jpeg" alt="Foto rotina 07" decoding="async" fetchpriority="low"  loading="lazy" />
                  <span class="media-fallback">rotina-07.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.550">
                <figure class="media-card media-card--three-four media-card--lg">
                  <img src="/assets/rotina/rotina-08.jpeg" alt="Foto rotina 08" decoding="async" fetchpriority="low"  loading="lazy" />
                  <span class="media-fallback">rotina-08.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media message--cluster" data-event data-at="0.585">
                <div class="media-grid media-grid--two">
                  <figure class="media-card media-card--portrait media-card--grid-small">
                    <img src="/assets/rotina/rotina-09.jpg" alt="Foto rotina 09" decoding="async" fetchpriority="low"  loading="lazy" />
                    <span class="media-fallback">rotina-09.jpg</span>
                  </figure>
                  <figure class="media-card media-card--portrait media-card--grid-small">
                    <img src="/assets/rotina/rotina-10.jpeg" alt="Foto rotina 10" decoding="async" fetchpriority="low"  loading="lazy" />
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
                  <img src="/assets/rotina/rotina-11.jpeg" alt="Foto rotina 11" decoding="async" fetchpriority="low"  loading="lazy" />
                  <span class="media-fallback">rotina-11.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.785">
                <figure class="media-card media-card--portrait media-card--sm">
                  <img src="/assets/rotina/rotina-12.jpeg" alt="Foto rotina 12" decoding="async" fetchpriority="low"  loading="lazy" />
                  <span class="media-fallback">rotina-12.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.820">
                <figure class="media-card media-card--portrait media-card--lg">
                  <img src="/assets/rotina/rotina-13.jpeg" alt="Foto rotina 13" decoding="async" fetchpriority="low"  loading="lazy" />
                  <span class="media-fallback">rotina-13.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media message--cluster" data-event data-at="0.855">
                <div class="media-grid media-grid--two">
                  <figure class="media-card media-card--portrait media-card--grid-small">
                    <img src="/assets/rotina/rotina-14.jpeg" alt="Foto rotina 14" decoding="async" fetchpriority="low"  loading="lazy" />
                    <span class="media-fallback">rotina-14.jpeg</span>
                  </figure>
                  <figure class="media-card media-card--portrait media-card--grid-small">
                    <img src="/assets/rotina/rotina-15.jpeg" alt="Foto rotina 15" decoding="async" fetchpriority="low"  loading="lazy" />
                    <span class="media-fallback">rotina-15.jpeg</span>
                  </figure>
                </div>
              </article>
    
              <article class="message message--outgoing" data-event data-at="0.890">
                <div class="bubble bubble--outgoing">Espero que nossa filha seja assim. <span class="checks" aria-hidden="true">✓✓</span></div>
              </article>

              <article class="message message--outgoing message--media" data-event data-at="0.905">
                <figure class="media-card media-card--three-four media-card--lg">
                  <img src="/assets/juju-crianca.jpg" alt="Foto de infância da Juju" decoding="async" fetchpriority="low"  loading="lazy" />
                  <span class="media-fallback">juju-crianca.jpg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--bridge-typing" data-transient data-start="0.920" data-end="0.942">
                <div class="typing-status">
                  <span>Juju ❤️ está digitando</span>
                  <span class="typing-dots typing-dots--inline" aria-hidden="true"><i></i><i></i><i></i></span>
                </div>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.945">
                <figure class="media-card media-card--portrait media-card--xl">
                  <img src="/assets/rotina/rotina-16.jpeg" alt="Foto rotina 16" decoding="async" fetchpriority="low"  loading="lazy" />
                  <span class="media-fallback">rotina-16.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.960">
                <figure class="media-card media-card--portrait media-card--sm">
                  <img src="/assets/rotina/rotina-17.jpeg" alt="Foto rotina 17" decoding="async" fetchpriority="low"  loading="lazy" />
                  <span class="media-fallback">rotina-17.jpeg</span>
                </figure>
              </article>
    
              <article class="message message--incoming message--media" data-event data-at="0.973">
                <figure class="media-card media-card--portrait media-card--lg">
                  <img src="/assets/rotina/rotina-18.jpeg" alt="Foto rotina 18" decoding="async" fetchpriority="low"  loading="lazy" />
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

  <button class="journey-player" type="button" data-auto-journey-control data-state="paused" aria-label="Continuar reprodução automática" title="Continuar reprodução automática">
    <span class="journey-player__icon journey-player__icon--play" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M8 5.6v12.8L18.5 12 8 5.6z"/></svg>
    </span>
    <span class="journey-player__icon journey-player__icon--pause" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M7 5.5h3.5v13H7zM13.5 5.5H17v13h-3.5z"/></svg>
    </span>
  </button>

  <audio id="title-chime" preload="metadata" src="/assets/sounds/notification.mp3"></audio>
  <audio id="background-music" preload="none" loop src="/assets/sounds/musica-fundo.mp3"></audio>
`;

// Bootstrap único: todos os módulos pertencem à mesma aplicação e são
// inicializados somente depois que o DOM principal existe. Sem corrida entre
// imports dinâmicos e sem uma segunda aplicação assumindo o scroll depois.
try {
  initStoryRuntime();
  initSiteContinuation();
} catch (error) {
  console.error('[site-unified] Falha ao iniciar a história:', error);
}

void import('./engagement-tracker.js')
  .catch((error) => console.warn('[analytics] indisponível:', error));

const hero = document.querySelector('.hero');
const startButton = document.querySelector('[data-start]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const parallaxNodes = [...document.querySelectorAll('[data-parallax]')];
const memoryHeartNodes = [...document.querySelectorAll('[data-memory-heart]')];

// Animações decorativas contínuas só consomem frame enquanto a cena está
// próxima da viewport. Em uma história longa isso evita que Hero/chuva fiquem
// desenhando por vários minutos depois que o usuário já passou deles.
function createVisibleAnimationLoop(target, draw, rootMargin = '35% 0px') {
  if (!target || typeof draw !== 'function') return { stop() {} };

  let raf = 0;
  let running = false;
  let visible = !('IntersectionObserver' in window);
  let observer = null;

  const frame = (time) => {
    if (!running) return;
    draw(time);
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || document.hidden || !visible) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    if (!running && !raf) return;
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const onVisibility = () => {
    if (document.hidden) stop();
    else start();
  };

  document.addEventListener('visibilitychange', onVisibility);

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
      else stop();
    }, { root: null, rootMargin, threshold: 0 });
    observer.observe(target);
  } else {
    start();
  }

  return {
    start,
    stop() {
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}

function visualDprCap() {
  // 1.5x no mobile mantém canvas/chuva nítidos, mas reduz bastante o custo de
  // preenchimento em telas 2x/3x. Desktop continua limitado a 2x.
  return window.innerWidth <= 860 ? 1.5 : 2;
}

const heartPortal = document.querySelector('[data-heart-portal]');
const chapterOne = document.querySelector('#ato-1');
let transitionRunning = false;
let introArmed = true;
let wheelIntent = 0;
let wheelResetTimer = null;

function setIntroLock(locked) {
  document.body.classList.toggle('is-intro-locked', locked);
}

setIntroLock(true);

function jumpToChapterOne() {
  if (!chapterOne) return;
  introArmed = false;
  setIntroLock(false);
  syncAutoJourneyControl();
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, chapterOne.offsetTop);
  requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

// ---------------------------------------------------------------------------
// COMEÇAR = reprodução guiada da história
// ---------------------------------------------------------------------------
// O botão Começar inicia um passeio automático pelo site. A partir daí o
// controle fixo no topo permite pausar/continuar a qualquer momento. Um gesto
// manual pausa (em vez de destruir) a reprodução, então a pessoa pode explorar
// uma cena e depois retomar exatamente de onde parou.
let autoJourneyRaf = 0;
let autoJourneyActive = false;
let autoJourneySession = false;
let autoJourneyLastTs = 0;
let autoJourneyBottomSince = 0;

const autoJourneyControl = document.querySelector('[data-auto-journey-control]');

function autoJourneyFinalReady() {
  const outro = document.querySelector('.love-outro');
  if (!outro) return true;
  return outro.classList.contains('is-ready') || !outro.classList.contains('is-locked');
}

function syncAutoJourneyControl() {
  if (!autoJourneyControl) return;

  // O controle deixa de depender do botão Começar. Se a pessoa entrar na
  // história por scroll/swipe/teclado, ele aparece em estado pausado e pode
  // iniciar o passeio automático a partir do ponto atual.
  const visible = !reducedMotion && !transitionRunning && (autoJourneySession || !introArmed || window.scrollY > 2);
  autoJourneyControl.classList.toggle('is-visible', visible);
  autoJourneyControl.dataset.state = autoJourneyActive ? 'playing' : 'paused';

  const label = autoJourneyActive
    ? 'Pausar reprodução automática'
    : (autoJourneySession ? 'Continuar reprodução automática' : 'Iniciar reprodução automática');
  autoJourneyControl.setAttribute('aria-label', label);
  autoJourneyControl.setAttribute('title', label);
}

function setAutoJourneyDocumentState() {
  document.documentElement.classList.toggle('has-auto-journey', autoJourneySession);
  document.documentElement.classList.toggle('is-auto-journey', autoJourneySession && autoJourneyActive);
  document.documentElement.classList.toggle('is-auto-journey-paused', autoJourneySession && !autoJourneyActive);
}

function pauseAutoJourney() {
  if (!autoJourneySession || !autoJourneyActive) return;
  autoJourneyActive = false;
  autoJourneyLastTs = 0;
  autoJourneyBottomSince = 0;
  if (autoJourneyRaf) cancelAnimationFrame(autoJourneyRaf);
  autoJourneyRaf = 0;
  setAutoJourneyDocumentState();
  syncAutoJourneyControl();
}

function stopAutoJourney() {
  autoJourneyActive = false;
  autoJourneySession = false;
  autoJourneyLastTs = 0;
  autoJourneyBottomSince = 0;
  if (autoJourneyRaf) cancelAnimationFrame(autoJourneyRaf);
  autoJourneyRaf = 0;
  setAutoJourneyDocumentState();
  syncAutoJourneyControl();
}

function shouldPauseAutoForVideo(video) {
  if (!video || video.paused || video.ended || video.readyState < 2) return false;

  // O segundo vídeo final começa enquanto o balão ainda está atravessando a
  // emenda. Continuamos até a tela virar de fato o player final e, só então,
  // paramos o scroll para assistir ao vídeo.
  if (video.dataset.videoRole === 'segundo-video-final') {
    const finalScreen = video.closest('.viv4-bridge__final-screen');
    return Boolean(finalScreen?.classList.contains('is-video-only'));
  }

  return true;
}

function hasPlayingVideo() {
  return [...document.querySelectorAll('video')].some(shouldPauseAutoForVideo);
}

function autoJourneyFrame(timestamp) {
  autoJourneyRaf = 0;
  if (!autoJourneyActive) return;

  if (!autoJourneyLastTs) autoJourneyLastTs = timestamp;
  const dt = Math.min(40, Math.max(0, timestamp - autoJourneyLastTs));
  autoJourneyLastTs = timestamp;

  // Vídeos narrativos são assistidos antes de a história continuar. Fora deles,
  // o documento inteiro é percorrido por uma única fonte de verdade: scrollY.
  if (!document.hidden && !hasPlayingVideo()) {
    const viewport = Math.max(480, window.visualViewport?.height || window.innerHeight || 720);
    const mobile = window.innerWidth <= 860;

    // ~45-50% mais rápido do que a versão anterior. Ainda preserva tempo de
    // leitura nas mensagens, mas evita a sensação de “arrastar” nas cenas longas.
    const rate = mobile ? 1.22 : 1.42;
    const minSpeed = mobile ? 620 : 780;
    const maxSpeed = mobile ? 1120 : 1520;
    const pxPerSecond = Math.max(minSpeed, Math.min(maxSpeed, viewport * rate));
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const currentY = window.scrollY;
    const nextY = Math.min(maxY, currentY + (pxPerSecond * dt / 1000));

    if (nextY > currentY + 0.05) {
      autoJourneyBottomSince = 0;
      window.scrollTo(0, nextY);
    } else if (currentY >= maxY - 2) {
      // Algumas cenas finais liberam altura somente depois de o vídeo terminar.
      // Não encerramos o passeio enquanto o epílogo ainda estiver bloqueado.
      if (!autoJourneyFinalReady()) {
        autoJourneyBottomSince = 0;
      } else {
        if (!autoJourneyBottomSince) autoJourneyBottomSince = timestamp;
        if (timestamp - autoJourneyBottomSince > 700) {
          stopAutoJourney();
          return;
        }
      }
    }
  }

  autoJourneyRaf = requestAnimationFrame(autoJourneyFrame);
}

function startAutoJourney() {
  if (reducedMotion) return;

  autoJourneySession = true;
  autoJourneyActive = true;
  autoJourneyLastTs = 0;
  autoJourneyBottomSince = 0;
  if (autoJourneyRaf) cancelAnimationFrame(autoJourneyRaf);
  setAutoJourneyDocumentState();
  syncAutoJourneyControl();
  autoJourneyRaf = requestAnimationFrame(autoJourneyFrame);
}

function cancelAutoJourneyFromUser(event) {
  if (!autoJourneyActive) return;
  // O próprio botão play/pause não conta como intenção de navegação manual.
  if (event?.target?.closest?.('[data-auto-journey-control]')) return;
  // Não tratamos eventos sintetizados pelo código como intenção manual.
  if (event && event.isTrusted === false) return;
  pauseAutoJourney();
}

window.addEventListener('wheel', cancelAutoJourneyFromUser, { passive: true, capture: true });
window.addEventListener('touchstart', cancelAutoJourneyFromUser, { passive: true, capture: true });
window.addEventListener('pointerdown', cancelAutoJourneyFromUser, { passive: true, capture: true });
window.addEventListener('keydown', (event) => {
  if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'].includes(event.key)) return;
  cancelAutoJourneyFromUser(event);
}, { capture: true });

autoJourneyControl?.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (autoJourneyActive) pauseAutoJourney();
  else startAutoJourney();
});

function beginLoveTransition(origin = startButton, options = {}) {
  if (transitionRunning || !chapterOne) return;
  const autoJourney = Boolean(options.autoJourney);
  transitionRunning = true;

  if (reducedMotion || !heartPortal) {
    jumpToChapterOne();
    chapterOne.classList.add('is-entered');
    transitionRunning = false;
    syncAutoJourneyControl();
    if (autoJourney) startAutoJourney();
    return;
  }

  const rect = origin?.getBoundingClientRect?.() || {
    left: window.innerWidth / 2,
    top: window.innerHeight / 2,
    width: 0,
    height: 0,
  };

  heartPortal.style.setProperty('--portal-x', `${rect.left + rect.width / 2}px`);
  heartPortal.style.setProperty('--portal-y', `${rect.top + rect.height / 2}px`);

  document.body.classList.add('is-transitioning');
  hero.classList.add('hero--starting');
  heartPortal.classList.remove('is-settled');
  heartPortal.classList.add('is-active');

  // The heart finishes covering the viewport first. Only then do we move to Ato I.
  // Because Ato I uses the exact same color, there is no visible cut between screens.
  window.setTimeout(() => {
    heartPortal.classList.add('is-settled');
    jumpToChapterOne();
    chapterOne.classList.add('is-entered');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heartPortal.classList.remove('is-active', 'is-settled');
        hero.classList.remove('hero--starting');
        document.body.classList.remove('is-transitioning');
        transitionRunning = false;
        syncAutoJourneyControl();
        if (autoJourney) startAutoJourney();
      });
    });
  }, 980);
}

// Clique = experiência guiada. Scroll/swipe/teclado da Home continuam chamando
// beginLoveTransition sem a flag e, portanto, permanecem totalmente manuais.
startButton?.addEventListener('click', () => beginLoveTransition(startButton, { autoJourney: true }));

function heroGatewayActive() {
  if (transitionRunning || !introArmed) return false;
  return window.scrollY <= Math.max(8, window.innerHeight * 0.02);
}

function rearmIntroIfBackAtStart() {
  if (transitionRunning || introArmed) return;
  if (window.scrollY > 1) return;
  stopAutoJourney();

  // Returning all the way to the home screen re-arms the exact same portal.
  // This keeps the second trip identical to the first instead of exposing the section seam.
  introArmed = true;
  chapterOne?.classList.remove('is-entered');
  hero?.classList.remove('hero--starting');
  heartPortal?.classList.remove('is-active', 'is-settled', 'is-revealing');
  document.body.classList.remove('is-transitioning');
  setIntroLock(true);
  syncAutoJourneyControl();
  if (window.scrollY !== 0) window.scrollTo(0, 0);
}

function accumulateWheelToPortal(event) {
  if (!heroGatewayActive() || event.deltaY <= 0) return;
  if (event.target.closest?.('[data-memory-heart]')) return;
  event.preventDefault();
  wheelIntent = 0;
  beginLoveTransition(startButton);
}

// Scroll down from the first screen anywhere and the heart takeover happens,
// avoiding the hard seam between hero and Ato I.
window.addEventListener('wheel', accumulateWheelToPortal, { passive: false });

let touchStartY = null;
window.addEventListener('touchstart', (event) => {
  if (!heroGatewayActive()) return;
  if (event.target.closest?.('[data-memory-heart], [data-start], [data-auto-journey-control]')) return;
  touchStartY = event.touches?.[0]?.clientY ?? null;
}, { passive: true });

window.addEventListener('touchend', (event) => {
  if (touchStartY == null || !heroGatewayActive()) return;
  const endY = event.changedTouches?.[0]?.clientY ?? touchStartY;
  const distance = touchStartY - endY;
  touchStartY = null;
  if (distance > 54) beginLoveTransition(startButton);
}, { passive: true });

window.addEventListener('keydown', (event) => {
  if (!heroGatewayActive()) return;
  if (!['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(event.key)) return;
  event.preventDefault();
  beginLoveTransition(startButton);
});

// While the intro is active, keep the viewport pinned so scrolling never reveals the next section early.
window.addEventListener('scroll', () => {
  rearmIntroIfBackAtStart();
  if (!document.body.classList.contains('is-intro-locked')) return;
  if (transitionRunning) return;
  if (window.scrollY !== 0) {
    window.scrollTo(0, 0);
  }
}, { passive: true });

// Gentle cursor parallax, intentionally subtle so the page stays delicate.
if (!reducedMotion) {
  hero?.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;

    parallaxNodes.forEach((node) => {
      const strength = Number(node.dataset.parallax || 0.1);
      node.style.setProperty('--px', `${nx * strength * 70}px`);
      node.style.setProperty('--py', `${ny * strength * 55}px`);
    });

    memoryHeartNodes.forEach((node) => {
      const depth = Number(node.dataset.depth || 1);
      node.style.setProperty('--heart-px', `${nx * depth * 16}px`);
      node.style.setProperty('--heart-py', `${ny * depth * 12}px`);
      node.style.setProperty('--heart-rx', `${-ny * depth * 3.5}deg`);
      node.style.setProperty('--heart-ry', `${nx * depth * 4.5}deg`);
    });

    document.documentElement.style.setProperty('--mouse-x', `${nx}`);
    document.documentElement.style.setProperty('--mouse-y', `${ny}`);
  });

  hero?.addEventListener('pointerleave', () => {
    memoryHeartNodes.forEach((node) => {
      node.style.setProperty('--heart-px', '0px');
      node.style.setProperty('--heart-py', '0px');
      node.style.setProperty('--heart-rx', '0deg');
      node.style.setProperty('--heart-ry', '0deg');
    });
  });
}

// Resn-inspired interactive field: drifting ink lines, cursor ripples and a soft particle trail.
const loveCanvas = document.querySelector('[data-love-canvas]');
const cursorAura = document.querySelector('[data-cursor-aura]');

if (loveCanvas && !reducedMotion) {
  const ctx = loveCanvas.getContext('2d', { alpha: true });
  const pointer = { x: innerWidth * .5, y: innerHeight * .5, active: false, down: false };
  const ripples = [];
  const motes = [];
  let dpr = 1;
  let cw = 1;
  let ch = 1;
  let lastTrail = 0;

  const resizeCanvas = () => {
    const rect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, visualDprCap());
    cw = Math.max(1, rect.width);
    ch = Math.max(1, rect.height);
    loveCanvas.width = Math.round(cw * dpr);
    loveCanvas.height = Math.round(ch * dpr);
    loveCanvas.style.width = `${cw}px`;
    loveCanvas.style.height = `${ch}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const addRipple = (x, y, power = 1) => {
    ripples.push({ x, y, r: 4, a: .24 * power, speed: 1.8 + power * 1.5 });
    if (ripples.length > 12) ripples.shift();
  };

  const addMote = (x, y, vx = 0, vy = 0) => {
    motes.push({
      x, y,
      vx: vx + (Math.random() - .5) * .55,
      vy: vy + (Math.random() - .5) * .55 - .18,
      life: 1,
      size: 1.2 + Math.random() * 2.4,
      spin: (Math.random() - .5) * .08,
      angle: Math.random() * Math.PI * 2,
    });
    if (motes.length > 70) motes.splice(0, motes.length - 70);
  };

  const drawTinyHeart = (x, y, size, angle, alpha) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(size / 18, size / 18);
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.bezierCurveTo(-10, -3, -9, -12, 0, -7);
    ctx.bezierCurveTo(9, -12, 10, -3, 0, 5);
    ctx.strokeStyle = `rgba(206,68,85,${alpha})`;
    ctx.lineWidth = 1.35;
    ctx.stroke();
    ctx.restore();
  };

  const draw = (t) => {
    ctx.clearRect(0, 0, cw, ch);

    // Slow, elastic ink threads. They bend toward the pointer instead of behaving like a static background.
    for (let i = 0; i < 3; i += 1) {
      const phase = t * .00023 + i * 2.1;
      const baseY = ch * (.22 + i * .27);
      const pullX = pointer.active ? (pointer.x - cw * .5) * (.035 + i * .008) : 0;
      const pullY = pointer.active ? (pointer.y - ch * .5) * (.025 + i * .006) : 0;
      ctx.beginPath();
      ctx.moveTo(-60, baseY + Math.sin(phase) * 17);
      ctx.bezierCurveTo(
        cw * .26 + Math.sin(phase * 1.2) * 70,
        baseY - 42 + pullY,
        cw * .72 + pullX,
        baseY + 54 - pullY,
        cw + 60,
        baseY + Math.cos(phase * .9) * 19,
      );
      ctx.strokeStyle = `rgba(202,55,72,${.033 + i * .012})`;
      ctx.lineWidth = 1.1 + i * .35;
      ctx.stroke();
    }

    for (let i = ripples.length - 1; i >= 0; i -= 1) {
      const r = ripples[i];
      r.r += r.speed;
      r.a *= .972;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(206,68,85,${r.a})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      if (r.a < .008) ripples.splice(i, 1);
    }

    for (let i = motes.length - 1; i >= 0; i -= 1) {
      const m = motes[i];
      m.x += m.vx;
      m.y += m.vy;
      m.vx *= .985;
      m.vy *= .985;
      m.life *= .982;
      m.angle += m.spin;
      drawTinyHeart(m.x, m.y, m.size * 4.5, m.angle, Math.max(0, m.life * .32));
      if (m.life < .04) motes.splice(i, 1);
    }

  };

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const dx = px - pointer.x;
    const dy = py - pointer.y;
    pointer.x = px;
    pointer.y = py;
    pointer.active = true;

    if (cursorAura && event.pointerType !== 'touch') {
      cursorAura.classList.add('is-visible');
      cursorAura.style.setProperty('--cursor-x', `${event.clientX}px`);
      cursorAura.style.setProperty('--cursor-y', `${event.clientY}px`);
    }

    const now = performance.now();
    if (now - lastTrail > 34 && Math.abs(dx) + Math.abs(dy) > 4) {
      addMote(px, py, dx * .02, dy * .02);
      lastTrail = now;
    }
  });

  hero.addEventListener('pointerdown', (event) => {
    const rect = hero.getBoundingClientRect();
    pointer.down = true;
    addRipple(event.clientX - rect.left, event.clientY - rect.top, 1.25);
    for (let i = 0; i < 5; i += 1) addMote(event.clientX - rect.left, event.clientY - rect.top);
    cursorAura?.classList.add('is-down');
  });

  const releasePointer = () => {
    pointer.down = false;
    cursorAura?.classList.remove('is-down');
  };

  hero.addEventListener('pointerup', releasePointer);
  hero.addEventListener('pointercancel', releasePointer);
  hero.addEventListener('pointerleave', () => {
    pointer.active = false;
    cursorAura?.classList.remove('is-visible', 'is-down');
  });

  resizeCanvas();
  createViewportFrameDriver(resizeCanvas);
  createVisibleAnimationLoop(hero, draw, '20% 0px');
}


// ---------------------------------------------------------
// ATO I — 19/10/2024: a festa, a chuva e o primeiro beijo.
// The entire scene is one sticky canvas controlled by scroll.
// ---------------------------------------------------------
const encounterStage = document.querySelector('[data-encounter-stage]');
const sceneDate = document.querySelector('[data-scene-date]');
const sceneDateLine = document.querySelector('[data-scene-date-line]');
const poseTogether = document.querySelector('[data-pose="together"]');
const poseQuestion = document.querySelector('[data-pose="question"]');
const poseKiss = document.querySelector('[data-pose="kiss"]');
const poseCuddle = document.querySelector('[data-pose="cuddle"]');
const copyBad = document.querySelector('[data-scene-copy="bad"]');
const copySaved = document.querySelector('[data-scene-copy="saved"]');
const copyFinal = document.querySelector('[data-scene-copy="final"]');

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const range = (progress, start, end) => clamp01((progress - start) / (end - start));
const bell = (progress, start, peak, end) => {
  if (progress <= start || progress >= end) return 0;
  if (progress <= peak) return range(progress, start, peak);
  return 1 - range(progress, peak, end);
};

let encounterProgress = 0;
function renderEncounter() {
  if (!chapterOne || !encounterStage) return;

  const start = chapterOne.offsetTop;
  // Usa a altura real do sticky, não window.innerHeight.
  // Isso mantém PC e mobile na mesma geometria mesmo com barras do navegador.
  const stickyHeight = Math.max(1, encounterStage.clientHeight || window.innerHeight);
  const travel = Math.max(1, chapterOne.offsetHeight - stickyHeight);
  const nextProgress = clamp01((window.scrollY - start) / travel);

  // Depois que o Ato I ficou totalmente para trás (ou ainda nem começou),
  // não reescrevemos dezenas de CSS variables a cada scroll do restante do site.
  if ((nextProgress === 0 || nextProgress === 1) && Math.abs(nextProgress - encounterProgress) < 0.0001) return;

  encounterProgress = nextProgress;
  encounterStage.style.setProperty('--encounter-progress', encounterProgress.toFixed(4));

  // The paper-cutout poses switch abruptly, like cartoon frames.
  // Final frame is the cuddle image the user selected.
  const posePhase = encounterProgress < .30
    ? 'together'
    : encounterProgress < .58
      ? 'question'
      : encounterProgress < .84
        ? 'kiss'
        : 'cuddle';

  poseTogether?.style.setProperty('--pose-opacity', posePhase === 'together' ? '1' : '0');
  poseTogether?.style.setProperty('--pose-x', '0vw');
  poseTogether?.style.setProperty('--pose-y', '0vh');
  poseTogether?.style.setProperty('--pose-scale', '1');
  poseTogether?.style.setProperty('--pose-blur', '0px');

  poseQuestion?.style.setProperty('--pose-opacity', posePhase === 'question' ? '1' : '0');
  poseQuestion?.style.setProperty('--pose-x', '.4vw');
  poseQuestion?.style.setProperty('--pose-y', '0vh');
  poseQuestion?.style.setProperty('--pose-scale', '1');
  poseQuestion?.style.setProperty('--pose-blur', '0px');

  poseKiss?.style.setProperty('--pose-opacity', posePhase === 'kiss' ? '1' : '0');
  poseKiss?.style.setProperty('--pose-x', '.2vw');
  poseKiss?.style.setProperty('--pose-y', '0vh');
  poseKiss?.style.setProperty('--pose-scale', '1');
  poseKiss?.style.setProperty('--pose-blur', '0px');

  poseCuddle?.style.setProperty('--pose-opacity', posePhase === 'cuddle' ? '1' : '0');
  poseCuddle?.style.setProperty('--pose-x', '0vw');
  poseCuddle?.style.setProperty('--pose-y', '0vh');
  poseCuddle?.style.setProperty('--pose-scale', '1');
  poseCuddle?.style.setProperty('--pose-blur', '0px');

  // Story text should progress without disappearing.
  const dateReveal = 1;
  const dateWrite = range(encounterProgress, .02, .16);
  sceneDate?.style.setProperty('--scene-opacity', `${dateReveal}`);
  sceneDate?.style.setProperty('--scene-y', `${range(encounterProgress, .18, .36) * -10}px`);
  sceneDateLine?.style.setProperty('--date-write', `${dateWrite.toFixed(3)}`);

  const badReveal = range(encounterProgress, .06, .16);
  copyBad?.style.setProperty('--scene-opacity', `${badReveal}`);
  copyBad?.style.setProperty('--scene-y', `${(1 - badReveal) * 20}px`);

  const savedReveal = range(encounterProgress, .32, .46);
  copySaved?.style.setProperty('--scene-opacity', `${savedReveal}`);
  copySaved?.style.setProperty('--scene-y', `${(1 - savedReveal) * 20}px`);

  const finalIn = range(encounterProgress, .62, .78);
  copyFinal?.style.setProperty('--scene-opacity', `${finalIn}`);
  copyFinal?.style.setProperty('--scene-y', `${(1 - finalIn) * 24}px`);

  // The memory gets warmer as Juliana "saves" the night.
  const warmth = range(encounterProgress, .18, .70);
  encounterStage.style.setProperty('--scene-warmth', warmth.toFixed(3));
  encounterStage.style.setProperty('--party-energy', range(encounterProgress, .04, .82).toFixed(3));
  encounterStage.style.setProperty('--rain-force', `${(.66 + encounterProgress * .34).toFixed(3)}`);
  // Restore the previous heart behavior: it grows steadily and stays formed on screen.
  const kissHeart = range(encounterProgress, .66, .91);
  encounterStage.style.setProperty('--kiss-heart-opacity', kissHeart.toFixed(3));
  encounterStage.style.setProperty('--kiss-heart-scale', `${(.05 + kissHeart * 1.58).toFixed(3)}`);

  encounterStage.style.setProperty('--hint-opacity', `${(1 - range(encounterProgress, 0, .14)).toFixed(3)}`);
}

const encounterScrollDriver = createScrollFrameDriver(renderEncounter, {
  root: chapterOne,
  rootMargin: '110% 0px',
});
createViewportFrameDriver(encounterScrollDriver.schedule);
encounterScrollDriver.schedule();

// Two rain planes create depth: small/slower rain behind the characters,
// long/bright drops in front. No external animation dependency is needed.
function createRain(canvas, options = {}) {
  if (!canvas || reducedMotion) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  const drops = [];
  const config = {
    density: options.density ?? 115,
    minSpeed: options.minSpeed ?? 9,
    maxSpeed: options.maxSpeed ?? 18,
    minLen: options.minLen ?? 8,
    maxLen: options.maxLen ?? 25,
    alpha: options.alpha ?? .28,
    width: options.width ?? 1,
    wind: options.wind ?? -1.6,
  };
  let width = 1;
  let height = 1;
  let dpr = 1;

  const seedDrop = (drop, randomY = true) => {
    drop.x = Math.random() * width * 1.15 - width * .06;
    drop.y = randomY ? Math.random() * height : -40 - Math.random() * 120;
    drop.speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);
    drop.len = config.minLen + Math.random() * (config.maxLen - config.minLen);
    drop.alpha = config.alpha * (.45 + Math.random() * .7);
    drop.offset = Math.random() * 6.28;
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, visualDprCap());
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.max(45, Math.round(config.density * (width / 1440)));
    while (drops.length < target) {
      const drop = {};
      seedDrop(drop, true);
      drops.push(drop);
    }
    drops.length = target;
  };

  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);
    const force = .78 + encounterProgress * .42;
    ctx.lineCap = 'round';
    for (const drop of drops) {
      drop.y += drop.speed * force;
      drop.x += config.wind * force;
      if (drop.y > height + 60 || drop.x < -100) seedDrop(drop, false);
      const shimmer = .84 + Math.sin(time * .003 + drop.offset) * .16;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x + config.wind * 1.8, drop.y + drop.len * force);
      ctx.strokeStyle = `rgba(255,239,238,${drop.alpha * shimmer})`;
      ctx.lineWidth = config.width;
      ctx.stroke();
    }
  };

  resize();
  createViewportFrameDriver(resize);
  createVisibleAnimationLoop(canvas, draw, '45% 0px');
}

createRain(document.querySelector('[data-rain-back]'), {
  density: 120, minSpeed: 6, maxSpeed: 12, minLen: 7, maxLen: 18, alpha: .19, width: .85, wind: -1.1,
});
createRain(document.querySelector('[data-rain-front]'), {
  density: 88, minSpeed: 12, maxSpeed: 22, minLen: 16, maxLen: 34, alpha: .38, width: 1.15, wind: -2.1,
});



// ---------------------------------------------------------
// TRANSIÇÃO ATO I -> SITE UNIFICADO V3.2 — SEM SALTO DE PÁGINA.
// A viewport fica visualmente PARADA o tempo inteiro:
// 1) no exato instante em que o sticky do Ato I terminaria, congelamos
//    uma cópia pixel-a-pixel da tela aprovada;
// 2) o documento continua rolando por baixo, invisível;
// 3) a cópia é rasgada e revela uma cópia EXATA do primeiro frame da rotina V3.2;
// 4) só soltamos o overlay quando a rotina V3.2 real está exatamente no topo.
// ---------------------------------------------------------
const chapterTear = document.querySelector('#transicao-ato-2');
const tearStage = document.querySelector('[data-tear-stage]');
const tearPage = document.querySelector('[data-tear-page]');
const tearSnapshotSlot = document.querySelector('[data-tear-snapshot]');
const tearNextSlot = document.querySelector('[data-tear-next]');
const tearEdge = document.querySelector('[data-tear-edge]');
const unifiedStory = document.querySelector('[data-story]');
const unifiedFirstScene = unifiedStory?.querySelector('.chat-scene');
let tearSnapshotBuilt = false;
let tearNextBuilt = false;
let tearVisualMode = null;
let tearTransitionViewport = 0;
let tearViewportWidth = Math.round(window.innerWidth || document.documentElement.clientWidth || 0);

function liveMobileViewportHeight() {
  const visual = window.visualViewport?.height;
  return Math.max(1, Math.round((Number.isFinite(visual) && visual > 0 ? visual : window.innerHeight) || tearStage?.clientHeight || 1));
}

// O overlay não participa do fluxo da página. Isso é o que impede a tela
// de "subir" entre o fim do Ato I e o começo da transição.
if (tearStage && tearStage.parentElement !== document.body) {
  document.body.appendChild(tearStage);
}

function cloneStageWithCanvasPixels(source, extraClass) {
  if (!source) return null;
  const clone = source.cloneNode(true);
  clone.classList.add(extraClass);

  const sourceCanvases = [...source.querySelectorAll('canvas')];
  const cloneCanvases = [...clone.querySelectorAll('canvas')];
  cloneCanvases.forEach((targetCanvas, index) => {
    const sourceCanvas = sourceCanvases[index];
    if (!sourceCanvas) return;
    try {
      targetCanvas.width = sourceCanvas.width;
      targetCanvas.height = sourceCanvas.height;
      const targetContext = targetCanvas.getContext('2d');
      targetContext?.drawImage(sourceCanvas, 0, 0);
    } catch {}
  });

  return clone;
}

function buildTearSnapshot() {
  if (tearSnapshotBuilt || !tearSnapshotSlot || !encounterStage) return;

  // Neste ponto o Ato I já chegou ao progresso 1. Não mudamos nenhuma
  // animação aprovada: apenas fotografamos visualmente o frame final.
  renderEncounter();
  const clone = cloneStageWithCanvasPixels(encounterStage, 'tear-snapshot-stage');
  if (!clone) return;
  clone.removeAttribute('data-encounter-stage');
  tearSnapshotSlot.replaceChildren(clone);
  tearSnapshotBuilt = true;
}

function buildTearNextPage() {
  if (tearNextBuilt || !tearNextSlot || !unifiedFirstScene) return;

  // O rasgo revela o PRIMEIRO FRAME REAL da rotina aprovada (V3.2).
  // Clonamos a cena já renderizada pelo runtime em progresso 0, então o
  // último pixel da transição coincide com o primeiro pixel da seção real.
  const clone = cloneStageWithCanvasPixels(unifiedFirstScene, 'tear-next-stage-clone');
  if (!clone) return;

  const unifiedStyle = getComputedStyle(unifiedStory);
  ['--paper', '--ink', '--sage', '--header-h', '--composer-h', '--chat-dim', '--composer-dim'].forEach((name) => {
    const value = unifiedStyle.getPropertyValue(name);
    if (value) tearNextSlot.style.setProperty(name, value);
  });

  clone.removeAttribute('data-scene');
  clone.setAttribute('aria-hidden', 'true');
  tearNextSlot.replaceChildren(clone);
  tearNextBuilt = true;
}

function resetTearVisual() {
  if (!tearStage) return;
  tearStage.style.setProperty('--tear-y', '103%');
  tearStage.style.setProperty('--tear-lift', '0vh');
  tearStage.style.setProperty('--tear-tilt', '0deg');
  tearStage.style.setProperty('--tear-progress', '0');
  tearStage.style.setProperty('--tear-edge-opacity', '0');
}

function renderTear() {
  if (!chapterTear || !tearStage || !tearPage || !unifiedStory) return;

  // No Chrome/Android a barra do navegador muda a altura visual durante o
  // próprio gesto de scroll. Se recalcularmos a geometria nesse momento, o
  // rasgo volta alguns frames e parece que a mesma página sobe várias vezes.
  // Usamos a altura visual ATUAL para detectar a entrada e, assim que a
  // transição começa, congelamos essa referência até o handoff terminar.
  const liveViewport = liveMobileViewportHeight();
  const wasActive = tearVisualMode === 'active';
  let transitionViewport = wasActive && tearTransitionViewport
    ? tearTransitionViewport
    : liveViewport;
  let freezeStart = chapterTear.offsetTop - transitionViewport;
  const handoff = unifiedStory.offsetTop;
  let active = window.scrollY >= freezeStart && window.scrollY < handoff;

  if (active && !wasActive) {
    tearTransitionViewport = liveViewport;
    transitionViewport = tearTransitionViewport;
    freezeStart = chapterTear.offsetTop - transitionViewport;
    active = window.scrollY >= freezeStart && window.scrollY < handoff;
  }

  const span = Math.max(1, handoff - freezeStart);
  const raw = clamp01((window.scrollY - freezeStart) / span);

  if (!active) {
    const mode = window.scrollY < freezeStart ? 'before' : 'after';
    if (tearVisualMode === mode) return;
    tearVisualMode = mode;
    tearTransitionViewport = 0;
    tearStage.classList.remove('is-active');
    if (mode === 'before') resetTearVisual();
    return;
  }

  tearVisualMode = 'active';
  buildTearSnapshot();
  buildTearNextPage();
  tearStage.classList.add('is-active');

  // Começa totalmente igual ao último frame do Ato I. Depois a borda rasgada
  // sobe pela tela; no fim, seguramos o primeiro frame da rotina V3.2 até o DOM real
  // chegar exatamente à mesma posição.
  const tear = range(raw, .02, .91);
  const eased = tear * tear * (3 - 2 * tear);
  const tearY = 103 - eased * 121;
  const lift = -eased * 3.2;
  const tilt = -eased * .38;
  const edgeOpacity = tear <= .01 || tear >= .995 ? 0 : 1;

  tearStage.style.setProperty('--tear-y', `${tearY.toFixed(3)}%`);
  tearStage.style.setProperty('--tear-lift', `${lift.toFixed(3)}vh`);
  tearStage.style.setProperty('--tear-tilt', `${tilt.toFixed(3)}deg`);
  tearStage.style.setProperty('--tear-progress', eased.toFixed(4));
  tearStage.style.setProperty('--tear-edge-opacity', `${edgeOpacity}`);

  if (tearEdge) tearEdge.style.opacity = `${edgeOpacity}`;
}

const tearScrollDriver = createScrollFrameDriver(renderTear, {
  root: chapterTear || unifiedStory,
  rootMargin: '110% 0px',
});

createViewportFrameDriver(() => {
  const nextWidth = Math.round(window.innerWidth || document.documentElement.clientWidth || 0);
  const widthChanged = Math.abs(nextWidth - tearViewportWidth) > 24;
  tearViewportWidth = nextWidth;

  // Android dispara resize quando a barra do navegador recolhe/volta. Isso
  // NÃO é uma mudança real de layout e não pode desmontar/recriar os clones
  // no meio do rasgo. Em mobile, só reconstruímos se a largura realmente
  // mudou (rotação, resize de janela, etc.).
  if (window.innerWidth <= 860 && !widthChanged) {
    tearScrollDriver.schedule();
    return;
  }

  tearSnapshotBuilt = false;
  tearNextBuilt = false;
  tearVisualMode = null;
  tearTransitionViewport = 0;
  tearSnapshotSlot?.replaceChildren();
  tearNextSlot?.replaceChildren();
  resetTearVisual();
  tearScrollDriver.schedule();
});
resetTearVisual();
tearScrollDriver.schedule();

// Draggable heart memories. They remain where the user leaves them, with a tiny inertial settle.
const heartNodes = memoryHeartNodes;
const heartResizeHandlers = [];

heartNodes.forEach((node) => {
  const xPct = Number(node.dataset.x);
  const yPct = Number(node.dataset.y);
  const initialRotate = Number(node.dataset.rotate);
  let x = 0;
  let y = 0;
  let vx = 0;
  let vy = 0;
  let dragging = false;
  let pointerId = null;
  let startPointerX = 0;
  let startPointerY = 0;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let lastT = 0;
  let raf = null;

  const placeAtAnchor = () => {
    const rect = hero.getBoundingClientRect();
    node.style.left = `${(xPct / 100) * rect.width}px`;
    node.style.top = `${(yPct / 100) * rect.height}px`;
  };

  const render = () => {
    const speedTilt = Math.max(-9, Math.min(9, vx * 0.04));
    node.style.setProperty('--drag-x', `${x}px`);
    node.style.setProperty('--drag-y', `${y}px`);
    node.style.setProperty('--drag-rotate', `${initialRotate + speedTilt}deg`);
  };

  const settle = () => {
    vx *= 0.89;
    vy *= 0.89;
    x += vx;
    y += vy;

    const heroRect = hero.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const left = nodeRect.left + vx;
    const right = nodeRect.right + vx;
    const top = nodeRect.top + vy;
    const bottom = nodeRect.bottom + vy;

    if (left < -nodeRect.width * 0.25 || right > heroRect.right + nodeRect.width * 0.25) vx *= -0.5;
    if (top < heroRect.top - nodeRect.height * 0.25 || bottom > heroRect.bottom + nodeRect.height * 0.25) vy *= -0.5;

    render();
    if (Math.abs(vx) + Math.abs(vy) > 0.18) raf = requestAnimationFrame(settle);
    else raf = null;
  };

  const beginDrag = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    dragging = true;
    pointerId = event.pointerId;
    node.classList.add('is-dragging');
    node.setPointerCapture?.(pointerId);
    startPointerX = event.clientX;
    startPointerY = event.clientY;
    startX = x;
    startY = y;
    lastX = event.clientX;
    lastY = event.clientY;
    lastT = performance.now();
  };

  const moveDrag = (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    const now = performance.now();
    const dt = Math.max(8, now - lastT);
    const dx = event.clientX - startPointerX;
    const dy = event.clientY - startPointerY;
    x = startX + dx;
    y = startY + dy;
    vx = ((event.clientX - lastX) / dt) * 16;
    vy = ((event.clientY - lastY) / dt) * 16;
    lastX = event.clientX;
    lastY = event.clientY;
    lastT = now;
    render();
  };

  const endDrag = (event) => {
    if (!dragging || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
    dragging = false;
    node.classList.remove('is-dragging');
    try { node.releasePointerCapture?.(pointerId); } catch {}
    pointerId = null;
    if (!reducedMotion) raf = requestAnimationFrame(settle);
  };

  node.addEventListener('pointerdown', beginDrag);
  node.addEventListener('pointermove', moveDrag);
  node.addEventListener('pointerup', endDrag);
  node.addEventListener('pointercancel', endDrag);
  node.addEventListener('lostpointercapture', endDrag);

  node.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 24 : 10;
    if (event.key === 'ArrowLeft') x -= step;
    else if (event.key === 'ArrowRight') x += step;
    else if (event.key === 'ArrowUp') y -= step;
    else if (event.key === 'ArrowDown') y += step;
    else return;
    event.preventDefault();
    render();
  });

  placeAtAnchor();
  heartResizeHandlers.push(placeAtAnchor);
});

createViewportFrameDriver(() => heartResizeHandlers.forEach((place) => place()));
