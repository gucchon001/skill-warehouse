# よくある要望 → 設定キー

| ユーザーの言い方 | キー（例） |
|------------------|------------|
| フォント大きく／小さく | `editor.fontSize` |
| タブ幅 | `editor.tabSize` |
| 保存時フォーマット | `editor.formatOnSave` |
| 折り返し | `editor.wordWrap` |
| テーマ | `workbench.colorTheme` |
| ミニマップ非表示 | `editor.minimap.enabled` |
| 自動保存 | `files.autoSave` |
| 行番号 | `editor.lineNumbers` |
| ブラケット色 | `editor.bracketPairColorization.enabled` |
| カーソル形 | `editor.cursorStyle` |
| スムーススクロール | `editor.smoothScrolling` |

## 名前空間の目安

- **エディタ**: `editor.*`
- **ワークベンチ**: `workbench.colorTheme`, `workbench.iconTheme`, `workbench.sideBar.location`
- **ファイル**: `files.autoSave`, `files.exclude`, `files.associations`
- **ターミナル**: `terminal.integrated.*`
- **Cursor 固有**: `cursor.*`, `aipopup.*` など（公式ドキュメント・設定 UI と併用）

完全一致しない場合は設定 UI の検索語をユーザーに案内する。
