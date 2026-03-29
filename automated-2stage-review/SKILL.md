---
name: automated-2stage-review
description: "PR・実装コードの2段階レビューをオーケストレーションする。第1段 仕様準拠（spec-reviewer）、合格後のみ第2段 コード品質（code-quality-reviewer）。単一サブでのレビューは code-review-subagents。Triggers: 2段階レビュー, spec review then code review, PR review pipeline, automated review, 仕様レビュー 品質レビュー, コードレビュー サブエージェント 2段, Claude Code agents."
metadata:
  last_verified: "2026-03-31"
---

# automated-2stage-review

**役割**: 本スキルは **監督（オーケストレーション）**。**実際のレビュー**はサブエージェント（または同等の委譲）が担当する。サブの定義・配置は **subagent-authoring**、パターン理論は **orchestration-and-patterns.md** を参照。

## The Iron Law（順序の逸脱禁止）

- **NO code quality review WITHOUT passing spec compliance review first.**（仕様準拠レビューで **PASS** するまで、コード品質レビューを開始しない。）
- **NO merging stages** for speed（「一度にやった方が早い」で **2 段を 1 つにまとめない**。）
- 仕様レビューで **FAIL / NEEDS_INFO** のときは **品質レビューに進まない**。修正タスクを出して **中断**する。

## いつ使うか

- PR または実装済みコードについて **仕様と品質を分けて**レビューしたいとき。
- メインコンテキストを汚さず、**サブに広く読ませて要約だけ返す**運用にするとき（ホストの隔離機能は公式で確認）。

## How to use / 手順

1. **準備**: プロジェクトに `spec-reviewer` と `code-quality-reviewer` を用意する（[references/claude-subagent-examples.md](references/claude-subagent-examples.md) を `.claude/agents/` または `.cursor/agents/` にコピー・調整）。
2. **第1段**: `spec-reviewer` を起動する。チェックリストは [references/spec-reviewer-prompt.md](references/spec-reviewer-prompt.md) を Read させる。
3. **分岐**: 指摘あり・仕様不明 → **修正または仕様確認**し、**ここで終了**。**PASS** のときだけ次へ。
4. **第2段**: `code-quality-reviewer` を起動する。[references/code-quality-reviewer-prompt.md](references/code-quality-reviewer-prompt.md) を Read させる。
5. **仕様疑義が第2段で出た場合**: 品質で片付けず **第1段に差し戻し**。

各サブの本文では **読み取り中心ツール**に寄せ、編集は別タスクにする（ホストの `tools` 設定で制御）。

## 第3層

| ファイル | 内容 |
|----------|------|
| [references/spec-reviewer-prompt.md](references/spec-reviewer-prompt.md) | 仕様準拠チェックリスト |
| [references/code-quality-reviewer-prompt.md](references/code-quality-reviewer-prompt.md) | 品質チェックリスト |
| [references/claude-subagent-examples.md](references/claude-subagent-examples.md) | Claude Code / Cursor 向けサブ定義の例 |

## 関連スキル

| スキル | 役割 |
|--------|------|
| **code-review-subagents** | サブでコードレビュー全般の入口（**単一レビュアー**と本スキルの**2 段**の選び方） |
| **subagent-authoring** | サブの配置・形式・マルチエージェント運用の一般論 |
| **skill-builder** / **skill-growing** | 本スキルのカスタマイズ・チーム用 fork の育成 |

## Troubleshooting

### エラー: 品質レビューだけ走って仕様が抜ける

**原因**: Iron Law 未適用またはサブの `description` が並列起動を誘発している。

**対処**: 本スキルの **Iron Law** を親プロンプトに含める。オーケストレータが **第2段の起動条件**を毎回明示する。

### エラー: サブがファイルを書き換える

**原因**: レビュアーに編集ツールが付いている。

**対処**: ホスト設定で **Read / Grep / Glob 等に限定**（[claude-subagent-examples.md](references/claude-subagent-examples.md)）。

### エラー: コンテキストが肥大化する

**原因**: チェックリスト全文を親に貼っている。

**対処**: チェックリストは **references/** に置き、**該当サブが起動したときだけ Read**（PD）。

詳細は [subagent-authoring/references/orchestration-and-patterns.md](../subagent-authoring/references/orchestration-and-patterns.md)。
