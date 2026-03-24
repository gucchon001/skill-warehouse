---
name: skill-structure
description: Defines directory layout and SKILL.md format for Agent Skills. Use when creating the skill folder, writing frontmatter, or explaining skill file structure.
---
# Skill File Structure

## Directory Layout

公式どおりの標準ツリー（不要なサブフォルダは作らない。詳細は **skill-builder** の `references/skill-folder-spec.md`）:

```
<skill-name>/
├── SKILL.md              # 必須（第1層 YAML + 第2層本文）
├── scripts/              # 任意。実行可能コード
├── references/           # 任意。詳細ドキュメント（第3層）
└── assets/               # 任意。テンプレ・非テキスト資産
```

## SKILL.md

Required: YAML frontmatter + markdown body.

```markdown
---
name: your-skill-name
description: Brief description and when to use it
---

# Your Skill Name

## Instructions
Step-by-step guidance.
```

## Metadata

| Field | Requirements |
|-------|--------------|
| `name` | Max 64 chars, lowercase letters/numbers/hyphens only |
| `description` | Max 1024 chars, non-empty; used for skill discovery |

Keep SKILL.md lean (命令形の核心・典型 Troubleshooting のみ)。長文・API 仕様・大きな例・エラー一覧は **`references/`** へ分離し、SKILL から `references/相対パス` で参照する。

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

