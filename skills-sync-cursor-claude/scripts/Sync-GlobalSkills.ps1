<#!
  One-way copy of global Agent Skills between Cursor and Claude Code (Windows).
  Does not delete extra folders on the destination (no /MIR).

  Usage:
    .\Sync-GlobalSkills.ps1 -Direction CursorToClaude
    .\Sync-GlobalSkills.ps1 -Direction ClaudeToCursor
#>
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('CursorToClaude', 'ClaudeToCursor')]
    [string]$Direction
)

$ErrorActionPreference = 'Stop'

$cursorRoot = Join-Path $env:USERPROFILE '.cursor\skills'
$claudeRoot = Join-Path $env:USERPROFILE '.claude\skills'

switch ($Direction) {
    'CursorToClaude' {
        $src = $cursorRoot
        $dst = $claudeRoot
    }
    'ClaudeToCursor' {
        $src = $claudeRoot
        $dst = $cursorRoot
    }
}

if (-not (Test-Path -LiteralPath $src -PathType Container)) {
    Write-Error "Source skills folder does not exist: $src"
}

New-Item -ItemType Directory -Force -Path $dst | Out-Null

$robocopy = Get-Command robocopy -ErrorAction SilentlyContinue
if (-not $robocopy) {
    Write-Error 'robocopy not found (unexpected on Windows).'
}

# /E subdirs incl. empty, /XO skip older dest, no mirror (no deletes on dst)
& robocopy.exe $src $dst /E /XO /NFL /NDL /NJH /NJS
$code = $LASTEXITCODE
# robocopy: 0-7 = success with various meanings; >=8 = error
if ($code -ge 8) {
    Write-Error "robocopy failed with exit code $code"
}

Write-Host "Done: $Direction ($src -> $dst). robocopy exit: $code"
