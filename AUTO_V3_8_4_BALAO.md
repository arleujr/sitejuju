# V3.8.4 — correção do balão no modo automático

- O segundo vídeo final (`videofinal.mp4`) pode começar enquanto o balão ainda está na ponte.
- O modo automático **não pausa mais** nesse instante.
- Ele continua avançando até `.viv4-bridge__final-screen.is-video-only`, quando o balão já saiu da tela.
- Só então o automático pausa para assistir ao vídeo.
- O comportamento manual não foi alterado.
