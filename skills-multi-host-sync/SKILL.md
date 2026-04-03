---
name: skills-multi-host-sync
description: "Unifies one canonical Agent Skills tree (スキル貯蔵庫 / skill-warehouse) for Cursor, Claude Code, and Antigravity via junctions or symlinks; by default runs git commit+push on CANON when .git exists. Triggers: スキルを同期して, スキルを同期, グローバルスキルを同期, スキル同期; sync global skills, sync skills across agents. On trigger, run verify/repair then sync script (includes git push by default)—not prose-only unless execution is blocked."
metadata:
  last_verified: "2026-04-03"
  version: "1.4.0"
---

# skills-multi-host-sync

## Purpose

**1 つの正本フォルダ**（**スキル貯蔵庫**；Git では多くの場合リポジトリ名 `skill-warehouse`）にグローバルスキルを置き、`~/.cursor/skills`・`~/.claude/skills`・`~/.gemini/antigravity/skills` の**3 ルートを同じ実体へ向ける**。以後は正本だけ編集する。

**「スキルを同期して」** = リンクの検証・修復に加え、**正本に `.git` があるときは既定で `git add` → 必要なら `commit` → `push`** まで行う（`scripts/sync-global-skills-*.ps1|sh` が末尾で `git-push-canonical` を呼ぶ）。**リンクだけ直したい**ときは `-SkipGitPush` / `SKIP_GIT_PUSH=1`。

## Execute

シェルが使えるときは**この順で実行**する。説明のみで終えない（実行不可のときだけ手動コマンドを返す）。

1. **正本** `CANON` を決める。未指定なら `~/.agent-skills`（Windows: `%USERPROFILE%\.agent-skills`）。
2. **検証**（クロスプラットフォーム）:
   ```bash
   node scripts/verify.mjs [CANON]
   ```
   `!` 行がなければ全ホスト OK（手順 4 の Git のみ実行）。`!` 行があれば手順 3 へ。
3. **修復**（ずれている・実フォルダのままのとき）:
   - 中身のある実フォルダは**必ず** `skills_backup_YYYYMMDD_HHmmss` などへリネームしてから続行する。
   - `CANON` が空に近いなら、**いちばんスキル数が多い**実フォルダから `robocopy` / `cp -a` で `CANON` へ集約する。
   - Windows: `scripts/sync-global-skills-junctions.ps1 -CanonicalPath <CANON>`（**既定で Git push 込み**。Git を触らないときだけ `-SkipGitPush`）。
   - Unix: `scripts/sync-global-skills-symlinks.sh [CANON]`（**既定で Git push 込み**。Git を触らないときだけ `SKIP_GIT_PUSH=1` を前置）。
4. **Git**: 上記スクリプトが `CANON` に `.git` がある場合に **`git-push-canonical`** を呼ぶ（既定）。変更がなければコミットは作らず、`git push` のみ試みる場合がある。`git push` が失敗してもジャンクション同期の成功は報告し、認証・コンフリクトは `references/details.md` の Git 節に従ってユーザーへ示す。
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
