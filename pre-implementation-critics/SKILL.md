---
name: pre-implementation-critics
description: "実装前に設計・調査結果へ3視点のクリティックを並列（または順次）で当て、観点漏れを減らすシフトレフト。MJ式ディスカッションの一般化。Triggers: 実装前レビュー, pre-implementation review, parallel critics, 設計レビュー 並列, shift-left, my-task-discussion style."
metadata:
  last_verified: "2026-03-31"
---

# pre-implementation-critics

**目的**: 実装に入る前に **正確性・網羅性・代替仮説**の 3 方向から批評させ、手戻りを減らす。インスピレーション: [MJ / note（並列クリティックの考え方）](https://note.com/mj3880/n/n2d28e12cb7a3)。

## 原則

- **NO coding until merge summary addresses all blockers**（**block** 級が残るときは実装開始しない。例外は **claude-md-workflow-routing** で定義した「trivial のみ」等）。
- 3 体は **同一プロンプトのコピー**にしない（視点が潰れる）。[references/default-critic-prompts.md](references/default-critic-prompts.md) の A/B/C を使い分ける。

## 手順

1. **対象を固定**: 設計メモ、調査結果、Issue 本文、**実装に入る前の合意文書**などを 1 つにまとめる。
2. **サブを用意**: [references/subagent-examples.md](references/subagent-examples.md) を `.claude/agents/` または `.cursor/agents/` に配置。
3. **起動**: 3 クリティックを **並列**（不可なら順次）。各サブに同じ対象パスと [default-critic-prompts.md](references/default-critic-prompts.md) の該当節を渡す。
4. **統合**: [references/merge-synthesis.md](references/merge-synthesis.md) に従い 1 レポートにする。
5. **分岐**: blockers 解消 → 実装。**local-quality-gate** や **code-review-subagents** は実装後フェーズで併用。

## 関連スキル

| スキル | 関係 |
|--------|------|
| **subagent-authoring** | サブ配置・並列協調の一般論 |
| **escalating-debug-loop** | デバッグ停滞時の再クリティックに再利用可能 |
| **automated-2stage-review** / **code-review-subagents** | **実装後**のレビュー（本スキルは**実装前**） |
| **claude-md-workflow-routing** | 「いつ本スキルを必須にするか」のルーティング |
| **workflow-task-agent-ref-layers** | wf / task / agent のどこに本タスクを置くかの整理 |

## Troubleshooting

### エラー: 3 サブが同じ意見ばかり

**原因**: プロンプト差が小さい、または入力が薄い。

**対処**: default-critic-prompts の A/B/C を強調差分し、入力に AC・制約を明示する。

### エラー: 並列がホストで不可

**原因**: ツール制限。

**対処**: 順次実行に落とすが、**出力は統合前に独立**させる（merge-synthesis で混ぜる）。

### エラー: 実装が先に始まってしまう

**原因**: オーケストレーションに「実装停止」が書かれていない。

**対処**: 親の **Agent Skill** か **CLAUDE.md** に本スキル手順へのリンクと **blocker 解消まで実装禁止**を明記。
