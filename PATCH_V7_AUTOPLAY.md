# V7 — Play/Pause do passeio automático

Alterações desta versão:

- O passeio iniciado pelo botão **Começar** está aproximadamente 45–50% mais rápido.
- Um controle fixo de **play/pause** aparece no canto superior direito durante o passeio.
- Scroll, swipe ou teclas de navegação pausam o passeio em vez de cancelá-lo definitivamente.
- O botão **play** retoma exatamente da posição atual.
- Removido o antigo estado de espera da transição Trabalho -> Sorriso que podia deixar o passeio preso.
- O passeio continua por Sorriso -> Estilo -> Academia -> Vivências -> tela final.
- Vídeos narrativos continuam sendo respeitados: o scroll espera enquanto eles estão tocando.
- Se um navegador bloquear reprodução tardia de vídeo com som durante o passeio automático, há fallback mudo para não prender a história antes do final.
- Se um vídeo final estiver ausente/com erro, a história também não fica bloqueada permanentemente.

## Como aplicar

Extraia este patch por cima da raiz do repositório atual, preservando a estrutura de pastas.
Ele altera somente:

- `src/main.js`
- `src/styles.css`
- `src/site-unified/vivencias-scene.js`

Não altera `public`, analytics, `package.json`, lockfile ou configuração do pnpm/Cloudflare.

Depois rode:

```powershell
pnpm build
git add src/main.js src/styles.css src/site-unified/vivencias-scene.js
git commit -m "add autoplay play pause control"
git push
```
