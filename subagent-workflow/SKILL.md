---
name: subagent-workflow
description: Step-by-step workflow for creating a Cursor subagent (scope, file, frontmatter, prompt, test). Use when guiding full subagent creation.
---
# Subagent Creation Workflow

1. **Scope**: Project (`.cursor/agents/`) for team/codebase-specific; user (`~/.cursor/agents/`) for personal (see subagent-locations).
2. **Create file**: e.g. `.cursor/agents/my-agent.md` (see subagent-format).
3. **Frontmatter**: `name` (lowercase, hyphens), `description` (see subagent-descriptions).
4. **System prompt**: Body = what the agent does when invoked, workflow, output format, constraints.
5. **Test**: e.g. "Use the my-agent subagent to [task]."

Design one focused subagent per task; use detailed, trigger-rich descriptions; commit project agents to version control.

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

