---
name: gws-drive
description: "gws（Google Workspace CLI）で Google Drive（マイドライブ＋共有ドライブ）に接続し、フォルダ・ファイルの一覧取得・検索・メタデータ取得・アップロード・エクスポートなどの操作を行う。トリガーは「gws で Drive に接続して」「Drive のフォルダ一覧を出して」「共有ドライブの一覧」「共有ドライブ内のファイルを見たい」など。"
metadata:
  last_verified: "2026-03-19"
---

# gws で Google Drive にアクセス・操作する

gws の `drive` コマンドで Google Drive API（v3）を呼び出し、マイドライブと共有ドライブの両方でファイル・フォルダの一覧、検索、メタデータ取得、アップロード、エクスポートなどを行う。

## 関連スキル（gws スイート）

| スキル | 役割 |
|--------|------|
| **gws-params-encoding** | 共通基盤。`--params` / `--json` をシェル・Node から壊さず渡す |
| **gws-drive**（本スキル） | Drive 一覧・共有ドライブ・検索・アップロード・エクスポート |
| **gws-docs-to-local** | Google Docs 読取 → ローカル JSON / Markdown |
| **gws-sheets-to-local** | スプレッドシート values 読取 → ローカル JSON / CSV |
| **gws-sheets-manage** | シート新規・メタ取得・values 更新（gws 経由） |

Sheets を **API（Node 等）で書く**手順は **sheet-api-update**。Drive / Sheets で JSON が壊れるときは **gws-params-encoding** を先に Read。

## いつこのスキルを使うか

- 「gws で Google Drive に接続して」「Drive のフォルダ一覧を出して」と言われたとき
- 指定フォルダ内のファイル一覧を取得したいとき
- **共有ドライブの一覧取得**や**共有ドライブ内のファイル操作**をしたいとき
- Drive にファイルをアップロード・フォルダを作成したいとき
- ファイルのメタデータ取得やエクスポート（PDF/CSV 等）を行いたいとき

## 前提

- **gws** がインストールされ、PATH にあること。
- **認証済み**であること。未ログインなら `gws auth login -s drive`（または必要なスコープ）を実行する。
- **フォルダ ID**: URL `https://drive.google.com/.../folders/XXXX` の `XXXX` がフォルダ ID。ファイル一覧の `q` で `'XXXX' in parents` のように指定する。
- **共有ドライブ ID**: URL `https://drive.google.com/drive/folders/XXXX` の `XXXX`、または `gws drive drives list` で取得する。

## 手順の基本

### 1. 指定フォルダ内のファイル・サブフォルダを一覧する（マイドライブ）

- コマンド: `gws drive files list` に `--params` で `q`, `pageSize`, `orderBy` などを渡す。
- フォルダ直下のみ: `q` に `'<FOLDER_ID>' in parents` を指定する。
- **Windows（PowerShell）で `--params` の JSON が壊れる場合**: **gws-params-encoding** に従う。推奨は「JSON を一時ファイルに書き、`Get-Content -Raw` で読み、変数で `--params` に渡す」こと。

```json
{"q": "'<FOLDER_ID>' in parents", "pageSize": 20, "orderBy": "name"}
```

### 2. 共有ドライブを操作する

#### 共有ドライブ一覧の取得

```
gws drive drives list --format table
```

#### 特定の共有ドライブ内のファイルを一覧する

`files list` に共有ドライブ用パラメータ3つを**必ずセットで**渡す:

| パラメータ | 値 | 役割 |
|---|---|---|
| `supportsAllDrives` | `true` | 共有ドライブ対応を宣言 |
| `includeItemsFromAllDrives` | `true` | 共有ドライブのアイテムを結果に含める |
| `corpora` | `"drive"` | 検索対象を指定共有ドライブに限定 |
| `driveId` | `"<DRIVE_ID>"` | 対象の共有ドライブ ID |

```json
{"supportsAllDrives": true, "includeItemsFromAllDrives": true, "corpora": "drive", "driveId": "<DRIVE_ID>", "pageSize": 20}
```

#### 共有ドライブ内の特定フォルダ配下を一覧する

`q` に `in parents` を追加し、共有ドライブ用パラメータも併用する:

```json
{"supportsAllDrives": true, "includeItemsFromAllDrives": true, "corpora": "drive", "driveId": "<DRIVE_ID>", "q": "'<FOLDER_ID>' in parents", "pageSize": 20}
```

#### マイドライブと全共有ドライブを横断検索する

`corpora` を `"allDrives"` にし、`driveId` は不要:

```json
{"supportsAllDrives": true, "includeItemsFromAllDrives": true, "corpora": "allDrives", "q": "name contains 'report'"}
```

### 3. ファイルのメタデータを取得する

- マイドライブ: `--params '{"fileId": "FILE_ID"}'`
- 共有ドライブ: `--params '{"fileId": "FILE_ID", "supportsAllDrives": true}'`

### 4. アップロード・フォルダ作成

- ファイルアップロード: `gws drive +upload ./local.pdf` または `gws drive files create --json '{"name": "report.pdf", "parents": ["FOLDER_ID"]}' --upload ./report.pdf`
- 共有ドライブへのアップロード: `--params '{"supportsAllDrives": true}'` を追加する。
- フォルダ作成: `gws drive files create --json '{"name": "Projects", "mimeType": "application/vnd.google-apps.folder"}'`

### 5. エクスポート（Docs/Sheets 等を PDF/CSV に）

- `gws drive files export --params '{"fileId": "FILE_ID", "mimeType": "application/pdf"}' -o document.pdf`

### 6. 検索クエリ（q）の例

- 名前で検索: `{"q": "name contains 'report'"}`
- 共有済み: `{"q": "sharedWithMe"}`
- 更新日で絞り: `{"q": "modifiedTime > '2026-01-01T00:00:00'"}`
- 複合: `{"q": "name contains 'budget' and mimeType = 'application/pdf'"}`

## 検証

スキルの動作を検証するテストスクリプトが `references/` にある。skill-growing でスキルを更新した際は必ず実行する。

| テスト | コマンド | 内容 |
|--------|---------|------|
| ドライラン単体テスト | `powershell -File references/test-dryrun.ps1` | `--dry-run` でリクエスト構造を検証（API 非呼び出し・8件） |
| システムテスト | `powershell -File references/test-system.ps1` | 実 API で読み取り専用レスポンス構造を検証（5件） |

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

- コマンド一覧・クエリ・権限・エクスポート形式: [references/drive-commands.md](references/drive-commands.md)
- `--params` の安定した渡し方（ターミナル・Node）: **gws-params-encoding** スキルを参照する。
