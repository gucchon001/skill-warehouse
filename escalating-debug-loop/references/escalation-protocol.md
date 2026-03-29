# エスカレーション・プロトコル

親スキル: **escalating-debug-loop**。

## トリガー

同一不具合に対し 2 回修正を試みても再現する、または local-quality-gate の同一段で 3 回失敗。

## E1 停止

新しい推測で即パッチを当てない。再現手順・期待と実際・試した変更・ログ断片を箇条書き。

## E2 外部情報

Web 検索または社内ドキュメントで類似事例を調べる。

## E3 並列クリティック

pre-implementation-critics と同型で 3 視点（根本原因・影響範囲・別仮説）を再度叩く。default-critic-prompts をデバッグ向けに言い換えてよい。

## E4 1 パッチ

統合レポートで 1 つの主仮説に決めてから最小修正。

## 関連

**systematic-debugging**（エスカレーション前）、**subagent-authoring**。
