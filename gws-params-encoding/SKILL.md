---
name: gws-params-encoding
description: gws を安定的に使うため、--params に JSON を渡すときターミナル・シェルで壊れやすい文字を避ける方法を案内する。「gws で JSON が壊れる」「Node から gws を呼ぶ」で発動。
last_verified: 2026-03-17
---

# gws を安定的に使う（--params の渡し方）

Node やターミナルから gws を呼ぶとき、`--params` に渡す JSON が **ダブルクォート・バックスラッシュ・円マーク・特殊文字** で壊れないようにする。

## 関連スキル（gws スイート）

| スキル | 役割 |
|--------|------|
| **gws-params-encoding**（本スキル） | **共通基盤**。`--params` / `--json` の安全な渡し方（引数配列・エスケープ） |
| **gws-drive** | Drive 操作全般（一覧・共有ドライブ・検索等） |
| **gws-docs-to-local** | Docs 読取 → ローカル |
| **gws-sheets-to-local** | シート values 読取 → ローカル |
| **gws-sheets-manage** | シート新規・更新（gws） |

**他の gws スキルを使う前に**、JSON 経由のコマンドでは本スキルか **references/stable-method.md** を確認する。

## いつこのスキルを使うか

- Node から gws を `spawnSync` などで呼び、`--params` に JSON を渡す実装をするとき
- ターミナル（特に Windows cmd）で gws に JSON を渡すとエラーになるとき

## 安定して渡す方法（実装）

- **推奨**: シェルを介さず、**引数配列で JSON をそのまま渡す**。
  - **Windows**: `.cmd` を直接 spawn すると EINVAL になるため、`spawnSync('cmd', ['/c', gwsPath, 'sheets', '...', '--params', paramsJson], { shell: false })` で実行する。
  - **Unix**: `spawnSync(gwsPath, ['sheets', '...', '--params', paramsJson], { shell: false })`。gws のパスは `GWS_PATH` または `which gws` で解決する。
- **shell: true のとき**: Windows では `paramsJson.replace(/\\/g, '\\\\').replace(/"/g, '\\"')` の**順**でエスケープし、全体を `"..."` で囲む。

## 検証

プロジェクト側にテストスクリプト（例: `scripts/gws-params-encoding-test.mjs`）を用意し、問題になりやすい文字パターン（ダブルクォート、バックスラッシュ、円マーク、%VAR%、&、絵文字 等）を順次実行して確認する。前提: gws が PATH にあり、初回は `gws auth login -s sheets` を実行すること。

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

- 安定方法の詳細・問題になりやすい文字のカテゴリ: [references/stable-method.md](references/stable-method.md)
