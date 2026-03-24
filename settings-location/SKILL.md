---
name: settings-location
description: Path to Cursor/VSCode settings.json per OS. Use when locating or opening the user settings file.
---
# Settings File Location

| OS | Path |
|----|------|
| macOS | ~/Library/Application Support/Cursor/User/settings.json |
| Linux | ~/.config/Cursor/User/settings.json |
| Windows | %APPDATA%\Cursor\User\settings.json |

User settings apply globally. Workspace settings live in `.vscode/settings.json` and apply only to the current project.

## Troubleshooting

### エラー: settings.json が見つからない

**原因**: OS 違い・Cursor と VS Code の取り違え・環境変数未展開。

**対処**: 本文の OS 別パスを確認。Windows は `%APPDATA%\Cursor\User\settings.json` をエクスプローラーのアドレスバーに貼り付けて開く。

### エラー: JSON を保存すると構文エラーになる

**原因**: カンマ抜け・引用符の閉じ忘れ・末尾カンマ（厳密な JSON では不可）。

**対処**: バックアップを取り、JSON 検証ツールで修正箇所を特定する。

