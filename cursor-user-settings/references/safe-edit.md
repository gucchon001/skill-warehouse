# 安全な編集手順

1. **Read** 現在の `settings.json`（パスは `paths.md`）。
2. **Preserve** 既存キーは維持し、依頼されたキーだけ追加または上書きする。
3. **Validate** 書き込み前に構文を確認する。VS Code / Cursor は **JSON with Comments**（`//`, `/* */`）を許すため、**コメントを消さない**。
4. **Write** インデントは既存に合わせる（多くは 2 スペース）。

## リロード

変更によってはウィンドウの再読み込みや Cursor の再起動が必要。該当する設定キーの説明に従う。

## Agent のコミット表記（Cursor）

- **CLI エージェント**の表記は `~/.cursor/cli-config.json`。
- **IDE エージェント**は **Settings → Agent → Attribution**。`settings.json` ではない。

## Troubleshooting（JSON）

### 保存すると構文エラーになる

**原因**: カンマ抜け、引用符の閉じ忘れ、厳密 JSON では無効な末尾カンマ。

**対処**: 変更前にバックアップ。JSON（および JSONC）用の検証で行を特定。必要なら差分を最小にして再適用。

### 設定が反映されない

**原因**: ワークスペース設定がユーザー設定より優先、または拡張が上書き。

**対処**: `.vscode/settings.json` の有無を確認。競合する拡張の README を参照。
