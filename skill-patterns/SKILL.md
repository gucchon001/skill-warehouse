---
name: skill-patterns
description: Reusable patterns for Agent Skills (template, examples, workflow, conditional, feedback loop). Use when designing how a skill should guide the agent.
---
# Skill Content Patterns

## Template

Define output format:

```markdown
## Report structure
# [Title]
## Executive summary
[One paragraph]
## Key findings
- Finding with data
## Recommendations
1. Actionable item
```

## Examples

For quality-sensitive output, show concrete examples (e.g. commit message format: input → output).

## Workflow

Numbered steps + optional checklist; agent copies and tracks progress.

## Conditional

Branch by decision: "If X → follow A; if Y → follow B."

## Feedback loop

After an action, run a validation step (e.g. script); if it fails, fix and re-run before proceeding.

Choose the pattern that fits the task's fragility and consistency needs.

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

