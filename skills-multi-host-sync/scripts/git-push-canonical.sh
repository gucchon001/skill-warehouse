#!/usr/bin/env bash
# In CANON: git add -A, commit if dirty, push unless SKIP_PUSH=1.
# Usage: ./git-push-canonical.sh [CANON_DIR]
set -euo pipefail
CANON="${1:-$HOME/.agent-skills}"
cd "$CANON"
if [[ ! -d .git ]]; then
  echo "git-push-canonical: no .git under $CANON — skip."
  exit 0
fi
git add -A
if [[ -z "$(git status --porcelain)" ]]; then
  echo "git-push-canonical: nothing to commit."
else
  MSG="${GIT_COMMIT_MSG:-chore: sync skill-warehouse $(date '+%Y-%m-%d %H:%M')}"
  git commit -m "$MSG"
  echo "git-push-canonical: committed."
fi
if [[ "${SKIP_PUSH:-0}" == "1" ]]; then
  exit 0
fi
git push
