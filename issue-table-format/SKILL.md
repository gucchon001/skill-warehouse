---
name: issue-table-format
description: 課題管理表シートに装飾・折り返し・列幅・種別・優先度・状態のプルダウンを一括適用する手順を案内する。「課題管理表を装飾して」「プルダウンを設定して」と言われたときに使う。
last_verified: 2026-03-17
---

# 課題管理表の書式・プルダウンを適用する

課題管理表シートに対して、**装飾**（ヘッダー背景・太字）・**折り返し**・**列幅**・**種別・優先度・状態のプルダウン**を一括適用する。

## いつこのスキルを使うか

- 課題管理表シートに「見た目」と「データ検証（プルダウン）」をまとめて設定したいとき
- 既に [issue-table](../issue-table/SKILL.md) で values を書き込んだあと、書式だけ入れたいとき

## 前提

- 対象スプレッドシートの **ID** と **シート名** が分かっていること。sheetId が分かれば get をスキップできる。

## 手順（エージェントが行うこと）

1. **request body の型**
   [references/batchUpdate-issue-table-format.md](references/batchUpdate-issue-table-format.md) の request 種別に従い、repeatCell・updateDimensionProperties・setDataValidation を `requests` 配列に並べる。

2. **一括実行**
   Sheets API の `spreadsheets.batchUpdate` で実行する。プロジェクト側にスクリプトを用意する場合は `scripts/issue-table-format-sheet.mjs [spreadsheetId] [sheetName] [sheetId]` のような形式。

## 列とインデックス（課題管理表 8 列）

| 列 | 名前   | 0-based index | プルダウン |
|----|--------|----------------|------------|
| A  | No     | 0              | —          |
| B  | 課題名 | 1              | —          |
| C  | 種別   | 2              | あり       |
| D  | 優先度 | 3              | あり       |
| E  | 状態   | 4              | あり       |
| F  | 担当   | 5              | —          |
| G  | 期限   | 6              | —          |
| H  | 備考   | 7              | —          |

## 参照

- request の型・フィールド: [references/batchUpdate-issue-table-format.md](references/batchUpdate-issue-table-format.md)
- 列定義・推奨値（種別・優先度・状態の候補）: [issue-table/references/issue-table-format.md](../issue-table/references/issue-table-format.md)

## Troubleshooting

### エラー: gws で読めない・書けない

**原因**: スコープ、ファイル ID 誤り、共有設定。

**対処**: **gws-drive** / **gws-sheets-*** と **gws-params-encoding** を確認し、ID と range を再確認する。

### エラー: Sheets API（Node 等）で更新できない

**原因**: 認証、シート名・range の誤り、権限。

**対処**: **sheet-api-update** の前提を確認し、API の有効化と認証情報を見直す。

