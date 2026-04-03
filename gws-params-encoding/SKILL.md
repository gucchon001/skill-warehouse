---
name: gws-params-encoding
description: "gws の --params JSON をシェル・Node から壊さず渡す。references/node-resolve-gws.md・scripts/gws-params-encoding-test.mjs（約50件検証）。公式は references/official-googleworkspace-cli.md。Triggers: gws JSON 壊れる, Node から gws, params 検証."
metadata:
  last_verified: "2026-03-30"
---

# gws を安定的に使う（--params の渡し方）

**CLI 正本**: [googleworkspace/cli](https://github.com/googleworkspace/cli) · npm **`@googleworkspace/cli`** · コマンド名 **`gws`**。インストール・`gws auth`・`GOOGLE_WORKSPACE_CLI_*`・公式リポジトリの Agent Skills との関係は [references/official-googleworkspace-cli.md](references/official-googleworkspace-cli.md) を正とする。

Node やターミナルから gws を呼ぶとき、`--params` に渡す JSON が **ダブルクォート・バックスラッシュ・円マーク・特殊文字** で壊れないようにする。

## 関連スキル（gws スイート）

| スキル | 役割 |
|--------|------|
| **gws-params-encoding**（本スキル） | **共通基盤**。`--params` / `--json` の安全な渡し方（引数配列・エスケープ） |
| **gws-drive** | Drive 操作全般（一覧・共有ドライブ・検索等） |
| **gws-docs-to-local** | Docs 読取 → ローカル |
| **gws-sheets** | スプレッドシート読取・新規・メタ・values update（gws） |

**他の gws スキルを使う前に**、JSON 経由のコマンドでは本スキルか **references/stable-method.md**・**references/node-resolve-gws.md**（Node からの起動）を確認する。

## いつこのスキルを使うか

- Node から gws を `spawnSync` などで呼び、`--params` に JSON を渡す実装をするとき
- ターミナル（特に Windows cmd）で gws に JSON を渡すとエラーになるとき

## 安定して渡す方法（実装）

- **推奨**: シェルを介さず、**引数配列で JSON をそのまま渡す**。
  - **Windows**: `.cmd` を直接 spawn すると EINVAL になるため、`spawnSync('cmd', ['/c', gwsPath, 'sheets', '...', '--params', paramsJson], { shell: false })` で実行する。
  - **Unix**: `spawnSync(gwsPath, ['sheets', '...', '--params', paramsJson], { shell: false })`。gws のパスは `GWS_PATH` または `which gws` で解決する。
- **shell: true のとき**: Windows では `paramsJson.replace(/\\/g, '\\\\').replace(/"/g, '\\"')` の**順**でエスケープし、全体を `"..."` で囲む。
- **Node でのパス解決・spawn の全文**: [references/node-resolve-gws.md](references/node-resolve-gws.md)

## 検証

スキル同梱の **[scripts/gws-params-encoding-test.mjs](scripts/gws-params-encoding-test.mjs)** で、約 50 パターンの文字を `range` に含む `values get` へ渡せるか検証できる。

- **環境変数**: `GWS_TEST_SPREADSHEET_ID`（必須・読み取り可能なスプレッドシート ID）、任意で `GWS_PATH`
- **前提**: `gws auth login -s sheets` 済み
- リポジトリからは **ラッパー**で `GWS_TEST_SPREADSHEET_ID` のデフォルトを渡してこのスクリプトを起動してよい（下記「プロジェクトから呼ぶ」）

### プロジェクトから呼ぶ

グローバルスキルは `~/.cursor/skills/gws-params-encoding/`（Windows: `%USERPROFILE%\.cursor\skills\gws-params-encoding\`）に置く。別パスにコピーしている場合は **`GWS_PARAMS_ENCODING_SKILL_ROOT`** でスキルフォルダのルートを指定する。

プロジェクトの `scripts/gws-params-encoding-test.mjs` がデフォルト ID を設定して上記を `node` で起動する実装になっている場合、そのファイルは薄いラッパーに留める。

## Troubleshooting

### エラー: gws コマンドが見つからない

**原因**: PATH 未設定、別シェルでインストールした。

**対処**: インストール先のフルパスで実行するか PATH を通す。

### エラー: --params の JSON が壊れる

**原因**: シェルが `"` や改行を解釈して JSON が欠ける（PowerShell / cmd で多い）。

**対処**: 本文の「安定して渡す方法」と [references/stable-method.md](references/stable-method.md) を Read。引数配列・`shell: false` を優先する。

### エラー: 認証・権限エラー（Drive / Sheets）

**原因**: トークン期限切れ、スコープ不足、共有ドライブ権限。

**対処**: gws の再認証手順を実行し、対象ファイル・ドライブの権限を確認する。

## 参照

- 公式 CLI（README と整合）: [references/official-googleworkspace-cli.md](references/official-googleworkspace-cli.md)
- 安定方法の詳細・問題になりやすい文字のカテゴリ: [references/stable-method.md](references/stable-method.md)
- Node から gws を起動する（`resolveGws`・spawn）: [references/node-resolve-gws.md](references/node-resolve-gws.md)
- `--params` 検証スクリプト（約 50 パターン）: [scripts/gws-params-encoding-test.mjs](scripts/gws-params-encoding-test.mjs)
