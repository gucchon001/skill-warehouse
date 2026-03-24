# エラー・環境別メモ（NotebookLM MCP）

SKILL.md の **Troubleshooting** で足りないときに読む。項目は **症状ラベル → 原因 → 対処**。

---

### エラー: 日本語が文字化けする（ターミナル・ログ）

**原因:** Windows コンソールのコードページ（cp932）と Python の出力エンコーディングの不一致。

**対処:** ターミナルで `chcp 65001` を試す。MCP 起動時の `env` に `PYTHONUTF8=1` と `PYTHONIOENCODING=utf-8` を入れる（[mcp-config.md](mcp-config.md) の例）。

---

### エラー: 同じ NotebookLM サーバーが 2 本表示される

**原因:** ユーザー設定とワークスペース設定の**両方**に同一サーバー定義がある。

**対処:** どちらか**一方だけ**に定義を残し、もう一方から削除する。Cursor の場合は [host-cursor.md](host-cursor.md) のパス表を参照する。

---

### エラー: 削除・生成ツールで弾かれる（confirm 以外）

**原因:** 必須引数の欠落、無効な `notebook_id` / `source_id`、セッション切れ。

**対処:** 接続中のツールスキーマで必須項目を確認する。`notebook_list` / `notebook_get` で ID を再取得する。認証を `nlm login` や `refresh_auth`（スキーマにあれば）で更新する。

---

### エラー: 遅い・タイムアウト・レート制限っぽい失敗

**原因:** NotebookLM 側や無料枠の制限。

**対処:** 間隔を空けてリトライする。ユーザーのブラウザ操作と同時に大量の API を叩かない。
