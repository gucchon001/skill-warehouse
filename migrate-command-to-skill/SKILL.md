---
name: migrate-command-to-skill
description: Converts a slash command (.md) to a Skill (SKILL.md). Use when migrating one command; preserve body exactly; add disable-model-invocation.
---
# Command → Skill Conversion

## 関連スキル（ルール／コマンド → スキル移行）

| スキル | 役割 |
|--------|------|
| **migrate-command-to-skill**（本スキル） | スラッシュコマンド **`.md` → SKILL.md**（本文完全保持 + `disable-model-invocation`） |
| **migrate-rule-to-skill** | **`.mdc` ルール**のスキル化（条件付き） |
| **migrate-locations** | コピー元・**配置先パス** |
| **skill-builder** | 新規スキル設計・フォルダ仕様 |

**Preserve body content exactly.** Do not reformat or "improve" it.

1. Read the command `.md` file.
2. Infer `description` from the first heading (strip `#`).
3. Create `.cursor/skills/{skill-name}/` (name = filename without .md).
4. Write `SKILL.md` with frontmatter: `name`, `description`, `disable-model-invocation: true`. Then a blank line, then the exact original content.
5. Optionally delete the original `.md`.

`disable-model-invocation: true` keeps the skill from being auto-suggested; commands are triggered explicitly via the `/` menu. `name` must be lowercase with hyphens only.

## Troubleshooting

### エラー: コマンド移行後、意図せずスキルが自動で選ばれる

**原因**: `disable-model-invocation: true` を付け忘れた。

**対処**: フロントマターに `disable-model-invocation: true` を追加し、従来どおり `/` メニューからの明示利用に寄せる。

### エラー: 本文が変わってしまった／フォーマットが崩れた

**原因**: 移行時に「改善」のために本文を編集してしまった。

**対処**: 元 `.md` を再読み込みし、**本文は一字一句そのまま**貼り直す（本スキルの前提）。

### エラー: スキルが一覧に出ない

**原因**: 配置パスやフォルダ名と `name` の不一致。

**対処**: **migrate-locations** と **skill-folder-spec.md** §9 を確認する。

