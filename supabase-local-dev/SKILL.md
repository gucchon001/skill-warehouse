---
name: supabase-local-dev
description: "ローカル Supabase（Docker + CLI）の立ち上げ、.env.local の接続変数、マイグレーション後の型同期、開発用ログインのモック。localhost から本番 DB に繋がない。Triggers: local Supabase, supabase start, SKIP_AUTH_LOCAL, ローカル構築, env sync, supabase CLI install."
metadata:
  last_verified: "2026-03-30"
---

# ローカル Supabase 開発（汎用）

**Next.js 等からローカル Supabase に繋ぐ**ための前提・手順。プロジェクト固有のスクリプト名・認証実装は各リポジトリの `.env.local.example` / `package.json` / プロジェクト内スキルを正とする。

## 前提

1. **Docker Desktop**（または CLI が要求するコンテナランタイム）が動くこと。ローカル Supabase はコンテナ前提。
2. **Supabase CLI** が PATH にあること。無い場合は [Supabase CLI のインストール](https://supabase.com/docs/guides/cli/getting-started)に従う（Homebrew / npm / Scoop / 直接ダウンロード等）。

## 必須フロー

1. **起動**: リポジトリが `npm run supabase:start` 等を用意していればそれを優先。なければリポジトリ直下で `supabase start`。
2. **接続情報の取得**: `supabase status` で API URL・anon key・service_role key（JWT 形式）を確認。プロジェクトに `npm run env:sync-supabase-local` のような同期スクリプトがあればそれを使う。
3. **`.env.local`（またはホストが読むローカル env）** に少なくとも次を設定（値は **ローカル用**のみ）:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - サーバーが Service Role で読む処理がある場合: `SUPABASE_SERVICE_ROLE_KEY`  
   変数名の揺れは各プロジェクトの例示ファイルに合わせる。詳細は [references/checklist-and-env.md](references/checklist-and-env.md)。
4. **アプリ再起動**: 環境変数はプロセス起動時に読み込まれることが多い。
5. **マイグレーション適用後**: `supabase gen types typescript --local` またはプロジェクトの `npm run supabase:types` 等で **型定義を再生成**する。

## ログイン認証のモック（開発専用）

本番・Preview では使わない。プロジェクトが `SKIP_AUTH_LOCAL=true` のようなフラグを用意している場合のみ有効化する。

- **目的**: OAuth なしでダッシュボード等を触る。
- **注意**: モック時にサーバーが **Service Role** でデータを取ると **RLS をバイパス**しうる。ローカル限定と心得る。

挙動・実装の対応表は各リポジトリのミドルウェア／レイアウトを参照。

## やってはいけないこと

- **localhost 上のアプリから本番（または共有ステージング）の DB URL・本番キーを `.env.local` に入れて接続しない**。

## 任意

- **Studio**: `supabase status` に表示される Studio URL でテーブル・SQL を確認。
- **クリーンな DB**: `supabase db reset` や seed（`supabase/seed.sql` 等）はプロジェクトに従う。
- **統合テスト**: ローカル Supabase 起動済みを前提にする場合がある。各リポジトリの `docs/testing` または `package.json` を参照。

## 関連スキル（マージしない）

| スキル | 役割 |
|--------|------|
| **supabase-postgres-best-practices** | スキーマ・RLS・インデックス等のレビュー（ローカル起動手順ではない） |
| プロジェクト内 **supabase-local** 等 | 当該リポジトリの npm スクリプト名・モック認証の実装パス |

DB 設計・RLS レビューは **supabase-postgres-best-practices**、ローカル stack 立ち上げは本スキル、**責務を分けたまま相互参照**する。

## Troubleshooting

### エラー: `supabase start` が Docker に接続できない / Cannot connect to the Docker daemon

**原因**: Docker が未起動、または WSL2 バックエンド未設定など。  
**対処**: Docker Desktop を起動し、公式のトラブルシュートに従う。CLI の要求バージョンを確認。

### エラー: ポートが既に使用されている

**原因**: 別プロセスや別 Supabase スタックが同じポートを使用中。  
**対処**: `supabase stop`、競合アプリの停止、`config.toml` のポート変更（プロジェクト次第）。

### エラー: アプリは起動するが DB に繋がらない / Invalid API key

**原因**: `.env.local` がローカル用でない、起動後に env を変えたが **dev サーバを再起動していない**、キーの取り違え（anon と service_role、または `sb_secret_` 系と JWT の混同）。  
**対処**: `supabase status` で再取得し、anon / service_role を正しい変数に入れ直し、アプリを再起動。

詳細・変数チェックリストは [references/checklist-and-env.md](references/checklist-and-env.md)。
