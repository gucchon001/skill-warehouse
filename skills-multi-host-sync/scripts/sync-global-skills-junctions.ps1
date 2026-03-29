#Requires -Version 5.1
<#
.SYNOPSIS
  Points Cursor, Claude Code, and Antigravity global skill roots at one canonical folder (Windows directory junctions).

.PARAMETER SkipGitPush
  If set, only create/repair junctions; do not run git-push-canonical.ps1.
  Default: push when CANON contains .git (see skills-multi-host-sync SKILL.md).

.PARAMETER CanonicalPath
  Absolute path to the real directory that contains skill folders (each <name>/SKILL.md).
  Default: $env:USERPROFILE\.agent-skills

.EXAMPLE
  .\sync-global-skills-junctions.ps1 -CanonicalPath "C:\Users\you\.agent-skills"

.NOTES
  If a target path exists as a normal directory with content, stop and back it up first (see skills-multi-host-sync SKILL.md).
#>
[CmdletBinding(SupportsShouldProcess)]
param(
  [Parameter()]
  [string] $CanonicalPath = (Join-Path $env:USERPROFILE '.agent-skills'),
  [switch] $SkipGitPush
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Test-IsJunction {
  param([string] $Path)
  if (-not (Test-Path -LiteralPath $Path)) { return $false }
  $item = Get-Item -LiteralPath $Path -Force
  return [bool]($item.Attributes -band [IO.FileAttributes]::ReparsePoint)
}

function Get-JunctionTarget {
  param([string] $Path)
  $t = (Get-Item -LiteralPath $Path).Target
  if ($null -eq $t) { return $null }
  if ($t -is [string]) {
    return [IO.Path]::GetFullPath($t)
  }
  if ($t -is [System.Array] -and $t.Count -gt 0) {
    return [IO.Path]::GetFullPath($t[0])
  }
  return [IO.Path]::GetFullPath([string]$t)
}

$canonical = [IO.Path]::GetFullPath($CanonicalPath)
if (-not (Test-Path -LiteralPath $canonical)) {
  New-Item -ItemType Directory -Path $canonical -Force | Out-Null
  Write-Host "Created canonical directory: $canonical"
}

$targets = @(
  (Join-Path $env:USERPROFILE '.cursor\skills'),
  (Join-Path $env:USERPROFILE '.claude\skills'),
  (Join-Path $env:USERPROFILE '.gemini\antigravity\skills')
)

foreach ($dest in $targets) {
  $parent = Split-Path -Parent $dest
  if (-not (Test-Path -LiteralPath $parent)) {
    if ($PSCmdlet.ShouldProcess($parent, 'Create directory')) {
      New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
  }

  if (Test-Path -LiteralPath $dest) {
    if (Test-IsJunction $dest) {
      $current = Get-JunctionTarget $dest
      if ($null -ne $current -and [string]::Equals($current, $canonical, [StringComparison]::OrdinalIgnoreCase)) {
        Write-Host "OK (already junction to canonical): $dest"
        continue
      }
      if ($PSCmdlet.ShouldProcess($dest, 'Remove junction and recreate')) {
        cmd.exe /c rmdir "$dest"
      }
    }
    else {
      $childCount = @(Get-ChildItem -LiteralPath $dest -Force -ErrorAction SilentlyContinue).Count
      if ($childCount -gt 0) {
        throw "Refusing to replace non-empty directory. Back up or rename: $dest"
      }
      if ($PSCmdlet.ShouldProcess($dest, 'Remove empty directory')) {
        Remove-Item -LiteralPath $dest -Force
      }
    }
  }

  if ($PSCmdlet.ShouldProcess($dest, "Create junction -> $canonical")) {
    cmd.exe /c mklink /J "$dest" "$canonical" | Out-Null
    if ($LASTEXITCODE -ne 0) {
      throw "mklink failed for $dest (exit $LASTEXITCODE)"
    }
    Write-Host "Junction: $dest -> $canonical"
  }
}

Write-Host "Done. Canonical: $canonical"

if (-not $SkipGitPush) {
  $gitScript = Join-Path $PSScriptRoot 'git-push-canonical.ps1'
  if (Test-Path -LiteralPath $gitScript) {
    & $gitScript -CanonicalPath $canonical
    if ($LASTEXITCODE -ne 0) {
      Write-Warning "git-push step exited $LASTEXITCODE (junctions are still OK)."
    }
  }
}
