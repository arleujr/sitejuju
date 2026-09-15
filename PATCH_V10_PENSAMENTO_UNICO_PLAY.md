# PATCH V10 — pensamento único + play/pause sempre disponível

Alterações:

1. Remove completamente o corredor de 5 balões com texto da V9.
2. Cria uma única transição de pensamento, sem texto: uma grande nuvem fica parcialmente fora do topo, sugerindo que todo o site acima estava dentro daquele pensamento; uma cauda de círculos conduz até o `videofinal.mp4`.
3. Mantém o segundo vídeo contido e proporcional, sem fullscreen/crop.
4. Encurta a transição para não arrastar demais até o vídeo final.
5. O botão global Play/Pause passa a aparecer também quando a pessoa entra na história manualmente por scroll/swipe/teclado.
6. Se a pessoa nunca clicou em "Começar", tocar em Play inicia o autoplay a partir do ponto atual.
7. Se o autoplay chega ao fim, o controle permanece disponível enquanto a pessoa estiver dentro da história.
8. Ao voltar completamente para a Hero, o controle volta a ficar oculto.

Arquivos alterados:
- `src/main.js`
- `src/site-unified/vivencias-scene.js`
- `src/site-unified/vivencias-scene.css`

Não altera `public`, analytics, package.json, lockfile ou configuração do Cloudflare.
