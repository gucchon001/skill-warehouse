---
name: spec-driven-mock-ui
description: "サーバレンダUIのモック先行を仕様と同期。Jinja2 + HTMX、フィクスチャ、/mock、fragment、test_client。新規画面の見た目・DESIGN.md は frontend-design、ダッシュの情報順は dashboard-first-view-ux、既存UIの軽チェックは ui-frontend-patterns。Triggers: mock-first UI, HTMX prototype, spec-driven mock, fragment, frontend-design, DESIGN.md, ダッシュ ファーストビュー."
metadata:
  last_verified: "2026-04-05"
  version: "1.1.0"
---

# spec-driven-mock-ui（仕様駆動・サーバUIモック先行）

## いつ使うか

- **画面や一覧の見え方を先に固めたい**が、DB や外部 API が未整備である。
- **Jinja2 + HTMX**（または同様のサーバレンダ + 部分更新）で本番に近い形にしたい。
- **純静的 HTML だけ**にすると、ルート・ヘッダ・CSRF など本番とズレる懸念がある。

## UI デザインスキルの使い分け（先に決める）

**判断木**（グローバル `~/.cursor/skills/`）:

- **ダッシュボード・トップの情報順・レイアウト設計（何を見せるか / IA）** → **dashboard-first-view-ux**
- **新規 UI の作成・スタイリング全般・DESIGN.md（どう作るか・主軸）** → **frontend-design**
- **既存画面の軽量レビュー（チェックリスト中心）** → **ui-frontend-patterns**（新規の作り込みは **frontend-design** へ寄せる）

モックの HTML/CSS を書く前に、上記のどれを Read するか決める。

## 手順

1. **仕様の正本**を 1 つ決める（要件 MD、OpenAPI、Notion 等）。画面 URL・返却（全文 HTML / fragment）・エラー表示方針を表にする。
2. **UI デザイン**: 上記判断木に従い **frontend-design** / **dashboard-first-view-ux** / **ui-frontend-patterns** を Read する（該当するものだけでよい）。
3. **モック専用の境界**を設ける: 例として `GET /mock/...` または `MOCK_UI=1` のときだけ Blueprint を登録。本番デプロイでは無効化できるようにする。
4. **データ**は Python の辞書／JSON フィクスチャ（`tests/fixtures/` または `mock_data/`）から渡す。ビジネスロジックをテンプレート内 JS に増やさない。
5. **HTMX**を使う場合は、`HX-Request` で fragment テンプレートを返すパターンを最初に 1 本通す。
6. **HTTP 契約テスト**を付ける（Flask `test_client`、FastAPI `TestClient` 等）。ステータスコードと主要 HTML 断片を検証。外部 API はモック。
7. 仕様を変えたら **先に正本を更新**し、モックとテストを追従する。

**関連スキル（Read してから実行）**: プロジェクトに **testing-playbook** があれば層の選定に従う。**table-definition-database-design**（フィクスチャ形を DB 定義に寄せる）、**spec-creation**（仕様とコードの対応表）。

詳細チェックリスト・スキル対応表: [references/workflow-and-skill-matrix.md](references/workflow-and-skill-matrix.md)。

## Troubleshooting

### エラー: モックだけが仕様から遅れる

**原因**: 正本の更新順序が逆で、画面が先に古くなった。

**対処**: 要件ドキュメントを先に修正し、モック・`03-web-*` 相当の表・test_client を同じ PR で揃える。

### エラー: 本番に /mock が露出した

**原因**: 環境フラグや Blueprint 登録のガードが無い。

**対処**: 本番ではモック Blueprint を登録しない、または Cloud Run / リバースプロキシで `/mock` を拒否。**vibesec** でレビューする。

### エラー: テストがフレークする

**原因**: 時刻・乱数・外部 URL をモックしていない。

**対処**: フィクスチャの `created_at` を固定し、外部呼び出しは patch / スタブに置き換える。

## 第3層

- 手順補足・スキルマッピング: [references/workflow-and-skill-matrix.md](references/workflow-and-skill-matrix.md)
