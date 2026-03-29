---
name: skills-sync-cursor-claude
description: Keeps global Agent Skills identical between Cursor (~/.cursor/skills) and Claude Code (~/.claude/skills) using one canonical root, junction/symlink, or copy sync. Use when the user wants the same skills in both tools, sync global skills, mirror skill folders, or avoid maintaining two copies on Windows or macOS/Linux.
metadata:
  version: "1.0.0"
  last_verified: "2026-03-29"
---

# Cursor ↔ Claude Code グローバルスキル同期

## いつ使うか

- Cursor と Claude Code の**ユーザー全体スキル**を同じ内容にしたいとき。
- 「片方だけ更新したのでコピーしたい」「二重管理をやめたい」と言われたとき。

## 前提（パス）

| ホスト | グローバルスキルルート |
|--------|-------------------------|
| **Cursor** | `~/.cursor/skills/`（各スキルは `<name>/SKILL.md`） |
| **Claude Code** | `~/.claude/skills/`（同上） |

形式は **skill-builder** の `references/skill-folder-spec.md` §9.1 と Anthropic の Agent Skills 前提で**共通化できる**。ホスト専用の YAML や追記があるスキルは **`references/host-cursor.md` / `references/host-claude.md`** に分離するのが安全（仕様のマルチホスト運用に合わせる）。

## 方針の選び方

1. **推奨（メンテ最小）**: **正本を 1 つ**決め、もう一方を **ジャンクション（Windows）またはシンボリックリンク（macOS/Linux）**で同じディレクトリを指す。以後は正本だけ編集する。
2. **正本を増やしたくない**: 既存のどちらかを正にし、もう一方へ **増分コピー**（`robocopy` / `rsync`）。削除の反映ポリシーはユーザーに確認する（ミラーリングは片側消去のリスクあり）。
3. **既に両方に別内容がある**: 先に **差分をマージ**（重複 `name` フォルダは中身を手で統合）、その後 1 または 2 に移行する。

## 手順（エージェントがユーザーに案内する順）

1. **Cursor と Claude Code を終了**する（スキルフォルダを掴んでいると失敗しうる）。
2. **バックアップ**: `skills` フォルダ全体を zip コピーなど別名で退避する。
3. ユーザーに「**Cursor を正**にするか **Claude を正**にするか」を 1 文で確認する。
4. OS に応じて **`references/platforms.md`** の該当節だけ実行する（ジャンクション or コピー）。
5. 両アプリを起動し、**スキル一覧に同じ `<name>` が見えるか**を確認する。

## 自動コピー（任意）

Windows で一方向コピーだけなら **`scripts/Sync-GlobalSkills.ps1`** を使える。ジャンクションは手動の方が安全なため SKILL では `references/platforms.md` を正とする。

## Troubleshooting

### ジャンクション / symlink 作成で「既に存在する」

**原因**: リンク先にしたいパスに、すでに実フォルダやファイルがある。

**対処**: 退避後、そのパスをリネームまたは削除してから作り直す。中身を失わないよう必ずバックアップする。

### 同期後、片方のツールだけ古いスキルが残る

**原因**: キャッシュや、プロジェクトローカルの `.cursor/skills` / `.claude/skills` が別にある。

**対処**: グローバルと**プロジェクト**は別ルート。プロジェクト側も揃えるなら同様にコピーまたはリンクの方針を決める（同一 `name` の二重配置は避ける）。

### Claude Code 専用のメタデータを入れたい

**原因**: 将来、ホストごとに解釈が分岐するキーが増える可能性。

**対処**: 共通 `SKILL.md` は薄く保ち、差分は `references/host-claude.md` 等に書く。コピー同期でも衝突しにくい。

## 第3層

- OS 別コマンド全文: `references/platforms.md`
- 一方向コピー用 PowerShell: `scripts/Sync-GlobalSkills.ps1`
