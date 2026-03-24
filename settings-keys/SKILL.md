---
name: settings-keys
description: Mapping from common user requests to Cursor/VSCode settings.json keys. Use when translating "change font" or "format on save" into concrete keys.
---
# Common Request → Setting

| User request | Setting |
|--------------|---------|
| Bigger/smaller font | `editor.fontSize` |
| Tab size | `editor.tabSize` |
| Format on save | `editor.formatOnSave` |
| Word wrap | `editor.wordWrap` |
| Theme | `workbench.colorTheme` |
| Hide minimap | `editor.minimap.enabled` |
| Auto save | `files.autoSave` |
| Line numbers | `editor.lineNumbers` |
| Bracket matching | `editor.bracketPairColorization.enabled` |
| Cursor style | `editor.cursorStyle` |
| Smooth scrolling | `editor.smoothScrolling` |

Editor: `editor.*`. Workbench: `workbench.colorTheme`, `workbench.iconTheme`, `workbench.sideBar.location`. Files: `files.autoSave`, `files.exclude`, `files.associations`. Terminal: `terminal.integrated.*`. Cursor-specific: `cursor.*`, `aipopup.*`.

## Troubleshooting

### エラー: settings.json が見つからない

**原因**: OS 違い・Cursor と VS Code の取り違え・環境変数未展開。

**対処**: 本文の OS 別パスを確認。Windows は `%APPDATA%\Cursor\User\settings.json` をエクスプローラーのアドレスバーに貼り付けて開く。

### エラー: JSON を保存すると構文エラーになる

**原因**: カンマ抜け・引用符の閉じ忘れ・末尾カンマ（厳密な JSON では不可）。

**対処**: バックアップを取り、JSON 検証ツールで修正箇所を特定する。

