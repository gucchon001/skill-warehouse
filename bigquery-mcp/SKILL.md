---
name: bigquery-mcp
description: "BigQuery MCP（データベース向け MCP ツールボックス）の設定・利用と、接続できない時の設定ガイド。Cursor / Claude / VS Code 等でテーブル一覧・SQL 実行・分析ツールを使う時に参照する。"
metadata:
  last_verified: "2026-03-31"
---

# BigQuery MCP スキル

[データベース向け MCP ツールボックス](https://github.com/googleapis/genai-toolbox) を使って BigQuery を Cursor 等の MCP 対応クライアントに接続し、SQL 実行・テーブル一覧・分析ツールを LLM から使うための手順と、**動かない時の設定ガイド**をまとめる。

公式: [MCP を使用して LLM を BigQuery に接続する](https://docs.cloud.google.com/bigquery/docs/pre-built-tools-with-mcp-toolbox?hl=ja)

## 関連スキル（役割分担）

| スキル | 役割 |
|--------|------|
| **bigquery-mcp-install** | 初回セットアップ（toolbox 取得・配置・`.cursor/mcp.json` マージ・OS 別手順）。詳細は **そのスキル**の `references/install-steps.md` |
| **bigquery-mcp**（本スキル） | 前提条件・`mcp.json` の典型形・接続トラブル・他クライアント。詳細トラブルは **本スキル**の `references/setup-and-troubleshooting.md` |
| **bigquery-mcp-usage** | どの MCP ツールをいつ使うか・呼び出し原則。詳細は **そのスキル**の `references/tool-reference.md` / `usage-patterns.md` |
| **dataplex-catalog-entry-names** | **BigQuery メタデータ × Dataplex / Data Catalog**。エントリ名形式の取り違え（403/404）。SQL 実行とは別系統 |

**初回インストール**は **bigquery-mcp-install**、**ツールの選び方**は **bigquery-mcp-usage** を優先して Read する。本スキルは「設定の全体像」と「繋がらないとき」の中心。**カタログ API の名前形式**は **dataplex-catalog-entry-names**。

## When to Use

- 「BigQuery MCP を設定したい」「BigQuery に MCP で接続したい」と言われたとき
- Cursor / Claude Desktop / Cline / VS Code Copilot / Windsurf で BigQuery のテーブル一覧・SQL 実行・分析を AI に任せたいとき
- BigQuery MCP が接続できない・ツールが使えないときのトラブルシュート

## 前提条件（必須）

1. **GCP プロジェクト**: プロジェクトを選択または作成し、課金を有効にする。
2. **BigQuery API**: プロジェクトで [BigQuery API を有効化](https://console.cloud.google.com/flows/enableapi?apiid=bigquery.googleapis.com&hl=ja) する。
3. **IAM**: 接続に `roles/bigquery.user` または `roles/bigquery.dataViewer`（および必要に応じて `roles/bigquery.jobUser`）を付与する。
4. **ADC**: ローカルでは [アプリケーションのデフォルト認証情報（ADC）](https://docs.cloud.google.com/docs/authentication/set-up-adc-local-dev-environment?hl=ja) を構成する（`gcloud auth application-default login`）。

## インストール（ツールボックス）

- **バージョン**: V0.7.0 以降必須。 [Releases](https://github.com/googleapis/genai-toolbox/releases) から取得。
- **Windows amd64**:
  ```bash
  curl -O "https://storage.googleapis.com/genai-toolbox/VERSION/windows/amd64/toolbox"
  ```
  `VERSION` を `v0.7.0` などに置き換える。Windows では実行可能パスを通す（例: ユーザーディレクトリに配置し、`command` に絶対パスを指定）。
- **macOS / Linux**: 同様に `darwin/arm64`, `darwin/amd64`, `linux/amd64` の URL で取得し、`chmod +x toolbox` のあと `./toolbox --version` で確認。

## Cursor での設定

1. プロジェクトルートに `.cursor` がなければ作成し、`.cursor/mcp.json` を用意する。
2. 次の構成を追加する。`PATH/TO/toolbox` は **絶対パス**（例: `C:\\Users\\USER\\toolbox.exe` または `/home/user/toolbox`）にし、`PROJECT_ID` は BigQuery の GCP プロジェクト ID に置き換える。

```json
{
  "mcpServers": {
    "bigquery": {
      "command": "PATH/TO/toolbox",
      "args": ["--prebuilt", "bigquery", "--stdio"],
      "env": {
        "BIGQUERY_PROJECT": "PROJECT_ID"
      }
    }
  }
}
```

3. **Cursor** で **[Settings] > [Cursor Settings] > [MCP]** を開き、サーバーが緑で「接続済み」になるか確認する。

## 利用可能なツール

| ツール | 用途 |
|--------|------|
| `list_dataset_ids` | データセット一覧 |
| `list_table_ids` | テーブル一覧 |
| `get_table_info` | テーブルメタデータ |
| `get_dataset_info` | データセットメタデータ |
| `execute_sql` | SQL 実行 |
| `search_catalog` | 自然言語でテーブル検索 |
| `ask_data_insights` | データ分析・質問応答 |
| `forecast` | 時系列予測 |
| `analyze_contribution` | 貢献度分析 |

ユーザーには「テーブル一覧を出して」「このデータセットで〇〇を分析して」などと依頼すれば、エージェントが上記ツールを利用する。

## Troubleshooting

### エラー: MCP が接続できない・サーバーが赤

**原因**: `.cursor/mcp.json` の場所、`command` の絶対パス、`BIGQUERY_PROJECT`、ADC、BigQuery API / IAM のいずれかが不整合。

**対処**: ワークスペースルートの `.cursor/mcp.json` を確認し `command` を絶対パスにする。`gcloud auth application-default login` を再実行。詳細は **references/setup-and-troubleshooting.md** を Read。

### エラー: ツールは見えるがクエリや一覧が失敗する

**原因**: IAM 不足、課金無効、プロジェクト ID の誤り。

**対処**: `roles/bigquery.user` 等を確認し、`BIGQUERY_PROJECT` にプロジェクト ID（番号ではない）を設定する。

## 詳細チェックリスト

接続できない・ツールが使えない場合は、次の順で確認する。詳細は **references/setup-and-troubleshooting.md** を参照すること。

1. **mcp.json の場所**
   - Cursor: プロジェクトルートの `.cursor/mcp.json`。ワークスペースがサブフォルダの場合はそのルートの `.cursor/mcp.json` を参照しているか確認する。

2. **command のパス**
   - `command` は **絶対パス**で指定する。相対パスや `./toolbox` は Cursor の作業ディレクトリによっては解決されない。
   - Windows: `C:\\Users\\USER\\toolbox.exe` のように `.exe` を含め、バックスラッシュはエスケープする。
   - バイナリに実行権限があるか（Unix: `chmod +x toolbox`）、Windows ではパスにスペースが含まれる場合は引用で囲む。

3. **BIGQUERY_PROJECT**
   - プロジェクト ID が正しいか（プロジェクト番号ではない）。`gcloud config get-value project` で確認できる。

4. **認証（ADC）**
   - ローカル: `gcloud auth application-default login` を実行し、同じユーザーで Cursor を起動しているか確認する。
   - サービスアカウントを使う場合: `GOOGLE_APPLICATION_CREDENTIALS` を `env` に追加する（例: `"GOOGLE_APPLICATION_CREDENTIALS": "C:\\path\\to\\key.json"`）。

5. **BigQuery API と IAM**
   - プロジェクトで BigQuery API が有効か。IAM で `bigquery.datasets.get` / `bigquery.tables.get` / `bigquery.jobs.create` 等が付与されているか確認する。

6. **MCP の再読み込み**
   - mcp.json を変更したら Cursor を再起動するか、MCP 設定画面でサーバーを再接続する。

7. **エラーメッセージの確認**
   - Cursor の MCP 設定でサーバーが赤/エラーの場合、表示されるエラーメッセージ（認証エラー・パスが見つからない等）を手がかりに上記を絞り込む。

## 他クライアント（Claude Desktop / Cline / VS Code / Windsurf）

各クライアントでの設定ファイルの場所と JSON のキー（`mcpServers` か `servers` か）は異なる。**references/setup-and-troubleshooting.md** に一覧と「動かない時」のチェック項目をまとめてある。必要になったらそのファイルを開いて参照すること。

## 参照

- 公式: [MCP を使用して LLM を BigQuery に接続する](https://docs.cloud.google.com/bigquery/docs/pre-built-tools-with-mcp-toolbox?hl=ja)
- リポジトリ: [googleapis/genai-toolbox](https://github.com/googleapis/genai-toolbox)
- 詳細なクライアント別手順とトラブルシュート: **references/setup-and-troubleshooting.md**
