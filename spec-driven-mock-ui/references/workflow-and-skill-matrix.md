# spec-driven-mock-ui — 補足とスキルマッピング

## チェックリスト（実装前）

- [ ] 正本に「フルページ vs fragment」の URL 表がある
- [ ] モックルートが本番で無効になる
- [ ] アイテム単位エラー等、仕様で求めた状態パターンが画面に載っている
- [ ] test_client（または同等）で 200 とキー文言を検証
- [ ] 外部 API を本番キーで叩いていない

## UI・デザイン（グローバル）— 使い分け

| 軸 | スキル | いつ使うか |
|----|--------|------------|
| **何を見せるか（IA・情報順）** | `dashboard-first-view-ux` | ダッシュ・トップ・一覧の優先順位・レイアウト設計 |
| **どう作るか（主軸・創造）** | `frontend-design` | 新規 UI・スタイリング・DESIGN.md |
| **既存を軽くチェック** | `ui-frontend-patterns` | 軽量レビュー・チェックリスト。新規の作り込みは `frontend-design` へ |

## よく併用するスキル（グローバル / プロジェクト）

| 目的 | スキル（典型パス） |
|------|-------------------|
| スキル探索 | `find-skills`（`~/.cursor/skills/find-skills/`） |
| 仕様とコードの対応 | プロジェクトの `spec-creation` |
| 新規 UI・DESIGN.md | `frontend-design`（`~/.cursor/skills/frontend-design/`） |
| ダッシュ・ファーストビュー | `dashboard-first-view-ux` |
| 既存 UI の軽レビュー | `ui-frontend-patterns` |
| DB 形の合意 | `table-definition-database-design` |
| テスト層の選び方 | プロジェクト `testing-playbook`（zip_fixer 等） |
| Flask ルートテスト | プロジェクト `python-flask-test-client` |
| E2E | プロジェクト `python-e2e-browser-test` |
| ローカル DB・認証モック | `supabase-local-dev` |
| 実装前レビュー | `pre-implementation-critics` |
| 公開範囲 | `vibesec` |

## 公開ディレクトリ（skills.sh）

「mock」名のスキルは多くが **API モック（WireMock 等）** や **別スタック**向け。UI モック先行は本スキル＋上表を優先し、不足時のみ `npx skills find "<query>"` で探索する。
