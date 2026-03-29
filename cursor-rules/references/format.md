# `.mdc` の形式（フロントマター）

親スキル: **cursor-rules** の `SKILL.md`。

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

**対処**: プロジェクトの `.cursor/rules/*.mdc` を確認し、上記 Structure 例どおり YAML を閉じる。

### エラー: フロントマターのパースエラー

**原因**: `description` のコロン欠け、`globs` の引用符崩れ、タブ混在。

**対処**: 上記 **Frontmatter Fields** の型に合わせて直す。コメントは本文側に書く。

### エラー: globs なのに期待するファイルでルールが載らない

**原因**: パターンが広すぎる／狭すぎる、ワークスペースルートの解釈違い。

**対処**: [scope.md](scope.md) を Read し glob を簡略化して試す。
