---
name: bigquery-mcp-install
description: "BigQuery MCP（genai-toolbox）のインストールを一気通貫で実行する。toolbox バイナリのダウンロード、.cursor/mcp.json への設定追加、ADC 認証の確認を自動化する。「BigQuery MCP をインストールして」「BigQuery MCP をセットアップして」「toolbox を入れて」と依頼されたときに参照する。"
metadata:
  last_verified: "2026-03-31"
---

# BigQuery MCP インストールスキル

BigQuery MCP（[genai-toolbox](https://github.com/googleapis/genai-toolbox)）をゼロから使える状態にする。

**Dataplex / Data Catalog のエントリ名・403** は **dataplex-catalog-entry-names**（インストールとは別）。

## When to Use

- 「BigQuery MCP をインストールして」「toolbox を入れて」と言われたとき
- 新しいプロジェクトで BigQuery MCP を最初からセットアップするとき
- toolbox バイナリの更新（バージョンアップ）をしたいとき

**利用方法・トラブルシュートは `bigquery-mcp` スキルを参照すること。本スキルはインストール専用。**

## 前提条件

1. **GCP プロジェクト** が存在し、課金が有効であること
2. **BigQuery API** がプロジェクトで有効であること
3. **gcloud CLI** がインストール済みであること

## インストール手順（概要）

以下の 4 ステップを順に実行する。各ステップの詳細コマンド・OS 別対応は **references/install-steps.md** を参照すること。

### Step 1: toolbox バイナリのダウンロード

1. [genai-toolbox Releases](https://github.com/googleapis/genai-toolbox/releases) で最新バージョン（V0.7.0 以降）を確認する
2. OS・アーキテクチャに合った URL からバイナリを取得する
3. 配置先を決め、実行権限を付与する

配置先の推奨:
- **Windows**: プロジェクトの `.cursor/bin/toolbox.exe` または `C:\Users\<USER>\toolbox.exe`
- **macOS/Linux**: `/usr/local/bin/toolbox` またはプロジェクトの `.cursor/bin/toolbox`

### Step 2: ADC（アプリケーションデフォルト認証情報）の確認

```bash
gcloud auth application-default login
```

既に認証済みの場合はスキップする。`gcloud auth application-default print-access-token` でトークンが取得できれば認証済み。

### Step 3: mcp.json への設定追加

プロジェクトルートの `.cursor/mcp.json` に bigquery サーバーを追加する。

- **既存の mcp.json がある場合**: `mcpServers` オブジェクトに `bigquery` キーを追加する（既存エントリを壊さない）
- **mcp.json がない場合**: `.cursor/` ディレクトリごと新規作成する

```json
{
  "mcpServers": {
    "bigquery": {
      "command": "TOOLBOX_ABSOLUTE_PATH",
      "args": ["--prebuilt", "bigquery", "--stdio"],
      "env": {
        "BIGQUERY_PROJECT": "PROJECT_ID"
      }
    }
  }
}
```

- `TOOLBOX_ABSOLUTE_PATH`: Step 1 で配置した toolbox の**絶対パス**（Windows は `\\` エスケープ）
- `PROJECT_ID`: GCP プロジェクト ID（`gcloud config get-value project` で確認）

### Step 4: 動作確認

1. Cursor の **[Settings] > [Cursor Settings] > [MCP]** を開く
2. bigquery サーバーが緑（接続済み）になることを確認する
3. 接続できない場合は `bigquery-mcp` スキルのトラブルシュートを参照する

## エージェントへの指示

インストール実行時は次の順序で進めること:

1. ユーザーに **GCP プロジェクト ID** を確認する（ワークスペースルールに `BIGQUERY_PROJECT` や GCP プロジェクト情報があればそれを使う）
2. **references/install-steps.md** を読み、ユーザーの OS に合った手順を実行する
3. `.cursor/mcp.json` が既に存在する場合は既存設定を壊さずにマージする
4. 完了後、ユーザーに MCP 設定画面での確認を促す

## Troubleshooting

### エラー: toolbox が取得できない・実行できない

**原因**: ダウンロード URL・OS アーキテクチャの不一致、実行権限、セキュリティソフトのブロック。

**対処**: [genai-toolbox Releases](https://github.com/googleapis/genai-toolbox/releases) から正しいバイナリを再取得。Unix は `chmod +x`。

### エラー: 接続・利用時のエラー

**原因**: MCP 設定または GCP 側の問題。

**対処**: **bigquery-mcp** スキルの `## Troubleshooting` と **references/setup-and-troubleshooting.md** を参照する。

## 参照

- 詳細手順（OS 別コマンド・パス例）: **references/install-steps.md**
- 利用・トラブルシュート: **bigquery-mcp** スキル
- 公式: [MCP を使用して LLM を BigQuery に接続する](https://docs.cloud.google.com/bigquery/docs/pre-built-tools-with-mcp-toolbox?hl=ja)
- リポジトリ: [googleapis/genai-toolbox](https://github.com/googleapis/genai-toolbox)
