# MCP ツール早見（notebooklm-mcp-cli）

接続中のクライアントが公開する **JSON スキーマを正**とする。以下はカテゴリ索引。

## ノートブック

- `notebook_list` — 一覧
- `notebook_get` — 詳細＋ソース（`notebook_id`）
- `notebook_describe` — 概要
- `notebook_create` / `notebook_rename` / `notebook_delete`

## ソース

- `source_add` — `source_type`: url | text | drive | file
- `source_delete` — **不可逆**、`confirm=true` 必須
- `source_rename` / `source_describe` / `source_get_content`
- `source_list_drive` / `source_sync_drive`

## 質問・補助

- `notebook_query` — ノート内質問
- `cross_notebook_query` / `chat_configure` / `note` / `tag` / `batch` / `pipeline`（各スキーマ要確認）

## リサーチ

- `research_start` / `research_status` / `research_import`

## スタジオ

- `studio_create` — `artifact_type` 等、**`confirm=true` 必須**
- `studio_status` / `studio_revise` / `studio_delete`
- `export_artifact` / `download_artifact`

## 共有

- `notebook_share_status` / `notebook_share_public` / `notebook_share_invite` / `notebook_share_batch`

## 認証・サーバ

- `refresh_auth` / `save_auth_tokens` / `server_info`

## 表示名

クライアントによってサーバー名にプレフィックスが付くことがある。設定上は同一サーバーでよい。
