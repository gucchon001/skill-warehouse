---
name: app-code-apis-not-cli
description: "アプリ・サービスコードでは CLI（gws・gcloud・curl 等）を subprocess で常時依存にせず、公式 HTTP API または SDK を使う。バッチ scripts は例外。Drive・Gemini・GCP 連携時に従う。"
metadata:
  last_verified: "2026-04-03"
---

# アプリは API、CLI は scripts に限定

## いつ従うか

- FastAPI / Gradio / 本番相当の Python・Node など **常駐・ライブラリとして import されるコード**を書く・レビューするとき。
- 「Drive から取る」「File Search に載せる」「GCP で何かする」を **アプリのリクエストパス**に載せるとき。

## ルール（要約）

| 層 | 外部連携の作法 |
|----|----------------|
| **アプリ本体** | **公式 SDK / REST API**（例: `google-genai`, `google-api-python-client`, 各種 `*_client`） |
| **`scripts/`・CI・手動運用** | CLI（`gws`, `gcloud` 等）や subprocess も可。アプリから **import して共有しない**。 |

## してはいけない例

- `subprocess.run(["gws", "drive", ...])` を `site_app.py` / `grading_service.py` から呼ぶ。
- 採点・解析の本線を `gcloud` の出力パースに依存させる。

## 推奨パターン

- **Google Drive**: Drive API v3 + サービスアカウント JSON またはユーザー OAuth（トークンを安全に保持）。
- **Gemini・File Search**: `google.genai` クライアント（API キーまたは Vertex 用認証）。
- **GCP リソース操作**: 本番コードでは **google-cloud-* クライアントライブラリ** を優先。`gcloud` はデプロイ・運用スクリプトに寄せる。

## 既存コードとの関係

- リポジトリに **gws 前提の `scripts/download_pdfs.py`** がある場合: **バッチ専用**として残し、アプリが同じことをするなら **API 版**（例: `download_pdfs_service_account.py` と同型）を別途用意する。

## Troubleshooting

### エラー: CLI しか手順が見つからない

**原因**: ドキュメントが CLI 中心で書かれており、API 相当が見えにくい。

**対処**: そのサービスの REST リファレンスまたは公式 Python/Node クライアントを探し、同等操作の API メソッドに置き換える。

### エラー: subprocess は動くが本番 CI/Vercel で失敗する

**原因**: アプリが CLI（`gws` 等）を subprocess 呼び出ししており、本番環境に CLI がインストールされていない。

**対処**: アプリ本体は公式 SDK（例: `google-api-python-client`、`@googleapis/sheets`）に置き換える。CLI は `scripts/` にのみ残す。

### エラー: 認証がローカルでは通るが本番で失敗する

**原因**: アプリがシェルのログイン状態（`gcloud auth login` 等）に依存している。

**対処**: ADC / サービスアカウント JSON / OAuth トークンを環境変数・Secret Manager 経由で渡し、シェル状態に依存させない。

## 関連（プロジェクト内）

- 同一内容の Cursor ルール: ワークスペース `.cursor/rules/app-use-apis-not-cli.mdc`（`app.py` 等にスコープ）
