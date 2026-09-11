# Continua + enquete + acompanhamento de acesso

## O que esta versão registra

A implementação foi propositalmente limitada:

- abertura do link;
- identificador do link (`?r=...`);
- mobile / desktop / tablet;
- último capítulo máximo alcançado;
- percentual máximo dentro daquele capítulo;
- se chegou à tela `Continua...`;
- voto `Sim` ou `Não`;
- primeiro e último horário vistos pelo backend.

Não há fingerprint, geolocalização, câmera, microfone, teclas digitadas nem armazenamento de IP pela aplicação.

> O parâmetro `?r=` identifica o LINK. Se o link for encaminhado, o painel não tem como provar qual pessoa física abriu.

## Tela final

Depois do conteúdo existente aparece uma tela preta com:

- `Continua...`
- `Gostou??`
- `Sim`
- `Não`

O voto é gravado pelo backend. Sem backend publicado, a tela continua aparecendo, mas o site informa que não conseguiu enviar o voto.

## Backend escolhido: Cloudflare Worker + D1

Ele fica em `analytics-worker/` e é independente da animação do site.

### 1. Criar o D1

No PowerShell:

```powershell
cd analytics-worker
pnpm install
npx wrangler login
npx wrangler d1 create love-story-analytics
```

O Wrangler mostrará um `database_id`.

Copie:

```powershell
Copy-Item .\wrangler.toml.example .\wrangler.toml
```

Abra `wrangler.toml` e substitua `COLE_O_DATABASE_ID_AQUI` pelo ID criado.

### 2. Criar as tabelas

```powershell
npx wrangler d1 execute love-story-analytics --remote --file=.\schema.sql
```

### 3. Criar a senha do painel

```powershell
npx wrangler secret put ADMIN_TOKEN
```

Digite uma senha longa. Ela NÃO deve ser colocada no código do site.

### 4. Publicar

```powershell
npx wrangler deploy
```

Você receberá uma URL parecida com:

```text
https://love-story-analytics.SEUSUBDOMINIO.workers.dev
```

### 5. Ligar o site ao Worker

Abra:

```text
public/analytics-config.js
```

e altere:

```js
apiBase: '/api'
```

para:

```js
apiBase: 'https://love-story-analytics.SEUSUBDOMINIO.workers.dev/api'
```

Depois do deploy do site, você pode trocar `ALLOWED_ORIGIN = "*"` no `analytics-worker/wrangler.toml` pelo domínio exato do site e rodar `npx wrangler deploy` novamente.

## Como ver os acessos

Com o site publicado, abra:

```text
https://SEU-SITE/admin.html
```

Digite o mesmo `ADMIN_TOKEN` criado no Worker.

O painel mostra:

- acessos;
- se chegou ao fim;
- até qual capítulo chegou;
- percentual dentro do capítulo;
- mobile / desktop;
- voto;
- horários.

O token do admin fica somente na sessão daquele navegador (`sessionStorage`), não está embutido no HTML.

## Como saber se o link que você mandou foi aberto

No próprio `/admin.html` existe `Gerar link marcado`.

Exemplo gerado:

```text
https://SEU-SITE/?r=juju-a1b2c3d4
```

Envie esse link. No painel, o destinatário aparecerá como `juju-a1b2c3d4`.

Isso identifica aquele link específico. Se ele for encaminhado para outra pessoa, todos os acessos pelo mesmo link terão o mesmo marcador.
