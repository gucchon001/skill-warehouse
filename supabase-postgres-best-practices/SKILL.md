---
name: supabase-postgres-best-practices
description: "Postgres / Supabase のパフォーマンス・セキュリティ監査の公式ベストプラクティス。SQL・スキーマ・RLS・インデックスのレビュー、接続・プール設計、EXPLAIN 観点の整理で使う。DB 専門家を雇う代わりのチェックリストとして参照する。"
metadata:
  last_verified: "2026-04-03"
---

# Supabase Postgres Best Practices（公式スキル連携）

**「DB 専門家を雇う代わり」** — Supabase が公開する **Postgres 最適化・RLS・スキーマ設計**のルール群。インデックス漏れ、RLS 誤設定、危険なクエリパターンのレビューに使う。

## いつ使うか

- 「このテーブル設計でパフォーマンス上の問題はない？」と **レビュー依頼** されたとき
- 新規マイグレーション（`CREATE TABLE` / `CREATE INDEX` / `CREATE POLICY`）を書いたあと
- 遅いクエリ・N+1・PostgREST の `max_rows` との兼ね合いを疑うとき
- **本番** と **ローカル専用 RLS** の取り違えを防ぎたいとき

## 優先度カテゴリ（公式の 8 区分）

| 優先度 | カテゴリ | 接頭辞 |
|--------|----------|--------|
| 1 | Query Performance | `query-` |
| 2 | Connection Management | `conn-` |
| 3 | Security & RLS | `security-` |
| 4 | Schema Design | `schema-` |
| 5 | Concurrency & Locking | `lock-` |
| 6 | Data Access Patterns | `data-` |
| 7 | Monitoring & Diagnostics | `monitor-` |
| 8 | Advanced Features | `advanced-` |

各ルールには **誤った例 / 正しい例**、必要に応じて EXPLAIN・Supabase 固有メモが含まれる。

## エージェントの進め方

1. **正本を読む**: 詳細は公式リポジトリの `references/*.md`（このスキルでは [references/official-source.md](references/official-source.md) から辿る）。
2. **プロジェクトの事実を集める**: `supabase/migrations/*.sql`、`supabase/config.toml`、アプリ側の Supabase クライアント（anon vs service_role）。
3. **カテゴリ 1〜3 を最優先**で突き合わせる（クエリ・接続・RLS）。
4. 指摘は **再現手順** または **該当マイグレーション名** まで落とす。

## 公式の取り込み（推奨）

ルール全文を手元に置くには:

```bash
npx skills add https://github.com/supabase/agent-skills --skill supabase-postgres-best-practices
```

## 出典

- Source: [Supabase Postgres Best Practices - Skills.sh](https://skills.sh/supabase/agent-skills/supabase-postgres-best-practices)
- メタデータ・更新は GitHub `supabase/agent-skills` の `skills/supabase-postgres-best-practices/SKILL.md` を正とする。

## Troubleshooting

### エラー: RLS がローカルでは通るが本番で 403 になる

**原因**: ローカルで `service_role` キーを使っており RLS をバイパスしていた。本番は `anon` キー経由で RLS が評価される。

**対処**: ローカルも `anon` キーで動作確認する。`CREATE POLICY` を `supabase/migrations/` に落とし、`supabase db reset` で検証する。

### エラー: クエリが遅い・N+1 が疑われる

**原因**: インデックス漏れ、または PostgREST の `max_rows` 上限でページング未実装。

**対処**: カテゴリ 1（`query-`）を参照し `EXPLAIN ANALYZE` で確認する。外部キーカラムへの `CREATE INDEX` を `supabase/migrations/` に追加する。

### エラー: スキルの `references/*.md` が見つからない

**原因**: `npx skills add` でルール全文をインストールしていない。

**対処**: `npx skills add https://github.com/supabase/agent-skills --skill supabase-postgres-best-practices` を実行してローカルに取り込む。

## 関連スキル

- **ローカル Supabase 起動・`.env.local`・開発用認証モック（汎用）**: グローバル **supabase-local-dev**
- 個別プロジェクトに **supabase-local** がある場合は、npm スクリプト名・実装パスはそちらを優先
- 型同期・マイグレーション後: 各プロジェクトの `npm run supabase:types` 等
