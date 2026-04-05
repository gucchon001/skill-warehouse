---
name: porters-write
description: |
  PORTERs Connect API への書き込み（Write API）を開発・テスト・本番実装するためのスキル。
  Candidate Write（求職者の新規登録・更新）の実装パターン、OAuth スコープ付与、
  テストスクリプトの実行、本番キュー設計をカバーする。
  Triggers: 「PORTERs に書き込む」「候補者を登録する」「Write API を実装する」
  「porters write」「candidate write」「書き込みテストを実行する」
metadata:
  last_verified: "2026-04-04"
---

# porters-write

PORTERs Connect API Write の開発・テスト・本番実装スキル。

## いつ使うか

- PORTERs に候補者（Candidate）・選考プロセス（Process）等を書き込む実装をするとき
- 書き込みテストを初めて実行するとき（スコープ付与から手順を確認したい）
- Write API のエラー（403/401）を調査するとき
- 本番 Write キュー設計（Supabase + Inngest）を検討するとき

## 実装済みファイル（このリポジトリ）

| ファイル | 役割 |
|---------|------|
| `lib/porters/write.ts` | `writeCandidate()` — XML ビルド・POST・レスポンスパース |
| `scripts/porters/write-test.ts` | 3 パターン CLI テスト |
| `app/(dashboard)/porters-test/page.tsx` | OAuth スコープ付与 UI |
| `app/api/auth/porters/authorize/route.ts` | `scope=write` → `PORTERS_SCOPE_ALL_RW` |
| `lib/porters/config.ts` | `PORTERS_SCOPE_ALL_RW` / `PORTERS_SCOPE_CANDIDATE_WRITE` 定数 |

## Write API の要点

```
POST /v1/candidate?partition={partitionId}
Headers:
  X-porters-hrbc-oauth-token: {accessToken}
  Content-Type: application/xml; charset=UTF-8
Body（新規）:
  <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <Candidate><Item>
    <Person.P_Id>-1</Person.P_Id>
    <Person.P_Name>山田太郎</Person.P_Name>
  </Item></Candidate>
Body（更新）: Person.P_Id に既存 ID を指定
必要スコープ: candidate_w（PORTERS_SCOPE_ALL_RW に含まれる）
```

**成功レスポンス**: `<Candidate><Item><Id>10xxx</Id><Code>0</Code></Item></Candidate>`
**エラーレスポンス**: `<System><Code>403</Code></System>`（スコープ不足）

## テスト手順

### 1. Write スコープを付与する（初回・スコープ切れ時）

```bash
npm run dev
# ブラウザで http://localhost:3000/porters-test を開く
# 「読み書き scope を付与（scope=write）」をクリック → PORTERs でログイン・承諾
```

### 2. テストスクリプトを実行する

```bash
# 全パターン（新規 → 更新 → エラーパターン）
npm run porters:write-test

# パターン指定
npm run porters:write-test -- --pattern new           # 新規登録のみ
npm run porters:write-test -- --pattern update --id 10001  # ID 指定で更新
npm run porters:write-test -- --pattern error          # 無効フィールドのエラー確認
```

### 3. テスト後の後片付け

`テスト_書き込み_DELETE_ME` というレコードが PORTERs に作成されます。
不要であれば PORTERs 管理画面から手動削除してください。

## `writeCandidate()` の使い方

```ts
import { writeCandidate } from '@/lib/porters/write'

const result = await writeCandidate(accessToken, partitionId, {
  'Person.P_Id': '-1',               // 新規: -1 / 更新: 既存 ID
  'Person.P_Name': '山田太郎',
  'Person.P_Reading': 'やまだたろう',
})

if (result.success) {
  console.log('登録 ID:', result.id)
} else {
  console.error(result.code, result.message)
}
```

## 本番実装の方向性

1. **書き込みキュー**: `porters_write_queue` テーブル（Supabase）にリクエストをキュー投入
2. **バッチ実行**: Inngest ジョブが `writeCandidate` を呼び出し
3. **競合検出**: `*_raw` テーブルの `updated_at` と比較してコンフリクトを検出
4. **リトライ**: Inngest の組み込みリトライを活用
5. **ログ**: 成功/失敗/ID を `porters_sync_log` または専用テーブルに記録

他リソース（Process/Job/Client）への拡張は `write.ts` に `writeProcess()` 等を追加するパターンで実装する。

## Troubleshooting

### エラー: `<System><Code>403</Code></System>`（スコープ不足）

**原因**: `candidate_w` スコープが OAuth で付与されていない。`scope=all`（読み取りのみ）で付与した場合に起きる。

**対処**: `/porters-test` から「**読み書き scope を付与（scope=write）**」をクリックして再付与する。すでに読み取りスコープを付与済みの場合は「アクセス権を取り消す」→「読み書き scope を付与」の順で再実行する。

### エラー: `getCodeDirect()` が失敗する

**原因**: OAuth 権限付与（ブラウザフロー）を未実施、または `.env.local` の `PORTERS_APP_ID_TEST` / `PORTERS_SECRET_TEST` が未設定。

**対処**: `npm run dev` → `/porters-test` → 「PORTERs 疎通テストを開始」 → PORTERs ログイン → 承諾を実施してから再実行。

### エラー: `{ success: false, code: '', message: 'コード ' }`（パース失敗）

**原因**: `write.ts` が `<System>` エラーレスポンスを処理していない古いバージョン。

**対処**: `lib/porters/write.ts` の `writeCandidate` に `parsed?.System` 分岐があるか確認する。
