# Áudio global — V3.8.6

## Música de fundo
Coloque a música em:

`public/assets/sounds/musica-fundo.mp3`

O site espera esse nome exatamente. A música:
- começa após o primeiro clique/toque (normalmente **Começar**);
- toca em loop;
- usa volume de fundo de 38%;
- faz fade e pausa quando qualquer vídeo começa;
- volta suavemente quando o vídeo pausa/termina ou quando o usuário retorna no scroll.

## Vídeos
Os vídeos de Vivências agora são configurados com `muted = false` e `volume = 1`.

Por política de Chrome/Safari, nenhum site pode garantir áudio audível antes de uma interação real do usuário. Se um navegador bloquear o autoplay sonoro de um vídeo, o site **não** troca para muted: mantém os controles para um toque/clique.

## Arquivos de vídeo esperados
- `public/assets/vivencias/vivencias-final.mp4`
- `public/assets/vivencias/videofinal.mp4`
