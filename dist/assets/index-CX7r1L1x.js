(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function r(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(s){if(s.ep)return;s.ep=!0;const n=r(s);fetch(s.href,n)}})();const _s="modulepreload",Es=function(e){return"/"+e},ka={},Ss=function(a,r,t){let s=Promise.resolve();if(r&&r.length>0){let f=function(p){return Promise.all(p.map(l=>Promise.resolve(l).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};var i=f;document.getElementsByTagName("link");const u=document.querySelector("meta[property=csp-nonce]"),c=u?.nonce||u?.getAttribute("nonce");s=f(r.map(p=>{if(p=Es(p),p in ka)return;ka[p]=!0;const l=p.endsWith(".css"),d=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${d}`))return;const b=document.createElement("link");if(b.rel=l?"stylesheet":_s,l||(b.as="script"),b.crossOrigin="",b.href=p,c&&b.setAttribute("nonce",c),document.head.appendChild(b),l)return new Promise((g,m)=>{b.addEventListener("load",g),b.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${p}`)))})}))}function n(u){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=u,window.dispatchEvent(c),!c.defaultPrevented)throw u}return s.then(u=>{for(const c of u||[])c.status==="rejected"&&n(c.reason);return a().catch(n)})},gt=new Set;let Ue=0,Vt=!1;function Ya(){Ue&&(cancelAnimationFrame(Ue),Ue=0)}function ks(){Ue=0,!document.hidden&&gt.forEach(e=>{if(!(e.destroyed||!e.nearViewport||!e.pending)){e.pending=!1;try{e.render()}catch(a){console.error("[scroll-runtime] Falha ao renderizar cena:",a)}}})}function ea(){document.hidden||Ue||(Ue=requestAnimationFrame(ks))}function ca(){if(document.hidden)return;let e=!1;gt.forEach(a=>{a.destroyed||!a.nearViewport||(a.pending=!0,e=!0)}),e&&ea()}function Ba(){if(document.hidden){Ya(),Ee&&cancelAnimationFrame(Ee),Ee=0;return}ca(),[...Ke].some(e=>e.pending&&!e.destroyed)&&da()}function Ls(){Vt||(Vt=!0,window.addEventListener("scroll",ca,{passive:!0}),document.addEventListener("visibilitychange",Ba))}function $s(){!Vt||gt.size||(Vt=!1,Ya(),window.removeEventListener("scroll",ca),document.removeEventListener("visibilitychange",Ba))}function Se(e,a={}){if(typeof e!="function")throw new TypeError("render precisa ser uma função");const r=a.root||null,t=a.rootMargin||"125% 0px",s={render:e,pending:!1,destroyed:!1,nearViewport:!r||!("IntersectionObserver"in window),observer:null};gt.add(s),Ls(),r&&"IntersectionObserver"in window&&(s.observer=new IntersectionObserver(u=>{const c=u[0];s.nearViewport=!!c?.isIntersecting,s.nearViewport?(s.pending=!0,ea()):s.pending=!1},{root:null,rootMargin:t,threshold:0}),s.observer.observe(r));function n(){s.destroyed||document.hidden||!s.nearViewport||(s.pending=!0,ea())}function i(){s.destroyed||document.hidden||(s.pending=!1,e())}return s.nearViewport&&n(),{schedule:n,flush:i,destroy(){s.destroyed||(s.destroyed=!0,s.pending=!1,s.observer?.disconnect(),s.observer=null,gt.delete(s),$s())}}}const Ke=new Set;let Ee=0,Nt=!1;function Ps(){Ee=0,!document.hidden&&Ke.forEach(e=>{if(!(e.destroyed||!e.pending)){e.pending=!1;try{e.render()}catch(a){console.error("[viewport-runtime] Falha ao atualizar cena:",a)}}})}function da(){document.hidden||Ee||(Ee=requestAnimationFrame(Ps))}function ja(e="window"){let a=!1;Ke.forEach(r=>{r.destroyed||e==="visual"&&!r.visualViewport||(r.pending=!0,a=!0)}),a&&da()}function Ot(){ja("window")}function Da(){ja("visual")}function Ms(){Nt||(Nt=!0,window.addEventListener("resize",Ot,{passive:!0}),window.addEventListener("orientationchange",Ot,{passive:!0}),window.visualViewport?.addEventListener?.("resize",Da,{passive:!0}))}function As(){!Nt||Ke.size||(Nt=!1,Ee&&cancelAnimationFrame(Ee),Ee=0,window.removeEventListener("resize",Ot),window.removeEventListener("orientationchange",Ot),window.visualViewport?.removeEventListener?.("resize",Da))}function ve(e,a={}){if(typeof e!="function")throw new TypeError("render precisa ser uma função");const r={render:e,visualViewport:!!a.visualViewport,pending:!1,destroyed:!1};Ke.add(r),Ms();function t(){r.destroyed||(r.pending=!0,da())}return{schedule:t,flush(){r.destroyed||(r.pending=!1,e())},destroy(){r.destroyed||(r.destroyed=!0,r.pending=!1,Ke.delete(r),As())}}}function qs(){const e=document.querySelector("[data-story]"),a=document.querySelector("[data-title]"),r=document.querySelector("[data-scene]"),t=document.querySelector("[data-chat-viewport]"),s=[...document.querySelectorAll("[data-event]")],n=[...document.querySelectorAll("[data-transient]")],i=document.querySelector("[data-sound-hint]"),u=[...document.querySelectorAll(".media-card")],c=document.getElementById("title-chime"),f=document.getElementById("background-music"),p=document.querySelector("[data-plus]"),l=document.querySelector("[data-work-gallery]"),d=document.querySelector("[data-gallery-sheet]"),b=document.querySelector("[data-gallery-grid]"),g=document.querySelector("[data-romance-overlay]"),m=document.querySelector("[data-viewer]"),h=document.querySelector("[data-viewer-media]"),E=document.querySelector("[data-viewer-img]"),M=document.querySelector("[data-viewer-fallback]"),T=document.querySelector("[data-viewer-prev]"),B=document.querySelector("[data-viewer-next]"),se=document.querySelector("[data-viewer-back]"),J=document.querySelector("[data-transition-video-stage]"),U=document.querySelector("[data-transition-play]"),_=document.querySelector("[data-transition-video-frame]"),x=document.querySelector("[data-next-scene-root]");if(!e||!t)return;const $=.65,V=.69,P=20,q=["webp","jpeg","jpg","png"],z=window.matchMedia("(max-width: 700px)"),F=(o,v=0,w=1)=>Math.min(w,Math.max(v,o)),oe=o=>o*o*(3-2*o);let ge=0,le=0,ie=0,j=1,ce=Math.max(1,t.clientHeight||window.innerHeight),K=!0,de="",Q=!1,ke=!1,ue=0;const Te=new Set,Ye=.38;let et=!1,Z=0,Le=0,I=!1,ee=!1,tt=0,be=0,$e=!1,at=0,xe=null,pe=!1,bt=!1,xt=!1,te=!1,y=!1,S=window.scrollY,R=!1,N=!1,Ce=0,_t=null,_e=0,Et=null;const St=new Set,kt=new Set,Be=new WeakMap,He=new WeakMap,Pe=[...s,...n].sort((o,v)=>ma(o)-ma(v)),Lt=n.filter(o=>o.classList.contains("message--bridge-typing")).map(o=>Number(o.dataset.end||0)).filter(Boolean).sort((o,v)=>o-v);function ma(o){return o.hasAttribute("data-transient")?Number(o.dataset.start||0):Number(o.dataset.at||0)}function $t(){const o=z.matches;return{viewerOpen:o?.722:.735,viewerSequence:o?.742:.758,videoStage:o?.982:.984,videoPress:o?.993:.994,gridAnchor:o?.704:.708,manualReleasePx:ce*(o?.85:1.25),suppressReleasePx:ce*(o?.7:.95)}}function Pt(o){const{viewerSequence:v,videoStage:w}=$t(),L=F(o,0,P-1),k=(L+.35)/P,C=v+k*(w-v),O=ie+j*C;Le=L,be=O,window.scrollTo({top:O,behavior:"auto"})}function ha(o="smooth"){const{gridAnchor:v}=$t(),w=ie+j*v;ee=!0,tt=w,$e=!0,at=w,l?.classList.remove("is-manual-viewer","is-auto-viewer"),l?.classList.add("is-active","is-grid-ready","is-copy-visible","is-manual-gallery"),l?.setAttribute("aria-hidden","false"),m?.setAttribute("aria-hidden","true"),l?.style.setProperty("--viewer-opacity","0"),l?.style.setProperty("--viewer-scale","0.92"),l?.style.setProperty("--sheet-opacity","1"),l?.style.setProperty("--sheet-scale","1"),je(!0,!1),window.scrollTo({top:w,behavior:o})}function is(o){return`/assets/trabalho/trabalho-${String(o+1).padStart(2,"0")}`}function je(o,v,w=0){if(!l)return;const L=o&&!v,k=o&&v&&Z<10,C=o&&v&&Z>=10,O=z.matches?.012:.016,A=L&&(ee||te||w>=V+O),Y=`${o?1:0}${L?1:0}${A?1:0}${k?1:0}${C?1:0}`;Y!==de&&(de=Y,l.classList.toggle("is-romance-gallery",L),l.classList.toggle("is-romance-gallery-copy-ready",A),l.classList.toggle("is-romance-viewer-a",k),l.classList.toggle("is-romance-viewer-b",C),g?.setAttribute("aria-hidden",o?"false":"true"))}function va(o,v,w){const L=is(v);let k=0;const C=()=>{o.onerror=()=>{k+=1,k<q.length?C():(o.removeAttribute("src"),o.classList.remove("is-loaded"),w?.())},o.onload=()=>o.classList.add("is-loaded"),o.src=`${L}.${q[k]}`};C()}function rs(){if(!(!b||b.children.length))for(let o=0;o<P;o+=1){const v=document.createElement("button");v.type="button",v.className="gallery-thumb",v.dataset.index=String(o),v.setAttribute("aria-label",`Abrir foto ${o+1}`);const w=document.createElement("img");w.alt=`Foto de trabalho ${o+1}`,w.decoding="async",w.loading="lazy",w.fetchPriority="low";const L=document.createElement("span");L.className="gallery-thumb__fallback",L.textContent=String(o+1).padStart(2,"0"),v.append(w,L),b.append(v),va(w,o,()=>v.classList.add("is-fallback")),w.addEventListener("load",()=>v.classList.remove("is-fallback"));let k=0,C=0,O=!1;v.addEventListener("pointerdown",A=>{k=A.clientX,C=A.clientY,O=!1}),v.addEventListener("pointermove",A=>{Math.hypot(A.clientX-k,A.clientY-C)>9&&(O=!0)},{passive:!0}),v.addEventListener("pointercancel",()=>{O=!0}),v.addEventListener("pointerup",A=>{O||Math.hypot(A.clientX-k,A.clientY-C)>9||ms(o)}),v.addEventListener("click",A=>A.preventDefault())}}u.forEach((o,v)=>{const w=o.querySelector("img");if(!w)return;w.decoding="async",v>=5&&(w.fetchPriority="low");const L=()=>o.classList.toggle("is-loaded",w.naturalWidth>0);w.complete&&L(),w.addEventListener("load",L,{once:!0}),w.addEventListener("error",()=>o.classList.remove("is-loaded"),{once:!0})});function ga(){ce=Math.max(1,t.clientHeight||window.innerHeight),ie=e.offsetTop;const o=Math.max(1,r?.clientHeight||window.innerHeight);j=Math.max(1,e.offsetHeight-o),K=!0,Jt(!0)}function ya(){le||(le=requestAnimationFrame(()=>{le=0,ga()}))}function os(o,v){if(o.hasAttribute("data-transient")){const w=Number(o.dataset.start||0),L=Number(o.dataset.end||1);return v>=w&&v<L}return v>=Number(o.dataset.at||0)}function ns(o){let v=!1;return Pe.forEach(w=>{const L=os(w,o);Be.get(w)!==L&&(Be.set(w,L),w.classList.toggle("is-visible",L),v=!0)}),v&&(K=!0),v}function ls(o){const v=He.get(o);if(Number.isFinite(v)&&v>0)return v;const w=o.offsetHeight||0;return w>0&&He.set(o,w),w}function cs(){if(!K)return;const o=z.matches,v=o?30:40,w=o?24:36,L=o?96:118,k=o?12:14,C=ce-8;let O=ce-v;for(let A=Pe.length-1;A>=0;A-=1){const Y=Pe[A];if(!Be.get(Y))continue;const re=ls(Y);O-=re;const fe=O;O-=k;let me=1,We=0;if(fe+re<w)me=0,We=1.2;else if(fe<w){const Ut=F((fe+re-w)/L);me=oe(Ut),We=(1-me)*1.1}Y.style.setProperty("--stack-y",`${fe.toFixed(1)}px`),Y.style.setProperty("--age-opacity",me.toFixed(3)),Y.style.setProperty("--age-blur",`${We.toFixed(2)}px`)}Pe.forEach(A=>{Be.get(A)||(A.style.setProperty("--stack-y",`${C.toFixed(1)}px`),A.style.setProperty("--age-opacity","0"),A.style.setProperty("--age-blur","2px"))}),K=!1}"ResizeObserver"in window&&(_t=new ResizeObserver(o=>{let v=!1;o.forEach(w=>{const k=(Array.isArray(w.borderBoxSize)?w.borderBoxSize[0]:w.borderBoxSize)?.blockSize||w.target.offsetHeight||0;k>0&&He.get(w.target)!==k&&(He.set(w.target,k),v=!0)}),v&&(K=!0,vs())}),Pe.forEach(o=>_t.observe(o)));function st(o){kt.add(F(o,0,P-1)),kt.size>=P&&(y=!0)}function ds(o,v){const w=Math.min(o,v),L=Math.max(o,v);for(let k=w;k<=L;k+=1)st(k)}function Me(o,v=!0){const w=F(o,0,P-1),L=w===Z?0:w>Z?1:-1;Z=w,w>=P-2&&it(),M&&(M.textContent=""),E&&(E.decoding="async",E.fetchPriority="high",E.classList.remove("is-loaded"),va(E,Z,()=>E.classList.remove("is-loaded"))),v&&h&&L!==0&&(h.style.transition="none",h.style.transform=`translate3d(${L*46}px,0,0) scale(.992)`,h.style.opacity=".48",requestAnimationFrame(()=>{h.style.transition="transform .48s cubic-bezier(.16,1,.3,1), opacity .38s ease",h.style.transform="translate3d(0,0,0) scale(1)",h.style.opacity="1"})),m?.getAttribute("aria-hidden")==="false"&&je(!0,!0)}function De(){Ce&&(clearTimeout(Ce),Ce=0)}function it(){bt||(bt=!0,document.dispatchEvent(new CustomEvent("nextscene:prepare",{detail:{mount:x}})))}function ze(o,v=!1,w=!1,L=!1){if(!l||!J)return;const k=!!o,C=k&&!!w,O=C&&!!L;l.classList.toggle("is-video-stage",k),l.classList.toggle("is-video-pressing",k&&!!v),l.classList.toggle("is-video-fullscreen",C),l.classList.toggle("is-next-scene-ready",O),J.setAttribute("aria-hidden",k?"false":"true"),x?.setAttribute("aria-hidden",O?"false":"true"),k&&it()}function us(){De(),N=!0,I=!0,be=window.scrollY,y=!0,te=!0,l?.classList.add("is-active","is-manual-viewer"),l?.classList.remove("is-auto-viewer","is-video-fullscreen","is-video-pressing","is-next-scene-ready"),x?.setAttribute("aria-hidden","true"),l?.setAttribute("aria-hidden","false"),m?.setAttribute("aria-hidden","false"),ze(!0,!1,!1),je(!1,!1)}function ps(){De(),N=!1,ze(!1,!1,!1),te=!1,I=!0,Me(P-1,!1),Pt(P-1),m?.setAttribute("aria-hidden","false"),l?.classList.add("is-active","is-manual-viewer"),je(!0,!0)}function Wt(){if(!J)return;De(),document.dispatchEvent(new CustomEvent("nextscene:transition-start")),N=!1,I=!1,ee=!1,$e=!1,te=!1,it();const{videoPress:o}=$t(),v=ie+j*Math.min(.998,o+.0015);l?.classList.add("is-video-pressing"),Ce=window.setTimeout(()=>{l?.classList.remove("is-video-pressing"),Ce=0},520);try{window.scrollTo({top:v,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}catch{window.scrollTo(0,v)}}function fs(){xt||(xt=!0,it(),document.dispatchEvent(new CustomEvent("nextscene:ready",{detail:{mount:x}})))}function Xt(){if(N){Wt();return}if(Z>=P-1){us();return}I=!0,be=window.scrollY;const o=Z+1;Me(o,!0),st(o),Pt(o)}function Gt(){if(l?.classList.contains("is-next-scene-ready"))return;if(N){ps();return}if(Z<=0)return;I=!0,be=window.scrollY;const o=Z-1;Me(o,!0),st(o),Pt(o)}function ms(o){De(),N=!1,ze(!1,!1,!1),pe=!1,I=!0,l?.classList.add("is-active"),l?.setAttribute("aria-hidden","false"),be=window.scrollY,$e=!1,te=!1,Me(o,!0),st(o),Pt(o),l?.classList.add("is-manual-viewer"),m?.setAttribute("aria-hidden","false"),je(!0,!0)}function wa(){De(),N=!1,ze(!1,!1,!1),I=!1,y&&(te=!0),ha("smooth")}function hs(o){if(!l||!d)return;const{viewerOpen:v,viewerSequence:w,videoStage:L,videoPress:k,manualReleasePx:C,suppressReleasePx:O}=$t();pe&&o<.93&&(pe=!1);const A=o>=V&&!pe,Y=te&&o>=V,re=!pe&&(ee||A||Y);p&&(p.classList.toggle("is-auto-click",A&&!ee),p.classList.toggle("is-manual-click",ee)),l.classList.toggle("is-active",re),l.classList.toggle("is-grid-ready",re),l.classList.toggle("is-copy-visible",re),l.classList.toggle("is-manual-gallery",ee),l.setAttribute("aria-hidden",re?"false":"true");const fe=(ee||te)&&!I,me=fe?0:oe(F((o-v)/.012));l.style.setProperty("--viewer-opacity",me.toFixed(4)),l.style.setProperty("--viewer-scale",(.88+.12*me).toFixed(4)),l.style.setProperty("--sheet-opacity",fe?"1":(1-.94*me).toFixed(4)),l.style.setProperty("--sheet-scale",fe?"1":(1-.035*me).toFixed(4));const We=oe(F((o-V)/.03));e.style.setProperty("--chat-dim",(1-.72*We).toFixed(3)),e.style.setProperty("--composer-dim",(1-.88*We).toFixed(3)),ee&&Math.abs(window.scrollY-tt)>C&&(ee=!1,l.classList.remove("is-manual-gallery")),I&&!N&&Math.abs(window.scrollY-be)>70&&(I=!1,l.classList.remove("is-manual-viewer")),$e&&Math.abs(window.scrollY-at)>O&&($e=!1);const Ut=window.scrollY<S-2;if(te&&Ut&&o>v+.012&&!I&&!R){R=!0,ha("auto"),setTimeout(()=>{R=!1},180),S=window.scrollY;return}const nt=!pe&&o>=v&&!$e&&!te&&!fe;nt&&o>=L-.008&&it();const lt=nt&&o>=L,Kt=lt&&o>=k,Sa=I||nt;if(nt&&st(0),m?.setAttribute("aria-hidden",Sa?"false":"true"),l.classList.toggle("is-auto-viewer",nt&&!I),N||(ze(lt,!1,Kt,Kt),Kt?fs():o<k-.004&&(xt=!1)),!pe&&!I&&!te&&o>=w&&o<L){const bs=F((o-w)/Math.max(1e-4,L-w)),Xe=Math.min(P-1,Math.floor(bs*P));if(Xe!==Le||Z!==Xe){const xs=o>w+.002;ds(Le,Xe),Me(Xe,xs),Le=Xe}Xe===P-1&&(y=!0)}else lt&&Z!==P-1?(Me(P-1,!1),Le=P-1,y=!0):!I&&!te&&o>=v&&o<w&&Z!==0&&(Me(0,!1),Le=0);je(re&&!lt&&!N,Sa&&!lt&&!N,o),S=window.scrollY}function Jt(o=!1){ge=0;const v=(window.scrollY-ie)/j,w=v<=0?"before":v>=1?"after":null;if(!o&&w&&w===Et){S=window.scrollY;return}Et=w;const L=F(v),k=F(L/$);ns(k),cs();const C=oe(F(k/.045)),O=oe(F((k-.022)/.075)),A=1-oe(F((k-.01)/.095));r?.style.setProperty("--entry-chrome",O.toFixed(4)),r?.style.setProperty("--entry-romance",A.toFixed(4));const Y=oe(F((k-.118)/.027));if(a){const re=1-Y,fe=7*(1-C)-18*Y,me=.984+.016*C-.008*Y;a.style.opacity=`${re.toFixed(3)}`,a.style.transform=`translate3d(-50%, ${fe.toFixed(2)}px, 0) scale(${me.toFixed(4)})`,a.style.filter=`blur(${(.8*Y).toFixed(2)}px)`}hs(L),o?_e=k:(_a(k),ws(k))}function vs(){ge||(ge=requestAnimationFrame(()=>Jt()))}function gs(o,v=360,w=!1){if(!f)return;cancelAnimationFrame(ue);const L=f.volume,k=performance.now(),C=F(o,0,1),O=A=>{const Y=F((A-k)/Math.max(1,v)),re=Y*Y*(3-2*Y);if(f.volume=L+(C-L)*re,Y<1){ue=requestAnimationFrame(O);return}ue=0,f.volume=C,w&&C<=.001&&f.pause()};ue=requestAnimationFrame(O)}async function rt({immediate:o=!1}={}){if(!(!f||!Q||!ke)){if(f.muted=!1,f.loop=!0,f.paused){f.volume=0;try{await f.play()}catch{return}}gs(Ye,o?80:520,!1)}}function ot(o){o instanceof HTMLVideoElement&&(o.defaultMuted=!1,o.muted=!1,o.volume=1,o.removeAttribute("muted"))}function ys(o){const v=o.target;v instanceof HTMLVideoElement&&(ot(v),Te.add(v),rt())}function ba(o){const v=o.target;v instanceof HTMLVideoElement&&(Te.delete(v),window.setTimeout(()=>rt(),80))}document.addEventListener("play",ys,!0),document.addEventListener("pause",ba,!0),document.addEventListener("ended",ba,!0),new MutationObserver(o=>{o.forEach(v=>v.addedNodes.forEach(w=>{w instanceof Element&&(w.matches?.("video")&&ot(w),w.querySelectorAll?.("video").forEach(ot))}))}).observe(document.documentElement,{childList:!0,subtree:!0}),document.querySelectorAll("video").forEach(ot);async function Mt(){if(Q){ke=!0,rt();return}let o=!1;if(f)try{f.muted=!1,f.loop=!0,f.volume=0,await f.play(),o=!0}catch{}if(c)try{const v=c.volume;c.muted=!1,c.volume=0,await c.play(),c.pause(),c.currentTime=0,c.volume=v||1,o=!0}catch{}Q=!0,ke=!0,i?.classList.add("is-active"),i?.setAttribute("aria-label","Som ativado"),i?.setAttribute("title","Som ativado"),document.querySelectorAll("video").forEach(ot),o&&rt({immediate:!0}),_a(F((window.scrollY-ie)/j/$))}function xa(){if(!(!c||!Q))try{c.currentTime=0,c.play().catch(()=>{})}catch{}}function _a(o){!Q||et||o>=.06&&(xa(),et=!0)}function ws(o){if(!Q){_e=o;return}Lt.forEach((v,w)=>{St.has(w)||_e<v&&o>=v&&(xa(),St.add(w))}),_e=o}p?.addEventListener("click",()=>{De(),N=!1,ze(!1,!1,!1),pe=!1,ee=!0,tt=window.scrollY,p.classList.add("is-manual-click"),l?.classList.add("is-active","is-grid-ready","is-copy-visible","is-manual-gallery"),l?.setAttribute("aria-hidden","false")}),T?.addEventListener("click",Gt),B?.addEventListener("click",Xt),se?.addEventListener("click",wa),U?.addEventListener("click",o=>{o.stopPropagation(),Wt()}),_?.addEventListener("click",o=>{o.target.closest?.(".transition-play")||Wt()}),m?.addEventListener("touchstart",o=>{xe=o.touches?.[0]?.clientX??null},{passive:!0}),m?.addEventListener("touchend",o=>{if(xe==null)return;const w=(o.changedTouches?.[0]?.clientX??xe)-xe;xe=null,!(Math.abs(w)<38)&&(I=!0,be=window.scrollY,w<0?Xt():Gt())},{passive:!0});function Ea(){if(!d)return;const o=d.scrollTop+d.clientHeight>=d.scrollHeight-3;d.classList.toggle("is-at-bottom",o)}d?.addEventListener("scroll",Ea,{passive:!0}),window.addEventListener("keydown",o=>{Q||Mt(),!l?.classList.contains("is-next-scene-ready")&&m?.getAttribute("aria-hidden")==="false"&&(o.key==="ArrowRight"&&Xt(),o.key==="ArrowLeft"&&Gt(),o.key==="Escape"&&wa())}),i?.addEventListener("click",Mt),window.addEventListener("pointerdown",()=>{Q||Mt()},{once:!0,passive:!0}),window.addEventListener("touchstart",()=>{Q||Mt()},{once:!0,passive:!0}),document.addEventListener("visibilitychange",()=>{f&&(document.hidden?f.pause():Q&&ke&&rt())}),Se(Jt,{root:e,rootMargin:"150% 0px"}),ve(ya,{visualViewport:!0}),z.addEventListener?.("change",ya),rs(),Me(0,!1),Ea(),requestAnimationFrame(()=>requestAnimationFrame(ga))}const Fs={"sorriso-01":{file:"sorriso-01.webp",width:497,height:1451,cutout:!0},"sorriso-02":{file:"sorriso-02.webp",width:540,height:960},"sorriso-03":{file:"sorriso-03.webp",width:900,height:1600},"sorriso-04":{file:"sorriso-04.webp",width:1200,height:1600,cutout:!0},"sorriso-05":{file:"sorriso-05.webp",width:900,height:1600,cutout:!0},"sorriso-06":{file:"sorriso-06.webp",width:900,height:1600,cutout:!0},"sorriso-07":{file:"sorriso-07.webp",width:900,height:1600},"sorriso-08":{file:"sorriso-08.webp",width:900,height:1600},"sorriso-09":{file:"sorriso-09.webp",width:668,height:900},"sorriso-10":{file:"sorriso-10.webp",width:1600,height:900},"sorriso-11":{file:"sorriso-11.webp",width:900,height:1600,cutout:!0},"sorriso-12":{file:"sorriso-12.webp",width:1200,height:1600},"sorriso-13":{file:"sorriso-13.webp",width:1600,height:900},"sorriso-14":{file:"sorriso-14.webp",width:1080,height:608},"sorriso-15":{file:"sorriso-15.webp",width:738,height:828,cutout:!0},"sorriso-16":{file:"sorriso-16.webp",width:540,height:960},"sorriso-17":{file:"sorriso-17.webp",width:1080,height:1920},"sorriso-18":{file:"sorriso-18.webp",width:540,height:960}},Ts=[{id:"s01",photos:[{id:"sorriso-04",rot:-1.2,enter:[34,-4],exit:[-36,-2],fasteners:[["tape-01.png","tc",-3],["laco-01.png","tr",6]]},{id:"sorriso-01",rot:-2.6,enter:[-34,8],exit:[28,18],fasteners:[["tape-02.png","tc",2]]},{id:"sorriso-02",rot:1.5,enter:[34,-4],exit:[36,-12],fasteners:[["tape-03.png","tc",-2]]},{id:"sorriso-03",rot:1.1,enter:[34,10],exit:[34,14],fasteners:[["tape-04.png","tc",2]]},{id:"sorriso-10",rot:-.8,enter:[0,28],exit:[0,26],fasteners:[["tape-05.png","tc",0]]},{id:"sorriso-16",rot:1.7,enter:[36,8],exit:[30,20],fasteners:[["tape-06.png","tc",0]]}],deco:[{key:"flor-01",file:"flor-01.png",rot:-9,enter:[-24,8],exit:[-32,12]},{key:"rosa",file:"rosa.png",rot:4,enter:[-28,18],exit:[-30,24]},{key:"angel-01",file:"angel-01.png",rot:-2,enter:[-22,-10],exit:[8,-26]},{key:"youaremysunshine",file:"youaremysunshine.png",rot:3,enter:[30,0],exit:[36,0]},{key:"carta-01",file:"carta-01.png",rot:3,enter:[-24,18],exit:[-30,26]},{key:"ribbon-01",file:"ribbon-01.png",rot:0,enter:[22,10],exit:[28,20]},{key:"selo-01",file:"selo-01.png",rot:5,enter:[30,-6],exit:[36,-10]},{key:"laco-01",file:"laco-01.png",rot:8,enter:[20,-14],exit:[26,-20]},{key:"miniheart",file:"miniheart.png",rot:0,enter:[16,-8],exit:[18,-10]},{key:"miniheart-02",file:"miniheart-02.png",rot:0,enter:[-10,12],exit:[-10,18]}]},{id:"s02",photos:[{id:"sorriso-05",rot:-1.1,enter:[-34,-4],exit:[-38,-4],fasteners:[["tape-01.png","tc",-4]]},{id:"sorriso-06",rot:1.2,enter:[34,-4],exit:[38,-2],fasteners:[["tape-02.png","tc",4],["laco-02.png","tr",9]]},{id:"sorriso-07",rot:1.2,enter:[-28,-16],exit:[-34,-18],fasteners:[["tape-03.png","tc",-2]]},{id:"sorriso-08",rot:-1.5,enter:[28,14],exit:[34,20],fasteners:[["tape-04.png","tc",2]]},{id:"sorriso-09",rot:-2.1,enter:[-28,18],exit:[-34,24],fasteners:[["tape-05.png","tc",0]]},{id:"sorriso-13",rot:.4,enter:[0,28],exit:[0,26],fasteners:[["tape-06.png","tc",0]]}],deco:[{key:"pessoafavorita",file:"pessoafavorita.png",rot:-2,enter:[18,-22],exit:[16,-24],kind:"title"},{key:"colar",file:"colar.png",rot:-8,enter:[-18,-12],exit:[-24,-18]},{key:"chave",file:"chave.png",rot:6,enter:[-20,6],exit:[-24,10]},{key:"carta",file:"carta.png",rot:2,enter:[-24,18],exit:[-28,22]},{key:"bear-01",file:"bear-01.png",rot:2,enter:[26,6],exit:[30,8]},{key:"kiss-01",file:"kiss-01.png",rot:-8,enter:[18,0],exit:[24,0]},{key:"laco-02",file:"laco-02.png",rot:8,enter:[24,-16],exit:[28,-18]},{key:"selo-02",file:"selo-02.png",rot:6,enter:[-12,16],exit:[-16,18]},{key:"miniheart",file:"miniheart.png",rot:0,enter:[10,-8],exit:[14,-8]},{key:"miniheart-02",file:"miniheart-02.png",rot:0,enter:[10,8],exit:[16,8]}]},{id:"s03",photos:[{id:"sorriso-11",rot:-1.3,enter:[-34,-4],exit:[-36,-4],fasteners:[["tape-01.png","tc",3]]},{id:"sorriso-12",rot:1.3,enter:[-24,-18],exit:[-28,-20],fasteners:[["tape-02.png","tc",-4]]},{id:"sorriso-14",rot:-.7,enter:[-12,28],exit:[-16,28],fasteners:[["tape-03.png","tc",0]]},{id:"sorriso-15",rot:1.5,enter:[30,-8],exit:[34,-10],fasteners:[["tape-04.png","tc",3],["laco-03.png","tr",6]]},{id:"sorriso-17",rot:.8,enter:[28,10],exit:[34,10],fasteners:[["tape-05.png","tc",-2]]},{id:"sorriso-18",rot:-1.1,enter:[26,22],exit:[32,24],fasteners:[["tape-06.png","tc",0]]}],deco:[{key:"anatomico",file:"anatomico.png",rot:-4,enter:[18,-18],exit:[22,-20]},{key:"lolipop",file:"lolipop.png",rot:-2,enter:[22,6],exit:[26,8]},{key:"lovesongstape",file:"lovesongstape.png",rot:-6,enter:[-24,12],exit:[-28,16]},{key:"angel-02",file:"angel-02.png",rot:2,enter:[24,-16],exit:[28,-20]},{key:"rosa",file:"rosa.png",rot:-4,enter:[-26,2],exit:[-30,6]},{key:"flor-01",file:"flor-01.png",rot:0,enter:[26,16],exit:[30,18]},{key:"carta",file:"carta.png",rot:4,enter:[24,-6],exit:[28,-10]},{key:"laco-03",file:"laco-03.png",rot:7,enter:[0,20],exit:[0,24]},{key:"selo-01",file:"selo-01.png",rot:-4,enter:[10,14],exit:[14,18]},{key:"miniheart",file:"miniheart.png",rot:0,enter:[12,10],exit:[16,12]},{key:"miniheart-02",file:"miniheart-02.png",rot:0,enter:[-10,-8],exit:[-14,-10]}]}],W={s1HoldEnd:.19,s1OutEnd:.29,s2InEnd:.39,s2HoldEnd:.58,s2OutEnd:.68,s3InEnd:.78,s3HoldEnd:.91,finalOutEnd:1};function ta(e,a,r){return Math.max(a,Math.min(r,e))}function ct(e,a,r){return ta((e-a)/(r-a),0,1)}function za(e){return e*e*(3-2*e)}function Cs(e,a,r=!1){const t=Fs[e.id],s=document.createElement("div");s.className="smile-v5__item is-photo",s.dataset.item=e.id,s.dataset.kind="photo",s.dataset.rot=String(e.rot||0),s.dataset.enterX=String(e.enter?.[0]||0),s.dataset.enterY=String(e.enter?.[1]||0),s.dataset.exitX=String(e.exit?.[0]||0),s.dataset.exitY=String(e.exit?.[1]||0),s.innerHTML=`
    <figure class="smile-v5__photo" data-cutout="${t.cutout?"true":"false"}" style="aspect-ratio:${t.width}/${t.height}">
      <span class="smile-v5__frame" aria-hidden="true"></span>
      <img class="smile-v5__photo-img" data-src="${a}/sorriso/${t.file}" alt="Foto ${e.id}" loading="lazy" decoding="async" />
      <span class="smile-v5__gloss" aria-hidden="true"></span>
    </figure>`;const n=s.querySelector(".smile-v5__photo"),i=s.querySelector(".smile-v5__photo-img");r&&i?.dataset.src&&(i.src=i.dataset.src,i.removeAttribute("data-src"),i.loading="eager");const u=s.querySelector(".smile-v5__gloss"),c=Number((e.id.match(/(\d+)$/)||[0,1])[1]);return u?.style.setProperty("--gloss-duration",`${8.2+c%5*.9}s`),u?.style.setProperty("--gloss-delay",`${-(c*1.37%7.4)}s`),(e.fasteners||[]).forEach(([f,p,l])=>{const d=document.createElement("img");d.className=`smile-v5__fastener smile-v5__fastener--${p}`,d.src=`${a}/love-scene/kit/${f}`,d.alt="",d.setAttribute("aria-hidden","true"),d.draggable=!1,d.style.transform=`rotate(${l||0}deg)`,n.appendChild(d)}),s}function La(e,a,r=!1){const t=document.createElement("div");t.className=`smile-v5__item ${e.kind==="title"?"is-title":"is-deco"}`,t.dataset.item=e.key,t.dataset.kind=e.kind||"deco",t.dataset.rot=String(e.rot||0),t.dataset.enterX=String(e.enter?.[0]||0),t.dataset.enterY=String(e.enter?.[1]||0),t.dataset.exitX=String(e.exit?.[0]||0),t.dataset.exitY=String(e.exit?.[1]||0),t.innerHTML=`<img class="smile-v5__img" data-src="${a}/love-scene/kit/${e.file}" alt="" aria-hidden="true" draggable="false" />`;const s=t.querySelector(".smile-v5__img");return r&&s?.dataset.src&&(s.src=s.dataset.src,s.removeAttribute("data-src")),t}function Hs(e,a,r=!1){const t=document.createElement("section");return t.className=`smile-v5__spread smile-v5__spread--${e.id}`,e.title&&t.appendChild(La({...e.title,kind:"title"},a,r)),e.photos.forEach(s=>t.appendChild(Cs(s,a,r))),e.deco.forEach(s=>t.appendChild(La(s,a,r))),t}function $a(e){e?.querySelectorAll("img[data-src]").forEach(a=>{a.src=a.dataset.src,a.removeAttribute("data-src")})}function Vs(e){e.forEach(a=>{const r=parseFloat(a.dataset.rot||"0");a.style.opacity="0",a.style.transform=`translate(0vw, 0vh) rotate(${r}deg)`})}function At(e){e.forEach(a=>{const r=parseFloat(a.dataset.rot||"0");a.style.opacity="1",a.style.transform=`translate(0vw, 0vh) rotate(${r}deg)`})}function qt(e,a,r){const t=za(a),s=window.innerWidth<=860,n=(i,u)=>{if(!s)return[i,u];const c=Math.sign(i),f=Math.sign(u);return c&&f?[c*112,f*76]:c?[c*116,0]:f?[0,f*112]:[0,0]};e.forEach(i=>{const u=parseFloat(i.dataset.rot||"0"),c=parseFloat(i.dataset.enterX||"0"),f=parseFloat(i.dataset.enterY||"0"),p=parseFloat(i.dataset.exitX||"0"),l=parseFloat(i.dataset.exitY||"0"),[d,b]=n(c,f),[g,m]=n(p,l),h=r==="in"?d*(1-t):g*t,E=r==="in"?b*(1-t):m*t;i.style.opacity="1",i.style.transform=`translate(${h}vw, ${E}vh) rotate(${u}deg)`})}function Ns(e,a){const r=e.querySelector(".smile-v5__section"),t=e.querySelector(".smile-v5__scene-stage"),s=Number.parseFloat(e.dataset.loveTrioProgress||"");let n;if(window.innerWidth<=860&&Number.isFinite(s))n=ta(s,0,1);else{const i=r.getBoundingClientRect(),u=Math.max(1,i.height-window.innerHeight);n=ta(-i.top/u,0,1)}if(n>.1&&$a(a.s02.root),n>.48&&$a(a.s03.root),Object.values(a).forEach(i=>Vs(i.items)),t.style.transform="translate3d(0,0,0)",n<=W.s1HoldEnd)At(a.s01.items);else if(n<=W.s1OutEnd)qt(a.s01.items,ct(n,W.s1HoldEnd,W.s1OutEnd),"out");else if(n<=W.s2InEnd)qt(a.s02.items,ct(n,W.s1OutEnd,W.s2InEnd),"in");else if(n<=W.s2HoldEnd)At(a.s02.items);else if(n<=W.s2OutEnd)qt(a.s02.items,ct(n,W.s2HoldEnd,W.s2OutEnd),"out");else if(n<=W.s3InEnd)qt(a.s03.items,ct(n,W.s2OutEnd,W.s3InEnd),"in");else if(n<=W.s3HoldEnd)At(a.s03.items);else{At(a.s03.items);const i=ct(n,W.s3HoldEnd,W.finalOutEnd),u=-118*za(i);t.style.transform=`translate3d(${u}vw, 0, 0)`}}function Os(e,a={}){if(!e)throw new Error("root obrigatório");const r=(a.assetBase||"/assets").replace(/\/$/,""),t=document.createElement("section");t.className="smile-v5",t.innerHTML=`
    <div class="smile-v5__section">
      <div class="smile-v5__sticky">
        <div class="smile-v5__next-style-bg" aria-hidden="true"></div>
        <div class="smile-v5__scene-stage">
          <div class="smile-v5__paper" aria-hidden="true"></div>
          <img class="smile-v5__center-title" src="${r}/love-scene/kit/amoseusorriso.png" alt="Amo o seu sorriso" draggable="false" />
          <div class="smile-v5__canvas"></div>
        </div>
      </div>
    </div>`;const s=t.querySelector(".smile-v5__canvas"),n={};Ts.forEach((p,l)=>{const d=Hs(p,r,l===0);s.appendChild(d),n[p.id]={root:d,items:[...d.querySelectorAll(".smile-v5__item")]}}),e.appendChild(t);const i=[];t.querySelectorAll(".smile-v5__photo-img").forEach(p=>{const l=p.closest(".smile-v5__item"),d=()=>l?.classList.add("is-loaded"),b=()=>l?.classList.add("is-error");p.addEventListener("load",d),p.addEventListener("error",b),i.push(()=>{p.removeEventListener("load",d),p.removeEventListener("error",b)}),p.hasAttribute("src")&&p.complete&&(p.naturalWidth?d():b())});const u=()=>Ns(t,n),c=Se(u,{root:t,rootMargin:"125% 0px"}),f=ve(()=>c.flush());return i.push(()=>f.destroy()),{root:t,render:u,refresh(){c.flush()},destroy(){c.destroy(),i.splice(0).forEach(p=>p()),t.remove()}}}const Is={"estilo-01":{file:"estilo-01.webp",width:900,height:1600},"estilo-02":{file:"estilo-02.webp",width:900,height:1600},"estilo-03":{file:"estilo-03.webp",width:900,height:1600},"estilo-04":{file:"estilo-04.webp",width:900,height:1600},"estilo-05":{file:"estilo-05.webp",width:900,height:1600},"estilo-06":{file:"estilo-06.webp",width:900,height:1600},"estilo-07":{file:"estilo-07.webp",width:900,height:1600},"estilo-08":{file:"estilo-08.webp",width:900,height:1600},"estilo-09":{file:"estilo-09.webp",width:900,height:1600},"estilo-10":{file:"estilo-10.webp",width:1200,height:1600,cutout:!0},"estilo-11":{file:"estilo-11.webp",width:720,height:1280},"estilo-12":{file:"estilo-12.webp",width:900,height:1600},"estilo-13":{file:"estilo-13.webp",width:900,height:1600},"estilo-14":{file:"estilo-14.webp",width:574,height:1259,cutout:!0},"estilo-15":{file:"estilo-15.webp",width:900,height:1600},"estilo-16":{file:"estilo-16.webp",width:406,height:503},"estilo-17":{file:"estilo-17.webp",width:1200,height:1600,cutout:!0},"estilo-18":{file:"estilo-18.webp",width:1200,height:1600},"estilo-19":{file:"estilo-19.webp",width:900,height:1600},"estilo-20":{file:"estilo-20.webp",width:900,height:1600},"estilo-21":{file:"estilo-21.webp",width:1080,height:1920},"estilo-22":{file:"estilo-22.webp",width:540,height:960,cutout:!0},"estilo-23":{file:"estilo-23.webp",width:540,height:960}},Rs=[{id:"s01",photos:[{id:"estilo-01",rot:-1.4,enter:[34,-8],exit:[-36,-6],fasteners:[["pin.png","tc",0],["laco-04.png","tr",6]]},{id:"estilo-02",rot:1.2,enter:[34,-4],exit:[36,-12],fasteners:[["laco-02.png","tc",0]]},{id:"estilo-03",rot:.9,enter:[34,8],exit:[36,10],fasteners:[["laco-03.png","tc",2]]},{id:"estilo-10",rot:-.6,enter:[36,12],exit:[34,16],fasteners:[["pin.png","tl",0]]},{id:"estilo-11",rot:-1.5,enter:[0,28],exit:[-8,26],fasteners:[["laco-05.png","tc",0]]},{id:"estilo-16",rot:1.6,enter:[10,24],exit:[6,24],fasteners:[["pin.png","tc",0]]}],deco:[{key:"styleicon",file:"styleicon.png",rot:-4,enter:[-18,10],exit:[-20,12]},{key:"teamo",file:"teamo.png",rot:2,enter:[-22,18],exit:[-24,20]},{key:"vogue",file:"vogue.png",rot:2,enter:[24,-10],exit:[28,-10]},{key:"tiger02",file:"tiger02.png",rot:0,enter:[-26,18],exit:[-30,22]},{key:"boca02",file:"boca02.png",rot:-6,enter:[14,-18],exit:[16,-20]},{key:"camera",file:"camera.png",rot:-4,enter:[14,18],exit:[18,20]},{key:"flor-02",file:"flor-02.png",rot:4,enter:[22,12],exit:[24,16]},{key:"coracao-01",file:"coracao-01.png",rot:0,enter:[10,8],exit:[12,8]},{key:"pin",file:"pin.png",rot:-4,enter:[0,16],exit:[0,18]}]},{id:"s02",photos:[{id:"estilo-04",rot:-1.3,enter:[-34,-8],exit:[-38,-10],fasteners:[["pin.png","tc",0]]},{id:"estilo-05",rot:1.1,enter:[-26,-14],exit:[-30,-14],fasteners:[["laco-05.png","tc",0]]},{id:"estilo-06",rot:1.4,enter:[34,-8],exit:[38,-8],fasteners:[["pin.png","tc",0]]},{id:"estilo-07",rot:-.8,enter:[0,-28],exit:[0,-30],fasteners:[["laco-03.png","tc",3]]},{id:"estilo-12",rot:-1.2,enter:[-24,24],exit:[-28,24],fasteners:[["laco-02.png","tc",0]]},{id:"estilo-14",rot:1.8,enter:[26,22],exit:[30,24],fasteners:[["pin.png","tl",0]]}],deco:[{key:"channel",file:"channel.png",rot:-3,enter:[-20,-14],exit:[-24,-16]},{key:"prada",file:"prada.png",rot:2,enter:[26,12],exit:[30,16]},{key:"relogio",file:"relogio.png",rot:4,enter:[26,-12],exit:[30,-14]},{key:"vogue02",file:"vogue02.png",rot:-2,enter:[0,24],exit:[0,26]},{key:"model-02",file:"model-02.png",rot:0,enter:[-12,22],exit:[-16,24]},{key:"model-04",file:"model-04.png",rot:0,enter:[12,20],exit:[16,22]},{key:"catfashion",file:"catfashion.png",rot:-4,enter:[-18,18],exit:[-20,22]},{key:"flor-04",file:"flor-04.png",rot:6,enter:[24,16],exit:[26,18]},{key:"coracao-02",file:"coracao-02.png",rot:0,enter:[10,-10],exit:[12,-12]},{key:"laco-05",file:"laco-05.png",rot:6,enter:[-16,-20],exit:[-20,-24]},{key:"vcdeixatudomaisbonito",file:"vcdeixatudomaisbonito.png",rot:-1,enter:[0,-24],exit:[0,-26]},{key:"ficardecanto-01",file:"ficardecanto-01.png",rot:0,enter:[24,18],exit:[30,22]},{key:"flor-01",file:"flor-01.png",rot:-4,enter:[-20,20],exit:[-24,24]}]},{id:"s03",photos:[{id:"estilo-08",rot:-1.2,enter:[-34,-6],exit:[-38,-6],fasteners:[["pin.png","tc",0]]},{id:"estilo-09",rot:1.4,enter:[-20,-10],exit:[-24,-12],fasteners:[["laco-03.png","tc",0]]},{id:"estilo-17",rot:-.7,enter:[0,-26],exit:[0,-28],fasteners:[["laco-01.png","tr",4]]},{id:"estilo-18",rot:1.1,enter:[26,-10],exit:[30,-12],fasteners:[["laco-02.png","tc",0]]},{id:"estilo-19",rot:-1.4,enter:[-18,22],exit:[-22,24],fasteners:[["laco-04.png","tc",0]]},{id:"estilo-22",rot:1.8,enter:[28,22],exit:[32,24],fasteners:[["pin.png","tl",0]]}],deco:[{key:"dontflash",file:"dontflash.png",rot:0,enter:[-20,18],exit:[-24,20]},{key:"coke",file:"coke.png",rot:-2,enter:[12,18],exit:[16,20]},{key:"coke2",file:"coke2.png",rot:-6,enter:[14,24],exit:[18,26]},{key:"botas",file:"botas.png",rot:0,enter:[18,-18],exit:[22,-20]},{key:"boca",file:"boca.png",rot:-7,enter:[0,-18],exit:[0,-20]},{key:"coracao-04",file:"coracao-04.png",rot:2,enter:[22,14],exit:[24,16]},{key:"revistas",file:"revistas.png",rot:-3,enter:[0,20],exit:[0,22]},{key:"cinema",file:"cinema.jpg",rot:-2,enter:[-26,24],exit:[-30,26]},{key:"flor-03",file:"flor-03.png",rot:4,enter:[26,16],exit:[30,18]},{key:"laco-03",file:"laco-03.png",rot:6,enter:[4,26],exit:[4,28]},{key:"model-01",file:"model-01.png",rot:0,enter:[-20,14],exit:[-24,16]}]},{id:"s04",photos:[{id:"estilo-13",rot:-1.2,enter:[-34,-10],exit:[-38,-12],fasteners:[["pin.png","tc",0]]},{id:"estilo-15",rot:1.1,enter:[-16,-8],exit:[-20,-10],fasteners:[["laco-04.png","tc",0]]},{id:"estilo-20",rot:-.6,enter:[10,-10],exit:[14,-12],fasteners:[["pin.png","tc",0]]},{id:"estilo-21",rot:.8,enter:[28,-10],exit:[32,-12],fasteners:[["laco-05.png","tc",0]]},{id:"estilo-23",rot:-1.2,enter:[0,24],exit:[0,28],fasteners:[["pin.png","tc",0]]}],deco:[{key:"botas-02",file:"botas-02.png",rot:-4,enter:[-24,18],exit:[-28,20]},{key:"cantoinferiordireito",file:"cantoinferiordireito.png",rot:0,enter:[26,22],exit:[30,24]},{key:"model-03",file:"model-03.png",rot:-3,enter:[-20,12],exit:[-24,14]},{key:"model-05",file:"model-05.png",rot:3,enter:[12,12],exit:[14,14]},{key:"model-06",file:"model-06.png",rot:0,enter:[18,12],exit:[22,14]},{key:"flor-05",file:"flor-05.png",rot:-6,enter:[-28,4],exit:[-30,6]},{key:"tiger",file:"tiger.png",rot:0,enter:[30,0],exit:[34,0]},{key:"camera",file:"camera.png",rot:-5,enter:[-18,20],exit:[-22,24]},{key:"teamo",file:"teamo.png",rot:2,enter:[12,22],exit:[16,24]},{key:"styleicon",file:"styleicon.png",rot:0,enter:[18,24],exit:[22,26]}]}],H={s1HoldEnd:.14,s1OutEnd:.22,s2InEnd:.3,s2HoldEnd:.44,s2OutEnd:.52,s3InEnd:.6,s3HoldEnd:.74,s3OutEnd:.82,s4InEnd:.9,s4HoldEnd:.95,finalOutEnd:1};function aa(e,a,r){return Math.max(a,Math.min(r,e))}function Ve(e,a,r){return aa((e-a)/(r-a),0,1)}function Wa(e){return e*e*(3-2*e)}function Xa(e,a){e.dataset.rot=String(a.rot||0),e.dataset.enterX=String(a.enter?.[0]||0),e.dataset.enterY=String(a.enter?.[1]||0),e.dataset.exitX=String(a.exit?.[0]||0),e.dataset.exitY=String(a.exit?.[1]||0)}function Ys(e,a,r=!1){const t=Is[e.id],s=document.createElement("div");s.className="style-v1__item is-photo",s.dataset.item=e.id,Xa(s,e),s.innerHTML=`
    <figure class="style-v1__photo" data-cutout="${t.cutout?"true":"false"}" style="aspect-ratio:${t.width}/${t.height}">
      <span class="style-v1__frame" aria-hidden="true"></span>
      <img class="style-v1__photo-img" data-src="${a}/estilo/${t.file}" alt="Foto ${e.id}" loading="lazy" decoding="async" />
      <span class="style-v1__gloss" aria-hidden="true"></span>
    </figure>`;const n=s.querySelector(".style-v1__photo"),i=s.querySelector(".style-v1__photo-img");r&&i?.dataset.src&&(i.src=i.dataset.src,i.removeAttribute("data-src"),i.loading="eager");const u=s.querySelector(".style-v1__gloss"),c=Number((e.id.match(/(\d+)$/)||[0,1])[1]);return u?.style.setProperty("--gloss-duration",`${8+c%6*.85}s`),u?.style.setProperty("--gloss-delay",`${-(c*1.27%7.2)}s`),(e.fasteners||[]).forEach(([f,p,l])=>{const d=document.createElement("img");d.className=`style-v1__fastener style-v1__fastener--${p}`,d.src=`${a}/love-scene-estilo/kit/${f}`,d.alt="",d.setAttribute("aria-hidden","true"),d.draggable=!1,d.style.transform=`rotate(${l||0}deg)`,n.appendChild(d)}),s}function Bs(e,a,r=!1){const t=document.createElement("div");t.className=`style-v1__item ${e.kind==="title"?"is-title":"is-deco"}`,t.dataset.item=e.key,Xa(t,e),t.innerHTML=`<img class="style-v1__img" data-src="${a}/love-scene-estilo/kit/${e.file}" alt="" aria-hidden="true" draggable="false" />`;const s=t.querySelector(".style-v1__img");return r&&s?.dataset.src&&(s.src=s.dataset.src,s.removeAttribute("data-src")),t}function js(e,a,r=!1){const t=document.createElement("section");return t.className=`style-v1__spread style-v1__spread--${e.id}`,(e.photos||[]).forEach(s=>t.appendChild(Ys(s,a,r))),(e.deco||[]).forEach(s=>t.appendChild(Bs(s,a,r))),t}function Qt(e){e?.querySelectorAll("img[data-src]").forEach(a=>{a.src=a.dataset.src,a.removeAttribute("data-src")})}function Ds(e){e.forEach(a=>{const r=parseFloat(a.dataset.rot||"0");a.style.opacity="0",a.style.transform=`translate(0vw, 0vh) rotate(${r}deg)`})}function dt(e){e.forEach(a=>{const r=parseFloat(a.dataset.rot||"0");a.style.opacity="1",a.style.transform=`translate(0vw, 0vh) rotate(${r}deg)`})}function Ge(e,a,r){const t=Wa(a),s=window.innerWidth<=860,n=(i,u)=>{if(!s)return[i,u];const c=Math.sign(i),f=Math.sign(u);return c&&f?[c*112,f*76]:c?[c*116,0]:f?[0,f*112]:[0,0]};e.forEach(i=>{const u=parseFloat(i.dataset.rot||"0"),c=parseFloat(i.dataset.enterX||"0"),f=parseFloat(i.dataset.enterY||"0"),p=parseFloat(i.dataset.exitX||"0"),l=parseFloat(i.dataset.exitY||"0"),[d,b]=n(c,f),[g,m]=n(p,l),h=r==="in"?d*(1-t):g*t,E=r==="in"?b*(1-t):m*t;i.style.opacity="1",i.style.transform=`translate(${h}vw, ${E}vh) rotate(${u}deg)`})}function zs(e,a){const r=e.querySelector(".style-v1__section"),t=e.querySelector(".style-v1__scene-stage"),s=Number.parseFloat(e.dataset.loveTrioProgress||"");let n;if(window.innerWidth<=860&&Number.isFinite(s))n=aa(s,0,1);else{const i=r.getBoundingClientRect(),u=Math.max(1,i.height-window.innerHeight);n=aa(-i.top/u,0,1)}if(n>.07&&Qt(a.s02.root),n>.36&&Qt(a.s03.root),n>.64&&Qt(a.s04.root),Object.values(a).forEach(i=>Ds(i.items)),t.style.transform="translate3d(0,0,0)",n<=H.s1HoldEnd)dt(a.s01.items);else if(n<=H.s1OutEnd)Ge(a.s01.items,Ve(n,H.s1HoldEnd,H.s1OutEnd),"out");else if(n<=H.s2InEnd)Ge(a.s02.items,Ve(n,H.s1OutEnd,H.s2InEnd),"in");else if(n<=H.s2HoldEnd)dt(a.s02.items);else if(n<=H.s2OutEnd)Ge(a.s02.items,Ve(n,H.s2HoldEnd,H.s2OutEnd),"out");else if(n<=H.s3InEnd)Ge(a.s03.items,Ve(n,H.s2OutEnd,H.s3InEnd),"in");else if(n<=H.s3HoldEnd)dt(a.s03.items);else if(n<=H.s3OutEnd)Ge(a.s03.items,Ve(n,H.s3HoldEnd,H.s3OutEnd),"out");else if(n<=H.s4InEnd)Ge(a.s04.items,Ve(n,H.s3OutEnd,H.s4InEnd),"in");else if(n<=H.s4HoldEnd)dt(a.s04.items);else{dt(a.s04.items);const i=Ve(n,H.s4HoldEnd,H.finalOutEnd);t.style.transform=`translate3d(${118*Wa(i)}vw, 0, 0)`}}function Ws(e,a={}){if(!e)throw new Error("initStyleScene(root): root é obrigatório.");const r=(a.assetBase||"/assets").replace(/\/$/,""),t=document.createElement("section");t.className="style-v1",t.innerHTML=`
    <div class="style-v1__section">
      <div class="style-v1__sticky">
        <div class="style-v1__next-bg" aria-hidden="true"></div>
        <div class="style-v1__scene-stage">
          <div class="style-v1__paper" aria-hidden="true"></div>
          <img class="style-v1__center-title" src="${r}/love-scene-estilo/kit/amocomovc-estilosa.png" alt="Eu amo como você é estilosa" draggable="false" />
          <div class="style-v1__canvas"></div>
        </div>
      </div>
    </div>`;const s=t.querySelector(".style-v1__canvas"),n={};Rs.forEach((p,l)=>{const d=js(p,r,l===0);s.appendChild(d),n[p.id]={root:d,items:[...d.querySelectorAll(".style-v1__item")]}}),e.appendChild(t);const i=[];t.querySelectorAll(".style-v1__photo-img").forEach(p=>{const l=p.closest(".style-v1__item"),d=()=>l?.classList.add("is-loaded"),b=()=>l?.classList.add("is-error");p.addEventListener("load",d),p.addEventListener("error",b),i.push(()=>{p.removeEventListener("load",d),p.removeEventListener("error",b)}),p.hasAttribute("src")&&p.complete&&(p.naturalWidth?d():b())});const u=()=>zs(t,n),c=Se(u,{root:t,rootMargin:"125% 0px"}),f=ve(()=>c.flush());return i.push(()=>f.destroy()),{root:t,render:u,refresh(){c.flush()},destroy(){c.destroy(),i.splice(0).forEach(p=>p()),t.remove()}}}const Xs={"academia-01":{file:"academia-01.webp",width:1080,height:1920},"academia-02":{file:"academia-02.webp",width:900,height:1600},"academia-03":{file:"academia-03.webp",width:900,height:1600},"academia-04":{file:"academia-04.webp",width:900,height:1600},"academia-05":{file:"academia-05.webp",width:1200,height:1600},"academia-06":{file:"academia-06.webp",width:1080,height:1920},"academia-07":{file:"academia-07.webp",width:1080,height:1920},"academia-08":{file:"academia-08.webp",width:900,height:1600},"academia-09":{file:"academia-09.webp",width:960,height:1280},"academia-10":{file:"academia-10.webp",width:720,height:1280},"academia-11":{file:"academia-11.webp",width:900,height:1600},"academia-12":{file:"academia-12.webp",width:900,height:1600},"academia-13":{file:"academia-13.webp",width:1200,height:1600},"academia-14":{file:"academia-14.webp",width:1200,height:1600},"academia-15":{file:"academia-15.webp",width:900,height:1600},"academia-16":{file:"academia-16.webp",width:903,height:900},"academia-17":{file:"academia-17.webp",width:900,height:1600},"academia-18":{file:"academia-18.webp",width:900,height:1600},"academia-19":{file:"academia-19.webp",width:1080,height:1920},"academia-20":{file:"academia-20.webp",width:1080,height:1439}},Gs=[{id:"a01",photos:[{id:"academia-01",rot:-1.1,enter:[-34,-8],exit:[-38,-10]},{id:"academia-02",rot:1,enter:[-24,-12],exit:[-30,-12]},{id:"academia-03",rot:-.8,enter:[0,-28],exit:[0,-30]},{id:"academia-04",rot:1.1,enter:[24,-12],exit:[30,-12]},{id:"academia-05",rot:-1.2,enter:[-16,24],exit:[-22,26]},{id:"academia-06",rot:1.3,enter:[24,22],exit:[30,24]}],deco:[{key:"cat-01",file:"cat-01.png",rot:-2,enter:[-24,18],exit:[-28,20]},{key:"cat-02",file:"cat-02.png",rot:3,enter:[28,-10],exit:[32,-12]},{key:"cat-03",file:"cat-03.png",rot:0,enter:[0,22],exit:[0,26]},{key:"dog01",file:"dog01.png",rot:2,enter:[26,18],exit:[30,22]},{key:"halter02",file:"halter02.png",rot:-4,enter:[10,22],exit:[14,26]},{key:"garrafa",file:"garrafa.png",rot:-3,enter:[-26,0],exit:[-30,0]},{key:"heart",file:"heart.png",rot:0,enter:[8,10],exit:[12,12]}]},{id:"a02",photos:[{id:"academia-07",rot:-1.2,enter:[-34,-8],exit:[-38,-10]},{id:"academia-08",rot:1.2,enter:[-20,-12],exit:[-24,-14]},{id:"academia-09",rot:-.9,enter:[0,-28],exit:[0,-30]},{id:"academia-10",rot:1,enter:[18,-16],exit:[22,-18]},{id:"academia-11",rot:-1.1,enter:[30,-8],exit:[34,-10]},{id:"academia-12",rot:1.2,enter:[-18,24],exit:[-22,26]},{id:"academia-13",rot:-.7,enter:[22,24],exit:[26,26]}],deco:[{key:"vceumsabor",file:"vceumsabor.png",rot:-1,enter:[0,24],exit:[0,28],kind:"title"},{key:"cat-04",file:"cat-04.png",rot:-1,enter:[-26,18],exit:[-30,22]},{key:"cat-05",file:"cat-05.png",rot:3,enter:[28,16],exit:[32,20]},{key:"cat-06",file:"cat-06.png",rot:0,enter:[26,-14],exit:[30,-18]},{key:"fire",file:"fire.png",rot:2,enter:[-10,22],exit:[-12,26]},{key:"luva",file:"luva.png",rot:-3,enter:[-28,0],exit:[-32,0]},{key:"halter01",file:"halter01.jpg",rot:3,enter:[28,0],exit:[32,0]},{key:"heart2",file:"heart2.png",rot:0,enter:[10,20],exit:[14,24]}]},{id:"a03",photos:[{id:"academia-14",rot:-1,enter:[-34,-8],exit:[-38,-10]},{id:"academia-15",rot:1.1,enter:[-20,-12],exit:[-24,-14]},{id:"academia-17",rot:-.8,enter:[18,-14],exit:[22,-16]},{id:"academia-18",rot:1.1,enter:[30,-8],exit:[34,-10]},{id:"academia-19",rot:-1.2,enter:[-24,24],exit:[-28,26]},{id:"academia-20",rot:1,enter:[28,22],exit:[32,24]},{id:"academia-16",rot:-.4,enter:[0,28],exit:[0,30]}],deco:[{key:"cat-07",file:"cat-07.png",rot:1,enter:[0,-24],exit:[0,-28]},{key:"rat01",file:"rat01.png",rot:-2,enter:[-28,20],exit:[-32,24]},{key:"rat02",file:"rat02.png",rot:2,enter:[-16,22],exit:[-20,26]},{key:"rat03",file:"rat03.png",rot:-1,enter:[16,22],exit:[20,26]},{key:"rat04",file:"rat04.png",rot:2,enter:[28,0],exit:[32,0]},{key:"rat05",file:"rat05.png",rot:-2,enter:[-28,0],exit:[-32,0]},{key:"trofeu",file:"trofeu.jpg",rot:0,enter:[0,18],exit:[0,22]}]}],ae={a1HoldEnd:.2,a1OutEnd:.3,a2InEnd:.4,a2HoldEnd:.61,a2OutEnd:.71,a3InEnd:.81};function sa(e,a,r){return Math.max(a,Math.min(r,e))}function Ft(e,a,r){return sa((e-a)/(r-a),0,1)}function Js(e){return e*e*(3-2*e)}function Ga(e,a){e.dataset.rot=String(a.rot||0),e.dataset.enterX=String(a.enter?.[0]||0),e.dataset.enterY=String(a.enter?.[1]||0),e.dataset.exitX=String(a.exit?.[0]||0),e.dataset.exitY=String(a.exit?.[1]||0)}function Us(e,a,r=!1){const t=Xs[e.id],s=document.createElement("div");s.className="gym-v1__item is-photo",s.dataset.item=e.id,Ga(s,e),s.innerHTML=`<figure class="gym-v1__photo" style="aspect-ratio:${t.width}/${t.height}">
    <span class="gym-v1__frame" aria-hidden="true"></span>
    <img class="gym-v1__photo-img" data-src="${a}/academia/${t.file}" alt="Foto ${e.id}" loading="lazy" decoding="async" />
    <span class="gym-v1__gloss" aria-hidden="true"></span>
  </figure>`;const n=s.querySelector(".gym-v1__photo-img");r&&n?.dataset.src&&(n.src=n.dataset.src,n.removeAttribute("data-src"),n.loading="eager");const i=s.querySelector(".gym-v1__gloss"),u=Number((e.id.match(/(\d+)$/)||[0,1])[1]);return i?.style.setProperty("--gloss-duration",`${8.3+u%6*.9}s`),i?.style.setProperty("--gloss-delay",`${-(u*1.31%7.6)}s`),s}function Ks(e,a,r=!1){const t=document.createElement("div");t.className=`gym-v1__item ${e.kind==="title"?"is-title":"is-deco"}`,t.dataset.item=e.key,Ga(t,e),t.innerHTML=`<img class="gym-v1__img" data-src="${a}/love-scene-academia/kit/${e.file}" alt="" aria-hidden="true" draggable="false" />`;const s=t.querySelector(".gym-v1__img");return r&&s?.dataset.src&&(s.src=s.dataset.src,s.removeAttribute("data-src")),t}function Qs(e,a,r=!1){const t=document.createElement("section");return t.className=`gym-v1__spread gym-v1__spread--${e.id}`,e.photos.forEach(s=>t.appendChild(Us(s,a,r))),e.deco.forEach(s=>t.appendChild(Ks(s,a,r))),t}function Pa(e){e?.querySelectorAll("img[data-src]").forEach(a=>{a.src=a.dataset.src,a.removeAttribute("data-src")})}function Zs(e){e.forEach(a=>{const r=parseFloat(a.dataset.rot||"0");a.style.opacity="0",a.style.transform=`translate(0vw,0vh) rotate(${r}deg)`})}function Zt(e){e.forEach(a=>{const r=parseFloat(a.dataset.rot||"0");a.style.opacity="1",a.style.transform=`translate(0vw,0vh) rotate(${r}deg)`})}function Tt(e,a,r){const t=Js(a),s=window.innerWidth<=860,n=(i,u)=>{if(!s)return[i,u];const c=Math.sign(i),f=Math.sign(u);return c&&f?[c*112,f*76]:c?[c*116,0]:f?[0,f*112]:[0,0]};e.forEach(i=>{const u=parseFloat(i.dataset.rot||"0"),c=parseFloat(i.dataset.enterX||"0"),f=parseFloat(i.dataset.enterY||"0"),p=parseFloat(i.dataset.exitX||"0"),l=parseFloat(i.dataset.exitY||"0"),[d,b]=n(c,f),[g,m]=n(p,l),h=r==="in"?d*(1-t):g*t,E=r==="in"?b*(1-t):m*t;i.style.opacity="1",i.style.transform=`translate(${h}vw,${E}vh) rotate(${u}deg)`})}function ei(e,a){const r=e.querySelector(".gym-v1__section"),t=Number.parseFloat(e.dataset.loveTrioProgress||"");let s;if(window.innerWidth<=860&&Number.isFinite(t))s=sa(t,0,1);else{const n=r.getBoundingClientRect(),i=Math.max(1,n.height-window.innerHeight);s=sa(-n.top/i,0,1)}s>.1&&Pa(a.a02.root),s>.48&&Pa(a.a03.root),Object.values(a).forEach(n=>Zs(n.items)),s<=ae.a1HoldEnd?Zt(a.a01.items):s<=ae.a1OutEnd?Tt(a.a01.items,Ft(s,ae.a1HoldEnd,ae.a1OutEnd),"out"):s<=ae.a2InEnd?Tt(a.a02.items,Ft(s,ae.a1OutEnd,ae.a2InEnd),"in"):s<=ae.a2HoldEnd?Zt(a.a02.items):s<=ae.a2OutEnd?Tt(a.a02.items,Ft(s,ae.a2HoldEnd,ae.a2OutEnd),"out"):s<=ae.a3InEnd?Tt(a.a03.items,Ft(s,ae.a2OutEnd,ae.a3InEnd),"in"):Zt(a.a03.items)}function ti(e,a={}){if(!e)throw new Error("initGymScene(root): root é obrigatório.");const r=(a.assetBase||"/assets").replace(/\/$/,""),t=document.createElement("section");t.className="gym-v1",t.innerHTML=`<div class="gym-v1__section"><div class="gym-v1__sticky"><div class="gym-v1__scene-stage"><div class="gym-v1__paper" aria-hidden="true"></div><div class="gym-v1__canvas"><img class="gym-v1__tapago" src="${r}/love-scene-academia/kit/tapago.png" alt="Amo receber os tá pago" draggable="false" /></div></div></div></div>`;const s=t.querySelector(".gym-v1__canvas"),n={};Gs.forEach((p,l)=>{const d=Qs(p,r,l===0);s.appendChild(d),n[p.id]={root:d,items:[...d.querySelectorAll(".gym-v1__item")]}}),e.appendChild(t);const i=[];t.querySelectorAll(".gym-v1__photo-img").forEach(p=>{const l=p.closest(".gym-v1__item"),d=()=>l?.classList.add("is-loaded"),b=()=>l?.classList.add("is-error");p.addEventListener("load",d),p.addEventListener("error",b),i.push(()=>{p.removeEventListener("load",d),p.removeEventListener("error",b)}),p.hasAttribute("src")&&p.complete&&(p.naturalWidth?d():b())});const u=()=>ei(t,n),c=Se(u,{root:t,rootMargin:"125% 0px"}),f=ve(()=>c.flush());return i.push(()=>f.destroy()),{root:t,render:u,refresh(){c.flush()},destroy(){c.destroy(),i.splice(0).forEach(p=>p()),t.remove()}}}function ai(e,a={}){if(!e)throw new Error("initLoveTrioScene(root): root é obrigatório.");const r=(a.assetBase||"/assets").replace(/\/$/,""),t=document.createElement("section");t.className="love-trio",t.innerHTML=`
    <div class="love-trio__smile" data-love-trio-smile></div>
    <div class="love-trio__style" data-love-trio-style></div>
    <div class="love-trio__gym" data-love-trio-gym></div>
  `,e.appendChild(t);const s=Os(t.querySelector("[data-love-trio-smile]"),{assetBase:r}),n=Ws(t.querySelector("[data-love-trio-style]"),{assetBase:r}),i=ti(t.querySelector("[data-love-trio-gym]"),{assetBase:r}),u=860,c={smile:3.55,style:4.85,gym:3.7},f=c.smile+c.style+c.gym,p=f+1;let l=0,d=window.innerWidth,b=window.innerWidth<=u,g=0;const m=(_,x,$)=>Math.max(x,Math.min($,_));function h(_,x){_?.root&&(_.root.dataset.loveTrioProgress=String(m(x,0,1)))}function E(){[s,n,i].forEach(_=>{_?.root?.removeAttribute("data-love-trio-progress")}),t.removeAttribute("data-mobile-act")}function M(_=!1){const x=window.innerWidth<=u,$=x!==b;if(b=x,!x)return l=0,d=window.innerWidth,t.style.removeProperty("--love-trio-mobile-track-h"),t.style.removeProperty("height"),E(),$;const V=Math.round(window.innerWidth),P=Math.abs(V-d)>24;if(!_&&l&&!P&&!$)return!1;l=Math.max(480,Math.round(window.innerHeight||0)),d=V;const q=Math.round(l*p);return t.style.setProperty("--love-trio-mobile-track-h",`${q}px`),t.style.height=`${q}px`,!0}function T(){if(!b||!l)return;const _=m(-t.getBoundingClientRect().top,0,l*f),x=c.smile*l,$=c.style*l,V=c.gym*l;h(s,_/x),h(n,(_-x)/$),h(i,(_-x-$)/V),s.render?.(),n.render?.(),i.render?.(),t.dataset.mobileAct=_<x?"smile":_<x+$?"style":"gym"}function B(){cancelAnimationFrame(g),g=requestAnimationFrame(()=>{t.querySelectorAll(".smile-v5__item, .style-v1__item, .gym-v1__item").forEach(x=>{x.style.removeProperty("--love-trio-mobile-right-nudge-x"),x.style.removeProperty("transform-origin")}),!(window.innerWidth>u)&&t.querySelectorAll(".smile-v5__canvas, .style-v1__canvas, .gym-v1__canvas").forEach(x=>{const $=x.clientWidth||1,V=Math.max(14,Math.round($*.035)),P=$-V;x.querySelectorAll(".smile-v5__item, .style-v1__item, .gym-v1__item").forEach(q=>{const z=q.offsetWidth,F=q.offsetHeight;if(!z||!F)return;const ge=q.offsetLeft+z/2;if(ge/$<.56)return;const j=getComputedStyle(q).scale,ce=Number.parseFloat(j&&j!=="none"?j:"1")||1,K=(Number.parseFloat(q.dataset.rot||"0")||0)*Math.PI/180,de=Math.abs(Math.cos(K)),Q=Math.abs(Math.sin(K)),ke=ce*(z/2*de+F/2*Q),Te=ge+ke-P;if(Te>.25){const Ye=-(Te+3);q.style.setProperty("--love-trio-mobile-right-nudge-x",`${Ye.toFixed(2)}px`)}})})})}function se(){M(!1)&&(s.refresh?.(),n.refresh?.(),i.refresh?.(),B()),T()}M(!0),B(),T();const J=Se(T,{root:t,rootMargin:"125% 0px"}),U=ve(se);return t.querySelectorAll("img").forEach(_=>_.addEventListener("load",B,{passive:!0})),{root:t,smileScene:s,styleScene:n,gymScene:i,refresh(){M(!0),s.refresh?.(),n.refresh?.(),i.refresh?.(),B(),T()},destroy(){J.destroy(),cancelAnimationFrame(g),U.destroy(),t.querySelectorAll("img").forEach(_=>_.removeEventListener("load",B)),s.destroy?.(),n.destroy?.(),i.destroy?.(),t.remove()}}}const ne=(e,a=0,r=1)=>Math.max(a,Math.min(r,e)),It=(e,a,r)=>e+(a-e)*r,qe=e=>(e=ne(e),e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2),si=[1,2,5,6,9,10,13],ii=[12,11,8,7,4,3],ri="vivencias-final.mp4",oi="videofinal.mp4",ni=[[152,114,146],[171,134,168],[159,132,180],[189,155,176]],li=[[199,165,205],[224,180,186],[226,195,169],[178,152,210],[156,195,214]];function Ma(e,a){const r=ne(a)*(e.length-1),t=Math.min(e.length-2,Math.floor(r)),s=r-t;return e[t].map((n,i)=>Math.round(It(n,e[t+1][i],s))).join(" ")}function Aa(e,a,r,t){const s=document.createElement("figure");s.className="viv4__card",s.dataset.photo=String(e);const n=t==="top"?[-3,2,-1,3,-2,2,-1]:[2,-2,3,-1,2,-3],i=t==="top"?[-8,12,-2,10,-6,14,0]:[10,-7,13,-2,8,-11];s.style.setProperty("--viv4-rot",`${n[r%n.length]}deg`),s.style.setProperty("--viv4-y",`${i[r%i.length]}px`),s.style.setProperty("--viv4-gloss-duration",`${8.2+e%5*.56}s`),s.style.setProperty("--viv4-gloss-delay",`${.7+e%7*.63}s`);const u=document.createElement("div");u.className="viv4__media";const c=document.createElement("img");c.className="viv4__photo",c.alt="",c.decoding="async",c.loading="eager",c.dataset.src=`${a}/vivencias-${String(e).padStart(2,"0")}.webp`,c.addEventListener("load",()=>{s.classList.add("is-loaded"),c.naturalWidth>c.naturalHeight*1.18&&s.classList.add("is-landscape")},{once:!0}),c.addEventListener("error",()=>{s.classList.remove("is-loaded"),c.removeAttribute("src")});const f=document.createElement("span");return f.className="viv4__gloss",u.append(c,f),s.append(u),s}function qa(e){e.querySelectorAll("img[data-src]").forEach(a=>{a.getAttribute("src")||(a.src=a.dataset.src)})}function Ae(e,a){e&&(e.style.transform=`translate3d(0,${a}px,0)`)}function ci(e,a,r={}){const t=document.createElement("section");t.className="viv4-bridge is-locked",t.innerHTML=`
    <div class="viv4-bridge__sticky">
      <div class="viv4-bridge__final-screen">
        <div class="viv4-bridge__video-host"></div>
        <img
          class="viv4-bridge__balloon"
          src="${a}/balaofala.png"
          alt=""
          draggable="false"
        />
      </div>
    </div>
  `,e.appendChild(t);const s=t.querySelector(".viv4-bridge__final-screen");t.querySelector(".viv4-bridge__balloon");const n=t.querySelector(".viv4-bridge__video-host");let i=null,u=null,c=!1,f=-1,p=0,l=!1,d=!1,b=!1,g=!1,m=!1,h=0;function E(){c||g||(g=!0,l=!1,t.classList.add("is-complete"),r.onComplete?.())}function M(){i&&(i.removeEventListener("ended",E),i.pause(),i.removeAttribute("src"),i.load(),i.remove(),i=null)}function T(){return i||(i=document.createElement("video"),i.className="viv4-bridge__video",i.controls=!0,i.playsInline=!0,i.preload="metadata",i.defaultMuted=!1,i.muted=!1,i.volume=1,i.loop=!1,i.removeAttribute("loop"),i.dataset.videoRole="segundo-video-final",i.src=`${a}/${oi}`,i.addEventListener("ended",E),n.appendChild(i),i)}function B(){const x=Number.parseFloat(t.style.getPropertyValue("--viv4-bridge-vh"))||window.innerHeight,$=Math.max(1,t.offsetHeight-x);return ne(-t.getBoundingClientRect().top/$)}function se(){c||(d=!1,b=!1,l=!1,g=!1,m=!1,h&&(clearTimeout(h),h=0),f=-1,p=0,t.classList.add("is-locked"),t.classList.remove("is-unlocked","is-complete"),s.classList.remove("is-video-only","is-balloon-flash"),s.style.transform="translate3d(0,100%,0)",M(),u?.schedule())}function J(){d||c||(T(),d=!0,b=!1,l=!1,m=!1,h&&(clearTimeout(h),h=0),s.classList.remove("is-balloon-flash"),f=-1,p=0,t.classList.remove("is-locked"),t.classList.add("is-unlocked"),u?.schedule())}function U(x){if(!Number.isFinite(x)||x<=0){t.style.removeProperty("--viv4-bridge-vh"),t.style.removeProperty("--viv4-bridge-h"),t.style.removeProperty("--viv4-bridge-mt");return}t.style.setProperty("--viv4-bridge-vh",`${x}px`),t.style.setProperty("--viv4-bridge-h",`${Math.round(x*3.3)}px`),t.style.setProperty("--viv4-bridge-mt",`${Math.round(-x*1.3)}px`)}function _(){if(c||!d)return;const x=B(),$=x-p;if(x>.08&&(b=!0),b&&$<-1e-4&&x<=.018){r.onReturn?.(),se();return}if(Math.abs(x-f)>1e-4){f=x;const V=window.innerWidth<=860?.5:.58,P=qe(ne(x/V));if(s.style.transform=`translate3d(0,${It(100,0,P)}%,0)`,x>.08&&!m&&(m=!0,s.classList.remove("is-balloon-flash"),s.offsetWidth,s.classList.add("is-balloon-flash"),h=window.setTimeout(()=>{h=0,s.classList.remove("is-balloon-flash")},420)),x>.52&&!l&&i){l=!0,i.muted=!1;const q=i.play();q&&typeof q.catch=="function"&&q.catch(()=>{i&&(i.muted=!1,i.volume=1,i.controls=!0,i.dataset.audioBlocked="true")})}if(x<.46&&l&&(l=!1,i)){i.pause();try{i.currentTime=0}catch{}}s.classList.toggle("is-video-only",x>.88)}p=x}return u=Se(_,{root:t,rootMargin:"110% 0px"}),{root:t,unlock:J,lock:se,setMobileViewportHeight:U,refresh(){f=-1,u?.flush()},destroy(){c=!0,u?.destroy(),h&&clearTimeout(h),M(),t.remove()}}}function di(e,a={}){if(!e)throw new Error("initVivenciasScene(root): root é obrigatório.");const r=(a.assetBase||"/assets/vivencias").replace(/\/$/,""),t=document.createElement("section");t.className="viv4",t.innerHTML=`
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
  `;const s=t.querySelector(".viv4__rail--top"),n=t.querySelector(".viv4__rail--bottom"),i=t.querySelector(".viv4__headline-viewport"),u=t.querySelector(".viv4__headline--1"),c=t.querySelector(".viv4__headline--2"),f=t.querySelector(".viv4__ending"),p=t.querySelector(".viv4__ending-copy"),l=t.querySelector(".viv4__bubble"),d=t.querySelector(".viv4__video");si.forEach((y,S)=>s.appendChild(Aa(y,r,S,"top"))),ii.forEach((y,S)=>n.appendChild(Aa(y,r,S,"bottom"))),e.appendChild(t);const b=ci(e,r,{onReturn:()=>Ye("bridge"),onComplete:()=>se()}),g=document.createElement("section");g.className="love-outro is-locked",g.setAttribute("aria-label","Continua"),g.setAttribute("aria-hidden","true"),g.innerHTML=`
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
  `,e.appendChild(g);const m=[...g.querySelectorAll("[data-vote]")],h=g.querySelector(".love-outro__status"),E=g.querySelector("[data-replay]");let M=!1,T=0;function B(){clearTimeout(T),g.classList.add("is-locked"),g.classList.remove("is-ready"),g.setAttribute("aria-hidden","true")}function se(){V||g.classList.contains("is-ready")||(g.classList.remove("is-locked"),g.setAttribute("aria-hidden","false"),requestAnimationFrame(()=>g.classList.add("is-ready")),T=window.setTimeout(()=>{if(V||!g.classList.contains("is-ready"))return;const y=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;g.scrollIntoView({behavior:y?"auto":"smooth",block:"start"})},120))}function J(){try{sessionStorage.setItem("love-story-replay-v1","1")}catch{}try{history.scrollRestoration="manual"}catch{}document.documentElement.style.scrollBehavior="auto",window.scrollTo(0,0),window.location.reload()}E?.addEventListener("click",J);function U(y,S="saved"){m.forEach(R=>{R.classList.toggle("is-selected",R.dataset.vote===y),R.disabled=S==="pending"}),h&&(S==="pending"?h.textContent="Enviando...":S==="saved"?h.textContent="Voto enviado ♡":S==="error"&&(h.textContent="Não consegui enviar. Tenta de novo."))}m.forEach(y=>y.addEventListener("click",()=>{if(M)return;const S=y.dataset.vote;M=!0,U(S,"pending"),document.dispatchEvent(new CustomEvent("love:vote",{detail:{vote:S}}))}));const _=y=>{M=!1,U(y.detail?.vote,"saved")},x=y=>{M=!1,U(y.detail?.vote,"error")};document.addEventListener("love:vote-saved",_),document.addEventListener("love:vote-error",x);let $=null,V=!1,P=!1,q=!1,z=!1,F=!1,oe=0,ge=!1,le=!0,ie=null,j=0,ce=window.innerWidth,K=-1;function de(y){F&&(y.type==="keydown"&&!["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," ","Spacebar"].includes(y.key)||y.preventDefault())}function Q(){!F||ge||Math.abs(window.scrollY-oe)>1&&(ge=!0,window.scrollTo(0,oe),requestAnimationFrame(()=>{ge=!1}))}function ke(){F||z||(F=!0,oe=window.scrollY,window.addEventListener("wheel",de,{passive:!1}),window.addEventListener("touchmove",de,{passive:!1}),window.addEventListener("keydown",de,{passive:!1}),window.addEventListener("scroll",Q,{passive:!0}))}function ue(){F&&(F=!1,window.removeEventListener("wheel",de),window.removeEventListener("touchmove",de),window.removeEventListener("keydown",de),window.removeEventListener("scroll",Q))}function Te(){if(!P)return;d.pause();const y=()=>{try{d.currentTime=Math.min(.01,Number.isFinite(d.duration)?Math.max(0,d.duration-.01):.01)}catch{}};d.readyState>=2?y():d.addEventListener("loadeddata",y,{once:!0})}function Ye(y="scene"){V||(ue(),B(),z=!1,q=!1,le=y!=="bridge",ie=y==="bridge"?window.scrollY:null,b.lock(),Te(),K=-1,$?.schedule())}function et(){z||(z=!0,q=!1,ue(),b.unlock())}function Z(){if(q||z||!le)return;at(),q=!0,d.muted=!1,d.volume=1,d.loop=!1;try{d.currentTime=0}catch{}ke();const y=d.play();y&&typeof y.catch=="function"&&y.catch(()=>{q=!1,ue()})}d.addEventListener("ended",et),d.addEventListener("error",()=>{q=!1,ue()});function Le(){const y=t.dataset.vivenciasProgress;if(y!=null&&y!==""){const S=Number(y);if(Number.isFinite(S))return ne(S)}return null}function I(){return window.innerWidth<=860&&j?j:window.innerHeight}function ee(y=!1){if(!(window.innerWidth<=860))return j=0,ce=window.innerWidth,t.style.removeProperty("height"),t.style.removeProperty("min-height"),t.style.removeProperty("--viv4-mobile-vh"),b.setMobileViewportHeight(null),!0;const R=Math.round(window.innerWidth),N=Math.abs(R-ce)>24;return!y&&j&&!N?!1:(j=Math.max(480,Math.round(window.innerHeight||0)),ce=R,t.style.height=`${Math.round(j*9.3)}px`,t.style.minHeight=`${Math.round(j*9.3)}px`,t.style.setProperty("--viv4-mobile-vh",`${j}px`),b.setMobileViewportHeight(j),!0)}function tt(){const y=Le();if(y!=null)return y;const S=Math.max(1,t.offsetHeight-I());return ne(-t.getBoundingClientRect().top/S)}function be(y){const R=(i?.offsetHeight||360)+Math.max(80,I()*.08);if(y<.22)Ae(u,0);else if(y<.295){const N=qe((y-.22)/.075);Ae(u,-R*N)}else Ae(u,-R);if(y<.335)Ae(c,R);else if(y<.42){const N=qe((y-.335)/.085);Ae(c,R*(1-N))}else if(y<.57)Ae(c,0);else if(y<.655){const N=qe((y-.57)/.085);Ae(c,-R*N)}else Ae(c,-R)}function $e(y){const S=window.innerWidth,R=ne(y/.735),N=qe(R),Ce=s.scrollWidth,_t=n.scrollWidth,_e=Math.max(20,S*.055),Et=_e,St=S-Ce-_e,kt=S-_t-_e,Be=_e;let He=It(Et,St,N),Pe=It(kt,Be,N);if(y>.735){const Lt=qe((y-.735)/.075);He-=S*1.12*Lt,Pe+=S*1.12*Lt}s.style.transform=`translate3d(${He}px,-50%,0)`,n.style.transform=`translate3d(${Pe}px,-50%,0)`}function at(){P||(d.src=`${r}/${ri}`,d.playsInline=!0,d.muted=!1,d.volume=1,d.loop=!1,d.preload="auto",d.classList.add("has-source"),P=!0)}function xe(y=0,S=1){window.innerWidth<=860?p.style.transform=`translateX(-50%) translateY(calc(-50% + ${y}px)) scale(${S})`:p.style.transform=`translateX(-50%) translateY(${y}px) scale(${S})`}function pe(y){const S=ne(y),R=I()*1.08;l.style.transform=`translate(-50%, calc(-50% + ${(1-S)*R}px))`}function bt(){if(V)return;const y=tt();if(!le&&!z&&(y<.945||ie!=null&&window.scrollY>ie+3)&&(le=!0,ie=null),z&&y<.945&&Ye("scene"),Math.abs(y-K)>1e-4){if(K=y,t.style.setProperty("--viv4-progress",String(Math.max(.01,y))),t.style.setProperty("--viv4-bg-rgb",Ma(ni,ne(y/.74))),qa(s),qa(n),be(y),$e(y),f.style.transform="translateY(105%)",xe(0,1),pe(0),y>=.75&&y<.835){const S=qe((y-.75)/.085);f.style.transform=`translateY(${(1-S)*105}%)`}else if(y>=.835&&(f.style.transform="translateY(0)",f.style.setProperty("--viv4-end-rgb",Ma(li,ne((y-.835)/.105))),y>.875)){const S=qe(ne((y-.875)/.09));window.innerWidth<=860?xe(-S*I()*.34,1-S*.14):xe(0,1-S*.06),pe(S),y>.9&&at(),y>=.972&&!z&&le&&Z()}}}const te=ve(()=>{ee(!1),K=-1,$?.schedule()});return ee(!0),$=Se(bt,{root:t,rootMargin:"125% 0px"}),{root:t,refresh(){ee(!1),K=-1,b.refresh?.(),$?.schedule()},setProgress(y){t.dataset.vivenciasProgress=String(ne(y)),K=-1,$?.schedule()},clearProgress(){delete t.dataset.vivenciasProgress,K=-1,$?.schedule()},destroy(){V=!0,$?.destroy(),ue(),te.destroy(),d.removeEventListener("ended",et),d.pause(),d.removeAttribute("src"),d.load(),document.removeEventListener("love:vote-saved",_),document.removeEventListener("love:vote-error",x),E?.removeEventListener("click",J),clearTimeout(T),g.remove(),b.destroy(),t.remove()}}}function ui(e,a={}){if(!e)throw new Error("initFullLoveScene(root): root é obrigatório.");const r=(a.assetBase||"/assets").replace(/\/$/,""),t=document.createElement("section");t.className="full-love",t.innerHTML=`
    <div class="full-love__trio" data-full-love-trio></div>
    <div class="full-love__vivencias" data-full-love-vivencias></div>
  `,e.appendChild(t);const s=t.querySelector("[data-full-love-trio]"),n=t.querySelector("[data-full-love-vivencias]"),i=ai(s,{assetBase:r}),u=di(n,{assetBase:`${r}/vivencias`});return{root:t,trioScene:i,vivenciasScene:u,refresh(){i.refresh?.(),u.refresh?.()},destroy(){i.destroy?.(),u.destroy?.(),t.remove()}}}function pi(){const e=document.querySelector("[data-love-continuation-shell]"),a=document.querySelector("[data-love-continuation-root]"),r=document.querySelector("[data-next-scene-root]");if(!e||!a)return null;const t=ui(a,{assetBase:"/assets"});e.classList.add("is-prepared"),e.setAttribute("aria-hidden","false"),window.fullLoveScene=t;let s=null,n=0,i=!1;function u(g){g.querySelectorAll(".smile-v5__spread").forEach((m,h)=>{h>0&&m.remove()}),g.querySelectorAll(".smile-v5__item").forEach(m=>{const h=Number.parseFloat(m.dataset.rot||"0")||0;m.style.opacity="1",m.style.transform=`translate(0vw, 0vh) rotate(${h}deg)`}),g.querySelectorAll("img[data-src]").forEach(m=>{m.src=m.dataset.src,m.removeAttribute("data-src"),m.loading="eager"}),g.querySelectorAll(".smile-v5__photo-img").forEach(m=>{m.closest(".smile-v5__item")?.classList.add("is-loaded")}),g.querySelector(".smile-v5__scene-stage")?.style.setProperty("transform","translate3d(0,0,0)")}function c(g){const m=g.querySelector(".smile-v5__section"),h=m?.querySelector(":scope > .smile-v5__sticky"),E=h?.querySelector(":scope > .smile-v5__scene-stage"),M=E?.querySelector(":scope > .smile-v5__canvas"),T=M?.querySelector(":scope > .smile-v5__spread");if(!m||!h||!E||!M||!T)return g.cloneNode(!0);const B=g.cloneNode(!1),se=m.cloneNode(!1),J=h.cloneNode(!1),U=h.querySelector(":scope > .smile-v5__next-style-bg");U&&J.appendChild(U.cloneNode(!0));const _=E.cloneNode(!1);[...E.children].forEach($=>{$!==M&&_.appendChild($.cloneNode(!0))});const x=M.cloneNode(!1);return x.appendChild(T.cloneNode(!0)),_.appendChild(x),J.appendChild(_),se.appendChild(J),B.appendChild(se),B}function f(){const g=t?.trioScene?.smileScene?.root;if(!g)return null;t.trioScene.smileScene.refresh?.();const m=document.createElement("div");m.className="love-trio main-continuation-preview",m.setAttribute("aria-hidden","true");const h=document.createElement("div");h.className="love-trio__smile";const E=c(g);return E.classList.add("main-continuation-preview__smile"),u(E),h.appendChild(E),m.appendChild(h),m}function p(g=r){if(!g||(s||(s=f()),!s))return null;const m=s.querySelector(".main-continuation-preview__smile");return m&&u(m),s.parentElement!==g&&g.replaceChildren(s),g.classList.add("is-preview-ready"),s}function l(g){const m=g?.detail?.mount||r;cancelAnimationFrame(n),n=requestAnimationFrame(()=>{t.refresh?.(),n=requestAnimationFrame(()=>{p(m),document.dispatchEvent(new CustomEvent("nextscene:preview-ready",{detail:{mount:m,preview:s}}))})})}function d(g){const m=g?.detail?.mount||r;p(m),e.classList.add("is-active"),e.setAttribute("aria-hidden","false"),document.dispatchEvent(new CustomEvent("nextscene:activated",{detail:{root:e,scene:t}})),i=!0,document.dispatchEvent(new CustomEvent("nextscene:entered",{detail:{root:e,scene:t}}))}document.addEventListener("nextscene:prepare",l),document.addEventListener("nextscene:ready",d);const b={prepare:l,activate(){return d({detail:{mount:r}})},get scene(){return t},get preview(){return s},get active(){return i}};return window.loveContinuation=b,b}const Fa="love-story-replay-v1";try{if(history&&"scrollRestoration"in history&&(history.scrollRestoration="manual"),sessionStorage.getItem(Fa)==="1"){sessionStorage.removeItem(Fa);const e=()=>window.scrollTo(0,0);e(),requestAnimationFrame(()=>requestAnimationFrame(e)),window.addEventListener("load",e,{once:!0})}}catch{}const ht="M50 88 C42 80 7 58 7 31 C7 11 31 2 50 22 C69 2 93 11 93 31 C93 58 58 80 50 88 Z",fi=[{left:8,delay:-.5,duration:10.8,size:20,drift:2,opacity:.52,glyph:"♡"},{left:16,delay:-4.4,duration:13.2,size:14,drift:-3,opacity:.34,glyph:"♥"},{left:24,delay:-2.1,duration:11.7,size:16,drift:4,opacity:.42,glyph:"♡"},{left:34,delay:-6.2,duration:14.1,size:12,drift:-2,opacity:.28,glyph:"♥"},{left:43,delay:-1.6,duration:12.4,size:18,drift:3,opacity:.46,glyph:"♡"},{left:52,delay:-5,duration:15,size:13,drift:-4,opacity:.3,glyph:"♥"},{left:61,delay:-3,duration:10.9,size:17,drift:2,opacity:.4,glyph:"♡"},{left:69,delay:-7.4,duration:13.7,size:12,drift:-3,opacity:.26,glyph:"♥"},{left:77,delay:-2.7,duration:11.5,size:16,drift:4,opacity:.41,glyph:"♡"},{left:86,delay:-6.7,duration:12.8,size:14,drift:-2,opacity:.33,glyph:"♥"},{left:93,delay:-4,duration:10.6,size:18,drift:3,opacity:.48,glyph:"♡"}];function mi(){return fi.map((e,a)=>`
    <span
      class="hero-float-heart hero-float-heart--${a%3}"
      style="--left:${e.left}%; --delay:${e.delay}s; --dur:${e.duration}s; --size:${e.size}px; --drift:${e.drift}vw; --alpha:${e.opacity};"
    >${e.glyph}</span>
  `).join("")}const hi=[{id:"carnaval",src:"/assets/jujucarnaval02.jpeg",alt:"Arleu e Juliana no carnaval",label:"Dois Gostosos",side:"left",x:16,y:25,size:38,rotate:-5,depth:1.05},{id:"formatura",src:"/assets/jujuformatura.jpeg",alt:"Arleu e Juliana na formatura",label:"🥵🥵🥵",side:"right-top",x:82,y:20,size:28,rotate:6,depth:.9},{id:"casamento",src:"/assets/jujucasamento.jpg",alt:"Arleu e Juliana em uma celebração",label:"Juntos",side:"right-bottom",x:80,y:61,size:27,rotate:-4,depth:1},{id:"filha",src:"/assets/juju-crianca.jpg",alt:"Foto de infância",label:"Espero que nossa filha seja assim.",side:"left-bottom",x:17,y:58,size:22,rotate:4,depth:.95}];function vi(e,a){return`
    <article
      class="memory-heart memory-heart--${e.side}"
      data-memory-heart
      data-id="${e.id}"
      data-x="${e.x}"
      data-y="${e.y}"
      data-rotate="${e.rotate}"
      data-depth="${e.depth}"
      style="--size:${e.size}vmin; --delay:${a*-1.7}s; --tilt:${e.rotate}deg"
      tabindex="0"
      aria-label="Memória: ${e.label}. Você pode arrastar este coração."
    >
      <div class="memory-heart__float">
        <div class="memory-heart__surface">
          <svg class="memory-heart__svg" viewBox="0 0 100 90" role="img" aria-label="${e.alt}">
            <defs>
              <clipPath id="clip-${e.id}">
                <path d="${ht}" />
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
              <path class="memory-heart__wash" d="${ht}" />
              <path class="memory-heart__outline memory-heart__outline--a" d="${ht}" />
              <path class="memory-heart__outline memory-heart__outline--b" d="${ht}" />
            </g>
          </svg>
          <span class="memory-heart__tag">${e.label}<i>♡</i></span>
        </div>
      </div>
    </article>
  `}const gi=document.querySelector("#app");gi.innerHTML=`
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
        ${mi()}
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
        ${hi.map(vi).join("")}
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
          <path d="${ht}" />
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

  <audio id="title-chime" preload="metadata" src="/assets/sounds/notification.mp3"></audio>
  <audio id="background-music" preload="none" loop src="/assets/sounds/musica-fundo.mp3"></audio>
`;try{qs(),pi()}catch(e){console.error("[site-unified] Falha ao iniciar a história:",e)}Ss(()=>import("./engagement-tracker-DC9igncz.js"),[]).catch(e=>console.warn("[analytics] indisponível:",e));const G=document.querySelector(".hero"),Qe=document.querySelector("[data-start]"),Ze=window.matchMedia("(prefers-reduced-motion: reduce)").matches,yi=[...document.querySelectorAll("[data-parallax]")],ia=[...document.querySelectorAll("[data-memory-heart]")];function Ja(e,a,r="35% 0px"){if(!e||typeof a!="function")return{stop(){}};let t=0,s=!1,n=!("IntersectionObserver"in window),i=null;const u=l=>{s&&(a(l),t=requestAnimationFrame(u))},c=()=>{s||document.hidden||!n||(s=!0,t=requestAnimationFrame(u))},f=()=>{!s&&!t||(s=!1,t&&cancelAnimationFrame(t),t=0)},p=()=>{document.hidden?f():c()};return document.addEventListener("visibilitychange",p),"IntersectionObserver"in window?(i=new IntersectionObserver(([l])=>{n=!!l?.isIntersecting,n?c():f()},{root:null,rootMargin:r,threshold:0}),i.observe(e)):c(),{start:c,stop(){f(),i?.disconnect(),document.removeEventListener("visibilitychange",p)}}}function Ua(){return window.innerWidth<=860?1.5:2}const Fe=document.querySelector("[data-heart-portal]"),we=document.querySelector("#ato-1");let Oe=!1,Rt=!0;function ua(e){document.body.classList.toggle("is-intro-locked",e)}ua(!0);function Ta(){if(!we)return;Rt=!1,ua(!1);const e=document.documentElement,a=e.style.scrollBehavior;e.style.scrollBehavior="auto",window.scrollTo(0,we.offsetTop),requestAnimationFrame(()=>{e.style.scrollBehavior=a})}let Ie=0,yt=!1,Re=0,Yt=!1;function wi(e){return!e||e.paused||e.ended||e.readyState<2?!1:e.dataset.videoRole==="segundo-video-final"?!!e.closest(".viv4-bridge__final-screen")?.classList.contains("is-video-only"):!0}function bi(){return[...document.querySelectorAll("video")].some(wi)}function Bt(){!yt&&!Ie||(yt=!1,Re=0,Ie&&cancelAnimationFrame(Ie),Ie=0,document.documentElement.classList.remove("is-auto-journey"))}function Ka(e){if(Ie=0,!yt)return;Re||(Re=e);const a=Math.min(40,Math.max(0,e-Re));if(Re=e,!document.hidden&&!Yt&&!bi()){const r=Math.max(480,window.visualViewport?.height||window.innerHeight||720),t=window.innerWidth<=860,u=Math.max(t?430:560,Math.min(t?760:1080,r*(t?.82:.96))),c=Math.max(0,document.documentElement.scrollHeight-window.innerHeight),f=Math.min(c,window.scrollY+u*a/1e3);if(f>window.scrollY+.05)window.scrollTo(0,f);else if(window.scrollY>=c-2){Bt();return}}Ie=requestAnimationFrame(Ka)}function Ca(){Ze||(Bt(),yt=!0,Re=0,document.documentElement.classList.add("is-auto-journey"),Ie=requestAnimationFrame(Ka))}function jt(e){yt&&(e&&e.isTrusted===!1||Bt())}window.addEventListener("wheel",jt,{passive:!0,capture:!0});window.addEventListener("touchstart",jt,{passive:!0,capture:!0});window.addEventListener("pointerdown",jt,{passive:!0,capture:!0});window.addEventListener("keydown",jt,{capture:!0});document.addEventListener("nextscene:transition-start",()=>{Yt=!0});document.addEventListener("nextscene:ready",()=>{Yt=!0});document.addEventListener("nextscene:entered",()=>{Yt=!1,Re=performance.now()});function Dt(e=Qe,a={}){if(Oe||!we)return;const r=!!a.autoJourney;if(Oe=!0,Ze||!Fe){Ta(),we.classList.add("is-entered"),Oe=!1,r&&Ca();return}const t=e?.getBoundingClientRect?.()||{left:window.innerWidth/2,top:window.innerHeight/2,width:0,height:0};Fe.style.setProperty("--portal-x",`${t.left+t.width/2}px`),Fe.style.setProperty("--portal-y",`${t.top+t.height/2}px`),document.body.classList.add("is-transitioning"),G.classList.add("hero--starting"),Fe.classList.remove("is-settled"),Fe.classList.add("is-active"),window.setTimeout(()=>{Fe.classList.add("is-settled"),Ta(),we.classList.add("is-entered"),requestAnimationFrame(()=>{requestAnimationFrame(()=>{Fe.classList.remove("is-active","is-settled"),G.classList.remove("hero--starting"),document.body.classList.remove("is-transitioning"),Oe=!1,r&&Ca()})})},980)}Qe?.addEventListener("click",()=>Dt(Qe,{autoJourney:!0}));function zt(){return Oe||!Rt?!1:window.scrollY<=Math.max(8,window.innerHeight*.02)}function xi(){Oe||Rt||window.scrollY>1||(Bt(),Rt=!0,we?.classList.remove("is-entered"),G?.classList.remove("hero--starting"),Fe?.classList.remove("is-active","is-settled","is-revealing"),document.body.classList.remove("is-transitioning"),ua(!0),window.scrollY!==0&&window.scrollTo(0,0))}function _i(e){!zt()||e.deltaY<=0||e.target.closest?.("[data-memory-heart]")||(e.preventDefault(),Dt(Qe))}window.addEventListener("wheel",_i,{passive:!1});let vt=null;window.addEventListener("touchstart",e=>{zt()&&(e.target.closest?.("[data-memory-heart], [data-start]")||(vt=e.touches?.[0]?.clientY??null))},{passive:!0});window.addEventListener("touchend",e=>{if(vt==null||!zt())return;const a=e.changedTouches?.[0]?.clientY??vt,r=vt-a;vt=null,r>54&&Dt(Qe)},{passive:!0});window.addEventListener("keydown",e=>{zt()&&["ArrowDown","PageDown"," ","Spacebar"].includes(e.key)&&(e.preventDefault(),Dt(Qe))});window.addEventListener("scroll",()=>{xi(),document.body.classList.contains("is-intro-locked")&&(Oe||window.scrollY!==0&&window.scrollTo(0,0))},{passive:!0});Ze||(G?.addEventListener("pointermove",e=>{const a=G.getBoundingClientRect(),r=(e.clientX-a.left)/a.width-.5,t=(e.clientY-a.top)/a.height-.5;yi.forEach(s=>{const n=Number(s.dataset.parallax||.1);s.style.setProperty("--px",`${r*n*70}px`),s.style.setProperty("--py",`${t*n*55}px`)}),ia.forEach(s=>{const n=Number(s.dataset.depth||1);s.style.setProperty("--heart-px",`${r*n*16}px`),s.style.setProperty("--heart-py",`${t*n*12}px`),s.style.setProperty("--heart-rx",`${-t*n*3.5}deg`),s.style.setProperty("--heart-ry",`${r*n*4.5}deg`)}),document.documentElement.style.setProperty("--mouse-x",`${r}`),document.documentElement.style.setProperty("--mouse-y",`${t}`)}),G?.addEventListener("pointerleave",()=>{ia.forEach(e=>{e.style.setProperty("--heart-px","0px"),e.style.setProperty("--heart-py","0px"),e.style.setProperty("--heart-rx","0deg"),e.style.setProperty("--heart-ry","0deg")})}));const Je=document.querySelector("[data-love-canvas]"),Ne=document.querySelector("[data-cursor-aura]");if(Je&&!Ze){const e=Je.getContext("2d",{alpha:!0}),a={x:innerWidth*.5,y:innerHeight*.5,active:!1,down:!1},r=[],t=[];let s=1,n=1,i=1,u=0;const c=()=>{const g=G.getBoundingClientRect();s=Math.min(window.devicePixelRatio||1,Ua()),n=Math.max(1,g.width),i=Math.max(1,g.height),Je.width=Math.round(n*s),Je.height=Math.round(i*s),Je.style.width=`${n}px`,Je.style.height=`${i}px`,e.setTransform(s,0,0,s,0,0)},f=(g,m,h=1)=>{r.push({x:g,y:m,r:4,a:.24*h,speed:1.8+h*1.5}),r.length>12&&r.shift()},p=(g,m,h=0,E=0)=>{t.push({x:g,y:m,vx:h+(Math.random()-.5)*.55,vy:E+(Math.random()-.5)*.55-.18,life:1,size:1.2+Math.random()*2.4,spin:(Math.random()-.5)*.08,angle:Math.random()*Math.PI*2}),t.length>70&&t.splice(0,t.length-70)},l=(g,m,h,E,M)=>{e.save(),e.translate(g,m),e.rotate(E),e.scale(h/18,h/18),e.beginPath(),e.moveTo(0,5),e.bezierCurveTo(-10,-3,-9,-12,0,-7),e.bezierCurveTo(9,-12,10,-3,0,5),e.strokeStyle=`rgba(206,68,85,${M})`,e.lineWidth=1.35,e.stroke(),e.restore()},d=g=>{e.clearRect(0,0,n,i);for(let m=0;m<3;m+=1){const h=g*23e-5+m*2.1,E=i*(.22+m*.27),M=a.active?(a.x-n*.5)*(.035+m*.008):0,T=a.active?(a.y-i*.5)*(.025+m*.006):0;e.beginPath(),e.moveTo(-60,E+Math.sin(h)*17),e.bezierCurveTo(n*.26+Math.sin(h*1.2)*70,E-42+T,n*.72+M,E+54-T,n+60,E+Math.cos(h*.9)*19),e.strokeStyle=`rgba(202,55,72,${.033+m*.012})`,e.lineWidth=1.1+m*.35,e.stroke()}for(let m=r.length-1;m>=0;m-=1){const h=r[m];h.r+=h.speed,h.a*=.972,e.beginPath(),e.arc(h.x,h.y,h.r,0,Math.PI*2),e.strokeStyle=`rgba(206,68,85,${h.a})`,e.lineWidth=1.2,e.stroke(),h.a<.008&&r.splice(m,1)}for(let m=t.length-1;m>=0;m-=1){const h=t[m];h.x+=h.vx,h.y+=h.vy,h.vx*=.985,h.vy*=.985,h.life*=.982,h.angle+=h.spin,l(h.x,h.y,h.size*4.5,h.angle,Math.max(0,h.life*.32)),h.life<.04&&t.splice(m,1)}};G.addEventListener("pointermove",g=>{const m=G.getBoundingClientRect(),h=g.clientX-m.left,E=g.clientY-m.top,M=h-a.x,T=E-a.y;a.x=h,a.y=E,a.active=!0,Ne&&g.pointerType!=="touch"&&(Ne.classList.add("is-visible"),Ne.style.setProperty("--cursor-x",`${g.clientX}px`),Ne.style.setProperty("--cursor-y",`${g.clientY}px`));const B=performance.now();B-u>34&&Math.abs(M)+Math.abs(T)>4&&(p(h,E,M*.02,T*.02),u=B)}),G.addEventListener("pointerdown",g=>{const m=G.getBoundingClientRect();a.down=!0,f(g.clientX-m.left,g.clientY-m.top,1.25);for(let h=0;h<5;h+=1)p(g.clientX-m.left,g.clientY-m.top);Ne?.classList.add("is-down")});const b=()=>{a.down=!1,Ne?.classList.remove("is-down")};G.addEventListener("pointerup",b),G.addEventListener("pointercancel",b),G.addEventListener("pointerleave",()=>{a.active=!1,Ne?.classList.remove("is-visible","is-down")}),c(),ve(c),Ja(G,d,"20% 0px")}const he=document.querySelector("[data-encounter-stage]"),Ha=document.querySelector("[data-scene-date]"),Ei=document.querySelector("[data-scene-date-line]"),ut=document.querySelector('[data-pose="together"]'),pt=document.querySelector('[data-pose="question"]'),ft=document.querySelector('[data-pose="kiss"]'),mt=document.querySelector('[data-pose="cuddle"]'),Va=document.querySelector('[data-scene-copy="bad"]'),Na=document.querySelector('[data-scene-copy="saved"]'),Oa=document.querySelector('[data-scene-copy="final"]'),pa=e=>Math.max(0,Math.min(1,e)),ye=(e,a,r)=>pa((e-a)/(r-a));let X=0;function Qa(){if(!we||!he)return;const e=we.offsetTop,a=Math.max(1,he.clientHeight||window.innerHeight),r=Math.max(1,we.offsetHeight-a),t=pa((window.scrollY-e)/r);if((t===0||t===1)&&Math.abs(t-X)<1e-4)return;X=t,he.style.setProperty("--encounter-progress",X.toFixed(4));const s=X<.3?"together":X<.58?"question":X<.84?"kiss":"cuddle";ut?.style.setProperty("--pose-opacity",s==="together"?"1":"0"),ut?.style.setProperty("--pose-x","0vw"),ut?.style.setProperty("--pose-y","0vh"),ut?.style.setProperty("--pose-scale","1"),ut?.style.setProperty("--pose-blur","0px"),pt?.style.setProperty("--pose-opacity",s==="question"?"1":"0"),pt?.style.setProperty("--pose-x",".4vw"),pt?.style.setProperty("--pose-y","0vh"),pt?.style.setProperty("--pose-scale","1"),pt?.style.setProperty("--pose-blur","0px"),ft?.style.setProperty("--pose-opacity",s==="kiss"?"1":"0"),ft?.style.setProperty("--pose-x",".2vw"),ft?.style.setProperty("--pose-y","0vh"),ft?.style.setProperty("--pose-scale","1"),ft?.style.setProperty("--pose-blur","0px"),mt?.style.setProperty("--pose-opacity",s==="cuddle"?"1":"0"),mt?.style.setProperty("--pose-x","0vw"),mt?.style.setProperty("--pose-y","0vh"),mt?.style.setProperty("--pose-scale","1"),mt?.style.setProperty("--pose-blur","0px");const n=1,i=ye(X,.02,.16);Ha?.style.setProperty("--scene-opacity",`${n}`),Ha?.style.setProperty("--scene-y",`${ye(X,.18,.36)*-10}px`),Ei?.style.setProperty("--date-write",`${i.toFixed(3)}`);const u=ye(X,.06,.16);Va?.style.setProperty("--scene-opacity",`${u}`),Va?.style.setProperty("--scene-y",`${(1-u)*20}px`);const c=ye(X,.32,.46);Na?.style.setProperty("--scene-opacity",`${c}`),Na?.style.setProperty("--scene-y",`${(1-c)*20}px`);const f=ye(X,.62,.78);Oa?.style.setProperty("--scene-opacity",`${f}`),Oa?.style.setProperty("--scene-y",`${(1-f)*24}px`);const p=ye(X,.18,.7);he.style.setProperty("--scene-warmth",p.toFixed(3)),he.style.setProperty("--party-energy",ye(X,.04,.82).toFixed(3)),he.style.setProperty("--rain-force",`${(.66+X*.34).toFixed(3)}`);const l=ye(X,.66,.91);he.style.setProperty("--kiss-heart-opacity",l.toFixed(3)),he.style.setProperty("--kiss-heart-scale",`${(.05+l*1.58).toFixed(3)}`),he.style.setProperty("--hint-opacity",`${(1-ye(X,0,.14)).toFixed(3)}`)}const Za=Se(Qa,{root:we,rootMargin:"110% 0px"});ve(Za.schedule);Za.schedule();function es(e,a={}){if(!e||Ze)return;const r=e.getContext("2d",{alpha:!0}),t=[],s={density:a.density??115,minSpeed:a.minSpeed??9,maxSpeed:a.maxSpeed??18,minLen:a.minLen??8,maxLen:a.maxLen??25,alpha:a.alpha??.28,width:a.width??1,wind:a.wind??-1.6};let n=1,i=1,u=1;const c=(l,d=!0)=>{l.x=Math.random()*n*1.15-n*.06,l.y=d?Math.random()*i:-40-Math.random()*120,l.speed=s.minSpeed+Math.random()*(s.maxSpeed-s.minSpeed),l.len=s.minLen+Math.random()*(s.maxLen-s.minLen),l.alpha=s.alpha*(.45+Math.random()*.7),l.offset=Math.random()*6.28},f=()=>{const l=e.getBoundingClientRect();n=Math.max(1,l.width),i=Math.max(1,l.height),u=Math.min(window.devicePixelRatio||1,Ua()),e.width=Math.round(n*u),e.height=Math.round(i*u),r.setTransform(u,0,0,u,0,0);const d=Math.max(45,Math.round(s.density*(n/1440)));for(;t.length<d;){const b={};c(b,!0),t.push(b)}t.length=d},p=l=>{r.clearRect(0,0,n,i);const d=.78+X*.42;r.lineCap="round";for(const b of t){b.y+=b.speed*d,b.x+=s.wind*d,(b.y>i+60||b.x<-100)&&c(b,!1);const g=.84+Math.sin(l*.003+b.offset)*.16;r.beginPath(),r.moveTo(b.x,b.y),r.lineTo(b.x+s.wind*1.8,b.y+b.len*d),r.strokeStyle=`rgba(255,239,238,${b.alpha*g})`,r.lineWidth=s.width,r.stroke()}};f(),ve(f),Ja(e,p,"45% 0px")}es(document.querySelector("[data-rain-back]"),{density:120,minSpeed:6,maxSpeed:12,minLen:7,maxLen:18,alpha:.19,width:.85,wind:-1.1});es(document.querySelector("[data-rain-front]"),{density:88,minSpeed:12,maxSpeed:22,minLen:16,maxLen:34,alpha:.38,width:1.15,wind:-2.1});const ra=document.querySelector("#transicao-ato-2"),D=document.querySelector("[data-tear-stage]"),Si=document.querySelector("[data-tear-page]"),oa=document.querySelector("[data-tear-snapshot]"),Ct=document.querySelector("[data-tear-next]"),Ia=document.querySelector("[data-tear-edge]"),wt=document.querySelector("[data-story]"),Ra=wt?.querySelector(".chat-scene");let na=!1,la=!1,Ht=null;D&&D.parentElement!==document.body&&document.body.appendChild(D);function ts(e,a){if(!e)return null;const r=e.cloneNode(!0);r.classList.add(a);const t=[...e.querySelectorAll("canvas")];return[...r.querySelectorAll("canvas")].forEach((n,i)=>{const u=t[i];if(u)try{n.width=u.width,n.height=u.height,n.getContext("2d")?.drawImage(u,0,0)}catch{}}),r}function ki(){if(na||!oa||!he)return;Qa();const e=ts(he,"tear-snapshot-stage");e&&(e.removeAttribute("data-encounter-stage"),oa.replaceChildren(e),na=!0)}function Li(){if(la||!Ct||!Ra)return;const e=ts(Ra,"tear-next-stage-clone");if(!e)return;const a=getComputedStyle(wt);["--paper","--ink","--sage","--header-h","--composer-h","--chat-dim","--composer-dim"].forEach(r=>{const t=a.getPropertyValue(r);t&&Ct.style.setProperty(r,t)}),e.removeAttribute("data-scene"),e.setAttribute("aria-hidden","true"),Ct.replaceChildren(e),la=!0}function fa(){D&&(D.style.setProperty("--tear-y","103%"),D.style.setProperty("--tear-lift","0vh"),D.style.setProperty("--tear-tilt","0deg"),D.style.setProperty("--tear-progress","0"),D.style.setProperty("--tear-edge-opacity","0"))}function $i(){if(!ra||!D||!Si||!wt)return;const e=Math.max(1,D.clientHeight||window.innerHeight),a=ra.offsetTop-e,r=wt.offsetTop,t=Math.max(1,r-a),s=pa((window.scrollY-a)/t);if(!(window.scrollY>=a&&window.scrollY<r)){const d=window.scrollY<a?"before":"after";if(Ht===d)return;Ht=d,D.classList.remove("is-active"),d==="before"&&fa();return}Ht="active",ki(),Li(),D.classList.add("is-active");const i=ye(s,.02,.91),u=i*i*(3-2*i),c=103-u*121,f=-u*3.2,p=-u*.38,l=i<=.01||i>=.995?0:1;D.style.setProperty("--tear-y",`${c.toFixed(3)}%`),D.style.setProperty("--tear-lift",`${f.toFixed(3)}vh`),D.style.setProperty("--tear-tilt",`${p.toFixed(3)}deg`),D.style.setProperty("--tear-progress",u.toFixed(4)),D.style.setProperty("--tear-edge-opacity",`${l}`),Ia&&(Ia.style.opacity=`${l}`)}const as=Se($i,{root:ra||wt,rootMargin:"110% 0px"});ve(()=>{na=!1,la=!1,Ht=null,oa?.replaceChildren(),Ct?.replaceChildren(),fa(),as.schedule()});fa();as.schedule();const Pi=ia,ss=[];Pi.forEach(e=>{const a=Number(e.dataset.x),r=Number(e.dataset.y),t=Number(e.dataset.rotate);let s=0,n=0,i=0,u=0,c=!1,f=null,p=0,l=0,d=0,b=0,g=0,m=0,h=0,E=null;const M=()=>{const _=G.getBoundingClientRect();e.style.left=`${a/100*_.width}px`,e.style.top=`${r/100*_.height}px`},T=()=>{const _=Math.max(-9,Math.min(9,i*.04));e.style.setProperty("--drag-x",`${s}px`),e.style.setProperty("--drag-y",`${n}px`),e.style.setProperty("--drag-rotate",`${t+_}deg`)},B=()=>{i*=.89,u*=.89,s+=i,n+=u;const _=G.getBoundingClientRect(),x=e.getBoundingClientRect(),$=x.left+i,V=x.right+i,P=x.top+u,q=x.bottom+u;($<-x.width*.25||V>_.right+x.width*.25)&&(i*=-.5),(P<_.top-x.height*.25||q>_.bottom+x.height*.25)&&(u*=-.5),T(),Math.abs(i)+Math.abs(u)>.18?E=requestAnimationFrame(B):E=null},se=_=>{_.button!==void 0&&_.button!==0||(E&&cancelAnimationFrame(E),E=null,c=!0,f=_.pointerId,e.classList.add("is-dragging"),e.setPointerCapture?.(f),p=_.clientX,l=_.clientY,d=s,b=n,g=_.clientX,m=_.clientY,h=performance.now())},J=_=>{if(!c||_.pointerId!==f)return;const x=performance.now(),$=Math.max(8,x-h),V=_.clientX-p,P=_.clientY-l;s=d+V,n=b+P,i=(_.clientX-g)/$*16,u=(_.clientY-m)/$*16,g=_.clientX,m=_.clientY,h=x,T()},U=_=>{if(!(!c||_.pointerId!==void 0&&_.pointerId!==f)){c=!1,e.classList.remove("is-dragging");try{e.releasePointerCapture?.(f)}catch{}f=null,Ze||(E=requestAnimationFrame(B))}};e.addEventListener("pointerdown",se),e.addEventListener("pointermove",J),e.addEventListener("pointerup",U),e.addEventListener("pointercancel",U),e.addEventListener("lostpointercapture",U),e.addEventListener("keydown",_=>{const x=_.shiftKey?24:10;if(_.key==="ArrowLeft")s-=x;else if(_.key==="ArrowRight")s+=x;else if(_.key==="ArrowUp")n-=x;else if(_.key==="ArrowDown")n+=x;else return;_.preventDefault(),T()}),M(),ss.push(M)});ve(()=>ss.forEach(e=>e()));
