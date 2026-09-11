# V3.4 — retorno Sorriso -> Trabalho

Correção restrita à emenda reversível Trabalho <-> Sorriso.

- `data-prelove-flow` não usa mais `display:none` durante Sorriso.
- A parte anterior fica estacionada como `position: fixed` + `visibility: hidden`, fora do fluxo mas ainda montada.
- O runtime de Rotina/Trabalho permanece suspenso durante toda a animação de retorno.
- `resumeStoryRuntime()` só roda depois de fullscreen -> player terminar.
- wheel/touch continuam bloqueados por mais um paint após `nextscene:returned`, evitando que o gesto de retorno atravesse a emenda.
- `overflow-anchor: none` estabiliza o rebase/restauração de scroll.

Nenhum código interno de Sorriso, Estilo, Academia ou Vivências foi alterado.
