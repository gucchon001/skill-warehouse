# --params でエラーになりやすい30パターンと検証

より広い **約 50 パターン**の自動検証はグローバル **gws-params-encoding** の [scripts/gws-params-encoding-test.mjs](../../gws-params-encoding/scripts/gws-params-encoding-test.mjs)（要 `GWS_TEST_SPREADSHEET_ID`）を参照。

## 検証結果

**引数配列**で `--params` を渡す実装（Python: `subprocess.run([gws, ..., "--params", json.dumps(params)], encoding="utf-8")`）で、以下30パターンすべて **unexpected argument なし** で通過することを確認済み。

## 30パターン（カテゴリ）

| ID | カテゴリ | 例 |
|----|----------|-----|
| 1 | ダブルクォート | `"` |
| 2 | ダブルクォート連続 | `"""` |
| 3 | バックスラッシュ | `\` |
| 4 | バックスラッシュ連続 | `\\` |
| 5 | エスケープ引用 | `\"` |
| 6 | 改行 | `A1\nB2` |
| 7 | タブ | `A1\tB2` |
| 8 | CR | `A1\rB2` |
| 9 | 円マーク半角 | `¥` |
| 10 | 円マーク全角 | `￥` |
| 11 | 日本語 | `日本語` |
| 12 | 日本語range風 | `シート!A1:B2` |
| 13 | 絵文字 | `🔒` |
| 14 | 絵文字付きrange | `Sheet🔒!A1` |
| 15 | 波括弧 | `Sheet{A}!A1` |
| 16 | 角括弧 | `Sheet[1]!A1` |
| 17 | 疑問符 | `Sheet?A!A1` |
| 18 | ハッシュ | `Sheet#1!A1` |
| 19 | アンパサンド | `A&B!A1` |
| 20 | パイプ | `A|B!A1` |
| 21 | 不等号 | `A<B>!A1` |
| 22 | 括弧 | `Sheet(1)!A1` |
| 23 | スラッシュ | `Sheet/A!A1` |
| 24 | アスタリスク | `Sheet*A1` |
| 25 | Windows変数風 | `%PATH%` |
| 26 | スペース含む | `Sheet 1!A1:B2` |
| 27 | CRLF | `A1\r\nB2` |
| 28 | 空文字 | `""` |
| 29 | 長い日本語 | `項目名・備考・メモ!A1:Z100` |
| 30 | 混在 | `シート"名"!A1:B2` |

## 検証手順（プロジェクト側）

プロジェクトに `scripts/gws-params-test/` を設ける場合の例。

- `test_cases_30.json`: 上記30パターンの `id`, `category`, `value` を格納。
- `run_test.py`: `gws sheets spreadsheets values get` を各 value を `range` にした params で**引数配列**から呼び、stderr に `unexpected argument` が含まれないことを確認。全30件 Pass でエラーなし。

実行: `python scripts/gws-params-test/run_test.py`（クイックは `--quick` で5件のみ）。

## 結論

**スクリプトから gws を呼ぶときは、必ず引数配列で `--params` に JSON 文字列を渡す。** シェル経由で渡すと 1〜30 の多くで壊れる。詳細は **gws-params-encoding** スキルを参照。
