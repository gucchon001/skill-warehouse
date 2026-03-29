---
name: supabase-postgres-best-practices
description: Postgres / Supabase のパフォーマンス・セキュリティ監査の公式ベストプラクティス。SQL・スキーマ・RLS・インデックスのレビュー、接続・プール設計、EXPLAIN 観点の整理で使う。DB 専門家を雇う代わりのチェックリストとして参照する。
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

## 関連（本リポジトリ）

- ローカル起動: プロジェクトスキル **supabase-local**
- 型同期・マイグレーション後: `npm run supabase:types`
