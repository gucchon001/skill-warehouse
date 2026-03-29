---
name: bigquery-mcp-usage
description: "BigQuery MCP ツールの使い方ガイド。エージェントがユーザーの依頼に応じて適切な MCP ツール（SQL 実行・テーブル探索・データ分析・予測・貢献度分析）を選択し、正しいパラメータで呼び出すための手順。「BigQuery でクエリして」「テーブル一覧を出して」「データを分析して」「予測して」と依頼されたときに参照する。"
metadata:
  last_verified: "2026-03-31"
---

# BigQuery MCP 利用スキル

BigQuery MCP の各ツールを正しく・効果的に使うためのガイド。

## 関連スキル（BigQuery まとまり）

| スキル | 役割 |
|--------|------|
| **bigquery-mcp-usage**（本スキル） | MCP **ツールの選択**・呼び出し原則 |
| **bigquery-mcp** | 設定・接続トラブル・`mcp.json` |
| **bigquery-mcp-install** | 初回セットアップ |
| **dataplex-catalog-entry-names** | **データカタログ**のエントリ名（Data Catalog ↔ Dataplex）。**SQL ツール選択は本スキル** |

## When to Use

- ユーザーが「BigQuery で〇〇して」「テーブル一覧を見せて」「SQL を実行して」と言ったとき
- BigQuery のデータを分析・探索・予測したいとき
- どのツールをどのパラメータで呼べばいいか判断するとき

## ツール一覧と選択フロー

ユーザーの依頼に応じて次のフローでツールを選択する:

```
ユーザーの依頼
├── データ構造を知りたい
│   ├── どんなデータセットがあるか → list_dataset_ids
│   ├── データセットの中身（テーブル一覧） → list_table_ids
│   ├── テーブルのスキーマ・メタデータ → get_table_info
│   └── データセットのメタデータ → get_dataset_info
│
├── テーブルやビューを探したい
│   └── 自然言語で検索 → search_catalog
│
├── データを取得・操作したい
│   └── SQL を実行 → execute_sql
│
├── データを分析・質問したい
│   └── 複雑な分析・インサイト → ask_data_insights
│
├── 時系列データを予測したい
│   └── 予測 → forecast
│
└── メトリクスの変動要因を知りたい
    └── 貢献度分析 → analyze_contribution
```

## 基本的な使い方（よくあるパターン）

### パターン 1: テーブルの探索（初見のデータセット）

1. `list_dataset_ids` でデータセット一覧を取得
2. `list_table_ids` で目的のデータセットのテーブル一覧を取得
3. `get_table_info` でスキーマ（カラム名・型・説明）を確認
4. `execute_sql` で `SELECT * FROM ... LIMIT 10` でサンプルデータを確認

### パターン 2: SQL でデータを取得

1. テーブルが分かっていれば直接 `execute_sql` で SQL を実行
2. 大量データの場合は先に `dry_run: true` でスキャン量を確認
3. 結果をユーザーに返す

### パターン 3: データ分析

1. `get_table_info` でスキーマを把握
2. `ask_data_insights` に質問とテーブル参照を渡す
3. 必要に応じて `execute_sql` で追加クエリ

### パターン 4: 時系列予測

1. `get_table_info` でタイムスタンプ列・データ列を特定
2. `forecast` にテーブルと列名を渡す

各ツールのパラメータ詳細と実例は **references/tool-reference.md** を参照すること。
ユースケース別の詳しいワークフローは **references/usage-patterns.md** を参照すること。

## エージェントへの指示

BigQuery MCP ツールを使う際は次のルールに従うこと:

### ツール呼び出しの原則

1. **project は省略可能**: `list_dataset_ids`、`list_table_ids`、`get_table_info`、`get_dataset_info` の `project` パラメータはデフォルト値（環境の `BIGQUERY_PROJECT`）が設定されている。明示的に別プロジェクトを指定する場合のみ渡す。
2. **SQL は Standard SQL**: `execute_sql` では BigQuery Standard SQL を使う。Legacy SQL は使わない。
3. **dry_run を活用**: 大きなテーブルへのクエリ前に `dry_run: true` でスキャン量を確認し、コストを意識する。
4. **LIMIT を付ける**: 探索的なクエリには必ず `LIMIT` を付ける（目安: 10〜100 行）。
5. **search_catalog の prompt**: ユーザーの言葉をそのまま渡す（リライトしない）。

### エラー時の対応

- 認証エラー・接続エラーが出た場合は `bigquery-mcp` スキルのトラブルシュートを参照する
- テーブルが見つからない場合は `search_catalog` や `list_table_ids` で正しい名前を確認する
- 権限エラーの場合はユーザーに IAM ロールの確認を促す

## Troubleshooting

### エラー: ツールの選び方が分からない・結果が期待と違う

**原因**: 分析系ツールと生 SQL の使い分けが曖昧。

**対処**: 本文のツール一覧に戻り、まず `list_dataset_ids` / `execute_sql` で事実確認する。

### エラー: 認証・接続エラー

**原因**: MCP 設定または GCP 認証。

**対処**: **bigquery-mcp** スキルを参照する（インストールは **bigquery-mcp-install**）。

## 参照

- ツールのパラメータ詳細と実例: **references/tool-reference.md**
- ユースケース別ワークフロー: **references/usage-patterns.md**
- インストール: **bigquery-mcp-install** スキル
- 設定・トラブルシュート: **bigquery-mcp** スキル
