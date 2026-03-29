---
name: subagent-authoring
description: "サブエージェント（委譲エージェント）定義の執筆・配置・形式・作成手順。Cursor `.cursor/agents`、Claude Code `.claude/agents`、Antigravity は references/locations.md・format.md。Triggers: subagent, サブエージェント, agents folder, delegate, Claude Code agents, custom agent md."
metadata:
  last_verified: "2026-03-30"
---

# Subagent authoring（ホスト横断）

**旧スキル統合**: `subagent-descriptions` / `subagent-format` / `subagent-locations` / `subagent-workflow` を **subagent-authoring** にまとめた。Cursor 専用名ではなく、**Claude Code・Antigravity でも使える考え方**を先に書き、パス差は第3層で分離する。

## いつ使うか

- サブエージェント／委譲エージェントの **`.md` 定義**を新規作成・修正するとき
- **`description` で委譲タイミング**を整えたいとき
- **プロジェクト vs ユーザー**のどちらに置くか決めるとき
- **Cursor / Claude Code / Antigravity** のどれ向けか意識して書きたいとき

## 第3層（Read）

| ファイル | 内容 |
|----------|------|
| [references/locations.md](references/locations.md) | **ホスト別**の配置パスと優先順位 |
| [references/format.md](references/format.md) | フロントマター・本文の型（Cursor 最小、Claude Code 拡張例） |
| [references/descriptions.md](references/descriptions.md) | 委譲のきっかけになる `description` の書き方 |
| [references/workflow.md](references/workflow.md) | 作成の手順（スコープ→ファイル→試験） |

## 関連

| リソース | 役割 |
|----------|------|
| **skill-builder** / **skill-growing** | **Skills**（`SKILL.md`）の新規・育成。本スキルは **Subagents**（別の定義ファイル群）。 |
| **cursor-rules** | `.cursor/rules/*.mdc`。ルールとサブエージェントは別物。 |
| **skill-folder-spec.md** | スキル配置のホスト差（§9）。サブエージェントのパス差は **locations.md** を正とする。 |

## Troubleshooting

### エラー: サブエージェントが一覧に出ない・読まれない

**原因**: ホストと違うディレクトリに置いている、ファイル名・拡張子が規約外。

**対処**: [references/locations.md](references/locations.md) と該当 IDE の公式ドキュメントを確認。

### エラー: スキル（本リポジトリの Agent Skill）が読み込まれない

**原因**: `SKILL.md` の `name` とフォルダ名の不一致、`references/` の相対パス誤り。

**対処**: **skill-folder-spec.md** §1。`subagent-authoring` は `~/.cursor/skills/subagent-authoring/SKILL.md` 等に置く。

### エラー: Claude Code だけフロントマターが効かない

**原因**: 任意キーや必須キーがバージョンと合っていない。

**対処**: [references/format.md](references/format.md) のリンク先公式を確認。
