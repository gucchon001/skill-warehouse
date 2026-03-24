# MCP 登録（stdio）— notebooklm-mcp-cli

ホストごとの **設定ファイルの場所・UI** は製品ドキュメントを正とする。

- **Cursor を使う場合:** [host-cursor.md](host-cursor.md)

以下は **notebooklm-mcp-cli** を stdio で載せるときの **ホスト非依存**の推奨パターンである。

## 推奨オプション（Windows 例）

| 項目 | 理由 |
|------|------|
| `command` = `notebooklm-mcp.exe` の**フルパス** | 子プロセスで `python` / `py` が PATH に無いことがある |
| `args`: `--transport`, `stdio` | stdio トランスポート |
| `PYTHONUTF8=1` と `PYTHONIOENCODING=utf-8` | 日本語環境（cp932）での不具合を減らす |

## JSON 例

`command` のユーザー名・Python 版は環境に合わせて置換する。

```json
{
  "mcpServers": {
    "notebooklm-mcp": {
      "command": "C:\\Users\\<ユーザー>\\AppData\\Roaming\\Python\\Python313\\Scripts\\notebooklm-mcp.exe",
      "args": ["--transport", "stdio"],
      "env": {
        "PYTHONUTF8": "1",
        "PYTHONIOENCODING": "utf-8"
      }
    }
  }
}
```

## 二重登録

**ユーザー全体**と**ワークスペース**の両方に同じサーバー定義を書くと、ホストによって **同じ MCP が 2 本**見える。**どちらか一方**にまとめる。Cursor でのパス例は [host-cursor.md](host-cursor.md)。

## CLI による自動登録

`nlm setup add …` のようなサブコマンドは [公式 README](https://github.com/jacob-bd/notebooklm-mcp-cli) を参照（ホスト名は README の更新に従う）。

## スキーマの正本

接続後、ホストが提示する **各ツールの JSON スキーマ** を **source of truth** とする。
