---
name: skill-requirements
description: Gathers requirements before creating an Agent Skill (purpose, scope, triggers, output format). Use when starting to create a new skill or when the user asks what to define first.
---
# Skill Requirements Gathering

Before creating a skill, determine:

1. **Purpose and scope**: What specific task or workflow should this skill help with?
2. **Target location**: Personal (`~/.cursor/skills/`) or project (`.cursor/skills/`)?
3. **Trigger scenarios**: When should the agent automatically apply this skill?
4. **Key domain knowledge**: What specialized information does the agent need?
5. **Output format**: Any required templates, formats, or styles?
6. **Existing patterns**: Conventions or examples to follow?

Infer from conversation context when possible. Use AskQuestion when available for scope/location; otherwise ask conversationally.

**Never create skills in `~/.cursor/skills-cursor/`** — reserved for Cursor's built-in skills.

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

