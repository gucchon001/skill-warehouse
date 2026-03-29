---
name: skill-run-scoring
description: "タスク完了直後に5軸（目的・品質・手順・引き継ぎ・リスク）で自己採点し、低軸を skill-growing や次アクションに接続する。Triggers: 振り返り, 自己採点, run scoring, タスク完了後レビュー, MJ scoring."
metadata:
  last_verified: "2026-03-31"
---

# skill-run-scoring

**目的**: タスクの終わり方を短時間で定量化し、スキル改善ループへ橋渡しする。参考: [MJ / note](https://note.com/mj3880/n/n2d28e12cb7a3)。

## いつ

- 実装・調査・ドキュメント更新など 1 タスクが一区切りしたとき。
- PR 作成前またはコミット直後（プロジェクト方針に合わせる）。

## 手順

1. [references/five-axes-rubric.md](references/five-axes-rubric.md) に従い A〜E を 1〜5 で採点する。
2. 最低軸を 1 つ選び、次の 1 アクションを決める（例: C が低い → claude-md-workflow-routing を SKILL に追記、E が低い → vibesec）。
3. スキル自体の改善が必要なら skill-growing を起動し、対象フォルダを明示する。

## 関連スキル

- **skill-growing** — 低スコアからの改善ループの正本。
- **skill-builder** — 新規スキル分割・作成。
- **local-quality-gate** — C 軸（手順）の具体。
- **pre-implementation-critics** — 実装前手順と対になる実装後の振り返り。
- **workflow-task-agent-ref-layers** — どのレイヤーのタスクだったかの言語化。

## Troubleshooting

### エラー: 採点が曖昧

**対処**: 各軸に事実 1 行（コマンド結果・リンク）を添える。

### エラー: 毎回すべて 4〜5

**対処**: code-review-subagents または第三者視点を挟み、ルーブリックの問いを厳しくする。
