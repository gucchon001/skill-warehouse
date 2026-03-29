---
name: gws-sheets-manage
description: "gws でスプレッドシートの新規作成・メタ取得・構造確認・values update（CLI）。アプリ本番からの常時書き込みは sheet-api-update。--params は gws-params-encoding。Triggers: gws シート作成, シート一覧 gid, 構造読み込み, gws でシート更新."
metadata:
  last_verified: "2026-04-01"
---

# gws でスプレッドシートを扱う（新規・確認・CLI 更新）

**本スキルの守備範囲**: **gws CLI**（`gws sheets spreadsheets …`）による **新規作成**、**メタデータ取得**、**構造の読み込み**、**values の更新**。**OAuth 済み gws** での作業・エージェントのワンショット・手動運用向け。

## sheet-api とどちらを使うか

| 場面 | 使うスキル |
|------|------------|
| **gws** で作成・一覧・`values update` までやりたい | **本スキル**（**gws-params-encoding** で `--params` / `--json`） |
| **Next.js / npm スクリプト / 本番**がシートに書く | **sheet-api-update**（Sheets API。**app-code-apis-not-cli**） |
| **値だけ**ローカルに取り出す | **gws-sheets-to-local** |

**書式・プルダウン・列幅の一括変更**は gws では扱わない。必要なら **sheet-api-update** の `batchUpdate`。

## 関連スキル（gws スイート）

| スキル | 役割 |
|--------|------|
| **gws-params-encoding** | `--params` / `--json` を壊さず渡す（**必読**） |
| **gws-sheets-to-local** | values **読取**のみ → ローカル JSON / CSV |
| **gws-sheets-manage**（本スキル） | 新規・メタ・構造・**gws 経由の** values 更新 |
| **gws-drive** | ファイル ID・共有ドライブ補助 |
| **sheet-api-update** | **アプリからの** Sheets API 書き込み |

## スコープ

- **含む**: スプレッドシート新規作成、get（シート一覧・gid・gridProperties）、構造把握、**gws の** `values update`。
- **含まない**: 条件付き書式・マクロ、**本番アプリに埋め込む**書き込み（→ **sheet-api-update**）。

## いつ本スキルを使うか

- 「gws でスプレッドシートを新規作成して」
- 「シート一覧・gid・構造を確認して」「構造を読み込んで」
- 「gws でこの範囲を更新して」（JSON/配列が渡せるとき）

## 前提

- **gws** インストール済み・認証済み（例: `gws auth login -s sheets`）。
- **`--params` / `--json`**: **gws-params-encoding** に従う。スクリプトからは**引数配列**で渡す。

## 1. 新規作成

`gws sheets spreadsheets create --json '{"properties": {"title": "タイトル"}}'`  
→ `spreadsheetId` / URL を記録。詳細は [references/create-and-get.md](references/create-and-get.md)。

## 2. 既存の確認・構造

`gws sheets spreadsheets get --params '{"spreadsheetId":"<id>"}' --format json`  
`fields` で `sheets.properties(sheetId,title,gridProperties)` 等。先頭行の確認は `values get`。日本語は **ファイル保存して UTF-8 で確認**推奨。詳細は [references/create-and-get.md](references/create-and-get.md)。

## 3. セル範囲の更新（values update）

`gws sheets spreadsheets values update --params '{"spreadsheetId":"...","range":"Sheet1!A1:Z"}' --json '[[...]]'`  
スクリプトからは引数配列・ファイル経由。詳細は [references/values-update.md](references/values-update.md)。

## エラー時

401/403: 認証・スコープ・共有。404: `spreadsheetId`。400/range: A1 とシート名。validationError: JSON 破損 → **gws-params-encoding**。Windows で gws が見つからない: `gws.cmd` のフルパス（**gws-sheets-to-local** の実行環境注記参照）。

## Troubleshooting

### エラー: gws が見つからない

PATH または npm の `gws.cmd` 絶対パス。

### エラー: --params の JSON が壊れる

**gws-params-encoding** を Read する。

### エラー: 「アプリから安定して書きたい」

**対処**: **sheet-api-update** に切り替える（本スキルは CLI 向け）。

## 参照

- 読取のみ: **gws-sheets-to-local**
- API 書き込み: **sheet-api-update**
- パラメータ渡し: **gws-params-encoding**
