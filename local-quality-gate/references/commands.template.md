# ローカル品質ゲート: コマンドテンプレート

プロジェクトで実際に使うコマンドに置き換える。

## 推奨順序

1. Lint: npm run lint または pnpm lint
2. 型検査: npm run typecheck または pnpm typecheck
3. ビルド: npm run build または pnpm build
4. 単体テスト: npm test または pnpm test

Python のみなら ruff、mypy、pytest 等に差し替える。

失敗時は修正し、段 1 からやり直す。最大試行回数は SKILL.md の Iron Law に従う。
