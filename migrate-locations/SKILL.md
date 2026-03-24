---
name: migrate-locations
description: Source and destination paths for migrating Cursor rules and slash commands to Skills. Use when finding files to migrate or where to write new skills.
---
# Migration Paths

## 関連スキル（ルール／コマンド → スキル移行）

| スキル | 役割 |
|--------|------|
| **migrate-locations**（本スキル） | **移行元・移行先パス**の一覧（プロジェクト / ユーザー） |
| **migrate-rule-to-skill** | `.mdc` ルール 1 件 → `SKILL.md`（本文そのまま） |
| **migrate-command-to-skill** | スラッシュコマンド `.md` → `SKILL.md` |
| **rule-format** / **rule-scope** | ルールを**残す**ときの `.mdc` の書き方・適用範囲 |
| **skill-builder** / **skill-folder-spec.md** | 新規スキルの**公式フォルダ構成** |

## パス一覧

| Level | Source | Destination |
|-------|--------|--------------|
| Project | `{workspaceFolder}/**/.cursor/rules/*.mdc`, `{workspaceFolder}/**/.cursor/commands/*.md` | `{workspaceFolder}/.cursor/skills/` |
| User | — | `~/.cursor/skills/` |
| User commands | `~/.cursor/commands/*.md` | `~/.cursor/skills/` |

Ignore: `~/.cursor/worktrees`, `~/.cursor/skills-cursor`. Rules can live in nested `.cursor/rules/`; search with globs.

## Troubleshooting

### エラー: 移行したスキルが一覧に出ない・読まれない

**原因**: グローバルとプロジェクトの取り違え、フォルダ名と `SKILL.md` の `name` の不一致、配置が `skills` 以外。

**対処**: 本スキルの表どおり `~/.cursor/skills/<name>/` または `.cursor/skills/<name>/` を確認。**skill-folder-spec.md** §9（**skill-builder** 内）でホスト別パスを確認。

### エラー: どこからどこへコピーすればよいか分からない

**原因**: ネストした `.cursor/rules` や user commands の場所が曖昧。

**対処**: 上記 **パス一覧**を再確認。`worktrees` は無視。必要ならプロジェクト内で `.cursor/commands` / `.cursor/rules` を glob 検索する。

### エラー: ルールをスキル化すべきか判断できない

**原因**: `alwaysApply` や `globs` 付きルールはスキル化ポリシーと相性が悪い。

**対処**: **migrate-rule-to-skill** の前提（対象外条件）を読む。**常時ガードレール**は `.mdc` のまま **rule-scope** で管理する選択肢もある。

