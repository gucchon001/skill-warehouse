---
name: skill-workflow
description: End-to-end workflow for creating an Agent Skill (discovery, design, implementation, verification). Use when guiding the full skill-creation process.
---
# Skill Creation Workflow

1. **Discovery**: Gather purpose, location, triggers, output format, existing patterns (see skill-requirements).
2. **Design**: Draft name (lowercase, hyphens), description (WHAT + WHEN), main sections, and any reference files or scripts.
3. **Implementation**: Create directory, write SKILL.md (see skill-structure, skill-descriptions, skill-authoring, skill-patterns, skill-scripts).
4. **Verification**:
   - SKILL.md under 500 lines
   - Description specific with trigger terms
   - Consistent terminology
   - References one level deep
   - No time-sensitive wording

Apply **cursor-rules** mindset (one concern): one concern per skill where possible; split instead of one large skill.

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

