# Data Catalog と Dataplex のエントリ名形式（詳細）

## 原因の整理

- **Data Catalog API** `GET /v1/entries:lookup?linkedResource=//bigquery.googleapis.com/projects/PROJECT_ID/datasets/DATASET/tables/TABLE_ID` は、**Data Catalog 用の**エントリ名を返す。
- その名前は `projects/{PROJECT_ID}/locations/{LOCATION}/entryGroups/@bigquery/entries/{BASE64_ENCODED_ID}` の形（プロジェクトは **ID**、entries の後は **base64**）。
- **Dataplex API** の PATCH / GET は、**Dataplex 用の**エントリ名を期待する。
- Dataplex の名前は `projects/{PROJECT_NUMBER}/locations/{LOCATION}/entryGroups/@bigquery/entries/bigquery.googleapis.com/projects/PROJECT_ID/datasets/DATASET/tables/TABLE_ID` の形（プロジェクトは**番号**、entries の後は**平文**のリソースパス）。

同じ論理リソース（BigQuery テーブル）を指していても、**形式が違う**ため、Data Catalog の名前を Dataplex に渡すと「存在しないエントリ」とみなされ、GET で 404、PATCH で 403 になる。

## 形式の比較

| 項目           | Data Catalog（lookup の戻り値）     | Dataplex（PATCH/GET に渡す名前）        |
|----------------|--------------------------------------|------------------------------------------|
| プロジェクト    | プロジェクト **ID**（例: gen-lang-client-0360012476） | プロジェクト **番号**（例: 699555092496） |
| entries/ 以降  | base64 エンコードされた 1 セグメント | 平文の `bigquery.googleapis.com/projects/.../tables/TABLE_ID` |

## 解決策: Dataplex 用名前の構築

Data Catalog の lookup に頼らず、次のように Dataplex 用の名前を組み立てる。

```javascript
// プロジェクト番号は gcloud または環境変数から取得
// gcloud projects describe gen-lang-client-0360012476 --format="value(projectNumber)"
function buildDataplexEntryName(projectNumber, location, projectId, datasetId, tableId) {
  return `projects/${projectNumber}/locations/${location}/entryGroups/@bigquery/entries/bigquery.googleapis.com/projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;
}
```

- **location**: 多くの場合 `asia-northeast1` など、BigQuery データセットのロケーションに合わせる。
- **projectNumber**: 数値の文字列。Cloud Resource Manager API が使えない環境では `gcloud projects describe PROJECT_ID --format="value(projectNumber)"` または環境変数で渡す。

## @bigquery の aspect について

- **overview**: Optional aspect。テーブル説明など、PATCH で更新可能。
- **schema**: Required aspect（BigQuery が管理）。**ユーザーは編集できない**。PATCH の body に `dataplex-types.global.schema` を含めると、権限不足でなくても拒否される可能性がある。カラム説明は **BigQuery Tables API**（`tables.update` の `schema.fields[].description`）で更新する。

## 権限（形式を直しても 403 が続く場合）

- Dataplex で aspect を更新するには、**プロジェクト**に対して呼び出し元に `roles/dataplex.catalogEditor` または `roles/dataplex.catalogAdmin` を付与する。
- 必要に応じて `roles/dataplex.entryOwner` と `roles/dataplex.aspectTypeUser` も付与する（catalogEditor / catalogAdmin に含まれる場合あり）。
- 付与先は、スクリプト実行時に使っている identity（`gcloud auth application-default login` のアカウント、または `GOOGLE_APPLICATION_CREDENTIALS` のサービスアカウント）と一致させる。
- 付与後、数分待ってから再実行する。

## 参考: Dataplex searchEntries で名前を取得する場合

Dataplex 形式の名前を「構築せずに」取得する場合は、Dataplex の `searchEntries`（POST）を使う。

- エンドポイント: `POST https://dataplex.googleapis.com/v1/projects/{projectId}/locations/global:searchEntries`
- body 例: `{ "query": "name:TABLE_ID", "scope": "projects/PROJECT_ID", "pageSize": 5 }`
- 返却の `results[].dataplexEntry.name` が Dataplex API の PATCH/GET にそのまま使える名前である。
