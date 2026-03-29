---
name: code-review-subagents
description: "コードレビューをサブエージェントに委譲する。パターンA 単一 code-reviewer、パターンB 仕様→品質の2段は automated-2stage-review。Triggers: コードレビュー サブエージェント, subagent code review, PR review delegate, レビュー 委譲, Claude Code agents review."
metadata:
  last_verified: "2026-03-31"
---

# code-review-subagents

**役割**: メインエージェントは **オーケストレーション**に留め、**読み取り・分析の本体**をサブエージェントに任せてコンテキストを節約する。サブの書き方・マルチエージェント一般論は **subagent-authoring**。

## パターンの選び方

| パターン | 使うとき | 使うスキル / ファイル |
|----------|----------|------------------------|
| **A: 単一レビュアー** | 小さめ PR、仕様が明確、1 回のレビューで足りる | **本スキル** + [references/single-reviewer-checklist.md](references/single-reviewer-checklist.md) |
| **B: 2 段（仕様ゲート → 品質）** | 仕様逸脱の早期検出を必須にしたい、手戻りを減らしたい | **automated-2stage-review** を Read して従う（Iron Law はそちら） |

## パターン A — 手順

1. プロジェクトに `code-reviewer` サブを置く（[references/code-reviewer-subagent.example.md](references/code-reviewer-subagent.example.md)）。
2. 本スキルを適用したエージェントが、サブ起動時に **チェックリスト**として `references/single-reviewer-checklist.md` を Read するよう指示する。
3. サブには **差分・対象パス・要件参照**を渡す。サブの出力（要約・指摘）だけをメインに戻す。

## パターン B — 手順

**automated-2stage-review** の `SKILL.md` と `references/` をそのまま使う（`spec-reviewer` / `code-quality-reviewer`）。本スキルと二重に Iron Law を書かない。

## 原則（軽量）

- **1 サブ ＝ 1 役割**（単一レビュアーでも「レビューのみ」。実装修正は別タスク）。
- チェックリストは **SKILL.md に貼らず** `references/` を Read（PD）。
- 編集ツールはサブに **付けない**運用を推奨（ホストの `tools` で制御）。

## 関連スキル

| スキル | 役割 |
|--------|------|
| **automated-2stage-review** | 仕様準拠 → 合格後のみ品質の **2 段パイプライン** |
| **subagent-authoring** | 配置・形式・協調パターン |
| **skill-builder** / **skill-growing** | チーム用に本スキルを fork・調整するとき |

## Troubleshooting

### エラー: サブがレビューせずに書き換える

**原因**: 編集系ツールが有効。

**対処**: `tools` を Read / Grep / Glob 等に限定（[code-reviewer-subagent.example.md](references/code-reviewer-subagent.example.md)）。

### エラー: 仕様と品質が混線する

**原因**: 大きい変更なのにパターン A を使っている。

**対処**: **automated-2stage-review**（パターン B）に切り替える。

### エラー: メインのコンテキストがまだ膨らむ

**原因**: サブに全文ログを戻している。

**対処**: **subagent-authoring** の [orchestration-and-patterns.md](../subagent-authoring/references/orchestration-and-patterns.md)（分離型）。要約と指摘一覧に限定して返させる。
