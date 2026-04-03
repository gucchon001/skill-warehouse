---
name: gws-sheets
description: "gws（@googleworkspace/cli）でスプレッドシートを扱う統合スキル。読取: values get → ローカル JSON/CSV。作成・メタ・構造・values update。PowerShell の --params 破損・UTF-8 文字化けは references/gws-sheets-values-get.md。Triggers: スプレッドシート読み込み, gws シート取得, validationError, PowerShell, 文字化け, gid, values update."
metadata:
  last_verified: "2026-04-03"
---

# gws でスプレッドシートを扱う（読取・作成・メタ・CLI 更新）

**CLI**: [googleworkspace/cli](https://github.com/googleworkspace/cli)（`gws sheets …` / ヘルパー `gws sheets +append` 等）。インストール・認証・`GOOGLE_WORKSPACE_CLI_*` は **gws-params-encoding** の [references/official-googleworkspace-cli.md](../gws-params-encoding/references/official-googleworkspace-cli.md)。

## 早見（どの手順を読むか）


| やりたいこと                                                                | 読む節                                              |
| --------------------------------------------------------------------- | ------------------------------------------------ |
| 指定範囲の**セル値**をローカルに JSON / CSV で保存する                                   | **§ A. 読取・ローカル出力**                               |
| **新規**ブック作成、**シート一覧・gid・gridProperties**、構造確認、**values update** で書き込む | **§ B. 新規・メタ・構造・更新**                             |
| **Next.js / 本番 / npm スクリプト**が安定してシートに書く                               | **sheet-api-update**（**app-code-apis-not-cli**）  |
| **書式・プルダウン・列幅**の一括変更                                                  | **sheet-api-update** の `batchUpdate`（gws では扱わない） |


## sheet-api とどちらを使うか


| 場面                                                      | 使うスキル                                                     |
| ------------------------------------------------------- | --------------------------------------------------------- |
| **gws** で作成・一覧・読取・`values update` までやりたい（CLI・エージェント・手動） | **本スキル**（**gws-params-encoding** で `--params` / `--json`） |
| **本番アプリ**がシートに書く                                        | **sheet-api-update**                                      |
| 値の**読み取りだけ**が必要で API を使わない                              | **本スキル § A**                                              |


## 関連スキル（gws スイート）


| スキル                     | 役割                                   |
| ----------------------- | ------------------------------------ |
| **gws-params-encoding** | `--params` / `--json` を壊さず渡す（**必読**） |
| **gws-sheets**（本スキル）    | 読取・新規・メタ・構造・**gws 経由の** values 更新    |
| **gws-drive**           | ファイル ID・共有ドライブ補助                     |
| **gws-docs-to-local**   | Docs 読取                              |
| **sheet-api-update**    | **アプリからの** Sheets API 書き込み           |


---

## A. 読取・ローカル出力

`gws sheets spreadsheets values get` で指定範囲の値を取得し、ローカルに **JSON**（および必要なら **CSV**）で保存する。文字化けを防ぐため、**取得〜保存は UTF-8 で一貫**させる。

### スコープ（§ A）

- **対象**: スプレッドシートの**読取**（指定範囲の values）とローカル**出力**。
- **対象外**: ブック新規作成・セル更新は § B または **sheet-api-update**。

### いつ § A を使うか

- 「スプレッドシートを読み込んで」「gws でシートのデータを取得して」
- シートの内容を JSON / CSV で手元に置きたいとき

### 前提（§ A）

- **gws** が PATH にあること。**スクリプトから**: Windows で見つからないときは `%APPDATA%\npm\gws.cmd` のフルパス。→ [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md)「実行環境の注意」。
- **認証**: `gws auth login -s sheets` 済み。
- **Spreadsheet ID**・**range**（例: `Sheet1!A1:Z1000`）が分かっていること。

### 手順（§ A）

1. Spreadsheet ID を URL から確定（`/d/` と `/edit` の間）。
2. **Bash / zsh**: `gws sheets spreadsheets values get --params '{"spreadsheetId": "<id>", "range": "<SheetName>!A1:Z"}' --format json`
3. **Windows PowerShell**: 上記の1行 JSON を**そのまま貼らない**（`validationError` になりやすい）。`ConvertTo-Json` または Node/Python の**引数配列**で `--params` を渡す。→ [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md)「Windows PowerShell」。
4. **stdout は UTF-8 のままファイルへ**（子プロセスで `encoding: utf8` を指定して保存）。PowerShell の **`$out = gws ...` → `WriteAllText` だけでは日本語が化けることがある**。→ 同ファイル「UTF-8 で保存する」。

詳細・CSV 化・エラー: [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md)。引数配列の検証: [references/params-test-30-patterns.md](references/params-test-30-patterns.md)。

### 文字化け防止（§ A）

[references/gws-sheets-values-get.md](references/gws-sheets-values-get.md) の「文字化けの原因と対策」に従う。

---

## B. 新規・メタ・構造・更新

**守備範囲**: `gws sheets spreadsheets …` による **新規作成**、**get**（シート一覧・gid）、**構造把握**、**values update**。**OAuth 済み gws**・ワンショット・手動運用向け。

### スコープ（§ B）

- **含む**: `create`、`get`、構造把握、`values update`。
- **含まない**: 条件付き書式・マクロ、**本番アプリに埋め込む**書き込み（→ **sheet-api-update**）。

### いつ § B を使うか

- 「gws でスプレッドシートを新規作成して」
- 「シート一覧・gid・構造を確認して」
- 「gws でこの範囲を更新して」（JSON / 二次元配列が渡せるとき）

### 前提（§ B）

- **gws** インストール済み・認証済み（`gws auth login -s sheets`）。
- `--params` / `--json` の渡し方: **gws-params-encoding**（[node-resolve-gws.md](../gws-params-encoding/references/node-resolve-gws.md)）。

### 1. 新規作成

`gws sheets spreadsheets create --json '{"properties": {"title": "タイトル"}}'`  
→ `spreadsheetId` / URL を記録。詳細: [references/create-and-get.md](references/create-and-get.md)

### 2. 既存の確認・構造

- **Bash**: `gws sheets spreadsheets get --params '{"spreadsheetId":"<id>"}' --format json`
- **PowerShell**: `$p = @{ spreadsheetId = '<id>' } | ConvertTo-Json -Compress` → `gws sheets spreadsheets get --params $p --format json`

詳細・gid: [references/create-and-get.md](references/create-and-get.md)。

### 3. セル範囲の更新（values update）

`gws sheets spreadsheets values update --params '{"spreadsheetId":"...","range":"Sheet1!A1:Z"}' --json '[[...]]'`  
詳細: [references/values-update.md](references/values-update.md)。エラー（401/403/404/validationError）→ 下記 Troubleshooting。

---

## Troubleshooting

### エラー: validationError / unexpected argument

**原因**: PowerShell や cmd で `--params` に手動エスケープした JSON を渡し `\` や `"` が壊れている。

**対処**: `@{ spreadsheetId = '…' } | ConvertTo-Json -Compress` で渡すか、引数配列（Node）を使う。詳細: **gws-params-encoding** / [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md)「Windows PowerShell」。

### エラー: 日本語がファイル保存後に文字化け

**原因**: PowerShell のリダイレクト・`Out-File` が ANSI 系で書き出す。

**対処**: Node/Python で `encoding: 'utf8'` を明示して `writeFileSync` / `write_text`。PowerShell の `$out = gws …` + `WriteAllText` のみでは化ける場合がある。詳細: [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md)「UTF-8 で保存する」。

### エラー: gws が見つからない（ENOENT）

**原因**: Node から `spawn('gws', …)` するとき PATH に `gws.cmd` が無い。

**対処**: `%APPDATA%\npm\gws.cmd` のフルパスを指定、または `run-gws.js` を `process.execPath` で起動。詳細: [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md)「実行環境の注意」。

---

## 参照

- 公式 CLI: [gws-params-encoding / official-googleworkspace-cli.md](../gws-params-encoding/references/official-googleworkspace-cli.md)
- 読取詳細: [references/gws-sheets-values-get.md](references/gws-sheets-values-get.md)
- 新規・get: [references/create-and-get.md](references/create-and-get.md)
- values update: [references/values-update.md](references/values-update.md)
- API 書き込み: **sheet-api-update**
- パラメータ渡し: **gws-params-encoding**

## 出力例（§ A）

- 例: `data/シート名_2026-03-17.json` や同 base の `.csv`
- Docs 連携の例: `docs/...json` と同 base の `.md` は **gws-docs-to-local**

