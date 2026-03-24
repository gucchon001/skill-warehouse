---
name: subagent-format
description: File format and frontmatter for Cursor subagents (.md in agents folder). Use when creating or editing a subagent file.
---
# Subagent File Format

`.md` file with YAML frontmatter and markdown body (the system prompt).

```markdown
---
name: my-agent
description: When to delegate to this subagent (be specific)
---

You are a... [system prompt]
```

**Required fields**: `name` (lowercase, hyphens), `description` (when to delegate). Body = system prompt. No `disable-model-invocation` unless documented for subagents.

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

