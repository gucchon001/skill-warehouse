# gws sheets spreadsheets values get とローカル出力

## コマンド

```bash
gws sheets spreadsheets values get --params '{"spreadsheetId": "<id>", "range": "<SheetName>!A1:Z"}' --format json
```

- **spreadsheetId**: スプレッドシートの ID（下記「Spreadsheet ID の取り方」参照）。
- **range**: A1 表記の範囲。例: `Sheet1!A1:Z1000`、`シート名!A:D`。シート名にスペースや特殊文字がある場合はシート名を `'Sheet 1'!A1:Z` のように単一引用符で囲む。タブ名に **EM ダッシュ（`—`）** 等があるときは API 応答の `title` と**一字一句**合わせる。
- **--format json**: 出力を JSON にする。gws は標準出力に UTF-8 で出す。

## Windows PowerShell（対話・ワンライナー）

PowerShell では次の **アンチパターン**で `validationError`（`unexpected argument 'spreadsheetId\\:…'` 等）や JSON 破損が起きやすい。

| 避ける | 理由 |
|--------|------|
| `--params '{\"spreadsheetId\":\"…\"}'` のように **バックスラッシュで手動エスケープ** | PowerShell が引数を再解釈し、`--params` の JSON が壊れる |
| bash 用の **シングルクォート1行 JSON** をそのまま貼る | PowerShell のクォート規則が異なり、同様に壊れる |

**推奨**: ハッシュテーブルを `ConvertTo-Json` で渡す。

```powershell
$range = "'シート名'!A1:Z100"   # シート名に記号があるときは API の title に合わせ、全体を A1 の単一引用符で囲む
$p = @{
  spreadsheetId = '<id>'
  range         = $range
} | ConvertTo-Json -Compress

gws sheets spreadsheets values get --params $p --format json
```

`spreadsheets get`（メタのみ）も同様に `$p = @{ spreadsheetId = '<id>' } | ConvertTo-Json -Compress` でよい。

## UTF-8 で保存する（日本語セル・PowerShell）

「コンソールに表示は崩れるが中身は UTF-8」なことと、「**ファイルに書いたあと** JSON 内の日本語が化ける」ことを区別する。

- **表示だけ化ける**: Windows コンソールのコードページのせい。**ファイルに UTF-8 で書いた内容**をエディタで開いて確認する。
- **ファイルが化ける**: PowerShell 5.x で `$out = gws ...` として文字列に取り込んだあと `WriteAllText` / `Set-Content` すると、**外部プロセス stdout の解釈が UTF-8 にならず**、日本語が壊れることがある。

**確実な対処**（いずれか）。

1. **Python**: `subprocess.run(..., capture_output=True, encoding="utf-8")` し、`Path(...).write_text(stdout, encoding="utf-8")`。
2. **Node**: 子プロセスで **`encoding: "utf8"`** を指定し、`fs.writeFileSync(path, stdout, "utf8")`。**`spawn('gws', …)` が ENOENT** になる場合は下記「`run-gws.js` を直接起動」。
3. PowerShell 7+ で外部コマンドの UTF-8 が安定する環境なら、`$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'` 等を検討するが、**エージェント自動化では 1 か 2 を優先**する。

### Node: `run-gws.js` を直接起動（Windows で ENOENT を避ける）

npm グローバル導入の `gws` は `gws.cmd` / `gws.ps1` 経由のため、`spawnSync('gws', …)` が **ENOENT** になることがある。**`@googleworkspace/cli` の `run-gws.js` を `process.execPath`（node）で起動**すると安定しやすい。

- パス例: `%APPDATA%\npm\node_modules\@googleworkspace\cli\run-gws.js`（`join(process.env.APPDATA, 'npm', 'node_modules', '@googleworkspace', 'cli', 'run-gws.js')`）

```js
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const runGws = join(process.env.APPDATA, "npm", "node_modules", "@googleworkspace", "cli", "run-gws.js");
const params = JSON.stringify({
  spreadsheetId: "<id>",
  range: "'シート名'!A1:Z",
});

const r = spawnSync(
  process.execPath,
  [runGws, "sheets", "spreadsheets", "values", "get", "--params", params, "--format", "json"],
  { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 },
);

if (r.status !== 0) throw new Error(r.stderr || r.stdout);
writeFileSync("out.json", r.stdout, "utf8");
```

引数の渡し方の共通原則は **gws-params-encoding** の [node-resolve-gws.md](../../gws-params-encoding/references/node-resolve-gws.md) も参照。

## Spreadsheet ID の取り方

- **URL から**: `/d/` の直後から、次の `/` または `?` の**手前**までを Spreadsheet ID とする。
- 例: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0`  
  → Spreadsheet ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## レスポンス JSON の構造

- `range`: 実際に返された範囲（A1 表記）。
- `majorDimension`: `"ROWS"` または `"COLUMNS"`。省略時は ROWS。
- `values`: 二次元配列。`[[cell1, cell2, ...], [cell1, cell2, ...], ...]`。行の配列。

空のセルは行末では省略されることがある。行の長さを揃えたい場合は実装側で補完する。

## JSON → CSV 変換のポイント

- `values` を 1 行ずつ処理し、各セルをダブルクォートで囲む（フィールド内に `"` や改行がある場合は `"` を `""` にエスケープ）。
- 区切り文字はカンマ。改行は LF（`\n`）。BOM を付ける場合は `\uFEFF` を先頭に。

## 文字化けの原因と対策

- **原因**: gws の出力は UTF-8。PowerShell の `Out-File` や `> file` で受け取ると、コンソールのコードページやパイプで UTF-8 が崩れて文字化けする。**PowerShell 5.x で変数に stdout を取り込んでから `WriteAllText` する経路**でも、日本語が壊れる報告がある。
- **対策**: **スクリプト（Python/Node）から gws を呼び**、子プロセスの stdout を `encoding="utf-8"` / `"utf8"` で読み、その文字列を **UTF-8 でファイルに書き込む**。シェル経由でファイルに流し込まない。→ 上記「UTF-8 で保存する」。
- **Python**: `subprocess.run(..., capture_output=True, encoding="utf-8")` で stdout を取得し、`Path(...).write_text(data, encoding="utf-8")` で保存。Windows で「gws が見つからない」ときは上記「実行環境の注意」の gws.cmd フルパスを使う。
- **Node**: 子プロセスで `encoding: "utf8"` を指定し、`fs.writeFileSync(path, stdout, "utf8")` で保存。`gws` が ENOENT なら `run-gws.js` を `process.execPath` で起動（上記）。

## 実行環境の注意（スクリプトから gws を呼ぶ場合）

- **Windows で gws が見つからない（FileNotFoundError）**: npm 経由の gws は `gws.cmd` / `gws.ps1` であり、subprocess で `"gws"` だけ指定すると実行ファイルとして解釈され見つからないことがある。**対策**: (1) `gws.cmd` のフルパスを使う（例: `%APPDATA%\npm\gws.cmd`）、(2) subprocess で `shell=True` にしてシェルに解釈させる。Python では `os.path.join(os.environ.get("APPDATA",""), "npm", "gws.cmd")` でパスを組み立てられる。
- **引数**: スクリプトからは**引数配列**で `--params` を渡す（シェルを介さない）。**gws-params-encoding** スキルを参照。
- **出力の受け取り**: 子プロセスは `capture_output=True` で**バイト列**（`text=False` のまま）で受け取り、`result.stdout.decode("utf-8")` してからファイルに UTF-8 で書き込む。`encoding="utf-8"` で `text=True` にしてもよいが、その文字列を **print でコンソールに出すと Windows（cp932）で日本語が文字化けして見える**ことがある。gws の出力自体は UTF-8 なので、**検証はファイルに書き出した内容で行う**。
- **問題になりやすい文字**: range や params 内の `"` `\` 改行・日本語・絵文字・`&` 等はシェル経由で渡すと壊れる。[params-test-30-patterns.md](params-test-30-patterns.md) 参照。引数配列で渡せば通過する。

## エラーと対処

| 現象 | 対処 |
|------|------|
| 401 / credentials missing | `gws auth login -s sheets` を実行する。 |
| 403 / Permission denied | 対象スプレッドシートへの閲覧権限があるアカウントで認証しているか確認する。 |
| 404 / Not found | Spreadsheet ID が正しいか確認する。URL の `/d/` と次の `/` の間だけを渡す。 |
| 400 / Invalid range | range の A1 表記が正しいか、シート名が存在するか確認する。 |
| validationError / unexpected argument | `--params` の JSON がシェルで壊れている。**PowerShell では `ConvertTo-Json`**、またはスクリプトから引数配列で渡す。上記「Windows PowerShell」。 |
| 取得はできるが保存後に文字化け | 保存経路を UTF-8 に統一する。PowerShell のパイプ・Out-File・**変数キャプチャ + WriteAllText だけ**に依存しない。上記「UTF-8 で保存する」。 |
