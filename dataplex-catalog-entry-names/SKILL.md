---
name: dataplex-catalog-entry-names
description: "Dataplex Universal Catalog でエントリを更新・参照するとき、Data Catalog API と Dataplex API では**エントリ名の形式が異なる**ため、Lookup で得た名前をそのまま Dataplex に渡すと 403/404 になる。正しい形式でエントリ名を構築するか、Dataplex 用の解決方法を使う。トリガーは「Dataplex 403」「Data Catalog から Dataplex 更新」「カタログ同期で 403」「BigQuery のメタデータの利用」など。"
metadata:
  last_verified: "2026-03-31"
---

# Dataplex / Data Catalog エントリ名の使い分け

同じ BigQuery テーブルを指す「カタログエントリ」でも、**Data Catalog API** と **Dataplex API** では **リソース名の形式が異なる**。形式を混同すると Dataplex の GET で 404、PATCH で 403（"Permission denied (or it may not exist)"）が返る。

## 関連スキル（BigQuery・データカタログ）

| スキル | 役割 |
|--------|------|
| **dataplex-catalog-entry-names**（本スキル） | Data Catalog と Dataplex の**エントリ名形式**の差・403/404 の典型原因・権限の順序 |
| **bigquery-mcp** / **bigquery-mcp-usage** | BigQuery 上の**データ**の探索・SQL・分析（MCP）。**カタログ名の組み立て**は本スキル |
| **bigquery-mcp-install** | MCP（toolbox）の初回セットアップ |

**クエリ実行・テーブル一覧**は **bigquery-mcp-***。**Lookup 結果を Dataplex にそのまま渡して失敗する**ときは本スキルを Read。

## When to Use

- **BigQuery のメタデータの利用**（テーブル・カラム説明の取得・登録、データカタログ連携、SQL 生成用スキーマの参照など）を扱うとき
- Dataplex API の PATCH または GET で **403 や 404** が出ているとき
- スクリプトで **Data Catalog の `entries:lookup` の結果**を Dataplex API にそのまま渡しているとき
- 「カタログ同期」「仕様書→Dataplex」「BigQuery メタデータを Dataplex に反映」といった処理を実装・デバッグするとき

## やること（必須）

1. **どの API に渡す名前か確認する**
   - **Dataplex API**（PATCH / GET）に渡す名前は **Dataplex 形式**でなければならない。
   - Data Catalog API の `GET /v1/entries:lookup?linkedResource=...` が返す `entry.name` は **Data Catalog 形式**であり、**Dataplex には渡してはいけない**。

2. **Dataplex 用のエントリ名を用意する**
   - **推奨**: スクリプト内で **Dataplex 形式を直接構築**する。
     - 形式: `projects/{プロジェクト番号}/locations/{location}/entryGroups/@bigquery/entries/bigquery.googleapis.com/projects/{projectId}/datasets/{datasetId}/tables/{tableId}`
     - プロジェクト**番号**（number）を使う。プロジェクト ID ではない。
     - プロジェクト番号の取得: `gcloud projects describe {PROJECT_ID} --format="value(projectNumber)"` または環境変数（例: `BQ_PROJECT_NUMBER`）で渡す。
   - **代替**: Dataplex の `searchEntries`（POST）でクエリを送り、返却の `dataplexEntry.name` を Dataplex API 用の名前として使う。

3. **@bigquery の aspect を更新する場合**
   - **schema** は Required aspect（BigQuery 管理）のため **編集不可**。PATCH には **overview のみ**を含める。カラム説明は BigQuery Tables API で直接更新する運用とする。

## 形式の違い（簡易）

| API / 用途     | エントリ名の特徴 |
|----------------|------------------|
| Data Catalog   | プロジェクト **ID**、`entries/` の後は **base64 エンコード**された ID |
| Dataplex       | プロジェクト **番号**、`entries/` の後は **平文**の `bigquery.googleapis.com/projects/.../tables/{TABLE_ID}` |

詳細な比較とコード例は `references/entry-name-formats.md` を参照。

## 権限確認

- **順序**: 403 の多くは **エントリ名の形式の誤り**（Data Catalog 形式を Dataplex に渡している）が原因。**まずエントリ名を Dataplex 形式に直し**、それでも 403 が続く場合に IAM を確認する。
- **確認する権限**: Dataplex で aspect を更新するには、呼び出し元（ユーザー or サービスアカウント）に次のいずれかが必要。
  - `roles/dataplex.catalogEditor` または `roles/dataplex.catalogAdmin`（いずれも `dataplex.entries.update` を含む）
  - 加えて `roles/dataplex.entryOwner` と `roles/dataplex.aspectTypeUser` があるとよい。
- **確認方法**: プロジェクトの IAM で該当メンバーのロールを確認。`gcloud projects get-iam-policy PROJECT_ID --format="table(bindings.role,bindings.members)" --flatten="bindings[].members" --filter="bindings.members:SA_OR_USER_EMAIL"` で一覧可。
- 詳細なロール・手順は `references/entry-name-formats.md` の「権限」を参照。

## このスキルが参照されるタイミング

Cursor のエージェントは、**ユーザーの質問やタスクの内容**と各スキルの **description（説明）** を照らし合わせ、関連しそうなスキルを読みにいく。次のようなときにこのスキルが選ばれやすい。

- **ユーザーが言及したとき**: 「Dataplex で 403 が出る」「Data Catalog から Dataplex を更新したい」「カタログ同期で 403」「Dataplex のエントリ名が分からない」「**BigQuery のメタデータを利用したい**」「テーブル説明をカタログに反映したい」など。
- **タスクの文脈**: **BigQuery のメタデータの利用**（テーブル・カラム説明の取得／登録、データカタログ・Dataplex 連携、SQL 生成用スキーマの参照）や、コード・仕様に「Data Catalog」「Dataplex」「entries:lookup」「update-aspects」「カタログ同期」などが含まれるとき。
- **逆に参照されにくいとき**: 単なる BigQuery のクエリ実行だけ、Dataplex にもメタデータにも触れない権限設計だけ、など「Data Catalog と Dataplex のエントリ名の違い」に無関係な話題。

スキルは「関数のように自動で呼ばれる」のではなく、**エージェントが「この話題ならこのスキルを読むとよい」と判断したとき**に SKILL.md が読み込まれる。

## チェックリスト（実装・調査時）

- [ ] Dataplex の PATCH/GET に渡している名前が、Data Catalog の lookup 結果になっていないか確認した
- [ ] Dataplex 用名前は「プロジェクト番号」+「平文リソースパス」で構築しているか（または searchEntries で取得しているか）
- [ ] @bigquery エントリの PATCH では overview のみ送り、schema は含めていないか
- [ ] 形式を直しても 403 が続く場合、呼び出し元の IAM ロール（catalogEditor / catalogAdmin 等）を確認した

## Troubleshooting

### エラー: Dataplex / Data Catalog API で 403 / 404

**原因**: エントリ名の形式が API 間で異なり、Lookup 結果をそのまま渡している。

**対処**: 本文・**references/** の「正しいエントリ名の組み立て」を確認し、Dataplex 用の形式に直す。

### エラー: メタデータが期待と違う

**原因**: 同期遅延、別リソースを参照している。

**対処**: リソース名をログに出して突き合わせ、Lookup をやり直す。

## 参照

- 詳細な形式比較・原因と解決策・権限: `references/entry-name-formats.md`
