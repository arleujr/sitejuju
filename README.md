# Arleu & Juliana — base unificada V5

Fluxo único da aplicação:

`Hero -> Ato I -> Rotina -> Trabalho -> Sorriso -> Estilo -> Academia -> Vivências -> final`

## Correções desta versão

- `Trabalho -> Sorriso` agora é **reversível pelo próprio scroll**. A posição do scroll é a única fonte de verdade da transição; não existe mais promoção do player para `<body>`, `position: fixed` temporário, rebase de scroll ou salto de coordenadas.
- Sorriso já é montado como parte real do documento desde o início. O quadro dentro do player é apenas uma prévia visual do primeiro frame.
- Ao voltar de Sorriso para Trabalho, as classes de fullscreen/preview são desfeitas automaticamente conforme o progresso volta, evitando o estado preso que causava os bugs na volta.
- A antiga ponte `Academia -> Vivências` foi removida por completo. Ela era a responsável pela tela roxa intermediária. Agora o fim de Academia encosta diretamente no início real de Vivências.
- Foram removidos os documentos de patches antigos que descreviam arquiteturas que já não existem nesta base.
- A foto nova da Hero continua reposicionada para não cobrir “colecionando momentos com você”.

## Estrutura e performance

- Rotina/Trabalho e a continuação pertencem à mesma aplicação e ao mesmo documento.
- Cenas dirigidas por scroll compartilham o scheduler global de `scroll` e `resize`.
- Assets pesados continuam carregando sob demanda onde o runtime já usa `data-src`/lazy loading.
- Música de fundo permanece com `preload="none"`.
- Nenhuma referência existente em `/assets/...` foi renomeada.

## Assets pessoais

Este pacote **não contém a sua pasta `public` privada**. Ele leva somente o arquivo novo:

`public/assets/juju-crianca.jpg`

Mantenha a sua `public/assets` original e apenas mescle este arquivo/pasta ao projeto.

## Rodar

```powershell
pnpm install
pnpm dev
```

Se o pnpm bloquear o build do `esbuild`:

```powershell
pnpm approve-builds
pnpm rebuild esbuild
pnpm dev
```

## Validação

```powershell
powershell -ExecutionPolicy Bypass -File .\VALIDAR_ASSETS.ps1
pnpm build
```

`ASSETS.md` contém a lista esperada de mídias.
