# PATCH V9 — Vivências / pensamentos / vídeo final

Altera somente a apresentação do final de Vivências.

## Mudanças
- `Me diverti muito` -> `Me diverti muito ao seu lado`.
- Mantém `e é só o começo da nossa história` e `vivencias-final.mp4` como estavam.
- Remove a dependência visual de `balaofala.png` na ponte final.
- Depois do primeiro vídeo, o scroll atravessa 5 balões de pensamento feitos em CSS.
- `videofinal.mp4` surge menor, centralizado, sem `object-fit: cover` e sem ocupar a tela inteira.
- A transição continua reversível ao subir o scroll.
- O autoplay continua reconhecendo o segundo vídeo através de `is-video-only`.

## Arquivos substituídos
- `src/site-unified/vivencias-scene.js`
- `src/site-unified/vivencias-scene.css`

Não altera `public`, analytics, package.json, pnpm ou configuração do Cloudflare.
