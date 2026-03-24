# gws Drive コマンド一覧

Google Workspace CLI の Drive コマンドの代表例。詳細は [Drive Commands - Google Workspace CLI](https://googleworkspace-cli.mintlify.app/commands/drive) を参照。

## 一覧・検索（マイドライブ）

| 目的 | コマンド例 |
|------|------------|
| フォルダ直下を一覧 | `gws drive files list --params '{"q": "'\''FOLDER_ID'\'' in parents", "pageSize": 20, "orderBy": "name"}'` |
| 名前で検索 | `gws drive files list --params '{"q": "name contains '\''report'\''"}'` |
| 全件ページネーション | `gws drive files list --params '{"pageSize": 100}' --page-all` |
| 共有済み | `gws drive files list --params '{"q": "sharedWithMe"}'` |
| スター付き | `gws drive files list --params '{"q": "starred = true"}'` |
| 更新日で絞り | `gws drive files list --params '{"q": "modifiedTime > '\''2026-01-01T00:00:00'\''"}'` |

## 共有ドライブ

共有ドライブ操作では `supportsAllDrives`, `includeItemsFromAllDrives` を必ずセットで渡す。

| 目的 | コマンド例 |
|------|------------|
| 共有ドライブ一覧 | `gws drive drives list --format table` |
| 共有ドライブのメタデータ | `gws drive drives get --params '{"driveId": "DRIVE_ID"}'` |
| 共有ドライブ内を一覧 | `gws drive files list --params '{"supportsAllDrives": true, "includeItemsFromAllDrives": true, "corpora": "drive", "driveId": "DRIVE_ID", "pageSize": 20}'` |
| 共有ドライブ内フォルダ配下 | `gws drive files list --params '{"supportsAllDrives": true, "includeItemsFromAllDrives": true, "corpora": "drive", "driveId": "DRIVE_ID", "q": "'\''FOLDER_ID'\'' in parents", "pageSize": 20}'` |
| 全ドライブ横断検索 | `gws drive files list --params '{"supportsAllDrives": true, "includeItemsFromAllDrives": true, "corpora": "allDrives", "q": "name contains '\''keyword'\''"}'` |

### corpora パラメータの使い分け

| corpora | driveId | 検索範囲 |
|---------|---------|---------|
| `user` | 不要 | ユーザーがアクセスしたファイル（マイドライブ＋共有ドライブ） |
| `drive` | 必須 | 指定した共有ドライブ内の全アイテム |
| `domain` | 不要 | ドメイン内で共有されたファイル |
| `allDrives` | 不要 | マイドライブ＋所属する全共有ドライブ（非効率な場合あり） |

## メタデータ・取得

| 目的 | コマンド例 |
|------|------------|
| メタデータ取得 | `gws drive files get --params '{"fileId": "FILE_ID"}'` |

## 作成・アップロード

| 目的 | コマンド例 |
|------|------------|
| フォルダ作成 | `gws drive files create --json '{"name": "Projects", "mimeType": "application/vnd.google-apps.folder"}'` |
| ファイルアップロード（簡易） | `gws drive +upload ./report.pdf` |
| 親フォルダ指定でアップロード | `gws drive +upload ./report.pdf --parent FOLDER_ID` |
| create + バイナリ | `gws drive files create --json '{"name": "report.pdf", "parents": ["FOLDER_ID"]}' --upload ./report.pdf` |

## 更新・削除

| 目的 | コマンド例 |
|------|------------|
| 名前変更 | `gws drive files update --params '{"fileId": "FILE_ID"}' --json '{"name": "New Name.pdf"}'` |
| 移動（親変更） | `gws drive files update --params '{"fileId": "FILE_ID", "addParents": "NEW_FOLDER_ID", "removeParents": "OLD_FOLDER_ID"}'` |
| ゴミ箱へ | `gws drive files update --params '{"fileId": "FILE_ID"}' --json '{"trashed": true}'` |
| 完全削除 | `gws drive files delete --params '{"fileId": "FILE_ID"}'` |

共有ドライブ内のファイルを更新・削除する場合は `"supportsAllDrives": true` を `--params` に追加する。

## エクスポート

| 目的 | コマンド例 |
|------|------------|
| Docs → PDF | `gws drive files export --params '{"fileId": "FILE_ID", "mimeType": "application/pdf"}' -o doc.pdf` |
| Sheets → CSV | `gws drive files export --params '{"fileId": "FILE_ID", "mimeType": "text/csv"}' -o data.csv` |

## 権限

| 目的 | コマンド例 |
|------|------------|
| ユーザーに共有 | `gws drive permissions create --params '{"fileId": "FILE_ID"}' --json '{"type": "user", "role": "reader", "emailAddress": "user@example.com"}'` |
| リンクで誰でも閲覧 | `gws drive permissions create --params '{"fileId": "FILE_ID"}' --json '{"type": "anyone", "role": "reader"}'` |
| 権限一覧 | `gws drive permissions list --params '{"fileId": "FILE_ID"}'` |

共有ドライブ内のファイルの権限操作には `"supportsAllDrives": true` を `--params` に追加する。

## その他

- **コピー**: `gws drive files copy --params '{"fileId": "FILE_ID"}' --json '{"name": "Copy of Document"}'`
- **フォルダ ID の取り方**: ブラウザで Drive のフォルダを開いたときの URL の `folders/` の直後がフォルダ ID。

## Windows での --params の渡し方

PowerShell では JSON 内の `"` や `'` が解釈されて壊れやすい。次のいずれかを使う。

1. **JSON をファイルに書き、変数で渡す**
   - 例: `$p = Get-Content -Raw "params.json"; gws drive files list --params $p --format table`
2. **gws-params-encoding スキル**に従い、Node 等から引数配列で `--params` を渡す。
