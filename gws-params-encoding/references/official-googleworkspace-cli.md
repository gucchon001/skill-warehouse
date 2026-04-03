# 公式 Google Workspace CLI（gws）との対応

本リポジトリの **gws-*** スキルは、CLI 本体として **[googleworkspace/cli](https://github.com/googleworkspace/cli)**（Apache-2.0）の `gws` を前提にしている。**Google の公式サポート製品ではない**（README の Disclaimer 参照）。

## パッケージとインストール

| 項目 | 内容 |
|------|------|
| npm パッケージ | `@googleworkspace/cli` |
| グローバルインストール | `npm install -g @googleworkspace/cli` |
| バイナリ名 | `gws`（Discovery ベースでサブコマンドが動的に生成される） |

その他: [Releases](https://github.com/googleworkspace/cli/releases) のプリビルド、`cargo install --git https://github.com/googleworkspace/cli --locked`、Homebrew `googleworkspace-cli` 等（公式 README の Installation 参照）。

## 認証

| 用途 | コマンド・手順 |
|------|----------------|
| 初回セットアップ（GCP プロジェクト・API 有効化・gcloud 利用可の場合） | `gws auth setup` |
| 対話ログイン | `gws auth login` |
| スコープを絞る（推奨: 未検証アプリは scope 数に制限あり） | `gws auth login -s drive,gmail,sheets` など |

**Testing mode（OAuth 未検証）**: 同意できる scope はおおよそ **25 個まで**。`recommended` プリセットは scope が多すぎて失敗しうる → **必要なサービスだけ** `-s` で選ぶ（公式 README の Warning 参照）。

## 環境変数（優先順位）

公式 README の Precedence に従う（高い順）:

1. `GOOGLE_WORKSPACE_CLI_TOKEN` — 事前取得のアクセストークン（例: `gcloud auth print-access-token`）
2. `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE` — OAuth またはサービスアカウント JSON のパス
3. `gws auth login` で保存した暗号化クレデンシャル
4. 平文 `~/.config/gws/credentials.json`

その他よく使うもの: `GOOGLE_WORKSPACE_CLI_CONFIG_DIR`（既定 `~/.config/gws`）、`.env` でも読み込み可（dotenvy）。一覧は公式 README の Environment Variables。

## ヘルパーとスキーマ

- **ヘルパー**は `+` 接頭辞（例: `gws drive +upload`、`gws sheets +append`、`gws sheets +read`）。Discovery 生成メソッドと衝突しない。
- **リクエスト／レスポンスの形を確認**: `gws schema <resource.path>`（例: `gws schema drive.files.list`）。

## 公式リポジトリの Agent Skills との関係

`npx skills add https://github.com/googleworkspace/cli` で、公式が配布する **API 単位の SKILL.md** をエージェントに取り込める。

**このユーザーのグローバル gws-*** スキル（gws-drive / **gws-sheets** / gws-docs-to-local / gws-params-encoding）は、**ワークフロー・Windows／Node 向けの `--params` 安定化・プロジェクト方針（sheet-api-update との分担）**を補足する別レイヤー。公式スキルと**置き換えではなく併用**でよい。

## 終了コード（スクリプト分岐用）

| Code | 意味 |
|------|------|
| 0 | 成功 |
| 1 | API エラー（4xx/5xx） |
| 2 | 認証エラー |
| 3 | 引数・バリデーション |
| 4 | Discovery 取得失敗 |
| 5 | 内部エラー |

## 正本

- リポジトリ: https://github.com/googleworkspace/cli  
- README に Quick Start、Authentication、Helper reference、Troubleshooting がまとまっている。
