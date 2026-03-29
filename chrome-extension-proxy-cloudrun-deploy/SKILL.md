---
name: chrome-extension-proxy-cloudrun-deploy
description: "Chrome 拡張用プロキシ API を Cloud Run に安全にデプロイする手順。デプロイ前チェック・Secret（BOM）・ヘルス確認・ロールバックの考え方。トリガーは「プロキシ API を安全にデプロイして」「Cloud Run にプロキシをデプロイ」「本番前にチェックしたい」など。実行コマンドは gcloud-cloudrun-deploy を参照する。"
metadata:
  last_verified: "2026-03-31"
---

# Chrome 拡張プロキシ API を Cloud Run に安全にデプロイする

Chrome 拡張が呼び出すプロキシ API（Gemini 等）を Cloud Run にデプロイする際の安全な手順。実際の gcloud コマンド・プロジェクト固有の設定は **gcloud-cloudrun-deploy** スキルを参照する。

## When to Use

- ユーザーが「Chrome 拡張のプロキシ API を Cloud Run に安全にデプロイして」「プロキシを Cloud Run にデプロイしたい」と依頼したとき
- 「本番に出す前にチェックしたい」「デプロイ手順を確認したい」と依頼したとき

## 安全にデプロイする原則

1. **デプロイ前**にチェックリストを実施する（Secret・IAM・package-lock・リッスン・CORS）。
2. デプロイを実行する（gcloud-cloudrun-deploy のコマンドを使用）。
3. **デプロイ後**にヘルス・拡張からの疎通を必ず確認する。
4. 問題があればロールバック手順を把握したうえで対処する。

詳細チェックリストは `references/safe-deploy-checklist.md` を参照する。

## How to Use

### 1. デプロイ前チェック

| 項目 | 確認内容 |
|------|----------|
| **Secret（API キー）** | Secret Manager に登録済みか。**BOM なし**で登録されているか（BOM があると 65279 エラーになる）。 |
| **IAM** | Cloud Run のサービスアカウントに `roles/secretmanager.secretAccessor` が付与されているか。 |
| **package-lock** | `npm ci` でビルドするため、`package.json` と `package-lock.json` が一致しているか。`proxy/` で `npm install` してからコミット・デプロイする。 |
| **リッスン** | アプリが `PORT`（デフォルト 8080）で **0.0.0.0** をリッスンしているか。 |
| **CORS** | 拡張のオリジン（`chrome-extension://<id>`）またはデプロイ先 URL を許可しているか。本番と開発でオリジンが違う場合は両方許可するか検討する。 |

BOM の登録・対処は gcloud-cloudrun-deploy の「1.2 Secret Manager」「3.4 ByteString エラー」を参照する。

### 2. デプロイの実行

- **このリポジトリ（ms_zanshin）**: gcloud-cloudrun-deploy スキルに従う。
  - 一括: `.\scripts\deploy-all-cloudrun.ps1`
  - proxy のみ: `proxy/` をカレントにし、`gcloud run deploy admin-chat-proxy --source . --region=asia-northeast1 --set-secrets=...` を実行する。
- **他プロジェクト**: プロジェクト ID・リージョン・サービス名・`--set-secrets` をその環境に合わせ、gcloud-cloudrun-deploy の手順をなぞる。

### 3. デプロイ後の確認（必須）

| 確認 | 方法 |
|------|------|
| **ヘルス** | `curl https://<Service URL>/health` で 200 が返るか。 |
| **拡張からの疎通** | 拡張の設定でプロキシ URL をデプロイ先にし、要約・返信など 1 リクエストが成功するか。 |
| **ログ** | Cloud Run のログに 5xx や ByteString エラーが出ていないか。 |

Service URL の取得:

```bash
gcloud run services describe <サービス名> --region=asia-northeast1 --format='value(status.url)' --project=<プロジェクトID>
```

### 4. 問題が出たとき（ロールバック）

- Cloud Run はリビジョンごとにトラフィック割合を変えられる。
- 新リビジョンで不具合がある場合: コンソールまたは `gcloud run services update-traffic` で**前のリビジョンに 100% 戻す**。原因（Secret BOM・コード・環境変数）を修正し、再度デプロイしてからトラフィックを切り替える。
- デプロイ失敗で「前のリビジョンが動いている」状態なら、そのまま利用し、修正後に再デプロイすればよい。

### 5. セキュリティの前提

- プロキシ API は**拡張側が API キーを持たない**構成（案 B）を想定。キーは Secret Manager に入れ、Cloud Run の環境変数にのみ注入する。
- `--allow-unauthenticated` は匿名でも呼べるため、プロキシ URL を秘密にできない。必要なら IAM 認証や VPC 等で制限する。
- 拡張の `host_permissions` は必要なオリジンのみに限定する（gws-gcp-context・chrome-extension-build を参照）。

## Examples

- 「Chrome 拡張のプロキシ API を Cloud Run に安全にデプロイして」
- 「本番に出す前にデプロイ前チェックを確認したい」
- 「プロキシのデプロイ後、ヘルスと拡張からの疎通を確認する手順を教えて」

## 関連スキル（役割分担）

| スキル | 役割 |
|--------|------|
| **chrome-extension-proxy-cloudrun-deploy**（本スキル） | Cloud Run への**安全なデプロイ**・前後チェック・ロールバックの考え方 |
| **gcloud-cloudrun-deploy** | **実コマンド**・Secret 名・BOM 対処・プロジェクト固有手順 |
| **chrome-extension-build** | 拡張側のメッセージング・`host_permissions`・プロキシ URL 設定 |
| **chrome-extension-refactor** | JS の責務分離（デプロイとは別） |

## Troubleshooting

### エラー: gcloud / Cloud Run デプロイが失敗する

**原因**: プロジェクト・リージョン・IAM、Secret、イメージタグの誤り。

**対処**: エラーメッセージのリソース名を手がかりに、本文のチェックリストを上から確認する。**gcloud-cloudrun-deploy** を Read。

### エラー: 拡張と API の疎通が失敗する

**原因**: CORS、URL 誤り、本番と開発の混同、`chrome-extension://` オリジン未許可。

**対処**: `curl …/health` で 200 を確認。拡張のプロキシ URL・manifest の権限を確認。**chrome-extension-build** を参照。

### エラー: Secret / BOM（65279）関連

**原因**: Secret に BOM が混入しているとリクエスト失敗や ByteString 系エラーになる。

**対処**: **gcloud-cloudrun-deploy** の Secret / BOM 節と `references/safe-deploy-checklist.md` を Read。

## 参照

- **実際のコマンド・Secret 名・BOM 対処**: **gcloud-cloudrun-deploy** スキル
- **コンテナを Docker なしでビルド**: gcloud-cloud-build スキル
- **拡張側のプロキシ利用**: chrome-extension-build スキル（メッセージング・権限）
- **デプロイ前・デプロイ後・ロールバックのチェックリスト**: `references/safe-deploy-checklist.md`
