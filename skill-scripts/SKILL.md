---
name: skill-scripts
description: When and how to use utility scripts in Agent Skills. Use when a skill needs reproducible, consistent steps or validation.
---
# Utility Scripts in Skills

Scripts are more reliable than generated code and save tokens.

- **When**: Fragile or consistency-critical steps; validation after edits.
- **Where**: `skill-name/scripts/` (e.g. `validate.py`, `helper.sh`).
- **Paths**: Use forward slashes (e.g. `scripts/helper.py`), not Windows-style backslashes.

In SKILL.md, state clearly whether the agent should **execute** the script or **read** it as reference. Document required packages and how to run (e.g. `python scripts/validate.py output/`). Prefer one default approach; add an escape hatch only when necessary (e.g. "For OCR, use pdf2image instead").

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

