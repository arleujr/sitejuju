# V3.5 — Trabalho ↔ Sorriso sem rebase global

Correção isolada da ponte Trabalho ↔ Sorriso.

- Remove a estratégia V3.4 que transformava todo `[data-prelove-flow]` em `position: fixed`.
- Não usa mais `window.scrollTo(0, 0)` para entrar em Sorriso.
- A continuação permanece no fluxo normal do mesmo documento.
- Durante o fullscreen, o scroll é levado ao topo real de `.love-continuation-shell`.
- Sorriso continua começando em progresso local 0, pois suas cenas usam geometria relativa ao próprio elemento.
- Na volta, o scroll retorna ao ponto exato do player antes de ocultar o shell.
- Detecção de retorno usa o topo local do shell, e não `window.scrollY <= 8`.
- Mantém o runtime de Trabalho suspenso até a animação de retorno terminar.

Nenhuma alteração interna em Sorriso, Estilo, Academia ou Vivências.
