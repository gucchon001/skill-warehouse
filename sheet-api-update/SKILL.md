---
name: sheet-api-update
description: スプレッドシートを Google Sheets API（Node / googleapis）で更新する手順を案内する。WBS・課題管理表・任意シートへの JSON 書き込み時に使う。書き込みは gws ではなく API のみ使用。
last_verified: 2026-03-17
---

# スプレッドシートを API で更新する

スプレッドシートへの**書き込み**は **Google Sheets API（googleapis / Node）** のみを使用する。gws の `values update` は Windows で `--params` / `--json` が壊れるため書き込みでは使わない。読取は API または gws のどちらでも可。

## トリガー

- 「スプレッドシートを API で更新して」「シートを API で反映して」
- 「WBS をスプレッドシートに書き込んで」「課題管理表をスプレッドシートに反映して」

## 前提

- **認証**: サービスアカウント JSON を使用する。環境変数 `GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH` でファイルパスを指定するか、`.env.local` の `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON` / `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64` を使う。
- 秘密鍵の改行: スクリプトで `credentials.private_key.replace(/\\n/g, '\n')` を実施する。DECODER エラー時は `NODE_OPTIONS=--openssl-legacy-provider` を案内する。

## 書き込みパターン

### values update（セル範囲の書き込み）

```javascript
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

await sheets.spreadsheets.values.update({
  spreadsheetId: 'YOUR_SPREADSHEET_ID',
  range: 'シート名!A1:D10',
  valueInputOption: 'USER_ENTERED',
  requestBody: { values: [["col1","col2"], ["val1","val2"]] },
});
```

### batchUpdate（書式・プルダウン・列幅）

書式変更・データ検証は `spreadsheets.batchUpdate` を使う。`requests` 配列に `repeatCell`（装飾）、`updateDimensionProperties`（列幅）、`setDataValidation`（プルダウン）を並べる。

### 汎用スクリプトパターン

プロジェクトごとに `scripts/xxx-to-sheet.mjs` を作り、「2次元配列の values を組み立て → API で書き込み」のパターンで実装する。

## 読取のみ行う場合

読取は **API** または **gws** のどちらでも可。

## エラー時の対処

| 現象 | 対処 |
|------|------|
| `Invalid service account JSON` / DECODER 系エラー | 秘密鍵の `\n` が文字列の `\\n` のままになっていないか確認。`NODE_OPTIONS=--openssl-legacy-provider` を付けて実行する。 |
| 認証失敗（401 / 403） | サービスアカウント JSON のパス・内容を確認。スプレッドシートを「共有」でそのサービスアカウントのメールに編集権限を付与しているか確認する。 |

## Troubleshooting

### エラー: gws で読めない・書けない

**原因**: スコープ、ファイル ID 誤り、共有設定。

**対処**: **gws-drive** / **gws-sheets-*** と **gws-params-encoding** を確認し、ID と range を再確認する。

### エラー: Sheets API（Node 等）で更新できない

**原因**: 認証、シート名・range の誤り、権限。

**対処**: **sheet-api-update** の前提を確認し、API の有効化と認証情報を見直す。

