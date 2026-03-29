---
name: local-quality-gate
description: "PR・push 前のローカル品質ゲートを固定順で実行（lint→typecheck→build→test）。失敗時は修正ループ（最大3回）。Triggers: quality gate, lint typecheck build, PR 前チェック, ローカル CI, pre-push."
metadata:
  last_verified: "2026-03-31"
---

# local-quality-gate

**目的**: テストやビルドを通さず PR に出す手戻りを減らす。参考: [MJ / note](https://note.com/mj3880/n/n2d28e12cb7a3)。コマンドは [references/commands.template.md](references/commands.template.md) をプロジェクト用に合わせる。

## Iron Law

- **NO PR / NO push**（プロジェクトが定める境界） until **lint → typecheck → build → unit tests** がこの順で **すべて成功**する。
- **Maximum fix loops: 3**。同じ段で 3 回失敗したら **escalating-debug-loop** または人間へ。

## 手順

1. リポジトリルートで commands.template に従い 1→2→3→4 を実行。
2. 失敗した段で止まり、ログを要約して修正。
3. **最初の段からやり直す**。
4. 全成功後に **code-review-subagents** や Git 操作へ（順序は **workflow-task-agent-ref-layers** や自プロジェクト WF で定義）。

## 関連スキル

| スキル | 関係 |
|--------|------|
| **code-review-subagents** | ゲート通過後のレビュー |
| **escalating-debug-loop** | ループ上限到達時 |
| **claude-md-workflow-routing** | いつ本ゲートを必須にするか |
| **test-driven-development** | テスト先行の補助 |

## Troubleshooting

### エラー: スクリプトがない

**対処**: commands.template を実在コマンドに合わせ、**skill-growing** で fork。

### エラー: 3 ループで同じ失敗

**対処**: **escalating-debug-loop** と **systematic-debugging**。
