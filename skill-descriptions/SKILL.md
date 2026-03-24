---
name: skill-descriptions
description: How to write effective skill descriptions for discovery (WHAT/WHEN, third person, trigger terms). Use when drafting or improving a skill's description field.
---
# Writing Skill Descriptions

The description is used for skill discovery. Be specific and include trigger terms.

## Style

- **Third person**: "Processes Excel files and generates reports" — not "I can help you..." or "You can use this to..."
- **WHAT**: What the skill does (specific capabilities).
- **WHEN**: When the agent should use it (trigger scenarios).

## Examples

```yaml
# Good
description: Extract text and tables from PDFs, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# Too vague
description: Helps with documents
```

Include both capability and trigger phrases so the agent can match user intent.

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

