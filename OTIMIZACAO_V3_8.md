# V3.8 — otimização e estabilidade

Esta revisão parte da V3.7 e não redesenha os atos. O foco é reduzir trabalho fora da tela e tornar os retornos entre cenas mais previsíveis, principalmente em mobile/trackpad.

## O que mudou

- Sorriso, Estilo, Academia, a ponte Academia → Vivências e Vivências deixaram de manter loops `requestAnimationFrame` permanentes. Agora renderizam por scroll/resize e quando estão próximas da viewport.
- Os canvases decorativos do Hero e da chuva pausam quando suas cenas estão longe da viewport ou quando a aba fica oculta.
- Canvas no mobile limita o DPR a 1.5x para reduzir fill-rate/GPU sem perder nitidez relevante; desktop continua limitado a 2x.
- Ato I e Rotina/Trabalho evitam recalcular estilos continuamente depois que o usuário já está fora do trecho correspondente.
- A prévia Academia → Vivências é criada sob demanda, perto da ponte, em vez de existir desde a entrada em Sorriso.
- A galeria pesada de Vivências também evita trabalho antecipado desnecessário.
- A ponte Trabalho ↔ Sorriso mantém o fluxo único do documento e ganhou proteção contra `overscroll` durante a animação, watchdog para liberar entrada em caso de falha e fallback/timeout para Web Animations.
- No layout mobile, mudanças entre Sorriso/Estilo/Academia sincronizam o frame no mesmo ciclo para evitar atraso visual de um frame.

## O que foi preservado

- Visual e textos dos atos.
- Hero e Ato I.
- Rotina e Trabalho.
- Player e transição Trabalho ↔ Sorriso.
- Sorriso, Estilo e Academia.
- Transição Academia ↔ Vivências.
- Lógica dos vídeos de Vivências.
- Tela final `Continua...`, enquete e `Ver de novo`.
- Analytics / Worker / painel admin.

## Testes de regressão executados

Foram feitos testes de runtime em Chromium headless, desktop e viewport mobile, incluindo múltiplos ciclos de ida/volta em Trabalho ↔ Sorriso e percurso bidirecional por Sorriso → Estilo → Academia → Vivências.

Nos testes de ponte Trabalho ↔ Sorriso, quatro ciclos consecutivos no desktop restauraram o mesmo ponto de scroll, sem overlays órfãos e sem erros JavaScript. O mesmo ciclo foi exercitado em viewport mobile. Também foi testado salto rápido de scroll para dentro de Vivências e retorno pela ponte Academia ↔ Vivências.

Os assets pessoais não fazem parte desses testes automatizados. A validação visual final deve ser feita com os arquivos reais em `public/assets/`.
