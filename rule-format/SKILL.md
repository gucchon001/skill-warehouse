---
name: rule-format
description: Defines the file format for Cursor rules (.mdc). Use when creating or editing rule files, checking frontmatter syntax, or explaining .cursor/rules/ file structure.
---
# Cursor Rule File Format

## 関連スキル（Cursor ルール）

| スキル | 役割 |
|--------|------|
| **rule-format**（本スキル） | `.mdc` の**構文・フロントマター** |
| **rule-scope** | `alwaysApply` と **globs** の選び方 |
| **rule-authoring** | 文章の書き方（短さ・例・1 関心） |
| **skill-builder** | ルール本文をベースに**新規スキル**を公式構成で作る |

Rules are `.mdc` files in `.cursor/rules/`.

## Structure

```markdown
---
description: Brief description of what this rule does
globs: **/*.ts
alwaysApply: false
---

# Rule Title

Your rule content here...
```

## Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | What the rule does (shown in rule picker) |
| `globs` | string | File pattern — rule applies when matching files are open |
| `alwaysApply` | boolean | If true, applies to every session |

File patterns: e.g. `**/*.ts`, `**/*.tsx`, `backend/**/*.py`.

## Troubleshooting

### エラー: ルールが UI に出ない・効かない

**原因**: 配置が `.cursor/rules/` 以外、拡張子が `.mdc` でない、フロントマターの `---` が閉じていない。

**対処**: プロジェクトの `.cursor/rules/*.mdc` を確認し、本スキルの Structure 例どおり YAML を閉じる。

### エラー: フロントマターのパースエラー

**原因**: `description` のコロン欠け、`globs` の引用符崩れ、タブ混在。

**対処**: 上記 **Frontmatter Fields** の型に合わせて直す。コメントは本文側に書く。

### エラー: globs なのに期待するファイルでルールが載らない

**原因**: パターンが広すぎる／狭すぎる、ワークスペースルートの解釈違い。

**対処**: **rule-scope** を Read し glob を簡略化して試す。

