# Arleu & Juliana — site único V3.8 otimizado

Esta é a base integrada e polida:

`Hero -> Ato I -> transição contínua -> Rotina -> Trabalho -> player -> Sorriso -> Estilo -> Academia -> Vivências`

O antigo Ato II do Hero não faz parte do runtime.

## Rodar

```bash
npm install
npm run dev
```

## Assets

Coloque os arquivos em `public/assets/...`. No código, os caminhos usam `/assets/...`.
Veja `ASSETS.md` para a lista esperada.

## Revisão V3.3

`POLIMENTO_UNIFICACAO_V3_3.md` descreve apenas os ajustes de continuidade e responsividade feitos nesta versão. Os atos já aprovados foram preservados.

## V3.6 — final e enquete

Esta versão adiciona, depois de todo o conteúdo, a tela `Continua...` + `Gostou??` (`Sim` / `Não`).

Para votos e acompanhamento de acesso funcionarem fora do computador local, publique o pequeno backend em `analytics-worker/` e configure `public/analytics-config.js`.

Instruções completas: `ANALYTICS_E_ENQUETE.md`.

## V3.7 — enquete só após o último vídeo

A tela `Continua... / Gostou??` fica completamente bloqueada até `public/assets/vivencias/videofinal.mp4` emitir o evento `ended`. Depois disso ela é revelada em tela preta.

Também foi adicionado `↻ Ver de novo`, que recarrega o site no topo e preserva os parâmetros do link (por exemplo `?r=...`).


## V3.8 — otimização e estabilidade

Revisão conservadora da V3.7 para melhorar fluidez e resistência a várias idas/voltas, sobretudo em mobile. Cenas fora da viewport deixam de executar loops de render contínuos; canvases decorativos pausam fora da tela; prévias pesadas passam a ser preparadas sob demanda; e a ponte Trabalho ↔ Sorriso ganhou proteções extras contra overscroll/locks presos.

Detalhes e testes: `OTIMIZACAO_V3_8.md`.
