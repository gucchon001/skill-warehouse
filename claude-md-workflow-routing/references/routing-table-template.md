# CLAUDE.md ルーティング表（テンプレ）

プロジェクトの `CLAUDE.md` にコピーし、**実在するスキル名**に合わせて置換する。

## 状況からスキルへ（例）

1. **実装前・設計・仕様合意** → `pre-implementation-critics`。ショートカット禁止: いきなり大量パッチ。
2. **実装後・PR 前** → `local-quality-gate`。ショートカット禁止: lint 未確認で push。
3. **バグが 2 回直らない / ゲート同段 3 連敗** → `escalating-debug-loop` と `systematic-debugging`。ショートカット禁止: 推測だけで 4 回目の同型修正。
4. **コードレビュー委譲** → `code-review-subagents` または `automated-2stage-review`。ショートカット禁止: 自己完結のみで重大変更。
5. **スキル改修** → `skill-growing`。ショートカット禁止: SKILL.md だけ無限追記。
6. **用語・段の整理** → `workflow-task-agent-ref-layers`（任意）。

## 「ショートカット禁止」の書き方例

```markdown
## 品質ゲート（ショートカット禁止）
- PR 前に **local-quality-gate** を満たすまで `git push` しない。
- 設計未合意の **trivial** 以外では **pre-implementation-critics** を飛ばさない。
```

**trivial** の定義はチームで固定する（例: 誤字 1 箇所、既存パターンのコピー 1 ファイル）。
