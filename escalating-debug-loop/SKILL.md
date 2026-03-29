---
name: escalating-debug-loop
description: "修正が2回以上効かない・品質ゲートが同じ段で連続失敗するとき、一旦停止してWeb調査＋並列クリティックで仮説を立て直す。Triggers: escalation, デバッグ エスカレーション, stuck bug, 直らない, debug loop, 試行錯誤 止める."
metadata:
  last_verified: "2026-03-31"
---

# escalating-debug-loop

**目的**: 闇雲な試行で回数だけ増える状況を避ける。インスピレーション: [MJ / note（エスカレーション）](https://note.com/mj3880/n/n2d28e12cb7a3)。

## いつ使うか

- **2 回**の修正試行後もバグが再現する。
- **local-quality-gate** で同じ段が **3 回**連続で失敗する。

## 手順

1. [references/escalation-protocol.md](references/escalation-protocol.md) の **E1→E2→E3→E4** を実行。
2. E3 では **pre-implementation-critics** の [default-critic-prompts.md](../pre-implementation-critics/references/default-critic-prompts.md) を **デバッグ向けに言い換えた**プロンプトで 3 サブを回してよい（統合は同スキルの merge-synthesis に準拠）。

## 関連スキル

| スキル | 関係 |
|--------|------|
| **systematic-debugging** | **先に**切り分けの型を当てる（本スキルは停滞後） |
| **pre-implementation-critics** | E3 の並列批判の型を流用 |
| **local-quality-gate** | 3 連敗時の入口 |
| **subagent-authoring** | サブ配置・分離 |

## Troubleshooting

### エラー: エスカレーション後も迷走

**原因**: E2 を飛ばしている、E3 と E4 が混線。

**対処**: escalation-protocol の順序を固定し、**1 主仮説**に絞ってからパッチ。

### エラー: サブがコードを書き換える

**原因**: レビュー用でなく調査用にツールを絞る。

**対処**: **subagent-authoring** の読み取り中心方針。
