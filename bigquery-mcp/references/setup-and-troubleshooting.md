# BigQuery MCP 設定ガイドと動かない時の対処

公式: [MCP を使用して LLM を BigQuery に接続する](https://docs.cloud.google.com/bigquery/docs/pre-built-tools-with-mcp-toolbox?hl=ja)

## 共通: ツールボックスのダウンロード

- [genai-toolbox Releases](https://github.com/googleapis/genai-toolbox/releases) で **V0.7.0 以降**を取得。
- OS/アーキテクチャに合わせた URL 例:
  - Windows amd64: `https://storage.googleapis.com/genai-toolbox/VERSION/windows/amd64/toolbox`
  - macOS arm64: `https://storage.googleapis.com/genai-toolbox/VERSION/darwin/arm64/toolbox`
  - macOS amd64: `https://storage.googleapis.com/genai-toolbox/VERSION/darwin/amd64/toolbox`
  - Linux amd64: `https://storage.googleapis.com/genai-toolbox/VERSION/linux/amd64/toolbox`
- Windows では `toolbox.exe` として保存するか、パスを通したフォルダに配置する。Unix では `chmod +x toolbox` を実行する。

---

## クライアント別設定

### Cursor

- **設定ファイル**: プロジェクトルートの `.cursor/mcp.json`
- **ディレクトリ**: 存在しなければ `.cursor` を作成してから `mcp.json` を作成
- **JSON のキー**: `mcpServers`

```json
{
  "mcpServers": {
    "bigquery": {
      "command": "C:\\path\\to\\toolbox.exe",
      "args": ["--prebuilt", "bigquery", "--stdio"],
      "env": {
        "BIGQUERY_PROJECT": "your-project-id"
      }
    }
  }
}
```

- **確認**: [Settings] > [Cursor Settings] > [MCP] で bigquery が緑のアクティブになること。

### Claude Desktop

- **設定ファイル**: [Settings] > [Developer] > [Edit Config] で開く設定ファイル
- **JSON のキー**: `mcpServers`（上記と同じブロックを追加）
- **確認**: 再起動後、チャットに MCP アイコンが表示されること。

### Cline（VS Code 拡張）

- **設定**: 拡張の [MCP Servers] アイコン > [Configure MCP Servers]
- **JSON のキー**: `mcpServers`
- **確認**: サーバーが緑のアクティブステータスになること。

### Visual Studio Code（Copilot）

- **設定ファイル**: プロジェクトルートの `.vscode/mcp.json`
- **JSON のキー**: `servers`（`mcpServers` ではない）

```json
{
  "servers": {
    "bigquery": {
      "command": "C:\\path\\to\\toolbox.exe",
      "args": ["--prebuilt", "bigquery", "--stdio"],
      "env": {
        "BIGQUERY_PROJECT": "your-project-id"
      }
    }
  }
}
```

- **確認**: VS Code ウィンドウの再読み込み後、MCP 互換拡張がサーバーを検出すること。

### Windsurf

- **設定**: Cascade アシスタント > MCP アイコン > [Configure]
- **JSON のキー**: `mcpServers`（Cursor と同じ形式）

### Claude Code

- **設定ファイル**: プロジェクトルートの `.mcp.json`
- **JSON のキー**: `mcpServers`
- **確認**: Claude Code 再起動後、ツールで MCP サーバーが検出されること。

---

## 動かない時の設定ガイド（チェックリスト）

### 1. サーバーが起動しない・接続できない

| 確認項目 | 対処 |
|----------|------|
| **command のパス** | 絶対パスで指定する。相対パスや `./toolbox` は避ける。 |
| **Windows のパス** | バックスラッシュは `\\` にエスケープ。例: `"C:\\Users\\me\\toolbox.exe"` |
| **実行権限** | Unix: `chmod +x toolbox`。Windows: そのパスでターミナルから `toolbox --version` が動くか確認。 |
| **設定ファイルの場所** | Cursor は「ワークスペースのルート」の `.cursor/mcp.json`。マルチルートの場合は開いているフォルダのルートを確認。 |
| **JSON の文法** | 余計なカンマ・欠けた括弧がないか確認。コメントは JSON では使えない。 |
| **キー名** | VS Code Copilot は `servers`、それ以外は `mcpServers`。 |

### 2. 接続はするがツールが使えない・エラーになる

| 確認項目 | 対処 |
|----------|------|
| **BIGQUERY_PROJECT** | プロジェクト **ID** を指定する（プロジェクト番号ではない）。`gcloud config get-value project` で確認。 |
| **BigQuery API** | [API を有効化](https://console.cloud.google.com/flows/enableapi?apiid=bigquery.googleapis.com&hl=ja) しているか。 |
| **課金** | プロジェクトで課金が有効か。 |
| **ADC（ローカル）** | `gcloud auth application-default login` を実行し、同じユーザーで IDE を起動しているか。 |
| **サービスアカウント** | キー JSON を指定する場合、mcp の `env` に `GOOGLE_APPLICATION_CREDENTIALS` を追加する。例: `"GOOGLE_APPLICATION_CREDENTIALS": "C:\\path\\to\\sa-key.json"` |

### 3. 権限エラー（403 / Permission denied）

| 確認項目 | 対処 |
|----------|------|
| **ロール** | プロジェクトまたはデータセットに `roles/bigquery.user` または `roles/bigquery.dataViewer` があるか。ジョブ実行には `roles/bigquery.jobUser` も必要。 |
| **データセットのロケーション** | クエリ先データセットのロケーションと、ジョブを実行するプロジェクトのロケーションが一致しているか。 |

### 4. その他

| 現象 | 対処 |
|------|------|
| **MCP が古いバージョン** | ツールボックス V0.7.0 以降を使う。 |
| **Cursor で設定を変えたのに反映されない** | Cursor を再起動するか、MCP 設定画面でサーバーをオフ/オンして再接続。 |
| **ファイアウォール・プロキシ** | ツールボックスは stdio で動作するため通常は不要だが、ADC でネットワークアクセスが必要。プロキシ環境では `HTTP_PROXY` 等を `env` に追加する場合あり。 |

---

## 参照リンク

- [BigQuery MCP 公式ガイド（日本語）](https://docs.cloud.google.com/bigquery/docs/pre-built-tools-with-mcp-toolbox?hl=ja)
- [genai-toolbox GitHub](https://github.com/googleapis/genai-toolbox)
- [ADC の設定（ローカル）](https://docs.cloud.google.com/docs/authentication/set-up-adc-local-dev-environment?hl=ja)
- [BigQuery のアクセス制御](https://docs.cloud.google.com/bigquery/docs/access-control?hl=ja)
