# セル範囲の更新（gws sheets spreadsheets values update）

## コマンド

```bash
gws sheets spreadsheets values update --params '{"spreadsheetId":"<id>","range":"<SheetName>!A1:Z"}' --json '[[ "A1", "B1" ], [ "A2", "B2" ]]'
```

- **--params**: `spreadsheetId` と `range`（A1 表記）。オプションで `valueInputOption: "USER_ENTERED"` を付けると数式・日付として解釈される（省略時は "RAW"）。
- **--json**: 行の二次元配列。`[[ row1_cell1, row1_cell2, ... ], [ row2_cell1, ... ]]`。指定した range の左上から順に上書きする。

## range の指定

- シート名は `get` で取得した `sheets[].properties.title` を使う。
- 例: `レファレンス一覧!A1:D20`、`Sheet1!A1:Z`
- シート名にスペースや `!` が含まれる場合は、A1 表記全体をシェルで壊さないよう、スクリプトから引数配列で渡す（**gws-params-encoding** 参照）。

## スクリプトから実行する場合（Node）

- `spawnSync` で `shell: false` とし、`--params` と `--json` を**別引数**で渡す。
- JSON が長い場合は一時ファイルに書き、`fs.readFileSync(path, 'utf8')` で読み、その文字列を引数に渡す。
- Windows では gws が `gws.cmd` のとき `cmd /c` で起動する場合あり。**gws-docs-to-local** や **gws-sheets** の [gws-sheets-values-get.md](gws-sheets-values-get.md)「実行環境の注意」を参照。

## valueInputOption

- **RAW**: 入力がそのまま文字列として入る（デフォルト）。
- **USER_ENTERED**: 数式・日付として解釈される。スプレッドシートの UI で入力したときと同じ挙動にしたい場合はこちらを指定する。
