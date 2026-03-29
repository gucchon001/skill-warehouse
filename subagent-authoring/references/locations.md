# サブエージェント定義の配置（ホスト別）

親スキル: **subagent-authoring** の `SKILL.md`。

**配置はホストごとに異なる。** 更新されたら各製品の公式ドキュメントを優先する。

## Cursor

| 配置 | スコープ | 優先度 |
|------|----------|--------|
| `.cursor/agents/*.md` | 現在のプロジェクト | 高 |
| `~/.cursor/agents/*.md` | 全プロジェクト | 低 |

同名は **プロジェクトがユーザーより優先**。プロジェクト配下はリポジトリにコミットしてチーム共有しやすい。

## Claude Code

| 配置 | スコープ |
|------|----------|
| `.claude/agents/` | プロジェクト（優先度が高いことが多い） |
| `~/.claude/agents/` | ユーザー全体 |

プラグイン由来のエージェントはプラグインの `agents/` 等に置かれる。詳細は [Claude Code: Sub-agents / .claude directory](https://code.claude.com/docs/en/sub-agents) および [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory)。

## Google Antigravity

`.agent/` 配下のルールやワークフロー、リポジトリ直下の **AGENTS.md** / **GEMINI.md** など、**製品リリースごとに推奨パスが変わりうる**。**skill-folder-spec.md** §9 の Antigravity 行と、公式の最新ガイドを確認する。

## Troubleshooting

### エラー: サブエージェントが一覧に出ない

**原因**: ホスト違いのパスに置いている、拡張子・ファイル名が規約外。

**対処**: 上記表と公式ドキュメントでパスを再確認。Cursor は `/agents` UI、Claude Code は `/agents` コマンド等で管理できる場合がある。
