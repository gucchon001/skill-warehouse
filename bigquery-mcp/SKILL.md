---
name: bigquery-mcp
description: "BigQuery MCP（genai-toolbox）の入口・分岐。インストールは bigquery-mcp-install、ツール選択は bigquery-mcp-usage、接続トラブルは本スキル＋ references/setup-and-troubleshooting.md。Triggers: BigQuery MCP, toolbox, BQ MCP, MCP BigQuery 接続, genai-toolbox."
metadata:
  last_verified: "2026-04-01"
---

# BigQuery MCP（入口スキル）

[genai-toolbox](https://github.com/googleapis/genai-toolbox) の **BigQuery プリビルト**を Cursor 等の MCP クライアントから使うときの **分岐の起点**。長い手順は子スキルと `references/` に分離している（Progressive Disclosure）。

公式: [MCP を使用して LLM を BigQuery に接続する](https://docs.cloud.google.com/bigquery/docs/pre-built-tools-with-mcp-toolbox?hl=ja)

## まずどれを読むか

| 状況 | 読むスキル / ファイル |
|------|------------------------|
| **初回セットアップ**（バイナリ取得・`mcp.json`・ADC） | **bigquery-mcp-install** → `references/install-steps.md` |
| **ツールの選び方**（一覧・SQL・分析・予測など） | **bigquery-mcp-usage** → `references/tool-reference.md` / `usage-patterns.md` |
| **接続できない・赤・認証失敗**（設定の切り分け） | **本スキル**の「Troubleshooting」→ **references/setup-and-troubleshooting.md** |
| **Data Catalog / Dataplex のエントリ名・403/404** | **dataplex-catalog-entry-names**（MCP 設定とは別系統） |

## 前提条件（4 点だけ）

1. GCP プロジェクト＋課金、[BigQuery API 有効化](https://console.cloud.google.com/flows/enableapi?apiid=bigquery.googleapis.com&hl=ja)
2. IAM: `roles/bigquery.user` 等（ジョブ作成・参照に必要な範囲）
3. ローカル ADC: `gcloud auth application-default login`
4. toolbox **V0.7.0 以降**（取得・配置は **bigquery-mcp-install**）

`mcp.json` の最小形・OS 別パス・他クライアント（Claude Desktop / VS Code 等）は **references/setup-and-troubleshooting.md** に集約している。

## Troubleshooting

### エラー: MCP が接続できない・サーバーが赤

**原因**: `mcp.json` の場所・`command` 絶対パス・`BIGQUERY_PROJECT`・ADC・API/IAM のいずれか。

**対処**: **references/setup-and-troubleshooting.md** を上から順に確認。初回構築のし直しは **bigquery-mcp-install**。

### エラー: ツールは見えるが一覧・クエリが失敗する

**原因**: IAM 不足、プロジェクト ID 誤り、課金無効。

**対処**: 前提条件と **setup-and-troubleshooting.md** の IAM 節。ツールの呼び方は **bigquery-mcp-usage**。

## 参照

- 設定・クライアント別 JSON・詳細チェックリスト: **references/setup-and-troubleshooting.md**
- インストール実行手順: **bigquery-mcp-install**
- ツール選択・パラメータ原則: **bigquery-mcp-usage**
- リポジトリ: [googleapis/genai-toolbox](https://github.com/googleapis/genai-toolbox)
