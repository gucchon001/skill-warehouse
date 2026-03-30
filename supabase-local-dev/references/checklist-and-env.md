# チェックリストと環境変数（参考）

## ローカル接続の確認順

1. `supabase status`（または Dashboard）で **API URL** と **anon** / **service_role** が取得できる。
2. `.env.local` に **ローカル**の値だけが入っている（本番 URL が混ざっていない）。
3. フロント用: `NEXT_PUBLIC_*` に URL と anon key。
4. サーバー専用: Service Role は **クライアントに埋め込まない**。サーバー処理・スクリプトのみ。
5. マイグレーションや `db reset` のあと、型生成コマンドを実行した。

## よくある変数名（Next.js 例）

| 用途 | 例（プロジェクトにより異なる） |
|------|-------------------------------|
| Supabase API のベース URL | `NEXT_PUBLIC_SUPABASE_URL` |
| 匿名（公開）キー | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| サービスロール（サーバーのみ） | `SUPABASE_SERVICE_ROLE_KEY` |

`sb_secret_...` で始まるキーと、JWT（ドット区切り 3 部）の **service_role** は別物。取り違えない。

## モック認証を使うときの追加確認

- フラグ名はリポジトリの `.env.local.example` を正とする（例: `SKIP_AUTH_LOCAL=true`）。
- 本番・Vercel Preview の環境変数に同フラグを入れない。
