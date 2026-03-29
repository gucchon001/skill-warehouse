---
name: claude-md-workflow-routing
description: "CLAUDE.md にワークフロールーティング表を置き、状況→スキル対応とショートカット禁止を明示する。Triggers: CLAUDE.md, ルーティング, workflow routing, ショートカット禁止, どのスキル使う, MJ routing."
metadata:
  last_verified: "2026-03-31"
---

# claude-md-workflow-routing

**目的**: リポジトリの **CLAUDE.md**（または AGENTS.md）に **いつどのスキルを読むか**を表形式で固定し、**暗黙のショートカット**を減らす。インスピレーション: [MJ / note](https://note.com/mj3880/n/n2d28e12cb7a3)。

## 手順

1. [references/routing-table-template.md](references/routing-table-template.md) をコピー。
2. プロジェクトに実在するスキル・ルールに列を合わせる（グローバル skill-warehouse とプロジェクト `.cursor/skills` の両方を考慮）。
3. **ショートカット禁止**を 2〜4 行で明文化（push 前ゲート、実装前批判など）。
4. **workflow-task-agent-ref-layers** で WF / Task の語彙と整合させる。

## 関連スキル

| スキル | 関係 |
|--------|------|
| **workflow-task-agent-ref-layers** | 表の「WF」「Task」の定義 |
| **pre-implementation-critics** | 実装前ルートの典型行 |
| **local-quality-gate** | PR 前ルートの典型行 |
| **skill-growing** | CLAUDE.md 自体のメンテ頻度が高いときに併用 |
| **find-skills** | 表に無い依頼の検索補助 |

## Troubleshooting

### エラー: 表が肥大化

**対処**: 頻出 5 行だけ CLAUDE.md に残し、残りは **find-skills** かプロジェクト `docs/` へ。

### エラー: エージェントが表を無視

**対処**: 親指示の先頭に「**CLAUDE.md のルーティング表に従え**」を 1 行入れる。**cursor-rules** で alwaysApply を検討。
