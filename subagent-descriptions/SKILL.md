---
name: subagent-descriptions
description: How to write subagent descriptions so the AI delegates correctly. Use when drafting or improving a subagent's description.
---
# Subagent Descriptions

The description decides when the AI delegates. Be specific and include trigger language.

```yaml
# ❌ Too vague
description: Helps with code

# ✅ Specific
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
```

Include "use proactively" when the agent should suggest the subagent automatically. Add clear trigger terms (e.g. "when encountering errors", "for data analysis tasks").

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

