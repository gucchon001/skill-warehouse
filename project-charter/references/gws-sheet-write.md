# gws でスプレッドシートに値を書く（PJC）

## values update の形

- **`--params`**: `spreadsheetId`, `range`, `valueInputOption: "USER_ENTERED"` を渡す。
- **`--json`**: request body の **`{"values": [[...], ...]}` だけ**を渡す（余計なキーを混ぜない）。
- **セル内改行**: 文字列に `\n` を含め、`USER_ENTERED` で送る。
- **範囲**: `シート名!A1:H11` のように **ラベル行を含む全行**を一度に書くと列ずれを防ぎやすい。

## 関連スキル

- JSON がシェルで壊れるとき: **gws-params-encoding**
- Sheets API（Node）で書くとき: **sheet-api-update**
