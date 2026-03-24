# 新規作成とメタデータ取得（gws sheets spreadsheets create / get）

## 新規作成（create）

```bash
gws sheets spreadsheets create --json '{"properties": {"title": "Q1 Budget"}}'
```

- **--json**: リクエストボディ。`properties.title` でスプレッドシートのタイトルを指定する。
- レスポンス例:
  - `spreadsheetId`: 以降の get / values get / values update で使う ID
  - `spreadsheetUrl`: ブラウザで開く URL
  - `sheets`: 初期シート（通常 1 枚）の properties 配列

Windows でシェルに JSON を渡すと壊れる場合は、JSON をファイルに書き、スクリプトから `--json` にファイル内容を渡す。

## メタデータ取得（get）— 既存シートの確認

```bash
gws sheets spreadsheets get --params '{"spreadsheetId": "<id>"}' --format json
```

- **spreadsheetId**: URL の `/d/` の直後から次の `/` または `?` の手前まで。
- レスポンスの **sheets[]** に各シートの情報がある。
  - **sheets[].properties.sheetId**: 数値。URL の **gid** に対応する。
  - **sheets[].properties.title**: シート名。`values get` / `values update` の range で使う。

### フィールド制限（軽量化）

```bash
# シートの sheetId と title だけ取得
gws sheets spreadsheets get --params '{"spreadsheetId": "<id>", "fields": "sheets.properties(sheetId,title)"}' --format json
```

### gid からシート名を引く

URL が `...?gid=1885307688` のとき、get の結果で `sheets[].properties.sheetId === 1885307688` の `title` がそのシート名。range は `"<title>!A1:Z100"` のように指定する。

### 構造の読み込み（シート一覧＋行数・列数・列名）

「構造を読み込んで」「シートの構成を確認して」と言われたときの手順。

1. **シート一覧とサイズ**: `spreadsheets get` で `fields` に `gridProperties` を含める。
   ```bash
   --params '{"spreadsheetId": "<id>", "fields": "sheets.properties(sheetId,title,gridProperties)"}'
   ```
   - 各シートの `title`（シート名）、`gridProperties.rowCount` / `columnCount`、`frozenRowCount` が取れる。
2. **各シートの列構成（ヘッダー行など）**: シート名が分かったら、`sheets spreadsheets values get` で範囲を指定して先頭行や数行を取得する。例: `"<SheetName>!A1:Z1"` または `"<SheetName>!A1:Z5"`。シート名に括弧やスペースがある場合は `'課題管理表(AI)'!A1:Z5` のように単一引用符で囲む。
3. **スクリプトで実行する場合**: gws の出力は UTF-8。Windows では「gws が見つからない」ときは **gws-sheets-to-local** の reference「実行環境の注意」に従い `gws.cmd` のフルパスを使う。出力をコンソールに print すると日本語が文字化けすることがあるため、**JSON をファイルに書き出して内容を確認**する。
