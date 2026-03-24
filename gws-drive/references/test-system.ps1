# gws-drive スキル システムテスト
# 実 API を呼び出してレスポンス構造を検証する（読み取り専用・副作用なし）
# 実行: powershell -File references/test-system.ps1

$ErrorActionPreference = "Stop"
$passed = 0
$failed = 0
$skipped = 0
$total  = 0

function Run-Test {
    param(
        [string]$Name,
        [scriptblock]$TestBlock
    )
    $script:total++
    try {
        & $TestBlock
        Write-Host "[PASS] $Name" -ForegroundColor Green
        $script:passed++
    }
    catch {
        Write-Host "[FAIL] $Name : $_" -ForegroundColor Red
        $script:failed++
    }
}

function Invoke-GwsLive {
    param([string[]]$SubCommand, [string]$ParamsJson)
    if ($ParamsJson) {
        $args_ = @("drive") + $SubCommand + @("--params", $ParamsJson)
    }
    else {
        $args_ = @("drive") + $SubCommand
    }
    $raw = & gws @args_ 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "gws exited $LASTEXITCODE : $($raw -join ' ')"
    }
    return ($raw -join "`n") | ConvertFrom-Json
}

function Assert-Key {
    param($Json, [string]$Key)
    $val = $Json.$Key
    if ($null -eq $val) { throw "key '$Key' is null or missing" }
}

Write-Host "`n=== gws-drive System Tests (live API, read-only) ===`n"

# --- T1: マイドライブ files list ---
Run-Test "files list (mydrive)" {
    $j = Invoke-GwsLive -SubCommand @("files", "list") -ParamsJson '{\"pageSize\": 2}'
    Assert-Key $j "files"
    Assert-Key $j "kind"
}

# --- T2: 共有ドライブ一覧 ---
Run-Test "drives list" {
    $j = Invoke-GwsLive -SubCommand @("drives", "list")
    Assert-Key $j "drives"
    Assert-Key $j "kind"
}

# --- T3–T5: 共有ドライブ内操作（最初の共有ドライブを自動選択） ---
Write-Host "`n  Fetching first shared drive ID..."
try {
    $drivesJson = Invoke-GwsLive -SubCommand @("drives", "list")
    $firstDrive = $drivesJson.drives | Select-Object -First 1
}
catch {
    $firstDrive = $null
}

if ($null -eq $firstDrive) {
    Write-Host "[SKIP] No shared drives found - skipping shared drive file tests" -ForegroundColor Yellow
    $skipped += 3
    $total += 3
}
else {
    $driveId = $firstDrive.id
    $driveName = $firstDrive.name
    Write-Host "  Using shared drive: $driveName ($driveId)`n"

    # --- T3: 共有ドライブ内ファイル一覧 ---
    Run-Test "files list (shared drive: $driveName)" {
        $j = Invoke-GwsLive -SubCommand @("files", "list") `
            -ParamsJson "{`\`"supportsAllDrives`\`": true, `\`"includeItemsFromAllDrives`\`": true, `\`"corpora`\`": `\`"drive`\`", `\`"driveId`\`": `\`"$driveId`\`", `\`"pageSize`\`": 2}"
        Assert-Key $j "files"
        Assert-Key $j "kind"
    }

    # --- T4: 共有ドライブ get ---
    Run-Test "drives get (shared drive: $driveName)" {
        $j = Invoke-GwsLive -SubCommand @("drives", "get") `
            -ParamsJson "{`\`"driveId`\`": `\`"$driveId`\`"}"
        Assert-Key $j "id"
        Assert-Key $j "name"
        Assert-Key $j "kind"
        if ($j.id -ne $driveId) { throw "id mismatch: expected=$driveId actual=$($j.id)" }
    }

    # --- T5: allDrives 横断検索 ---
    Run-Test "files list (allDrives cross-search)" {
        $j = Invoke-GwsLive -SubCommand @("files", "list") `
            -ParamsJson '{\"supportsAllDrives\": true, \"includeItemsFromAllDrives\": true, \"corpora\": \"allDrives\", \"pageSize\": 2}'
        Assert-Key $j "files"
        Assert-Key $j "kind"
    }
}

# --- 結果 ---
$skipMsg = ""
if ($skipped -gt 0) { $skipMsg = ", $skipped skipped" }
Write-Host "`n=== Results: $passed/$total passed, $failed failed$skipMsg ===`n"
if ($failed -gt 0) { exit 1 }
