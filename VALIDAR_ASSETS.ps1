$root = Join-Path $PSScriptRoot "public\assets"
$required = @(
  "jujucarnaval02.jpeg",
  "jujuformatura.jpeg",
  "jujucasamento.jpg",
  "juju-crianca.jpg",
  "festa-show-neon.png",
  "encontro-01-juntos.png",
  "encontro-02-pergunta.png",
  "encontro-03-beijo.png",
  "encontro-04-abraco.png",
  "titulo-abertura.png",
  "rotina/rotina-01.jpeg",
  "rotina/rotina-02.jpeg",
  "rotina/rotina-03.jpeg",
  "rotina/rotina-04.jpeg",
  "rotina/rotina-05.jpeg",
  "rotina/rotina-06.jpeg",
  "rotina/rotina-07.jpeg",
  "rotina/rotina-08.jpeg",
  "rotina/rotina-09.jpg",
  "rotina/rotina-10.jpeg",
  "rotina/rotina-11.jpeg",
  "rotina/rotina-12.jpeg",
  "rotina/rotina-13.jpeg",
  "rotina/rotina-14.jpeg",
  "rotina/rotina-15.jpeg",
  "rotina/rotina-16.jpeg",
  "rotina/rotina-17.jpeg",
  "rotina/rotina-18.jpeg",
  "romance/trabalho-frase-01-user.png",
  "romance/trabalho-frase-02-user.png",
  "romance/trabalho-frase-03-user.png",
  "sounds/notification.mp3",
  "sounds/musica-fundo.mp3",
)
$missing = @()
foreach ($item in $required) {
  $path = Join-Path $root $item
  if (-not (Test-Path $path)) { $missing += $item }
}
if ($missing.Count -eq 0) {
  Write-Host "Assets basicos encontrados. Veja ASSETS.md para Sorriso/Estilo/Academia/Vivencias e Trabalho." -ForegroundColor Green
} else {
  Write-Host "Faltando:" -ForegroundColor Yellow
  $missing | ForEach-Object { Write-Host " - $_" }
}
