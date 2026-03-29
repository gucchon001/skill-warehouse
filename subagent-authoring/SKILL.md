---
name: subagent-authoring
description: "サブエージェント定義の執筆・配置・形式・作成手順と、マルチエージェント運用（分離実行・協調・レビューゲート・並列リサーチ）。Cursor / Claude Code / Antigravity のパスは locations.md。Triggers: subagent, サブエージェント, delegate, multi-agent, orchestration, fork context, レビューゲート, parallel research, オーケストレーション."
metadata:
  last_verified: "2026-03-31"
---

# Subagent authoring（ホスト横断）

**旧スキル統合**: `subagent-descriptions` / `subagent-format` / `subagent-locations` / `subagent-workflow` を **subagent-authoring** にまとめた。Cursor 専用名ではなく、**Claude Code・Antigravity でも使える考え方**を先に書き、パス差は第3層で分離する。

## いつ使うか

- サブエージェント／委譲エージェントの **`.md` 定義**を新規作成・修正するとき
- **`description` で委譲タイミング**を整えたいとき
- **プロジェクト vs ユーザー**のどちらに置くか決めるとき
- **Cursor / Claude Code / Antigravity** のどれ向けか意識して書きたいとき
- **複数サブの協調**（順序・並列・レビューゲート）や **親コンテキストを汚さない分離実行** を Skill とセットで設計したいとき

## 運用パターン（要旨）

- **分離型**: リサーチ／詳細レビューはサブで広く読み、**親には要約のみ**返す（隔離実行はホストの公式で確認）。
- **協調型**: 並列または順序付きで複数サブを回し、**Skill 本文に遷移と依存**を明示する。
- **設計のコツ**: **1 サブ ＝ 1 役割**、プロンプトは**ファイル分離（PD）**、仕様レビュー → 品質レビューなど **ゲート**、リサーチは **並列 → 統合**。

詳細は [references/orchestration-and-patterns.md](references/orchestration-and-patterns.md)。

## 第3層（Read）

| ファイル | 内容 |
|----------|------|
| [references/locations.md](references/locations.md) | **ホスト別**の配置パスと優先順位 |
| [references/format.md](references/format.md) | フロントマター・本文の型（Cursor 最小、Claude Code 拡張例） |
| [references/descriptions.md](references/descriptions.md) | 委譲のきっかけになる `description` の書き方 |
| [references/workflow.md](references/workflow.md) | 作成の手順（スコープ→ファイル→試験） |
| [references/orchestration-and-patterns.md](references/orchestration-and-patterns.md) | **運用パターン**（分離・協調）と **設計のコツ**（依存明示・PD・ゲート・並列） |

## 関連

| リソース | 役割 |
|----------|------|
| **skill-builder** / **skill-growing** | **Skills**（`SKILL.md`）の新規・育成。本スキルは **Subagents**（別の定義ファイル群）。 |
| **cursor-rules** | `.cursor/rules/*.mdc`。ルールとサブエージェントは別物。 |
| **skill-folder-spec.md** | スキル配置のホスト差（§9）。サブエージェントのパス差は **locations.md** を正とする。 |
| **layer-skill-design** | 共有プロンプト置き場（`prompt/` / `os/`）とスキル群の整理。§2.3 の PD と併用可。 |

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

### エラー: マルチサブの手順が毎回違う・ゲートをすっ飛ばす

**原因**: Skill 側に依存関係と「次に起動する相手」が書かれていない。

**対処**: [references/orchestration-and-patterns.md](references/orchestration-and-patterns.md) §2.2・§2.4。親 **Skill** の本文または `references/` に遷移を固定する。
