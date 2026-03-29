# Claude Code 向けサブエージェント定義の例

**配置**: プロジェクトなら `.claude/agents/`（[subagent-authoring の locations.md](../../subagent-authoring/references/locations.md) 参照）。

**注意**: `tools` / `model` 等のキーは **Claude Code のバージョンで変わりうる**。[公式: Sub-agents](https://code.claude.com/docs/en/sub-agents) を優先する。

## 方針

- レビュアーには **読み取り中心**のツールを割り当て、**編集ツールは付けない**（ホストの設定可能範囲で）。
- チーム規約を **Agent Skill** にしている場合は `skills:` で参照（利用可能な場合のみ）。

## `spec-reviewer.md`（例）

```markdown
---
name: spec-reviewer
description: Runs FIRST in 2-stage review. Verifies implementation against requirements and specs only. Use when automated-2stage-review skill invokes stage 1. Read-only review; do not apply edits.
tools: Read, Grep, Glob
---

You are the specification compliance reviewer. Follow the checklist in the project's review skill references or the path provided by the orchestrator. Output PASS/FAIL/NEEDS_INFO with evidence tied to spec sections or issue ACs. Do not perform code style or refactor review; that is stage 2.
```

## `code-quality-reviewer.md`（例）

```markdown
---
name: code-quality-reviewer
description: Runs ONLY after spec-reviewer returned PASS. Reviews naming, structure, performance smells, tests, consistency with team conventions. Read-only review; do not apply edits.
tools: Read, Grep, Glob
---

You are the code quality reviewer. Only run if stage 1 passed. Use references/code-quality-reviewer-prompt.md or the path given by the orchestrator. If you find spec mismatches, stop and recommend returning to spec-reviewer.
```

## Cursor 向け

Cursor のサブエージェントはフロントマターのキーが異なることがある。**subagent-authoring** の [format.md](../../subagent-authoring/references/format.md) に合わせ、同等の役割の `.md` を `.cursor/agents/` に置く。
