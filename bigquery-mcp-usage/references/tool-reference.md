# BigQuery MCP ツール リファレンス

各ツールのパラメータ、呼び出し例、注意点をまとめる。

---

## list_dataset_ids

データセット一覧を取得する。

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `project` | string | いいえ | 環境の BIGQUERY_PROJECT | 一覧を取得する GCP プロジェクト ID |

**呼び出し例:**

```json
{
  "toolName": "list_dataset_ids",
  "arguments": {}
}
```

別プロジェクトを指定する場合:

```json
{
  "toolName": "list_dataset_ids",
  "arguments": { "project": "other-project-id" }
}
```

---

## list_table_ids

指定データセットのテーブル一覧を取得する。

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `dataset` | string | **はい** | — | テーブル一覧を取得するデータセット ID |
| `project` | string | いいえ | 環境の BIGQUERY_PROJECT | データセットが属する GCP プロジェクト ID |

**呼び出し例:**

```json
{
  "toolName": "list_table_ids",
  "arguments": { "dataset": "my_dataset" }
}
```

---

## get_table_info

テーブルのメタデータ（スキーマ、行数、サイズなど）を取得する。

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `dataset` | string | **はい** | — | テーブルの親データセット |
| `table` | string | **はい** | — | テーブル名 |
| `project` | string | いいえ | 環境の BIGQUERY_PROJECT | GCP プロジェクト ID |

**呼び出し例:**

```json
{
  "toolName": "get_table_info",
  "arguments": { "dataset": "my_dataset", "table": "users" }
}
```

**用途:** スキーマ確認 → SQL 組み立ての前に必ず呼ぶことを推奨。カラム名・型・説明が分かるため、正確な SQL を書ける。

---

## get_dataset_info

データセットのメタデータ（ロケーション、作成日、説明など）を取得する。

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `dataset` | string | **はい** | — | データセット ID。`project.dataset` 形式も可 |
| `project` | string | いいえ | 環境の BIGQUERY_PROJECT | GCP プロジェクト ID |

**呼び出し例:**

```json
{
  "toolName": "get_dataset_info",
  "arguments": { "dataset": "my_dataset" }
}
```

---

## execute_sql

BigQuery Standard SQL を実行する。

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `sql` | string | **はい** | — | 実行する SQL 文 |
| `dry_run` | boolean | いいえ | `false` | `true` にするとクエリを検証しスキャン量を返す（実行はしない） |

**呼び出し例（通常実行）:**

```json
{
  "toolName": "execute_sql",
  "arguments": {
    "sql": "SELECT user_id, name, email FROM `my_dataset.users` LIMIT 10"
  }
}
```

**呼び出し例（dry_run でコスト確認）:**

```json
{
  "toolName": "execute_sql",
  "arguments": {
    "sql": "SELECT * FROM `my_dataset.large_table` WHERE created_at > '2025-01-01'",
    "dry_run": true
  }
}
```

### SQL のベストプラクティス

- Standard SQL を使う（Legacy SQL は不可）
- テーブル参照は `` `project.dataset.table` `` または `` `dataset.table` `` 形式
- 探索的クエリには `LIMIT` を付ける
- `SELECT *` は避け、必要なカラムだけ指定する
- パーティションテーブルでは `WHERE` でパーティション列を絞る（コスト削減）
- 大きなテーブルへのクエリ前に `dry_run: true` でスキャン量を確認する

---

## search_catalog

自然言語でテーブル・ビュー・モデル・ルーティン・コネクションを検索する。

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `prompt` | string | **はい** | — | 検索意図を表すプロンプト。**ユーザーの言葉をそのまま渡す（リライトしない）** |
| `projectIds` | string[] | いいえ | `[]` | 検索対象のプロジェクト ID 配列 |
| `datasetIds` | string[] | いいえ | `[]` | 検索対象のデータセット ID 配列 |
| `types` | string[] | いいえ | `[]` | フィルタする型。`CONNECTION`, `POLICY`, `DATASET`, `MODEL`, `ROUTINE`, `TABLE`, `VIEW` |
| `pageSize` | integer | いいえ | `5` | 返す結果数 |

**呼び出し例:**

```json
{
  "toolName": "search_catalog",
  "arguments": {
    "prompt": "ユーザーの購入履歴に関するテーブル"
  }
}
```

テーブルだけに絞る場合:

```json
{
  "toolName": "search_catalog",
  "arguments": {
    "prompt": "売上データ",
    "types": ["TABLE"],
    "pageSize": 10
  }
}
```

---

## ask_data_insights

テーブルのデータに対して自然言語で質問し、分析・インサイトを得る。

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `user_query_with_context` | string | **はい** | — | ユーザーの質問（会話履歴やシステム指示を含めてよい） |
| `table_references` | string | **はい** | — | 対象テーブルの JSON 文字列。配列で `projectId`, `datasetId`, `tableId` を指定 |

**呼び出し例:**

```json
{
  "toolName": "ask_data_insights",
  "arguments": {
    "user_query_with_context": "過去3ヶ月で最も売上が伸びた商品カテゴリはどれですか？",
    "table_references": "[{\"projectId\": \"gen-lang-client-0360012476\", \"datasetId\": \"sales\", \"tableId\": \"transactions\"}]"
  }
}
```

複数テーブルを参照する場合:

```json
{
  "toolName": "ask_data_insights",
  "arguments": {
    "user_query_with_context": "顧客の平均注文金額と購入頻度の関係を分析してください",
    "table_references": "[{\"projectId\": \"gen-lang-client-0360012476\", \"datasetId\": \"sales\", \"tableId\": \"orders\"}, {\"projectId\": \"gen-lang-client-0360012476\", \"datasetId\": \"sales\", \"tableId\": \"customers\"}]"
  }
}
```

### 注意

- `table_references` は **JSON 文字列**（文字列の中に JSON 配列）を渡す
- テーブルが存在しない場合はエラーになるため、事前に `get_table_info` で確認すること

---

## forecast

時系列データの予測を行う。

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `history_data` | string | **はい** | — | 履歴データのテーブル ID またはクエリ |
| `timestamp_col` | string | **はい** | — | タイムスタンプ列の名前 |
| `data_col` | string | **はい** | — | 予測対象のデータ列の名前 |
| `horizon` | integer | いいえ | `10` | 予測ステップ数 |
| `id_cols` | string[] | いいえ | `[]` | 時系列を識別する列名の配列（複数系列がある場合） |

**呼び出し例（単一系列）:**

```json
{
  "toolName": "forecast",
  "arguments": {
    "history_data": "sales.daily_revenue",
    "timestamp_col": "date",
    "data_col": "revenue",
    "horizon": 30
  }
}
```

**呼び出し例（複数系列 — 店舗別）:**

```json
{
  "toolName": "forecast",
  "arguments": {
    "history_data": "sales.daily_revenue_by_store",
    "timestamp_col": "date",
    "data_col": "revenue",
    "id_cols": ["store_id"],
    "horizon": 14
  }
}
```

**呼び出し例（SQL でフィルタした履歴データ）:**

```json
{
  "toolName": "forecast",
  "arguments": {
    "history_data": "SELECT date, revenue FROM `sales.daily_revenue` WHERE date >= '2025-01-01'",
    "timestamp_col": "date",
    "data_col": "revenue",
    "horizon": 30
  }
}
```

---

## analyze_contribution

メトリクスの変動に対する各ディメンションの貢献度を分析する。テスト群と対照群を比較して、どのディメンションがメトリクスの変化に最も寄与しているかを明らかにする。

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `input_data` | string | **はい** | — | テーブル ID または SQL クエリ |
| `contribution_metric` | string | **はい** | — | 分析するメトリクスの式（下記フォーマット参照） |
| `is_test_col` | string | **はい** | — | テスト/対照群を識別する列名 |
| `dimension_id_cols` | string[] | いいえ | — | ディメンション列名の配列 |
| `pruning_method` | string | いいえ | `PRUNE_REDUNDANT_INSIGHTS` | `NO_PRUNING` または `PRUNE_REDUNDANT_INSIGHTS` |
| `top_k_insights_by_apriori_support` | integer | いいえ | `30` | 返すインサイト数 |

### contribution_metric のフォーマット

| 種別 | 式の形式 | 例 |
|------|---------|-----|
| 合計メトリクス | `SUM(列名)` | `SUM(revenue)` |
| 比率メトリクス | `SUM(分子)/SUM(分母)` | `SUM(clicks)/SUM(impressions)` |
| カテゴリ別メトリクス | `SUM(合計列)/COUNT(DISTINCT カテゴリ列)` | `SUM(revenue)/COUNT(DISTINCT customer_id)` |

**呼び出し例:**

```json
{
  "toolName": "analyze_contribution",
  "arguments": {
    "input_data": "marketing.campaign_results",
    "contribution_metric": "SUM(conversions)/SUM(impressions)",
    "is_test_col": "is_new_campaign",
    "dimension_id_cols": ["region", "device_type", "age_group"]
  }
}
```
