---
name: subagent-locations
description: Where Cursor subagent files live (project vs user) and priority. Use when deciding where to create or find a subagent.
---
# Subagent Locations

| Location | Scope | Priority |
|----------|-------|----------|
| `.cursor/agents/` | Current project | Higher |
| `~/.cursor/agents/` | All projects | Lower |

Same name in both: project wins. Project agents are for codebase-specific, team-shared agents; user agents are personal and global.

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

