# Cursor 固有の MCP 設定（NotebookLM）

**Cursor の UI・パスはアップデートで変わることがある。** 最新は Cursor 公式ドキュメントを正とする。ここは **2026 年前後の一般的なパターン**のメモ。

## 設定ファイルの場所

| 種別 | パス（Windows 例） |
|------|---------------------|
| **ユーザー全体** | `%USERPROFILE%\.cursor\mcp.json` |
| **ワークスペース（プロジェクト）** | `<リポジトリルート>\.cursor\mcp.json` |

両方に同じ `notebooklm-mcp` ブロックを書くと、**同じサーバーが 2 本**表示されることがある。**どちらか一方**にだけ定義するのが安全（多くはユーザー全体のみ）。

## 反映

- `mcp.json` を保存したあと **Cursor の再起動** または MCP の **再接続** が必要なことが多い。
- 接続状態・ログは **Cursor の MCP / 出力パネル**（表記はバージョン依存）で確認する。

## ツール一覧での表示名

設定キーが `notebooklm-mcp` でも、UI やエージェント側では **`user-notebooklm-mcp`** のように **プレフィックス付き**で見えることがある。中身は同じ stdio サーバーでよい。

## CLI からの自動登録

notebooklm-mcp-cli が提供する場合:

```text
nlm setup add cursor
```

詳細は [notebooklm-mcp-cli README](https://github.com/jacob-bd/notebooklm-mcp-cli) に従う。

## 汎用の JSON 断片

stdio の `command` / `args` / `env` の具体例は [mcp-config.md](mcp-config.md) を参照（Cursor 専用ではない）。
