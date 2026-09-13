# Atualização rápida — Analytics V2

## 1) Preserve sua pasta public

Este pacote NÃO contém suas fotos pessoais. Mescle `public/` com a sua pasta atual.

Arquivos novos/alterados desta atualização dentro de `public`:

- `admin.html`
- `assets/juju-crianca.jpg` (já vinha da versão anterior)

Mantenha o seu `public/analytics-config.js` atual.

## 2) Criar as tabelas V2 no D1

```powershell
cd analytics-worker
npx wrangler d1 execute love-story-analytics --remote --file=.\migrations\0002_detailed_analytics.sql
```

## 3) Atualizar o Worker

```powershell
npx wrangler deploy
```

O `ADMIN_TOKEN` existente continua o mesmo.

## 4) Atualizar o site

```powershell
cd ..
pnpm install
pnpm build
```

Depois faça seu deploy normal.

## 5) Testar

Abra um link marcado, por exemplo:

```text
https://SEU-SITE/?r=juju
```

Feche e abra novamente duas vezes. Depois entre em:

```text
https://SEU-SITE/admin.html
```

O esperado é aparecer:

- 1 dispositivo provável;
- 3 acessos individuais;
- três horários diferentes;
- cidade/região/país aproximados quando a Cloudflare conseguir resolver;
- duração e etapa máxima de cada acesso.
