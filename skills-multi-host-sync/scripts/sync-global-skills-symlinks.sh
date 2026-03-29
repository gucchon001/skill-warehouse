#!/usr/bin/env bash
# Points Cursor, Claude Code, and Antigravity global skill roots at one canonical folder (symlinks).
#
# Usage:
#   chmod +x sync-global-skills-symlinks.sh
#   ./sync-global-skills-symlinks.sh              # canonical: ~/.agent-skills
#   ./sync-global-skills-symlinks.sh /path/to/canonical
#
# If a target exists as a real directory with contents, the script exits with an error; back it up first.

set -euo pipefail

CANON_INPUT="${1:-$HOME/.agent-skills}"
mkdir -p "$CANON_INPUT"
CANON="$(cd "$CANON_INPUT" && pwd)"

link_one() {
  local dest="$1"
  local parent
  parent="$(dirname "$dest")"
  mkdir -p "$parent"

  if [[ -L "$dest" ]]; then
    rm -f "$dest"
  elif [[ -d "$dest" ]]; then
    local n
    n="$(find "$dest" -mindepth 1 -maxdepth 1 2>/dev/null | wc -l | tr -d ' ')"
    if [[ "${n:-0}" -gt 0 ]]; then
      echo "Refusing to replace non-empty directory: $dest" >&2
      exit 1
    fi
    rmdir "$dest"
  elif [[ -e "$dest" ]]; then
    echo "Refusing: $dest exists and is not a directory" >&2
    exit 1
  fi

  ln -sfn "$CANON" "$dest"
  echo "Symlink: $dest -> $CANON"
}

link_one "$HOME/.cursor/skills"
link_one "$HOME/.claude/skills"
mkdir -p "$HOME/.gemini/antigravity"
link_one "$HOME/.gemini/antigravity/skills"

echo "Done. Canonical: $CANON"

# Default: run git-push-canonical when .git exists. Opt out: SKIP_GIT_PUSH=1
if [[ "${SKIP_GIT_PUSH:-0}" != "1" ]]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  bash "$SCRIPT_DIR/git-push-canonical.sh" "$CANON"
fi
