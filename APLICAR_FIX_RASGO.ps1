$ErrorActionPreference = "Stop"

$project = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$mainPath = Join-Path $project "src\main.js"

if (!(Test-Path -LiteralPath $mainPath)) {
  throw "Nao encontrei src\main.js. Extraia este patch na raiz do sitejuju."
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$text = [System.IO.File]::ReadAllText($mainPath, $utf8)

# Segurança: este patch é propositalmente cirúrgico. Se a estrutura esperada
# não estiver presente exatamente uma vez, ele aborta sem gravar nada.
$functionPattern = '(?s)function renderTear\(\) \{.*?\r?\n\}\r?\n\r?\nconst tearScrollDriver'
$functionMatches = [regex]::Matches($text, $functionPattern)

if ($functionMatches.Count -ne 1) {
  throw "renderTear nao encontrado exatamente uma vez. Nenhum arquivo foi alterado."
}

$varsOld = @'
let tearTransitionViewport = 0;
let tearFreezeStartY = 0;
let tearHandoffY = 0;
let tearViewportWidth = Math.round(window.innerWidth || document.documentElement.clientWidth || 0);
'@

$varsNew = @'
let tearTransitionViewport = 0;
let tearFreezeStartY = 0;
let tearHandoffY = 0;

// Estado monotônico da emenda:
// before -> tearing -> completed.
// "completed" só pode voltar para "before" se o usuário realmente retornar
// ao capítulo anterior; pequenas oscilações de scroll/viewport não reabrem o rasgo.
let tearPhase = 'before';
let tearLastScrollY = window.scrollY;

let tearViewportWidth = Math.round(window.innerWidth || document.documentElement.clientWidth || 0);
'@

if (!$text.Contains($varsOld)) {
  throw "Bloco de estado da transicao nao corresponde ao esperado. Nenhum arquivo foi alterado."
}

$newFunction = @'
function renderTear() {
  if (!chapterTear || !tearStage || !tearPage || !unifiedStory) return;

  const scrollY = window.scrollY;
  const liveViewport = liveMobileViewportHeight();
  const deltaY = scrollY - tearLastScrollY;
  tearLastScrollY = scrollY;

  const liveStart = chapterTear.offsetTop - liveViewport;
  const liveHandoff = unifiedStory.offsetTop;

  // Para rearmar o efeito é preciso voltar de verdade ao capítulo anterior.
  // Isso separa uma intenção real do usuário das pequenas oscilações causadas
  // pela barra móvel do navegador, momentum e arredondamento de layout.
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

    // IMPORTANTE: não zeramos tearFreezeStartY/tearHandoffY aqui.
    // O bug anterior acontecia justamente porque a geometria era esquecida
    // assim que a Conversa aparecia por um frame, permitindo o rasgo reentrar.
  };

  // Depois de concluído, o handoff é irreversível enquanto continuamos
  // próximos/abaixo da Conversa. Nada de viewport/resíduo de momentum pode
  // trazer "Nosso primeiro beijo" de volta por cima.
  if (tearPhase === 'completed') {
    if (deltaY < -.5 && scrollY < liveStart - rearmMargin) {
      setBefore();
    }
    return;
  }

  // Antes da emenda, apenas aguardamos chegar ao ponto correto.
  if (tearPhase === 'before') {
    if (scrollY < liveStart) {
      if (tearVisualMode !== 'before') {
        tearVisualMode = 'before';
        tearStage.classList.remove('is-active');
        resetTearVisual();
      }
      return;
    }

    // Entrou no rasgo: congelamos as duas coordenadas UMA única vez.
    tearTransitionViewport = liveViewport;
    tearFreezeStartY = chapterTear.offsetTop - tearTransitionViewport;
    tearHandoffY = unifiedStory.offsetTop;
    tearPhase = 'tearing';
  }

  const freezeStart = tearFreezeStartY;
  const handoff = tearHandoffY;

  // Reversão intencional: se a pessoa realmente voltou para a tela anterior,
  // rearmamos o efeito. Uma oscilação de poucos pixels não consegue fazer isso.
  if (deltaY < -.5 && scrollY < freezeStart - rearmMargin) {
    setBefore();
    return;
  }

  // O rasgo terminou. A partir daqui a Conversa é a única tela válida.
  // Mesmo que o scroll oscile alguns pixels para cima no frame seguinte,
  // permanecemos em completed.
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

const tearScrollDriver
'@

$text = $text.Replace($varsOld, $varsNew)
$text = [regex]::Replace($text, $functionPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newFunction }, 1)

$viewportOld = @'
  // Android dispara resize quando a barra do navegador recolhe/volta. Isso
  // NÃO é uma mudança real de layout e não pode desmontar/recriar os clones
  // no meio do rasgo. Em mobile, só reconstruímos se a largura realmente
  // mudou (rotação, resize de janela, etc.).
  if (window.innerWidth <= 860 && !widthChanged) {
    tearScrollDriver.schedule();
    return;
  }

  tearSnapshotBuilt = false;
  tearNextBuilt = false;
  tearVisualMode = null;
  tearTransitionViewport = 0;
  tearFreezeStartY = 0;
  tearHandoffY = 0;
  tearSnapshotSlot?.replaceChildren();
  tearNextSlot?.replaceChildren();
  resetTearVisual();
  tearScrollDriver.schedule();
'@

$viewportNew = @'
  // Mudança apenas de ALTURA (barra do Chrome/Safari, teclado, UI do browser)
  // não é motivo para desmontar/rearmar a transição — em desktop nem em mobile.
  if (!widthChanged) {
    tearScrollDriver.schedule();
    return;
  }

  // Largura mudou de verdade (rotação/resize). Reconstruímos só os clones.
  // O estado "completed" continua completed; nunca reabre a tela anterior.
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
'@

if (!$text.Contains($viewportOld)) {
  throw "Bloco de resize da transicao nao corresponde ao esperado. Nenhum arquivo foi alterado."
}

$text = $text.Replace($viewportOld, $viewportNew)

# Backup fora do repositório.
$backupDir = Join-Path $env:TEMP ("sitejuju-tear-fix-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
Copy-Item -LiteralPath $mainPath -Destination (Join-Path $backupDir "main.js") -Force

[System.IO.File]::WriteAllText($mainPath, $text, $utf8)

Write-Host ""
Write-Host "Correcao aplicada somente em src\main.js." -ForegroundColor Green
Write-Host "Backup: $backupDir\main.js" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Agora teste:" -ForegroundColor Yellow
Write-Host "  pnpm build"
Write-Host "  pnpm dev"
