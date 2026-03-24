# gws-drive スキル ドライラン単体テスト
# API を呼ばず --dry-run でリクエスト構造のみ検証する
# 実行: powershell -File references/test-dryrun.ps1

$ErrorActionPreference = "Stop"
$passed = 0
$failed = 0
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

function Invoke-GwsDryRun {
    param(
        [string[]]$SubCommand,
        [string]$ParamsJson
    )
    if ($ParamsJson) {
        $args_ = @("drive") + $SubCommand + @("--dry-run", "--params", $ParamsJson)
    }
    else {
        $args_ = @("drive") + $SubCommand + @("--dry-run")
    }
    $raw = & gws @args_ 2>&1
    $text = ($raw -join "`n")
    return $text | ConvertFrom-Json
}

function Assert-Param {
    param($Json, [string]$Key, [string]$Expected)
    $actual = $Json.query_params.$Key
    if ("$actual" -ne "$Expected") {
        throw "param '$Key': expected='$Expected' actual='$actual'"
    }
}

Write-Host "`n=== gws-drive Dry-Run Unit Tests ===`n"

# --- T1: マイドライブ files list ---
Run-Test "files list (mydrive)" {
    $j = Invoke-GwsDryRun -SubCommand @("files", "list") -ParamsJson '{\"pageSize\": 5}'
    if (-not $j.dry_run) { throw "dry_run is not true" }
    if ($j.method -ne "GET") { throw "method: $($j.method)" }
    if ($j.url -ne "https://www.googleapis.com/drive/v3/files") { throw "url: $($j.url)" }
    Assert-Param $j "pageSize" "5"
}

# --- T2: マイドライブ files list with q ---
Run-Test "files list with q (mydrive)" {
    $j = Invoke-GwsDryRun -SubCommand @("files", "list") -ParamsJson '{\"q\": \"name contains ''report''\", \"pageSize\": 10}'
    if (-not $j.dry_run) { throw "dry_run is not true" }
    Assert-Param $j "pageSize" "10"
}

# --- T3: files get ---
Run-Test "files get (mydrive)" {
    $j = Invoke-GwsDryRun -SubCommand @("files", "get") -ParamsJson '{\"fileId\": \"TEST_FILE_ID\"}'
    if (-not $j.dry_run) { throw "dry_run is not true" }
    if ($j.method -ne "GET") { throw "method: $($j.method)" }
}

# --- T4: drives list ---
Run-Test "drives list" {
    $j = Invoke-GwsDryRun -SubCommand @("drives", "list")
    if (-not $j.dry_run) { throw "dry_run is not true" }
    if ($j.url -ne "https://www.googleapis.com/drive/v3/drives") { throw "url: $($j.url)" }
}

# --- T5: 共有ドライブ内 files list ---
Run-Test "files list (shared drive)" {
    $j = Invoke-GwsDryRun -SubCommand @("files", "list") `
        -ParamsJson '{\"supportsAllDrives\": true, \"includeItemsFromAllDrives\": true, \"corpora\": \"drive\", \"driveId\": \"TEST_DRIVE_ID\", \"pageSize\": 5}'
    if (-not $j.dry_run) { throw "dry_run is not true" }
    Assert-Param $j "supportsAllDrives" "true"
    Assert-Param $j "includeItemsFromAllDrives" "true"
    Assert-Param $j "corpora" "drive"
    Assert-Param $j "driveId" "TEST_DRIVE_ID"
    Assert-Param $j "pageSize" "5"
}

# --- T6: 共有ドライブ内フォルダ配下 ---
Run-Test "files list (shared drive + folder)" {
    $j = Invoke-GwsDryRun -SubCommand @("files", "list") `
        -ParamsJson '{\"supportsAllDrives\": true, \"includeItemsFromAllDrives\": true, \"corpora\": \"drive\", \"driveId\": \"TEST_DRIVE_ID\", \"q\": \"''FOLDER_ID'' in parents\"}'
    if (-not $j.dry_run) { throw "dry_run is not true" }
    Assert-Param $j "supportsAllDrives" "true"
    Assert-Param $j "corpora" "drive"
    Assert-Param $j "driveId" "TEST_DRIVE_ID"
}

# --- T7: allDrives 横断検索 ---
Run-Test "files list (allDrives cross-search)" {
    $j = Invoke-GwsDryRun -SubCommand @("files", "list") `
        -ParamsJson '{\"supportsAllDrives\": true, \"includeItemsFromAllDrives\": true, \"corpora\": \"allDrives\", \"q\": \"name contains ''test''\"}'
    if (-not $j.dry_run) { throw "dry_run is not true" }
    Assert-Param $j "supportsAllDrives" "true"
    Assert-Param $j "includeItemsFromAllDrives" "true"
    Assert-Param $j "corpora" "allDrives"
}

# --- T8: files get (共有ドライブ) ---
Run-Test "files get (shared drive)" {
    $j = Invoke-GwsDryRun -SubCommand @("files", "get") `
        -ParamsJson '{\"fileId\": \"TEST_FILE_ID\", \"supportsAllDrives\": true}'
    if (-not $j.dry_run) { throw "dry_run is not true" }
    Assert-Param $j "supportsAllDrives" "true"
}

# --- 結果 ---
Write-Host "`n=== Results: $passed/$total passed, $failed failed ===`n"
if ($failed -gt 0) { exit 1 }
