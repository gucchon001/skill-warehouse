# 課題管理表 batchUpdate の request 一覧

Sheets API の `spreadsheets.batchUpdate` に渡す **request body** は `{ "requests": [ ... ] }`。各要素は次のいずれか 1 種のみを持つ。

## 1. repeatCell（装飾・折り返し）

指定範囲のセルに同じ書式を適用する。

- **range**: `sheetId`, `startRowIndex`, `endRowIndex`, `startColumnIndex`, `endColumnIndex`（いずれも 0 始まり）
- **cell.userEnteredFormat**:
  - ヘッダー用: `backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 }`, `textFormat: { bold: true }`, `wrapStrategy: "WRAP"`
  - データ行用: `wrapStrategy: "WRAP"` のみ
- **fields**: 更新するフィールドのマスク。例: `"userEnteredFormat(backgroundColor,textFormat,wrapStrategy)"` または `"userEnteredFormat(wrapStrategy)"`

## 2. updateDimensionProperties（列幅）

列のピクセル幅を指定する。列ごとに 1 request ずつ書くか、同じ幅の列をまとめて 1 request で指定する。

- **range**: `sheetId`, `dimension: "COLUMNS"`, `startIndex`, `endIndex`（endIndex は含まない）
- **properties**: `pixelSize`: 数値
- **fields**: `"pixelSize"`

## 3. setDataValidation（プルダウン）

指定範囲にデータ検証（リスト選択）を設定する。

- **range**: `sheetId`, `startRowIndex`, `endRowIndex`, `startColumnIndex`, `endColumnIndex`（ヘッダーを除くデータ行のみなら startRowIndex: 1）
- **rule**:
  - **condition**: `type: "ONE_OF_LIST"`, `values: [ { "userEnteredValue": "選択肢1" }, ... ]`
  - **showCustomUi**: `true` でプルダウン表示

## 種別・優先度・状態のリスト値（プルダウン用）

| 列 | 候補 |
|----|------|
| 種別 | 要確認, タスク, バグ, 機能, 改善 |
| 優先度 | 高, 中, 低 |
| 状態 | 未着手, 対応中, レビュー中, 完了, 保留, 調査完了 |
