---
name: skills-multi-host-sync
description: "Unifies one canonical Agent Skills tree (スキル貯蔵庫 / skill-warehouse) for Cursor, Claude Code, and Antigravity via junctions or symlinks; optional git commit-push to origin. Triggers: スキルを同期して, スキルを同期, グローバルスキルを同期, スキル同期; sync global skills, sync skills across agents. On trigger, run verify/repair and git when applicable in the shell—not prose-only unless execution is blocked."
metadata:
  last_verified: "2026-03-29"
  version: "1.3.1"
---

# skills-multi-host-sync

## Purpose

**1 つの正本フォルダ**（**スキル貯蔵庫**；Git では多くの場合リポジトリ名 `skill-warehouse`）にグローバルスキルを置き、`~/.cursor/skills`・`~/.claude/skills`・`~/.gemini/antigravity/skills` の**3 ルートを同じ実体へ向ける**。以後は正本だけ編集する。

## Execute

シェルが使えるときは**この順で実行**する。説明のみで終えない（実行不可のときだけ手動コマンドを返す）。

1. **正本** `CANON` を決める。未指定なら `~/.agent-skills`（Windows: `%USERPROFILE%\.agent-skills`）。
2. **検証**: 上記 3 ルートがすべて `CANON` へのジャンクション（Windows）またはシンボリックリンク（Unix）か確認する。すべて一致なら、各ルート直下のスキルフォルダ数を数え、等しければ**終了**。
3. **修復**: ずれている、または実フォルダのままのルートがある場合:
   - 中身のある実フォルダは**必ず** `skills_backup_YYYYMMDD_HHmmss` などへリネームしてから続行する。
   - `CANON` が空に近いなら、**いちばんスキル数が多い**実フォルダから `robocopy` / `cp -a` で `CANON` へ集約する。
   - Windows: `scripts/sync-global-skills-junctions.ps1 -CanonicalPath <CANON>`。Git までまとめるなら **`-GitPush`** を付ける。
   - Unix: `scripts/sync-global-skills-symlinks.sh [CANON]`。Git までまとめるなら **`GIT_PUSH=1`** を前置する。
4. **Git**: `CANON` に `.git` があるとき、リンク同期の**直後**に `scripts/git-push-canonical.ps1`（Windows）または `scripts/git-push-canonical.sh`（Unix）を実行する。変更がなければコミットは作らず、`git push` のみ試みる（リモートが進んでいる場合など）。`git push` が失敗してもジャンクション同期の成功は報告し、認証・コンフリクトは `references/details.md` の Git 節に従ってユーザーへ示す。
5. **報告**: `CANON`、3 ルートのリンク先、フォルダ数、Git（コミット有無・push 成否）を短く出す。

詳細・パス表・コピー同期・Git 例: `references/details.md`。

## Troubleshooting

### エラー: 片方のエージェントだけ古いスキル

**原因**: プロジェクト側 `.cursor/skills` 等を読んでいる、またはグローバルと同名が衝突している。

**対処**: ワークスペースのスキル有無を確認。製品ドキュメントでグローバル優先かを確認する。

### エラー: Windows で mklink / ジャンクションが失敗

**原因**: 権限、宛先がネットワーク、同名の実フォルダが残っている。

**対処**: `references/details.md` の Windows 節。空にするか退避後に再実行。ダメならコピー同期へ。

### エラー: 正本を消したらすべて空に見える

**原因**: 3 ルートはリンクのみで、実体は `CANON` 側。

**対処**: バックアップと Git は `CANON` に対して行う。削除前に実体を複製する。

### エラー: git push が失敗

**原因**: 資格情報未設定、VPN、リモート先行、`main` と `master` の不一致など。

**対処**: `CANON` で `git status` / `git remote -v` / `git pull --rebase`（方針に応じて）をユーザーが実行。シークレットはコミットしない。
