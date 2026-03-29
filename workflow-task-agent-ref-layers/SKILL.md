---
name: workflow-task-agent-ref-layers
description: "Workflow・Task・Agent・Reference の4語を整理し、CLAUDE.md・subagent・skill references・layer-skill-design と対応づける。Triggers: wf task agent ref, ワークフロー整理, オーケストレーション, レイヤー対応, MJ layers."
metadata:
  last_verified: "2026-03-31"
---

# workflow-task-agent-ref-layers

**目的**: マルチエージェント運用で用語と責務を揃え、どこに何を書くか迷子を減らす。参考: [MJ / note](https://note.com/mj3880/n/n2d28e12cb7a3)。

## 使い方

1. いまの依頼が WF のどの段かを言語化する。
2. Task 単位で親エージェントが持つべき最小コンテキストを切る。
3. Agent は subagent-authoring に従い定義し、ref はスキル references/ またはリポジトリの仕様書に置く。

詳細は [references/mapping-table.md](references/mapping-table.md)。

## 関連スキル

- **claude-md-workflow-routing** — WF を CLAUDE.md に落とす表。
- **subagent-authoring** — Agent 定義の正本。
- **layer-skill-design** — 思考 / 制作 / データの 3 層。
- **skill-builder** — スキルフォルダ構造（ref は references/）。
- **pre-implementation-critics** — 実装前タスクの典型。
- **local-quality-gate** — 実装後タスクの典型。

## Troubleshooting

### エラー: WF と Task が混線

**対処**: mapping-table に沿い 1 メッセージ = 1 Task に分割し、WF は CLAUDE.md にのみ書く。

### エラー: ref が SKILL.md に肥大化

**対処**: skill-growing で第3層へ退避し、Description Trap を避ける。
