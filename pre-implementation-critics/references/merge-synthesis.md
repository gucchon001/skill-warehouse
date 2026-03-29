# 3 クリティック結果の統合

親スキル: **pre-implementation-critics**。

## 手順

1. 3 出力を並べ、重複指摘をマージする。
2. block（実装前に解消必須）/ warn / nit に分類する。
3. オーナーが実装に進む判断をするまでコーディングを開始しない。trivial のみのタスクの例外は **claude-md-workflow-routing** で定義。

## 統合アウトプット例

見出し例: Pre-implementation critique summary / Blockers / Warnings / Actions before code。

## 関連

- 実装後のレビュー: **code-review-subagents** / **automated-2stage-review**
- 並列パターン: **subagent-authoring** の orchestration-and-patterns.md
