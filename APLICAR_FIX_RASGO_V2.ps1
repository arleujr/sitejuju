$ErrorActionPreference = "Stop"

$project = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$mainPath = Join-Path $project "src\main.js"

if (!(Test-Path -LiteralPath $mainPath)) {
  throw "Nao encontrei src\main.js. Extraia este patch na raiz do sitejuju."
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$original = [System.IO.File]::ReadAllText($mainPath, $utf8)
$text = $original

# Proteções: este patch só deve rodar na versão atual que contém estes efeitos.
$protectedTokens = @(
  "heartPortal.classList.add('is-active')",
  "Juju ❤️ está digitando",
  "typing-dots typing-dots--inline"
)

foreach ($token in $protectedTokens) {
  if (!$text.Contains($token)) {
    throw "Protecao falhou: nao encontrei '$token'. Nenhum arquivo foi alterado."
  }
}

# ------------------------------------------------------------
# 1) Estado monotônico da transição
# ------------------------------------------------------------
$statePattern = 'let tearTransitionViewport = 0;\r?\nlet tearFreezeStartY = 0;\r?\nlet tearHandoffY = 0;\r?\nlet tearViewportWidth = Math\.round\(window\.innerWidth \|\| document\.documentElement\.clientWidth \|\| 0\);'
$stateMatches = [regex]::Matches($text, $statePattern)

if ($stateMatches.Count -ne 1) {
  throw "Bloco de estado do rasgo nao encontrado exatamente uma vez. Nenhum arquivo foi alterado."
}

$stateReplacement = @'
let tearTransitionViewport = 0;
let tearFreezeStartY = 0;
let tearHandoffY = 0;

// Estado monotônico da emenda:
// before -> tearing -> completed.
// Completed só volta para before se o usuário realmente retornar à seção anterior.
let tearPhase = 'before';
let tearLastScrollY = window.scrollY;

let tearViewportWidth = Math.round(window.innerWidth || document.documentElement.clientWidth || 0);
'@

$text = [regex]::Replace($text, $statePattern, $stateReplacement, 1)

# ------------------------------------------------------------
# 2) Substitui SOMENTE renderTear()
# ------------------------------------------------------------
$renderPattern = '(?s)function renderTear\(\) \{.*?\r?\n\}\r?\nconst tearScrollDriver = createScrollFrameDriver'
$renderMatches = [regex]::Matches($text, $renderPattern)

if ($renderMatches.Count -ne 1) {
  throw "renderTear() nao encontrado exatamente uma vez. Nenhum arquivo foi alterado."
}

$renderReplacement = @'
function renderTear() {
  if (!chapterTear || !tearStage || !tearPage || !unifiedStory) return;

  const scrollY = window.scrollY;
  const liveViewport = liveMobileViewportHeight();
  const deltaY = scrollY - tearLastScrollY;
  tearLastScrollY = scrollY;

  const liveStart = chapterTear.offsetTop - liveViewport;
  const rearmMargin = Math.max(96, liveViewport * .16);

  const setBefore = () => {
    tearPhase = 'before';
    tearVisualMode = 'before';
    tearTransitionViewport = 0;
    tearFreezeStartY = 0;
    tearHandoffY = 0;
    tearStage.classList.remove('is-active');
    resetTearVisual();
  };

  const setCompleted = () => {
    tearPhase = 'completed';
    tearVisualMode = 'after';
    tearStage.classList.remove('is-active');

    // Não limpamos freezeStart/handoff aqui.
    // O bug vinha justamente de esquecer a geometria após um único frame
    // da Conversa e permitir que o rasgo fosse ativado novamente.
  };

  // Depois de concluído, pequenas oscilações de scroll/viewport não podem
  // recolocar "Nosso primeiro beijo" por cima da Conversa.
  if (tearPhase === 'completed') {
    if (deltaY < -.5 && scrollY < liveStart - rearmMargin) {
      setBefore();
    }
    return;
  }

  // Ainda antes da emenda.
  if (tearPhase === 'before') {
    if (scrollY < liveStart) {
      if (tearVisualMode !== 'before') {
        tearVisualMode = 'before';
        tearStage.classList.remove('is-active');
        resetTearVisual();
      }
      return;
    }

    // Entrou no rasgo: congela as duas coordenadas uma única vez.
    tearTransitionViewport = liveViewport;
    tearFreezeStartY = chapterTear.offsetTop - tearTransitionViewport;
    tearHandoffY = unifiedStory.offsetTop;
    tearPhase = 'tearing';
  }

  const freezeStart = tearFreezeStartY;
  const handoff = tearHandoffY;

  // Reversão real do usuário: só rearma depois de voltar bastante para cima.
  if (deltaY < -.5 && scrollY < freezeStart - rearmMargin) {
    setBefore();
    return;
  }

  // Handoff concluído. A partir daqui a Conversa é a única tela válida.
  if (scrollY >= handoff) {
    setCompleted();
    return;
  }

  tearVisualMode = 'active';
  buildTearSnapshot();
  buildTearNextPage();
  tearStage.classList.add('is-active');

  const span = Math.max(1, handoff - freezeStart);
  const raw = clamp01((scrollY - freezeStart) / span);
  const tear = range(raw, .02, .91);
  const eased = tear * tear * (3 - 2 * tear);
  const tearY = 103 - eased * 121;
  const lift = -eased * 3.2;
  const tilt = -eased * .38;
  const edgeOpacity = tear <= .01 || tear >= .995 ? 0 : 1;

  tearStage.style.setProperty('--tear-y', `${tearY.toFixed(3)}%`);
  tearStage.style.setProperty('--tear-lift', `${lift.toFixed(3)}vh`);
  tearStage.style.setProperty('--tear-tilt', `${tilt.toFixed(3)}deg`);
  tearStage.style.setProperty('--tear-progress', eased.toFixed(4));
  tearStage.style.setProperty('--tear-edge-opacity', `${edgeOpacity}`);

  if (tearEdge) tearEdge.style.opacity = `${edgeOpacity}`;
}
const tearScrollDriver = createScrollFrameDriver
'@

$text = [regex]::Replace($text, $renderPattern, $renderReplacement, 1)

# ------------------------------------------------------------
# 3) Resize: troca SOMENTE o viewport driver ligado ao tear
#    Regex propositalmente independente dos comentários atuais.
# ------------------------------------------------------------
$resizePattern = '(?s)createViewportFrameDriver\(\(\) => \{\r?\n  const nextWidth = Math\.round\(window\.innerWidth \|\| document\.documentElement\.clientWidth \|\| 0\);.*?\r?\n\}\);\r?\nresetTearVisual\(\);\r?\ntearScrollDriver\.schedule\(\);'
$resizeMatches = [regex]::Matches($text, $resizePattern)

if ($resizeMatches.Count -ne 1) {
  throw "Viewport driver do rasgo nao encontrado exatamente uma vez. Nenhum arquivo foi alterado."
}

$resizeReplacement = @'
createViewportFrameDriver(() => {
  const nextWidth = Math.round(window.innerWidth || document.documentElement.clientWidth || 0);
  const widthChanged = Math.abs(nextWidth - tearViewportWidth) > 24;
  tearViewportWidth = nextWidth;

  // Mudança apenas de ALTURA (barra do navegador, UI móvel etc.)
  // não pode desmontar nem rearmar a transição.
  if (!widthChanged) {
    tearScrollDriver.schedule();
    return;
  }

  // Mudança real de largura (rotação/resize): reconstruímos os clones,
  // mas preservamos o estado monotônico.
  tearSnapshotBuilt = false;
  tearNextBuilt = false;
  tearSnapshotSlot?.replaceChildren();
  tearNextSlot?.replaceChildren();

  if (tearPhase === 'before') {
    tearVisualMode = 'before';
    tearTransitionViewport = 0;
    tearFreezeStartY = 0;
    tearHandoffY = 0;
    resetTearVisual();
  } else if (tearPhase === 'tearing') {
    tearTransitionViewport = liveMobileViewportHeight();
    tearFreezeStartY = chapterTear.offsetTop - tearTransitionViewport;
    tearHandoffY = unifiedStory.offsetTop;
  } else {
    tearVisualMode = 'after';
    tearStage.classList.remove('is-active');
  }

  tearScrollDriver.schedule();
});
resetTearVisual();
tearScrollDriver.schedule();
'@

$text = [regex]::Replace($text, $resizePattern, $resizeReplacement, 1)

# Verificação final antes de tocar no arquivo.
if ($text -eq $original) {
  throw "Nenhuma mudanca foi produzida. Nenhum arquivo foi alterado."
}

if (!$text.Contains("let tearPhase = 'before';")) {
  throw "Validacao interna falhou: tearPhase nao foi inserido."
}
if (!$text.Contains("if (tearPhase === 'completed')")) {
  throw "Validacao interna falhou: estado completed ausente."
}

# Garante que os efeitos protegidos continuam presentes após a alteração.
foreach ($token in $protectedTokens) {
  if (!$text.Contains($token)) {
    throw "Validacao final falhou: '$token' desapareceu. Nenhum arquivo foi alterado."
  }
}

# Backup.
$backupDir = Join-Path $env:TEMP ("sitejuju-tear-fix-v2-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$backupFile = Join-Path $backupDir "main.js"
Copy-Item -LiteralPath $mainPath -Destination $backupFile -Force

# Grava UTF-8 sem BOM.
[System.IO.File]::WriteAllText($mainPath, $text, $utf8)

# Valida sintaxe. Se falhar, restaura automaticamente.
$node = Get-Command node.exe -ErrorAction SilentlyContinue
if (!$node) {
  $node = Get-Command node -ErrorAction SilentlyContinue
}

if ($node) {
  & $node.Source --check $mainPath
  if ($LASTEXITCODE -ne 0) {
    Copy-Item -LiteralPath $backupFile -Destination $mainPath -Force
    throw "Node detectou erro de sintaxe. main.js original foi restaurado automaticamente."
  }
}

Write-Host ""
Write-Host "FIX V2 aplicado com sucesso." -ForegroundColor Green
Write-Host "Alterado somente: src\main.js (controlador do rasgo + resize dele)." -ForegroundColor Green
Write-Host "Backup: $backupFile" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Agora rode:" -ForegroundColor Yellow
Write-Host "  pnpm build"
Write-Host "  pnpm dev"
