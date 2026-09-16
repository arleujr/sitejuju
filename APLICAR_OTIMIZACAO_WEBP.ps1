$ErrorActionPreference = "Stop"

$project = $PSScriptRoot
$assets = Join-Path $project "public\assets"
$patchFiles = Join-Path $project "patch-files"

$items = @(
  @{ Name = "festa-show-neon";      Quality = 82; Alpha = 90 },
  @{ Name = "encontro-01-juntos";   Quality = 84; Alpha = 92 },
  @{ Name = "encontro-02-pergunta"; Quality = 84; Alpha = 92 },
  @{ Name = "encontro-03-beijo";    Quality = 84; Alpha = 92 },
  @{ Name = "encontro-04-abraco";   Quality = 84; Alpha = 92 }
)

if (!(Test-Path (Join-Path $project "package.json"))) {
  throw "Execute este patch na raiz do sitejuju (onde fica package.json)."
}

if (!(Test-Path $assets)) {
  throw "Nao encontrei public\assets."
}

$missing = @()
foreach ($item in $items) {
  $png = Join-Path $assets ($item.Name + ".png")
  if (!(Test-Path -LiteralPath $png)) {
    $missing += $png
  }
}

if ($missing.Count -gt 0) {
  Write-Host ""
  Write-Host "Faltam os PNGs originais:" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
  throw "Conversao cancelada. Nenhum codigo foi substituido."
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = Join-Path $env:TEMP ("sitejuju-webp-backup-" + $stamp)
New-Item -ItemType Directory -Force -Path $backup | Out-Null

Write-Host ""
Write-Host "Backup local: $backup" -ForegroundColor DarkGray

# Backup do codigo que sera substituido.
$backupFiles = @(
  "index.html",
  "src\main.js",
  "src\styles.css",
  "src\site-unified\runtime.js"
)

foreach ($relative in $backupFiles) {
  $source = Join-Path $project $relative
  if (Test-Path -LiteralPath $source) {
    $dest = Join-Path $backup $relative
    New-Item -ItemType Directory -Force -Path (Split-Path $dest -Parent) | Out-Null
    Copy-Item -LiteralPath $source -Destination $dest -Force
  }
}

foreach ($item in $items) {
  Copy-Item -LiteralPath (Join-Path $assets ($item.Name + ".png")) `
            -Destination (Join-Path $backup ($item.Name + ".png")) -Force
}

Write-Host ""
Write-Host "Verificando conversor..." -ForegroundColor Cyan
$npxCheck = Get-Command npx.cmd -ErrorAction SilentlyContinue
if (!$npxCheck) {
  throw "Nao encontrei npx.cmd. Confirme que o Node.js/npm estao instalados."
}

Write-Host ""
Write-Host "Convertendo PNG -> WebP..." -ForegroundColor Cyan

$beforeBytes = 0
$afterBytes = 0

foreach ($item in $items) {
  $png = Join-Path $assets ($item.Name + ".png")
  $webp = Join-Path $assets ($item.Name + ".webp")
  $tmpDir = Join-Path $env:TEMP ("sitejuju-sharp-" + [guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

  $beforeBytes += (Get-Item -LiteralPath $png).Length

  Write-Host ("  {0}.png" -f $item.Name) -ForegroundColor White

  # Usa o executavel npx.cmd explicitamente no Windows.
  # Isso evita o problema do PowerShell/npx tratar "npm exec" de forma errada.
  $npx = (Get-Command npx.cmd -ErrorAction Stop).Source

  & $npx `
      --yes `
      --package=sharp-cli@6.1.0 `
      sharp `
      -i $png `
      -o (Join-Path $tmpDir "{name}.webp") `
      -f webp `
      -q $item.Quality `
      --alphaQuality $item.Alpha `
      --effort 5

  if ($LASTEXITCODE -ne 0) {
    Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
    throw "Falha convertendo $($item.Name).png."
  }

  $generated = Join-Path $tmpDir ($item.Name + ".webp")
  if (!(Test-Path -LiteralPath $generated)) {
    Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
    throw "Sharp terminou, mas nao gerou $($item.Name).webp."
  }

  Copy-Item -LiteralPath $generated -Destination $webp -Force
  Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue

  $newSize = (Get-Item -LiteralPath $webp).Length
  $afterBytes += $newSize

  $oldMB = [math]::Round((Get-Item -LiteralPath $png).Length / 1MB, 2)
  $newMB = [math]::Round($newSize / 1MB, 2)
  Write-Host ("      {0} MB -> {1} MB" -f $oldMB, $newMB) -ForegroundColor Green
}

# So troca o codigo depois que TODOS os WebPs existem.
Write-Host ""
Write-Host "Aplicando referencias WebP no codigo..." -ForegroundColor Cyan

Copy-Item -LiteralPath (Join-Path $patchFiles "index.html") `
          -Destination (Join-Path $project "index.html") -Force
Copy-Item -LiteralPath (Join-Path $patchFiles "src\main.js") `
          -Destination (Join-Path $project "src\main.js") -Force
Copy-Item -LiteralPath (Join-Path $patchFiles "src\styles.css") `
          -Destination (Join-Path $project "src\styles.css") -Force
Copy-Item -LiteralPath (Join-Path $patchFiles "src\site-unified\runtime.js") `
          -Destination (Join-Path $project "src\site-unified\runtime.js") -Force

# PNGs nao sao mais usados. Mantemos backup fora do repositorio e retiramos do public.
foreach ($item in $items) {
  Remove-Item -LiteralPath (Join-Path $assets ($item.Name + ".png")) -Force
}

$beforeMB = [math]::Round($beforeBytes / 1MB, 2)
$afterMB = [math]::Round($afterBytes / 1MB, 2)
$savedMB = [math]::Round(($beforeBytes - $afterBytes) / 1MB, 2)
$percent = if ($beforeBytes -gt 0) {
  [math]::Round((1 - ($afterBytes / $beforeBytes)) * 100, 1)
} else { 0 }

Write-Host ""
Write-Host ("TOTAL: {0} MB -> {1} MB | economia {2} MB ({3}%)" -f `
  $beforeMB, $afterMB, $savedMB, $percent) -ForegroundColor Green

Write-Host ""
Write-Host "Validando build..." -ForegroundColor Cyan
& pnpm build
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "O build falhou. Seu backup esta em:" -ForegroundColor Red
  Write-Host "  $backup" -ForegroundColor Yellow
  throw "Build falhou."
}

Write-Host ""
Write-Host "PRONTO." -ForegroundColor Green
Write-Host "Teste com: pnpm dev" -ForegroundColor Yellow
Write-Host "Depois, se estiver tudo certo: git add -A; git commit; git push" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backup dos PNGs/codigo anterior:" -ForegroundColor DarkGray
Write-Host "  $backup" -ForegroundColor DarkGray
