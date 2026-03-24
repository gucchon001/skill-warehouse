---
name: gws-sheets-manage
description: gws でスプレッドシートの新規作成・既存シート一覧の確認・構造の読み込み・セル範囲の更新を行う手順。「既存シートを確認して」「構造を読み込んで」「シートを更新して」で発動。
last_verified: 2026-03-19
---

# gws でスプレッドシートを扱う（新規作成・確認・更新）

gws の `sheets spreadsheets` サブコマンドで、**新規作成**・**既存シートの確認**・**セル範囲の更新**を行う。読取専用の一括取得は **gws-sheets-to-local**、書き込みの認証・スクリプト一覧はプロジェクトの **sheet-api-update** を参照。

## 関連スキル（gws スイート）

| スキル | 役割 |
|--------|------|
| **gws-params-encoding** | 共通基盤。`--params` / `--json` を壊さず渡す |
| **gws-sheets-to-local** | values **読取**のみ → ローカル JSON / CSV |
| **gws-sheets-manage**（本スキル） | 新規作成・メタ取得・**values 更新**（gws） |
| **gws-drive** | ファイル・共有ドライブ（シート ID の取得補助等） |
| **gws-docs-to-local** | Docs 読取 |

**Node / googleapis での Sheets 更新**は **sheet-api-update**。

## スコープ

- **対象**: スプレッドシートの新規作成、メタデータ取得（シート一覧・gid）、指定範囲への values 更新。
- **対象外**: 書式・条件付き書式・マクロは本スキルでは扱わない。必要なら Sheets API の batchUpdate を別途参照。

## いつこのスキルを使うか

- 「gws でスプレッドシートを新規作成して」と言われたとき
- 「既存のシート一覧を確認して」「gid とシート名の対応を見たい」「構造を読み込んで」「シートの構成を確認して」と言われたとき
- 「このシートの範囲を更新して」と JSON または配列でデータが渡されるとき

## 前提

- **gws** がインストールされ、認証済みであること。未ログインなら `gws auth login -s sheets` を実行する。
- **--params / --json** を渡すときは **gws-params-encoding** に従い、スクリプトからは**引数配列**で渡してシェルで JSON を壊さないようにする。

## 1. 新規作成

- コマンド: `gws sheets spreadsheets create --json '{"properties": {"title": "タイトル"}}'`
- 出力に `spreadsheetId` と `spreadsheetUrl` が含まれる。これを記録して以降の get / update に使う。
- 詳細・オプションは [references/create-and-get.md](references/create-and-get.md) を参照。

## 2. 既存シートの確認（メタデータ取得）・構造の読み込み

- コマンド: `gws sheets spreadsheets get --params '{"spreadsheetId": "<id>"}' --format json`
- オプションで `fields` を指定するとレスポンスを削れる。例: `fields: "sheets.properties(sheetId,title)"`。**行数・列数も欲しいとき**は `fields: "sheets.properties(sheetId,title,gridProperties)"`。
- レスポンスの `sheets[].properties` に **sheetId**（URL の **gid** に対応）と **title**（シート名）がある。range 指定時はこの **title** をシート名として使う（例: `"レファレンス一覧!A1:D20"`）。
- **「構造を読み込んで」の場合**: (1) get でシート一覧と gridProperties を取得、(2) 必要なら各シートの先頭行を `values get`（例: `"SheetName!A1:Z5"`）で取得して列名を確認。出力に日本語が含まれるときは**スクリプトで gws を呼び、stdout を UTF-8 デコードしてファイルに保存**し、コンソール表示では文字化けすることがあるのでファイルで確認する。詳細は [references/create-and-get.md](references/create-and-get.md) の「構造の読み込み」。

## 3. セル範囲の更新（values update）

- コマンド: `gws sheets spreadsheets values update --params '{"spreadsheetId":"<id>","range":"<SheetName>!A1:Z"}' --json '<valuesのJSON配列>'`
- **range**: A1 表記（例: `Sheet1!A1:D10`）。シート名にスペースや特殊文字がある場合は `'Sheet 1'!A1:Z` のようにクォートで囲む。
- **--json**: 行の配列の JSON。例: `[[ "A1", "B1" ], [ "A2", "B2" ]]`。既存範囲は上書きされる。
- スクリプトから実行する場合は **引数配列**で `--params` と `--json` を渡し、JSON をファイルに書いてから `fs.readFileSync` で読むか、`JSON.stringify` で渡す。詳細は [references/values-update.md](references/values-update.md)。

## エラー時

- 401 / 403: 認証とスコープ（`gws auth login -s sheets`）、対象スプレッドシートへの権限を確認する。
- 404: spreadsheetId が正しいか、URL の `/d/` と次の `/` の間だけを渡しているか確認する。
- 400 / Invalid range: range の A1 表記とシート名（メタデータの title）を確認する。
- validationError: `--params` / `--json` がシェルで壊れていないか確認し、スクリプトから引数配列で渡す。
- **スクリプトで gws が見つからない（Windows FileNotFoundError）**: npm の gws は .cmd/.ps1 のため、`%APPDATA%\npm\gws.cmd` のフルパスを使う。**gws-sheets-to-local** の reference「実行環境の注意」を参照。

## Troubleshooting

### エラー: gws コマンドが見つからない

**原因**: PATH 未設定、別シェルでインストールした。

**対処**: インストール先のフルパスで実行するか PATH を通す。

### エラー: --params の JSON が壊れる

**原因**: シェルが `"` や改行を解釈して JSON が欠ける（PowerShell / cmd で多い）。

**対処**: **gws-params-encoding** スキルを Read し、ファイル経由や安全な渡し方に従う。

### エラー: 認証・権限エラー（Drive / Sheets）

**原因**: トークン期限切れ、スコープ不足、共有ドライブ権限。

**対処**: gws の再認証手順を実行し、対象ファイル・ドライブの権限を確認する。

## 参照

- 読取・ローカル出力: **gws-sheets-to-local** スキル
- パラメータの渡し方: **gws-params-encoding** スキル
- プロジェクトの書き込みスクリプト一覧: **sheet-api-update** スキル（.cursor/skills/ 内）
