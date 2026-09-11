# Polimento de unificação V3.3

Objetivo desta revisão: reduzir a sensação de que o Hero/Ato I e o SITE_UNIFICADO_V3_2 são aplicações diferentes, sem redesenhar ou reescrever os atos aprovados.

## O que mudou

- A transição Ato I -> Rotina ganhou mais curso de scroll e menos inclinação/sombra, ficando menos brusca no desktop e especialmente no touch.
- A matemática do Ato I, do rasgo e da primeira cena da Rotina agora usa a altura real dos respectivos elementos sticky, evitando misturar `100svh` com `window.innerHeight` quando a barra do navegador mobile muda de tamanho.
- O primeiro frame da Rotina não entra mais como uma interface de chat completa de uma vez. O título já está presente no frame zero, sobre uma camada de papel/rosa herdada visualmente do Hero; cabeçalho e composer aparecem progressivamente conforme o usuário continua rolando.
- O clone usado pelo rasgo e a cena real compartilham o mesmo estado inicial, evitando um frame de diferença na soltura do overlay.
- Os rebases invisíveis Trabalho <-> Sorriso neutralizam temporariamente `scroll-behavior: smooth`, para que o navegador não tente animar um reposicionamento que precisa ser instantâneo.
- Na volta fullscreen -> player, a animação usa o tamanho real do overlay (`100dvh`) em vez de `window.innerHeight`, reduzindo saltos em browsers mobile.
- `scrollbar-gutter: stable` reduz micro-deslocamentos horizontais em desktop quando o estado de scroll muda.

## O que NÃO mudou

- Hero aprovado e seus elementos.
- Conteúdo/textos do Ato I.
- Sequência Rotina -> Trabalho -> player -> Sorriso.
- Sorriso, Estilo e Academia internamente.
- A transição Academia <-> Vivências da V3.2 aprovada.
- Lógica reversível da V3.2.

## Assets

Continuam no padrão único:

- arquivo físico: `public/assets/...`
- URL no código: `/assets/...`
