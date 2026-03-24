---
name: gws-sheets-to-local
description: gws で Google スプレッドシートを読み込み、指定範囲の値をローカルに JSON または CSV で出力する。--params は引数配列で渡す（30パターン検証済み）。「スプレッドシートを読み込んで」「gws でシート取得」で発動。
last_verified: 2026-03-19
---

# gws でスプレッドシートを読む（読取・ローカル出力）

gws の `sheets spreadsheets values get` で指定した範囲の値を取得し、ローカルに **JSON**（および必要なら **CSV**）で保存する。文字化けを防ぐため、**取得〜保存は UTF-8 で一貫**させる。

## 関連スキル（gws スイート）

| スキル | 役割 |
|--------|------|
| **gws-params-encoding** | 共通基盤。`--params` を壊さず渡す（本スキルは検証パターン多数） |
| **gws-sheets-to-local**（本スキル） | values **読取** → ローカル JSON / CSV |
| **gws-sheets-manage** | 新規作成・メタ取得・values **更新** |
| **gws-drive** | Drive 上のファイル操作 |
| **gws-docs-to-local** | Docs 読取 |

**API での Sheets 更新**は **sheet-api-update**。

## スコープ

- **対象**: スプレッドシートの**読取**（指定範囲の values）と、ローカルへの**出力**（JSON / CSV）。
- **対象外**: スプレッドシートの作成・更新・書式変更は本スキルでは扱わない。書き込みは **sheet-api-update** 等を参照する。

## いつこのスキルを使うか

- 「スプレッドシートを読み込んで」「gws でシートのデータを取得して」と言われたとき
- シートの内容を JSON や CSV で手元に置きたいとき
- 指定範囲をローカルに保存したいとき

## 前提

- **gws** がインストールされ、PATH にあること。**スクリプトから呼ぶ場合**: Windows で `gws` が見つからないときは `%APPDATA%\npm\gws.cmd` のフルパスを使う。詳細は [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md) の「実行環境の注意」。
- **認証済み**であること。未ログインなら `gws auth login -s sheets` を実行する。
- **Spreadsheet ID** が分かること。URL の `/d/` と `/edit` の間の文字列。詳細は [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md)。
- 読みたい **範囲**（A1 表記、例: `Sheet1!A1:Z1000`）が決まっていること。

## 手順（エージェントが行うこと）

1. **Spreadsheet ID を確定する**
   - ユーザーが URL または ID を指定していればそれを使う。
   - URL の場合は `/d/` の直後から、次の `/` または `?` の手前までを Spreadsheet ID とする。
   - 例: `https://docs.google.com/spreadsheets/d/1abc...xyz/edit` → ID は `1abc...xyz`

2. **範囲（range）を決める**
   - シート名とセル範囲を A1 表記で指定する。例: `Sheet1!A1:Z1000`。全シート・全範囲を一度に取ることはできないため、必要なシート名と範囲をユーザー指定または慣例で決める。詳細は [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md)。

3. **gws で値を取得する**
   - コマンド: `gws sheets spreadsheets values get --params '{"spreadsheetId": "<id>", "range": "<SheetName>!A1:Z"}' --format json`
   - **出力は必ず UTF-8 で受け取る。** ターミナルに直接パイプして保存すると文字化けするため、**スクリプト（Python/Node）から gws を呼び、`encoding="utf-8"` で標準出力を読み、UTF-8 でファイルに書く。**
   - スクリプトから `--params` を渡すときは **gws-params-encoding** に従い、引数配列で渡してシェルで JSON を壊さないようにする。

4. **ローカルに出力する**
   - **JSON**: 取得した JSON をそのまま UTF-8 でファイルに保存する。出力先はユーザー指定またはプロジェクトの `data/` や `docs/` など。
   - **CSV**（任意）: レスポンスの `values` 配列を行ごとに CSV 化して保存する。詳細は [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md)。

## 文字化け防止（必須）

PowerShell の `Out-File` や `> file` で gws の出力を保存しない。**スクリプトから gws を呼び、stdout をバイト列で受け取り UTF-8 デコードしてから UTF-8 でファイルに書く。** 出力を print すると Windows コンソールで日本語が化けることがあるので、検証はファイル内容で行う。具体例・Windows の gws.cmd パスは [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md)。

## エラー時

401 / 403 / 404 / validationError の対処は [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md) の「エラーと対処」を参照。`--params` は camelCase。**スクリプトからは必ず引数配列で渡す**（gws-params-encoding）。シェル経由だと range 内の `"` `\` 日本語 絵文字などで壊れる。

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

## 出力例・参照

- 例: `data/シート名_2026-03-17.json` や同 base の `.csv`
- 詳細: [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md)（コマンド・Spreadsheet ID・range・文字化け・エラー）
- 問題になりやすい30パターンと検証: [references/params-test-30-patterns.md](references/params-test-30-patterns.md)（引数配列で全パターン通過済み）
