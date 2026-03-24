---
name: wbs
description: PJC の内容をもとに WBS（Work Breakdown Structure）を書く。スキル内のレファレンス（考え方・5ステップ・構成・チェックリスト）に沿い、成功状態・スコープは PJC と一致させる。「wbsを作って」「WBSをスプレッドシートに反映して」で発動。
last_verified: 2026-03-17
---

# WBS 作成スキル

**WBS は PJC の内容をもとに書く。** 成功状態・スコープは PJC と一致させ、そのうえで主要素・タスク・肝タスクを展開する。

## 使うレファレンス（毎回ここを参照する）

| ファイル | 内容 |
|----------|------|
| [references/slides-wbs-thinking.md](references/slides-wbs-thinking.md) | 考え方・WBS の定義・大原則（MECE・スコープ）・5ステップ・肝タスク・70%主義 |
| [references/wbs-structure.md](references/wbs-structure.md) | サンプルシートの構成・列定義（NO.／大項目／中項目／小項目／タスク／ステータス／オーナー等） |
| [references/wbs-checklist.md](references/wbs-checklist.md) | チェックリスト（MECE・スコープ・肝タスク・70%前提・全体） |

## トリガー

- 「wbsを作って」「WBSを書いて」「PJCをもとにWBSを作って」
- 「WBSを〇〇スプレッドシートに反映して」「WBSをシートに書いて」

## 前提

- **WBS は PJC の内容をもとに書く。** PJC の背景・目的・成功状態・スコープ・内容・方法をベースに、成功状態・スコープは PJC と一致させる。
- **型**は上記 3 レファレンスを参照する。
- gws で `--params` に JSON を渡す実装では [gws-params-encoding](../gws-params-encoding/SKILL.md) を参照する。

## 手順（5 ステップに沿う）

### 1. レファレンスを読む

- **構成**は [references/wbs-structure.md](references/wbs-structure.md) を読む。
- **考え方**は [references/slides-wbs-thinking.md](references/slides-wbs-thinking.md) を読む。
- **チェックリスト**は [references/wbs-checklist.md](references/wbs-checklist.md) で確認する。

### 2. Step 1：成功状態・スコープを決める（Why）

- **PJC から**目的・成功状態とスコープ（In/Out）を引き継ぐ。

### 3. Step 2：主要素に分解する（What）

- PJC の「内容・方法」や開発計画から、成果物・フェーズを大項目として並べる。

### 4. Step 3：課題・懸念の洗い出しと肝タスク（最重要）

- リスク・前提条件・未決定事項を QCD 観点で洗い出す。
- その対策タスク＝**肝タスク**を WBS に明示する。

### 5. Step 4：タスクベースに分解

- 各主要素の下にタスクを並べる。肝タスクを重点に。粒度は 70% 程度でよい。

### 6. Step 5：メンバー共有・意見反映

- 出力した WBS をベースに認識合わせする。

### 7. チェックリストで確認

- [wbs-checklist.md](references/wbs-checklist.md) を確認する。

### 8. 出力形式

- Markdown・スプレッドシート用 values・CSV のいずれか。指定がなければ Markdown。

## スプレッドシートに反映するときのルール

- **列と項目の対応**は [wbs-structure.md](references/wbs-structure.md) に合わせる。ラベル行と値行を混同しない。
- **「└」はタスクが階層（親の直下の子タスク）になっているときのみ**タスク列に付ける。
- **肝タスク**を欠かさず含める。
- **70% 主義**: 完璧な粒度より抜け漏れ防止。

## エラー時

- **401 / No credentials** → `gws auth login -s sheets` を実行する。
- **403 insufficient authentication scopes** → スコープを付けて再ログインする。
- **404 や range エラー** → spreadsheetId とシート名を確認する。

## 参照

- 考え方・5ステップ: [references/slides-wbs-thinking.md](references/slides-wbs-thinking.md)
- 構成・列定義: [references/wbs-structure.md](references/wbs-structure.md)
- チェックリスト: [references/wbs-checklist.md](references/wbs-checklist.md)

## Troubleshooting

### エラー: gws で読めない・書けない

**原因**: スコープ、ファイル ID 誤り、共有設定。

**対処**: **gws-drive** / **gws-sheets-*** と **gws-params-encoding** を確認し、ID と range を再確認する。

### エラー: Sheets API（Node 等）で更新できない

**原因**: 認証、シート名・range の誤り、権限。

**対処**: **sheet-api-update** の前提を確認し、API の有効化と認証情報を見直す。

