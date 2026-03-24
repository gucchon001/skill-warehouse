# Chrome 拡張プロキシ API 安全デプロイ チェックリスト

## デプロイ前

- [ ] Secret Manager に API キーを登録済み（BOM なしで登録）
- [ ] Cloud Run 用 SA に `roles/secretmanager.secretAccessor` 付与済み
- [ ] `proxy/` で `npm install` 済み・package-lock をコミット済み
- [ ] アプリが `PORT` で `0.0.0.0` をリッスンしている
- [ ] CORS に拡張オリジン（または許可するオリジン）を設定している

## デプロイ後

- [ ] `curl https://<Service URL>/health` で 200
- [ ] 拡張からプロキシ URL を設定し、1 リクエストが成功する
- [ ] Cloud Run ログに 5xx / ByteString エラーがない

## ロールバック

- [ ] 不具合時は前リビジョンに 100% 戻す手順を把握している（`gcloud run services update-traffic` またはコンソール）
