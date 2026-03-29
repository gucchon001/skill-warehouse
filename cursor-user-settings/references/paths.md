# settings.json の場所

## ユーザー設定（グローバル）

| OS | Cursor |
|----|--------|
| Windows | `%APPDATA%\Cursor\User\settings.json` |
| macOS | `~/Library/Application Support/Cursor/User/settings.json` |
| Linux | `~/.config/Cursor/User/settings.json` |

**VS Code** を触る場合は `Cursor` を `Code` に読み替える（例: Windows `%APPDATA%\Code\User\settings.json`）。

## ワークスペース

- リポジトリ直下の `.vscode/settings.json`（当該プロジェクトのみ）。

## 補足

- Windows でパスを開く: エクスプローラーのアドレスバーに `%APPDATA%\Cursor\User` を貼り付け。
- 環境変数が展開されないシェルでは、ユーザーに上記をそのまま貼るよう案内する。

## Troubleshooting（パス）

### settings.json が見つからない

**原因**: OS 取り違え、Cursor と VS Code の取り違え、初回起動で `User` フォルダ未作成。

**対処**: 上表の OS を再確認。無ければ Cursor を一度起動してから再試行。
