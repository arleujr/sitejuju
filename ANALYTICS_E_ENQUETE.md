# Analytics privado V2 + enquete

Esta versão separa **dispositivo provável** de **acesso individual**.

Exemplo: se o mesmo navegador abrir o site 8 vezes, o painel mostra:

- 1 dispositivo provável;
- 8 acessos;
- horário de cada abertura;
- tempo visível aproximado em cada acesso;
- etapa máxima alcançada;
- finalização e voto;
- cidade/região/país aproximados daquele acesso.

Se um link marcado, por exemplo `?r=juju`, aparecer em dois IDs de navegador diferentes, o painel marca **possível compartilhamento**. Isso é apenas um indício: a mesma pessoa pode abrir o link no celular e no computador.

## O que é registrado

Por acesso:

- marcador do link (`?r=...`);
- ID aleatório persistente do navegador (`device_id`);
- ID aleatório daquela abertura (`session_id`);
- data/hora de entrada e última atividade;
- saída aproximada quando o navegador informa;
- tempo em que a página ficou visível;
- mobile / desktop / tablet;
- navegador e sistema operacional em categoria básica;
- idioma/fuso do navegador;
- cidade, região e país **aproximados** informados pela Cloudflare;
- origem em nível de domínio, quando existe;
- maior capítulo/progresso alcançado;
- finalização;
- voto Sim/Não.

A aplicação **não armazena**:

- endereço IP;
- GPS;
- latitude/longitude;
- nome/telefone/e-mail;
- fingerprint de hardware/canvas/fontes;
- câmera, microfone ou teclas digitadas.

A geolocalização vem de `request.cf` no Worker. É geolocalização aproximada da conexão e pode apontar para uma cidade próxima ou para a infraestrutura da operadora.

## Arquivos alterados

- `src/engagement-tracker.js` — tracker V2;
- `analytics-worker/src/index.js` — API V2;
- `analytics-worker/schema.sql` — esquema completo;
- `analytics-worker/migrations/0002_detailed_analytics.sql` — migração segura para o D1 já existente;
- `public/admin.html` — novo painel detalhado.

O histórico da tabela antiga `visits` é preservado e aparece em uma seção separada no novo painel.

## Atualizar o D1 que já está publicado

No PowerShell, dentro do projeto:

```powershell
cd analytics-worker
npx wrangler d1 execute love-story-analytics --remote --file=.\migrations\0002_detailed_analytics.sql
```

A migração usa `CREATE TABLE IF NOT EXISTS`, então não apaga a tabela antiga nem os votos já registrados.

## Publicar o Worker atualizado

Ainda em `analytics-worker`:

```powershell
npx wrangler deploy
```

O `ADMIN_TOKEN` já cadastrado continua valendo. Não precisa criar outro token.

## Publicar o frontend

Depois volte para a raiz:

```powershell
cd ..
pnpm install
pnpm build
```

Faça o deploy da mesma forma que você já usa hoje.

Como a sua pasta `public` contém fotos pessoais e não foi enviada, o ZIP desta versão traz apenas os arquivos públicos que foram criados/alterados aqui. **Mescle** a pasta `public` do ZIP com a sua pasta `public` real; não substitua/apague seus assets pessoais.

O arquivo `public/admin.html` desta versão deve substituir o `admin.html` antigo.

Seu `public/analytics-config.js` atual deve continuar existindo. O painel novo lê exatamente o mesmo `window.__LOVE_ANALYTICS__.apiBase` usado pelo site.

## Painel

Abra:

```text
https://SEU-SITE/admin.html
```

Digite o mesmo `ADMIN_TOKEN` do Worker.

O painel possui:

- total de acessos/aberturas;
- total de dispositivos prováveis;
- finalizações e votos;
- primeiro e último acesso;
- resumo por link marcado;
- aviso de possível compartilhamento quando um link marcado aparece em mais de um dispositivo;
- cards por dispositivo com quantidade de acessos;
- timeline com cada acesso e horário até os segundos;
- tempo visível aproximado;
- cidade/região/país aproximados;
- navegador/SO;
- etapa máxima;
- voto;
- origem do acesso;
- histórico antigo preservado.

O painel atualiza automaticamente a cada 30 segundos e também tem botão `Atualizar`.

## Link marcado

No painel existe um campo para gerar/copiar um link marcado. Exemplo:

```text
https://SEU-SITE/?r=juju
```

O marcador identifica **o link**, não uma identidade física. Se o mesmo link for encaminhado, as novas aberturas continuam com `recipient = juju`, mas podem aparecer sob outro dispositivo provável.

## Como os acessos são contados

Nesta V2, cada carregamento completo da página cria um novo `session_id`. Portanto:

- abrir → 1 acesso;
- fechar e abrir de novo → novo acesso;
- atualizar/recarregar → novo acesso;
- navegar dentro da história sem recarregar → continua o mesmo acesso.

O `device_id` fica em `localStorage`. Se o navegador limpar os dados, usar aba privada ou outro navegador/aparelho, um novo dispositivo provável pode aparecer.
