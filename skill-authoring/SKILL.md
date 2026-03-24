---
name: skill-authoring
description: Core authoring principles for Agent Skills (concise, progressive disclosure, degrees of freedom). Use when writing or refactoring skill content.
---
# Skill Authoring Principles

- **Concise**: Assume the agent is capable; add only context it doesn't have. Challenge every paragraph: "Does the agent really need this?"
- **Under 500 lines**: Keep SKILL.md lean; use reference.md / examples.md for detail.
- **Progressive disclosure**: Essential steps in SKILL.md; link one level deep to reference.md or examples.md. Avoid deep nesting.
- **Degrees of freedom**:
  - **High** (text only): Multiple valid approaches (e.g. code review).
  - **Medium** (templates): Preferred pattern with acceptable variation.
  - **Low** (exact scripts): Fragile or consistency-critical steps.

No time-sensitive wording (e.g. "before August 2025"). Use "Current method" vs "Legacy" sections if needed.

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

