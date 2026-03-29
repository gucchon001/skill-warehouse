---
name: sheet-api-update
description: "スプレッドシートの書き込みを Node/googleapis（Sheets API）で行う。アプリ・本番パイプライン・常時依存は API。gws での一発更新は gws-sheets-manage。Triggers: Sheets API, googleapis 書き込み, スプレッドシート API 更新, WBS 課題表 シート反映."
metadata:
  last_verified: "2026-04-01"
---

# スプレッドシートを Sheets API で更新する

**本スキルの守備範囲**: **アプリケーションコード**や **Vercel/CI 等の本番・準本番**から、**Google Sheets API（googleapis / Node）**で `values.update` / `batchUpdate` する手順。**app-code-apis-not-cli** と整合させ、Sheets への**常時書き込み**は subprocess + gws にしない。

## gws とどちらを使うか

| 場面 | 使うスキル |
|------|------------|
| **Next.js / バッチ npm スクリプト / 常駐処理**がシートに書く | **本スキル**（Sheets API） |
| **エージェント・手動・ワンショット**で `gws` を叩いて作成・メタ取得・セル更新する | **gws-sheets-manage**（**gws-params-encoding** 必須） |
| **セル値の読み取りだけ**ローカルに落とす | **gws-sheets-to-local** |

**なぜアプリは API か**: Windows では gws の `--params` / `--json` がシェルで壊れやすく、**コードに gws 書き込みを埋め込む**と不安定になりやすい。CLI での更新は **gws スキル側**の手順に任せる。

## トリガー

- 「スプレッドシートを API で更新して」「googleapis でシートに書いて」
- 「WBS / 課題管理表を**スクリプトから**スプレッドシートに反映して」

## 前提

- **認証**: サービスアカウント JSON。`GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH`、または `.env.local` の `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON` / `..._BASE64`。
- 秘密鍵の改行: `credentials.private_key.replace(/\\n/g, '\n')`。DECODER 系は `NODE_OPTIONS=--openssl-legacy-provider` を検討。

## 書き込みパターン

### values.update（セル範囲）

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
  requestBody: { values: [['col1', 'col2'], ['val1', 'val2']] },
});
```

### batchUpdate（書式・プルダウン・列幅）

`spreadsheets.batchUpdate` の `requests` に `repeatCell`、`updateDimensionProperties`、`setDataValidation` 等。

### 汎用パターン

`scripts/*-to-sheet.mjs` 等で「2 次元配列を組み立て → 上記 API で書く」。

## 読み取り

読み取りは **Sheets API** でも **gws**（**gws-sheets-to-local**）でも可。用途に合わせて選ぶ。

## Troubleshooting

### エラー: gws で読めない・書けない

**対処**: 読取・gws 経路は **gws-sheets-to-local** / **gws-sheets-manage** と **gws-params-encoding**。本スキルは **API 書き込み**向け。

### エラー: Sheets API で更新できない

**原因**: 認証、range、共有（サービスアカウントに編集権限）。

**対処**: 前提を再確認。`Invalid service account JSON` / DECODER は秘密鍵の `\n` と OpenSSL オプションを確認。

## 参照

- **gws での**作成・メタ・values 更新: **gws-sheets-manage**
- **gws** の JSON 渡し: **gws-params-encoding**
- アプリでの CLI 回避方針: **app-code-apis-not-cli**
