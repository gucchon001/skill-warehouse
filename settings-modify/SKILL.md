---
name: settings-modify
description: How to safely read and update Cursor/VSCode settings.json (preserve existing, validate JSON). Use when adding or changing editor settings.
---
# Modifying settings.json

1. **Read** the current settings file (see settings-location).
2. **Preserve** all existing settings; only add or change what the user asked for.
3. **Validate** JSON before writing (VSCode supports JSON with comments — preserve `//` and `/* */` if present).
4. **Write** with consistent formatting (e.g. 2-space indent).

Some settings need a window reload or restart. Mention that when relevant. For major changes, note that the user can undo in the file or via git.

**Commit attribution**: For CLI agent edit `~/.cursor/cli-config.json`. For IDE agent use **Cursor Settings > Agent > Attribution**, not settings.json.

## Troubleshooting

### エラー: settings.json が見つからない

**原因**: OS 違い・Cursor と VS Code の取り違え・環境変数未展開。

**対処**: 本文の OS 別パスを確認。Windows は `%APPDATA%\Cursor\User\settings.json` をエクスプローラーのアドレスバーに貼り付けて開く。

### エラー: JSON を保存すると構文エラーになる

**原因**: カンマ抜け・引用符の閉じ忘れ・末尾カンマ（厳密な JSON では不可）。

**対処**: バックアップを取り、JSON 検証ツールで修正箇所を特定する。

