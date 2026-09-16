$required = @(
  'public/assets/loading-casal.webp',
  'public/assets/jujucarnaval02.jpeg',
  'public/assets/jujuformatura.jpeg',
  'public/assets/jujucasamento.jpg',
  'public/assets/hero-coracoes.jpg',
  'public/assets/festa-show-neon.png',
  'public/assets/encontro-01-juntos.png',
  'public/assets/encontro-02-pergunta.png',
  'public/assets/encontro-03-beijo.png',
  'public/assets/encontro-04-abraco.png'
)

$tracked = @(git ls-files public/assets)

Write-Host ""
Write-Host "ASSETS CRITICOS" -ForegroundColor Cyan
Write-Host "---------------"

foreach ($path in $required) {
  $exact = @($tracked | Where-Object { $_ -ceq $path })
  $caseOnly = @($tracked | Where-Object { $_ -ieq $path })

  if ($exact.Count -gt 0) {
    $size = if (Test-Path -LiteralPath $path) {
      [math]::Round((Get-Item -LiteralPath $path).Length / 1MB, 2)
    } else { "?" }
    Write-Host ("OK      {0}   {1} MB" -f $path, $size) -ForegroundColor Green
  }
  elseif ($caseOnly.Count -gt 0) {
    Write-Host ("CASE    esperado: {0}" -f $path) -ForegroundColor Yellow
    Write-Host ("        git tem:  {0}" -f ($caseOnly -join ', ')) -ForegroundColor Yellow
  }
  elseif (Test-Path -LiteralPath $path) {
    Write-Host ("LOCAL   {0} existe, mas NAO esta rastreado pelo Git" -f $path) -ForegroundColor Red
  }
  else {
    Write-Host ("FALTA   {0}" -f $path) -ForegroundColor Red
  }
}

Write-Host ""
Write-Host "Total de arquivos rastreados em public/assets: $($tracked.Count)"
