---
name: migrate-rule-to-skill
description: Converts a single Cursor rule (.mdc) to a Skill (SKILL.md). Use when migrating one rule; preserve body content exactly.
---
# Rule → Skill Conversion

## 関連スキル（ルール／コマンド → スキル移行）

| スキル | 役割 |
|--------|------|
| **migrate-rule-to-skill**（本スキル） | **`.mdc` 1 件**を条件付きで SKILL 化（本文保持） |
| **migrate-command-to-skill** | スラッシュコマンド `.md` → SKILL |
| **migrate-locations** | パス一覧 |
| **rule-format** / **rule-scope** | ルールを **`.mdc` のまま**保守するとき |

**Preserve body content exactly.** Do not reformat or "improve" it.

1. Read the `.mdc` file.
2. Take `description` from frontmatter; ignore `globs` and `alwaysApply`.
3. Body = everything after the closing `---` of frontmatter.
4. Create `.cursor/skills/{skill-name}/` (name = filename without .mdc).
5. Write `SKILL.md` with frontmatter: `name`, `description`. Then the exact body (whitespace and formatting unchanged).
6. Optionally delete the original `.mdc`.

Migrate only rules that have `description` and do **not** have `globs` or `alwaysApply: true` (i.e. "Applied intelligently" rules).

## Troubleshooting

### エラー: この手順でスキル化してはいけないルールだった

**原因**: `globs` または `alwaysApply: true` のルールは本スキルの**対象外**（常時・ファイル単位のガードは `.mdc` が適切）。

**対処**: **rule-scope** で適用方法を見直す。オンデマンドの手順だけをスキル化するなら、ルールを分割してから再検討する。

### エラー: `description` が無くて移行できない

**原因**: 本スキルは frontmatter の `description` を必須としている。

**対処**: `.mdc` に `description` を追加するか、**skill-builder** 流で新規スキルとして書き直す。

### エラー: 移行後スキルが読み込まれない

**原因**: フォルダ名・`name`・配置パスの不一致。

**対処**: **migrate-locations** と **skill-folder-spec.md** §9 を確認する。

