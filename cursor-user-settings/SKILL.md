---
name: cursor-user-settings
description: "Locate, read, and safely edit Cursor or VS Code user settings.json (and workspace .vscode/settings.json when needed). Maps plain-language requests to keys. Triggers: change font, tab size, format on save, theme, word wrap, minimap, settings.json path, エディタ設定, Cursor 設定, VSCode 設定."
metadata:
  last_verified: "2026-03-29"
---

# cursor-user-settings

## Purpose

**ユーザー** `settings.json` を、既存設定と JSONC コメントを壊さずに更新する。ワークスペース単位の変更は `.vscode/settings.json` を対象にする。

## Execute

1. **パス**: `references/paths.md` で OS・Cursor/VS Code を確定し、ファイルを `Read` する。
2. **キー**: 依頼を `references/common-keys.md` に照合し、必要なら設定 UI 検索語を補助する。
3. **編集**: `references/safe-edit.md` に従い、最小差分で `StrReplace` または全体 `Write`（コメント保持）。
4. **仕上げ**: リロード・再起動が要る設定ならユーザーに伝える。

## Troubleshooting

### エラー: settings.json が見つからない

**原因**: OS 違い、Cursor と VS Code の取り違え、パス誤り。

**対処**: `references/paths.md` を再確認。Windows は `%APPDATA%\Cursor\User\settings.json` をアドレスバーに貼付。

### エラー: JSON 構文エラー

**原因**: カンマ・引用符・末尾カンマ、JSONC の取り扱いミス。

**対処**: `references/safe-edit.md` の Troubleshooting。

詳細は `references/` 各ファイル。
