# Love Story Analytics Worker V2

Backend privado em Cloudflare Worker + D1.

## Atualização de uma instalação já existente

```powershell
npx wrangler d1 execute love-story-analytics --remote --file=.\migrations\0002_detailed_analytics.sql
npx wrangler deploy
```

O token atual continua válido:

```powershell
npx wrangler secret put ADMIN_TOKEN
```

Só execute o comando acima se quiser trocar a senha do painel.

## Desenvolvimento

```powershell
npm install
npx wrangler dev
```

## Endpoints V2

- `POST /api/session/start`
- `POST /api/session/ping`
- `POST /api/session/end`
- `POST /api/progress`
- `POST /api/vote`
- `GET /api/admin/summary` (Bearer `ADMIN_TOKEN`)
- `GET /api/health`

Os endpoints antigos continuam aceitos para preservar compatibilidade durante o deploy.
