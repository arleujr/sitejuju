# V3.6 — Continua / enquete / analytics leve

Base: `SITE_UNICO_V3_5_BRIDGE_ESTAVEL`.

Alterações:

1. Adicionada tela final preta depois da experiência existente.
2. Texto `Continua...` e pergunta `Gostou??` com `Sim` / `Não`.
3. Voto persistente via API externa, sem alterar as timelines existentes.
4. Tracker de progresso por capítulos, com envio espaçado (não envia a cada pixel de scroll).
5. Identificação opcional do link via `?r=`.
6. Backend Cloudflare Worker + D1 incluído em `analytics-worker/`.
7. Painel privado em `/admin.html`, protegido no backend por `ADMIN_TOKEN`.
8. Nenhuma coleta de fingerprint, localização, conteúdo digitado ou mídia.
