# BigQuery MCP インストール 詳細手順

## 1. toolbox バイナリのダウンロード

### バージョンの確認

[genai-toolbox Releases](https://github.com/googleapis/genai-toolbox/releases) で最新版を確認する。V0.7.0 以降が必須。

### ダウンロード URL

`VERSION` を `v0.7.0` などに置き換える。

| OS | アーキテクチャ | URL |
|----|---------------|-----|
| Windows | amd64 | `https://storage.googleapis.com/genai-toolbox/VERSION/windows/amd64/toolbox` |
| macOS | arm64 (Apple Silicon) | `https://storage.googleapis.com/genai-toolbox/VERSION/darwin/arm64/toolbox` |
| macOS | amd64 (Intel) | `https://storage.googleapis.com/genai-toolbox/VERSION/darwin/amd64/toolbox` |
| Linux | amd64 | `https://storage.googleapis.com/genai-toolbox/VERSION/linux/amd64/toolbox` |

### Windows でのダウンロードと配置

```powershell
# 配置先ディレクトリを作成（プロジェクトに置く場合）
New-Item -ItemType Directory -Force -Path ".cursor\bin"

# ダウンロード（VERSION を置き換える）
Invoke-WebRequest -Uri "https://storage.googleapis.com/genai-toolbox/VERSION/windows/amd64/toolbox" -OutFile ".cursor\bin\toolbox.exe"

# 動作確認
.\.cursor\bin\toolbox.exe --version
```

ユーザーディレクトリに置く場合:

```powershell
Invoke-WebRequest -Uri "https://storage.googleapis.com/genai-toolbox/VERSION/windows/amd64/toolbox" -OutFile "$env:USERPROFILE\toolbox.exe"
$env:USERPROFILE\toolbox.exe --version
```

### macOS / Linux でのダウンロードと配置

```bash
# macOS arm64 の例（VERSION を置き換える）
curl -o toolbox "https://storage.googleapis.com/genai-toolbox/VERSION/darwin/arm64/toolbox"
chmod +x toolbox

# グローバルに配置
sudo mv toolbox /usr/local/bin/toolbox

# 動作確認
toolbox --version
```

プロジェクトに置く場合:

```bash
mkdir -p .cursor/bin
curl -o .cursor/bin/toolbox "https://storage.googleapis.com/genai-toolbox/VERSION/darwin/arm64/toolbox"
chmod +x .cursor/bin/toolbox
.cursor/bin/toolbox --version
```

---

## 2. ADC 認証の確認と実行

### 認証済みか確認

```bash
gcloud auth application-default print-access-token
```

トークンが表示されれば認証済み。エラーになる場合は次を実行する。

### 認証を実行

```bash
gcloud auth application-default login
```

ブラウザが開き、Google アカウントでの認証を求められる。完了するとローカルに認証情報が保存される。

### プロジェクト ID の確認

```bash
gcloud config get-value project
```

出力されるプロジェクト ID を Step 3 の `BIGQUERY_PROJECT` に使う。

---

## 3. mcp.json の設定

### 重要なルール

- `command` には **絶対パス** を指定する
- Windows ではバックスラッシュを `\\` でエスケープする
- 既存の mcp.json がある場合は `mcpServers` に `bigquery` キーを**追加**する（他のサーバー設定を消さない）

### パスの例

| OS | 配置先 | command の値 |
|----|--------|-------------|
| Windows（プロジェクト） | `.cursor\bin\toolbox.exe` | `"c:\\path\\to\\project\\.cursor\\bin\\toolbox.exe"` |
| Windows（ユーザー） | `C:\Users\USER\toolbox.exe` | `"C:\\Users\\USER\\toolbox.exe"` |
| macOS/Linux（グローバル） | `/usr/local/bin/toolbox` | `"/usr/local/bin/toolbox"` |
| macOS/Linux（プロジェクト） | `.cursor/bin/toolbox` | `"/path/to/project/.cursor/bin/toolbox"` |

### 新規作成する場合

```json
{
  "mcpServers": {
    "bigquery": {
      "command": "TOOLBOX_ABSOLUTE_PATH",
      "args": ["--prebuilt", "bigquery", "--stdio"],
      "env": {
        "BIGQUERY_PROJECT": "PROJECT_ID"
      }
    }
  }
}
```

### 既存 mcp.json にマージする場合

既存の `mcpServers` オブジェクトの中に次のエントリを追加する:

```json
"bigquery": {
  "command": "TOOLBOX_ABSOLUTE_PATH",
  "args": ["--prebuilt", "bigquery", "--stdio"],
  "env": {
    "BIGQUERY_PROJECT": "PROJECT_ID"
  }
}
```

---

## 4. 動作確認

1. Cursor で **Ctrl+Shift+P** → 「MCP」と検索、または **[Settings] > [Cursor Settings] > [MCP]** を開く
2. `bigquery` サーバーが一覧に表示され、ステータスが緑（Active / Connected）であることを確認する
3. 赤やエラーの場合:
   - `command` のパスが正しいか（絶対パス、存在するか）
   - `BIGQUERY_PROJECT` がプロジェクト ID（番号ではない）か
   - ADC 認証が通っているか
   - 詳しくは **bigquery-mcp** スキルのトラブルシュートセクションを参照

---

## バージョンアップ時

toolbox を更新するときは Step 1 を新しい VERSION で再実行する。mcp.json の変更は不要（パスが同じ場合）。Cursor の MCP 設定でサーバーを再接続する。
