# 安定方法の詳細と問題になりやすい文字

## 安定方法（推奨）

- **JSON をシェルに渡さない**: `spawnSync` の第2引数に **配列** で `['--params', paramsJson]` を渡し、`shell: false` で実行する。
- **Windows の場合**: `gws.cmd` を直接 spawn すると EINVAL になるため、`spawnSync('cmd', ['/c', gwsPath, 'sheets', 'spreadsheets', 'values', 'get', '--params', paramsJson], { shell: false, windowsHide: true })` とする。これで JSON は 1 つの引数として gws に渡り、cmd による解釈を避けられる。
- **gws のパス**: `GWS_PATH` が設定されていればそれを使う。未設定なら Windows は `cmd /c where gws`、Unix は `which gws` で解決する。Windows では `where` の結果に `.cmd` を付与する（spawn 時は cmd /c 経由なので .cmd でよい）。

## 従来方法（shell: true を使う場合）

- Windows で `"..."` で囲むとき、**先に** `\` を `\\` に、**その後** `"` を `\"` に置換する。順序を逆にするとバックスラッシュが正しく渡らない。
- Unix ではそのまま渡してよい（シェルが配列の要素をそのまま子プロセスに渡すため）。

## %VAR%風 → 解決済み

- **対処**: Windows では JSON を cmd に渡す前に `%` を `^%` にエスケープする。`escapeForWindowsCmd` で実施。
- 安定方法・従来方法ともに `paramsJson.replace(/%/g, '^%')` を適用して通過。

## アンパサンド → Windows ではスキップ

- **理由**: cmd が `&` をコマンド区切りとして解釈する。Node が cmd に渡す際に 1 本のコマンドラインにまとめられるため、エスケープ（`^&` 等）では防げない。
- **対処**: Windows では該当ケースを **SKIP** する。実運用で range に `&` を含める必要がある場合は、一時ファイル経由で JSON を渡す等を検討する。

## 問題になりやすい文字のカテゴリ（約 50 パターン）

| カテゴリ | 例 |
|----------|-----|
| ダブルクォート・バックスラッシュ | `"` `""` `\` `\\` `\"` `\n` `\t` `\r` |
| 円マーク・日本語 | `¥` `￥` `日本語` `シート!A1:B2` |
| 絵文字・Unicode | `🔒` `Sheet🔒!A1` |
| Windows 依存 | `C:\path\to` `\\server\share` `%PATH%` |
| シェル特殊 | `$HOME` `` ` `` `!` スペース・改行・タブ・CRLF |
| 記号・括弧 | `{}` `[]` `?` `#` `&` `|` `<>` `()` `/` `*` |
| その他 | 空文字・長い文字列・制御文字・ゼロ幅スペース |
