# Multi-host global skills（補足）

出典: **skill-builder** の `references/skill-folder-spec.md` §9.1。製品ドキュメントと矛盾する場合は製品を優先する。

## グローバルルート（3 ホスト）

| ホスト | パス |
|--------|------|
| Cursor | `~/.cursor/skills/<name>/` |
| Claude Code | `~/.claude/skills/<name>/` |
| Antigravity | `~/.gemini/antigravity/skills/<name>/` |

Windows 例: `%USERPROFILE%\.cursor\skills` ほか同様。macOS/Linux は `$HOME/.cursor/skills` ほか。

**ワークスペース**の `.cursor/skills` / `.claude/skills` / `.agent/skills` は別。**このスキルはユーザーグローバル同士の共有のみ**。

**同名スキルをグローバルとプロジェクトの両方に置かない**（優先が不明）。

## Windows: ジャンクション

既存の `skills` が実フォルダのとき: リネーム退避 → 正本へ中身を揃える → `cmd /c mklink /J "<dest>" "<CANON>"`。宛先はローカル NTFS が無難。確認: `cmd /c dir "%USERPROFILE%\.cursor\skills"` で `<JUNCTION>`。削除は `rmdir` でエントリのみ（正本は残る）。

`/D` シンボリックリンクは権限・ポリシーで失敗しうる。不可なら下記コピー同期。

## リンク不可時: コピー同期

`/MIR` や `rsync --delete` は**削除同期**で取り違えると壊れる。原則 **削除なし**: Windows `robocopy CANON TARGET /E /XO`、Unix `rsync -a`（`--delete` は理解した上でのみ）。

## ホスト固有 YAML

各ホストだけのメタキーが必要なら `references/host-<product>.md` に隔離し、共通 `SKILL.md` は汎用のままにする（skill-folder-spec §10.1）。

## Git（正本をリポジトリにしている場合）

**目的**: ジャンクション／シンボリックリンクの同期が終わったあと、正本 `CANON` の変更を **commit → push** してバックアップ・共有する。

- **判定**: `Test-Path (Join-Path CANON '.git')` または `[ -d "$CANON/.git" ]`。
- **実行（既定）**: `sync-global-skills-junctions.ps1` / `sync-global-skills-symlinks.sh` の**末尾で** `git-push-canonical` が走る（`CANON` に `.git` があるとき）。単体実行: `scripts/git-push-canonical.ps1 -CanonicalPath <CANON>` / `git-push-canonical.sh <CANON>`。
- **コミットメッセージ**: 未指定なら `chore: sync skill-warehouse <YYYY-MM-dd HH:mm>`（**スキル貯蔵庫**の同期を表す既定文）。上書きは `-Message`（ps1）または `GIT_COMMIT_MSG`（sh）。
- **同期だけして Git は触らない**: Windows は `sync-global-skills-junctions.ps1 -SkipGitPush`。Unix は `SKIP_GIT_PUSH=1 ./sync-global-skills-symlinks.sh`。
- **コミットはするが push だけしない**（`git-push-canonical` 単体のとき）: ps1 は `-SkipPush`、sh は `SKIP_PUSH=1`。
- **リポジトリ名（スキル貯蔵庫）**: スラッグは **`skill-warehouse`**。新規作成例: `gh repo create skill-warehouse --private --source=. --remote=origin --push`（`gh` 認証済みのとき）。別アカウント／別名にしたい場合は `git remote set-url origin https://github.com/<user>/<repo>.git`。
- **リモート URL**: **`git remote -v` を正**とする。旧 `cursor-global-skills` を運用しない場合は `git remote remove origin` のうえ新規 `origin` を追加する。

機密・`.env` をスキル樹に置かない。`.gitignore` で除外する。
かない。`.gitignore` で除外する。

かない。`.gitignore` で除外する。


かない。`.gitignore` で除外する。



かない。`.gitignore` で除外する。
