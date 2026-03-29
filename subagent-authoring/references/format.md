# サブエージェント定義ファイルの形式

親スキル: **subagent-authoring** の `SKILL.md`。

## 共通の考え方

多くのホストで Markdown と YAML フロントマターで定義し、本文がシステムプロンプトになる。

## Cursor（最小例）

```markdown
---
name: my-agent
description: When to delegate to this subagent (be specific)
---

You are a... [system prompt]
```

- **必須**: `name`（小文字・ハイフン）、`description`（委譲条件）
- 本文 = 起動時の指示。ホスト固有の追加キーは Cursor のドキュメントに従う。

## Claude Code（拡張フィールドの例）

公式: `https://code.claude.com/docs/en/sub-agents` 。フロントマターに任意で次のようなキーが付くことがある:

- `tools`, `model`, `permissionMode`, `skills` など

必須・任意キーは製品版で変わりうるため、編集前に公式ドキュメントを確認する。

## Antigravity

エージェントやルールの配置は製品のバージョンとドキュメントに従う。リポジトリ直下の AGENTS.md / GEMINI.md と `.agent/` 配下は [skill-folder-spec.md](../../skill-builder/references/skill-folder-spec.md) §9 の Antigravity 注記と併せて確認する。

## Troubleshooting

### エラー: フロントマターが認識されない

**原因**: `---` の閉じ忘れ、ホストが解釈しないキー、拡張子や配置パスがホストと不一致。

**対処**: locations.md で配置を確認し、該当ホストの公式ドキュメントの例に合わせる。
