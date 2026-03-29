#Requires -Version 5.1
<#
.SYNOPSIS
  In CANON: git add -A, commit if dirty, optional push.

.PARAMETER CanonicalPath
  Root that may contain .git (default: ~/.agent-skills).

.PARAMETER Message
  Commit message. Default: chore: sync skill-warehouse <timestamp> (スキル貯蔵庫).

.PARAMETER SkipPush
  Commit only; do not push.

.PARAMETER SkipGit
  No-op (for callers that pass a flag).
#>
param(
  [string] $CanonicalPath = (Join-Path $env:USERPROFILE '.agent-skills'),
  [string] $Message = '',
  [switch] $SkipPush,
  [switch] $SkipGit
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ($SkipGit) { exit 0 }

$canonical = [IO.Path]::GetFullPath($CanonicalPath)
$gitDir = Join-Path $canonical '.git'
if (-not (Test-Path -LiteralPath $gitDir)) {
  Write-Host "git-push-canonical: no .git under $canonical — skip."
  exit 0
}

Push-Location -LiteralPath $canonical
try {
  git add -A
  if ($LASTEXITCODE -ne 0) { throw "git add failed (exit $LASTEXITCODE)" }

  $porcelain = git status --porcelain 2>$null
  if ([string]::IsNullOrWhiteSpace($porcelain)) {
    Write-Host "git-push-canonical: nothing to commit."
  }
  else {
    if ([string]::IsNullOrWhiteSpace($Message)) {
      $Message = "chore: sync skill-warehouse $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    git commit -m $Message
    if ($LASTEXITCODE -ne 0) { throw "git commit failed (exit $LASTEXITCODE)" }
    Write-Host "git-push-canonical: committed."
  }

  if (-not $SkipPush) {
    git push
    if ($LASTEXITCODE -ne 0) {
      Write-Warning "git-push-canonical: git push failed (exit $LASTEXITCODE). Check auth, remote, or diverged history."
      exit 1
    }
    Write-Host "git-push-canonical: pushed."
  }
}
finally {
  Pop-Location
}
