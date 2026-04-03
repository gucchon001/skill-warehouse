# Node から gws を起動する（パス解決・spawn）

`child_process.spawn` / `spawnSync` で gws を呼ぶときの定番パターン。**JSON は引数配列の 1 要素としてそのまま渡し、`shell: false`** とする（[stable-method.md](stable-method.md)）。

## 環境変数

| 変数 | 役割 |
|------|------|
| `GWS_PATH` | gws 実行ファイルのフルパス。設定されていれば最優先で使用する。 |
| （その他 CLI 全体） | [official-googleworkspace-cli.md](official-googleworkspace-cli.md) の `GOOGLE_WORKSPACE_CLI_*` |

## resolveGws() の考え方

1. `GWS_PATH` があればそれを使う。
2. **Windows**: `cmd /c where gws` の先頭行を取得。`gws` だけだと spawn で失敗しやすいので、拡張子がなければ **`.cmd` を付ける**（npm グローバルは `gws.cmd`）。
3. **Unix / macOS**: `which gws`。
4. 見つからなければフォールバック `'gws'`（PATH が通っている実行環境向け。**CI や IDE によっては ENOENT になりうる**ので、本番スクリプトでは 2 までで必ず解決できるようにする）。

実装例はスキル同梱の [scripts/gws-params-encoding-test.mjs](../scripts/gws-params-encoding-test.mjs) 内 `resolveGws()` を参照。

## spawn の形

### Windows

`gws.cmd` を **直接** `spawnSync(gwsPath, args)` すると環境によって **EINVAL** になることがある。その場合は **`cmd` 経由**にする。

```js
import { spawnSync } from 'child_process';

const opts = { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024, shell: false, windowsHide: true };
// paramsJson を cmd に渡すと % が環境変数展開されるため、必要に応じて % → ^% にエスケープする
const raw = paramsJson.replace(/%/g, '^%');
spawnSync('cmd', ['/c', gwsPath, 'sheets', 'spreadsheets', 'values', 'get', '--params', raw], opts);
```

### Unix

```js
spawnSync(gwsPath, ['sheets', 'spreadsheets', 'values', 'get', '--params', paramsJson], {
  encoding: 'utf8',
  maxBuffer: 2 * 1024 * 1024,
  shell: false,
});
```

## 標準出力の文字コード

gws の標準出力は **UTF-8**。Windows コンソールに `console.log` すると見かけ上文字化けすることがある。**検証はファイルへ UTF-8 で書き出して行う**（**gws-sheets** / **gws-docs-to-local** の各 reference 参照）。

## 検証スクリプト

約 50 パターンの range 文字列で `values get` に渡せるかを試す: [scripts/gws-params-encoding-test.mjs](../scripts/gws-params-encoding-test.mjs)。  
事前に **`GWS_TEST_SPREADSHEET_ID`**（読み取り可能なスプレッドシート ID）と **`gws auth login -s sheets`** が必要。

## 関連

- Sheets の読取・保存手順全体: **gws-sheets**
- Docs の取得: **gws-docs-to-local**
