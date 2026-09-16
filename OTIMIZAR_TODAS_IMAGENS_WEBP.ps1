$ErrorActionPreference = "Stop"

$project = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$public = Join-Path $project "public"
$assets = Join-Path $public "assets"

if (!(Test-Path (Join-Path $project "package.json"))) {
  throw "Execute este script na raiz do sitejuju, onde fica package.json."
}
if (!(Test-Path $assets)) {
  throw "Nao encontrei public\assets."
}

$npx = (Get-Command npx.cmd -ErrorAction SilentlyContinue)
if (!$npx) {
  throw "Nao encontrei npx.cmd. Confirme que Node.js/npm estao instalados."
}
$npx = $npx.Source

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = Join-Path $env:TEMP ("sitejuju-assets-backup-" + $stamp)
New-Item -ItemType Directory -Force -Path $backup | Out-Null

$report = New-Object System.Collections.Generic.List[object]
$converted = New-Object System.Collections.Generic.List[object]

$sourceExtensions = @(".png", ".jpg", ".jpeg")
$minBytes = 20KB
$minimumSaving = 0.08

$images = Get-ChildItem -LiteralPath $assets -Recurse -File |
  Where-Object { $sourceExtensions -contains $_.Extension.ToLowerInvariant() }

if ($images.Count -eq 0) {
  Write-Host "Nenhum PNG/JPG/JPEG restante em public\assets." -ForegroundColor Green
  exit 0
}

Write-Host ""
Write-Host ("Encontradas {0} imagens PNG/JPG/JPEG." -f $images.Count) -ForegroundColor Cyan
Write-Host "Convertendo apenas quando WebP realmente ficar menor..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $images) {
  $oldBytes = $file.Length
  $relFromProject = $file.FullName.Substring($project.Length).TrimStart('\','/')
  $relFromPublic = $file.FullName.Substring($public.Length).TrimStart('\','/')
  $target = [System.IO.Path]::ChangeExtension($file.FullName, ".webp")
  $targetName = [System.IO.Path]::GetFileName($target)

  if ($oldBytes -lt $minBytes) {
    $report.Add([pscustomobject]@{
      Arquivo = $relFromProject
      AntesMB = [math]::Round($oldBytes / 1MB, 3)
      DepoisMB = ""
      EconomiaPct = ""
      Status = "mantido: pequeno"
    })
    continue
  }

  # Se ja existe WebP com o mesmo nome, nao sobrescreve cegamente.
  if (Test-Path -LiteralPath $target) {
    $existingBytes = (Get-Item -LiteralPath $target).Length
    if ($existingBytes -lt $oldBytes) {
      $saving = 1 - ($existingBytes / $oldBytes)
      $converted.Add([pscustomobject]@{
        OldFull = $file.FullName
        NewFull = $target
        OldName = $file.Name
        NewName = $targetName
        OldRelPublic = ($relFromPublic -replace '\\','/')
        NewRelPublic = (([System.IO.Path]::ChangeExtension($relFromPublic, ".webp")) -replace '\\','/')
        OldBytes = $oldBytes
        NewBytes = $existingBytes
      })
      $report.Add([pscustomobject]@{
        Arquivo = $relFromProject
        AntesMB = [math]::Round($oldBytes / 1MB, 3)
        DepoisMB = [math]::Round($existingBytes / 1MB, 3)
        EconomiaPct = [math]::Round($saving * 100, 1)
        Status = "WebP ja existia"
      })
    }
    else {
      $report.Add([pscustomobject]@{
        Arquivo = $relFromProject
        AntesMB = [math]::Round($oldBytes / 1MB, 3)
        DepoisMB = [math]::Round($existingBytes / 1MB, 3)
        EconomiaPct = [math]::Round((1 - ($existingBytes / $oldBytes)) * 100, 1)
        Status = "mantido: WebP existente nao compensa"
      })
    }
    continue
  }

  $ext = $file.Extension.ToLowerInvariant()
  $quality = if ($ext -eq ".png") { 88 } else { 82 }
  $alphaQuality = 95

  $tmpDir = Join-Path $env:TEMP ("sitejuju-webp-" + [guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

  Write-Host ("  {0}" -f $relFromProject) -ForegroundColor White

  & $npx `
      --yes `
      --package=sharp-cli@6.1.0 `
      sharp `
      -i $file.FullName `
      -o (Join-Path $tmpDir "{name}.webp") `
      -f webp `
      -q $quality `
      --alphaQuality $alphaQuality `
      --effort 5

  if ($LASTEXITCODE -ne 0) {
    Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
    throw "Falha convertendo $relFromProject."
  }

  $generated = Join-Path $tmpDir ($file.BaseName + ".webp")
  if (!(Test-Path -LiteralPath $generated)) {
    Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
    throw "Conversor nao gerou $($file.BaseName).webp."
  }

  $newBytes = (Get-Item -LiteralPath $generated).Length
  $saving = 1 - ($newBytes / $oldBytes)

  if ($saving -lt $minimumSaving) {
    $report.Add([pscustomobject]@{
      Arquivo = $relFromProject
      AntesMB = [math]::Round($oldBytes / 1MB, 3)
      DepoisMB = [math]::Round($newBytes / 1MB, 3)
      EconomiaPct = [math]::Round($saving * 100, 1)
      Status = "mantido: economia < 8%"
    })
    Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
    continue
  }

  # Backup do original.
  $backupTarget = Join-Path $backup $relFromProject
  New-Item -ItemType Directory -Force -Path (Split-Path $backupTarget -Parent) | Out-Null
  Copy-Item -LiteralPath $file.FullName -Destination $backupTarget -Force

  Copy-Item -LiteralPath $generated -Destination $target -Force
  Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue

  $converted.Add([pscustomobject]@{
    OldFull = $file.FullName
    NewFull = $target
    OldName = $file.Name
    NewName = $targetName
    OldRelPublic = ($relFromPublic -replace '\\','/')
    NewRelPublic = (([System.IO.Path]::ChangeExtension($relFromPublic, ".webp")) -replace '\\','/')
    OldBytes = $oldBytes
    NewBytes = $newBytes
  })

  $report.Add([pscustomobject]@{
    Arquivo = $relFromProject
    AntesMB = [math]::Round($oldBytes / 1MB, 3)
    DepoisMB = [math]::Round($newBytes / 1MB, 3)
    EconomiaPct = [math]::Round($saving * 100, 1)
    Status = "convertido"
  })

  Write-Host ("      {0:N2} MB -> {1:N2} MB  (-{2:N1}%)" -f `
    ($oldBytes / 1MB), ($newBytes / 1MB), ($saving * 100)) -ForegroundColor Green
}

if ($converted.Count -eq 0) {
  Write-Host ""
  Write-Host "Nenhuma conversao trouxe economia suficiente." -ForegroundColor Yellow
  $report | Export-Csv (Join-Path $project "RELATORIO_OTIMIZACAO_ASSETS.csv") -NoTypeInformation -Encoding UTF8
  exit 0
}

Write-Host ""
Write-Host ("{0} imagens serao usadas em WebP." -f $converted.Count) -ForegroundColor Cyan
Write-Host "Atualizando referencias no codigo..." -ForegroundColor Cyan

# Arquivos de texto que podem conter caminhos de assets.
$textExtensions = @(".js",".mjs",".cjs",".css",".html",".htm",".jsx",".ts",".tsx",".vue")
$textFiles = Get-ChildItem -LiteralPath $project -Recurse -File |
  Where-Object {
    $textExtensions -contains $_.Extension.ToLowerInvariant() -and
    $_.FullName -notmatch '\\node_modules\\' -and
    $_.FullName -notmatch '\\dist\\' -and
    $_.FullName -notmatch '\\.git\\'
  }

# Backup dos arquivos de codigo que realmente forem alterados.
$backedUpText = @{}

# Agrupa basenames para evitar substituicao ambigua.
$allAssetFiles = Get-ChildItem -LiteralPath $assets -Recurse -File
$basenameCounts = @{}
foreach ($assetFile in $allAssetFiles) {
  $key = $assetFile.Name.ToLowerInvariant()
  if (!$basenameCounts.ContainsKey($key)) { $basenameCounts[$key] = 0 }
  $basenameCounts[$key]++
}

foreach ($textFile in $textFiles) {
  $content = Get-Content -LiteralPath $textFile.FullName -Raw
  $originalContent = $content

  foreach ($item in $converted) {
    $oldRel = $item.OldRelPublic
    $newRel = $item.NewRelPublic

    # Caminhos completos conhecidos.
    $content = $content.Replace("/" + $oldRel, "/" + $newRel)
    $content = $content.Replace($oldRel, $newRel)

    # Quando o basename e unico, tambem cobre referencias montadas por assetBase.
    $oldKey = $item.OldName.ToLowerInvariant()
    if ($basenameCounts[$oldKey] -eq 1) {
      $content = $content.Replace($item.OldName, $item.NewName)
    }
  }

  if ($content -cne $originalContent) {
    if (!$backedUpText.ContainsKey($textFile.FullName)) {
      $relText = $textFile.FullName.Substring($project.Length).TrimStart('\','/')
      $dest = Join-Path $backup $relText
      New-Item -ItemType Directory -Force -Path (Split-Path $dest -Parent) | Out-Null
      Copy-Item -LiteralPath $textFile.FullName -Destination $dest -Force
      $backedUpText[$textFile.FullName] = $true
    }
    Set-Content -LiteralPath $textFile.FullName -Value $content -Encoding UTF8
  }
}

# Cria relatorio antes do build.
$reportPath = Join-Path $project "RELATORIO_OTIMIZACAO_ASSETS.csv"
$report | Export-Csv $reportPath -NoTypeInformation -Encoding UTF8

$oldTotal = ($converted | Measure-Object -Property OldBytes -Sum).Sum
$newTotal = ($converted | Measure-Object -Property NewBytes -Sum).Sum
$saveTotal = $oldTotal - $newTotal
$savePct = if ($oldTotal -gt 0) { (1 - ($newTotal / $oldTotal)) * 100 } else { 0 }

Write-Host ""
Write-Host ("CONVERTIDOS: {0:N2} MB -> {1:N2} MB | economia {2:N2} MB ({3:N1}%)" -f `
  ($oldTotal/1MB), ($newTotal/1MB), ($saveTotal/1MB), $savePct) -ForegroundColor Green

Write-Host ""
Write-Host "Validando o projeto..." -ForegroundColor Cyan
& pnpm build
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "BUILD FALHOU. Nao apague nada." -ForegroundColor Red
  Write-Host "Backup em:" -ForegroundColor Yellow
  Write-Host "  $backup" -ForegroundColor Yellow
  throw "Build falhou."
}

Write-Host ""
Write-Host "Build OK." -ForegroundColor Green

# Os originais permanecem por seguranca. Eles nao serao baixados pelo site
# quando o codigo estiver apontando para WebP.
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "Os arquivos originais foram mantidos por seguranca." -ForegroundColor Yellow
Write-Host "O navegador passa a usar os WebPs; os originais nao pesam no carregamento." -ForegroundColor Yellow

Write-Host ""
Write-Host "Maiores arquivos que ainda existem em public\assets:" -ForegroundColor Cyan
Get-ChildItem -LiteralPath $assets -Recurse -File |
  Sort-Object Length -Descending |
  Select-Object -First 25 @{N="MB";E={[math]::Round($_.Length/1MB,2)}}, FullName |
  Format-Table -AutoSize

Write-Host ""
Write-Host "Relatorio:" -ForegroundColor Cyan
Write-Host "  $reportPath"
Write-Host "Backup:" -ForegroundColor DarkGray
Write-Host "  $backup"

Write-Host ""
Write-Host "Teste agora com:" -ForegroundColor Yellow
Write-Host "  pnpm dev"
Write-Host ""
Write-Host "Se estiver certo:" -ForegroundColor Yellow
Write-Host "  git add -A"
Write-Host '  git commit -m "optimize remaining images to webp"'
Write-Host "  git push"
