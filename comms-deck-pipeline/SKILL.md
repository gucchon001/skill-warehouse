---
name: comms-deck-pipeline
description: 全社・共有会向けデッキのワークフロー（脚本CANONICAL・枚構成CANONICAL_slides・NotebookLM下書き・Marp完成・聴衆別派生）を一貫させる。Triggers: 全社デッキ, CANONICAL_slides, NotebookLM 下書き, 聴衆別スライド, deck workflow, スライド資産, つぎはぎ, 編集可能スライド
intent: >-
  Align narrative (CANONICAL.md), slide structure (CANONICAL_slides.md), NotebookLM studio drafts, and Marp/PPTX finish so outputs are editable, audience-appropriate, and not patchwork. Single source of truth lives in docs/comms/DECK_WORKFLOW_AND_SKILLS.md.
type: workflow
---

## Purpose

補助教育ドメインなど **L2 脚本 + L3 スライド** を扱うとき、次の失敗を防ぐ。

- `CANONICAL.md` と `CANONICAL_slides.md` の **役割混線** による手戻り  
- NotebookLM の **PDF が編集しづらい** のに、それだけを最終物にして **つぎはぎ** が増える  
- **聴衆別の深さ** をプロンプト1本で期待してズレる  

**正本（人間が読む手順書）:** `docs/comms/DECK_WORKFLOW_AND_SKILLS.md`  
このスキルは **その正本を開き、段階とサブスキルを指示**する。

## When to Use

- 「全社デッキをまた作る」「NotebookLM で下書きしてから整えたい」  
- 「CANONICAL と CANONICAL_slides のどちらを直すか迷う」  
- 「一発完成に近づけたいが NL だけでは限界と感じる」  
- 「聴衆別に派生デッキを作りたい」

## Workflow (summary)

実行順は正本の **§4 推奨ワークフロー v1** に従う。要約:

1. **storyboard** — 6フレームでストーリー合意  
2. **storybrand-messaging** — 一行メッセージと聴衆  
3. **executive-briefing**（任意）— 経営・全社向け1枚圧縮  
4. **`CANONICAL.md`** — 脚本・出典・参考資料マッピング  
5. **`CANONICAL_slides.md`** — 枚構成・Marp 正本・NL 章立てのマスタ  
6. （推奨）**スライド意図シート** — 聴衆・must_remember・primary_source（正本 §3 表）  
7. **notebooklm-slide-layout** + MCP `studio_create` / `studio_revise` — 下書き・枚修正（`docs/comms/notebooklm/README_STUDIO_SLIDES.md`）  
8. **marp-slide-style** + **slide-composer** — **編集可能な完成**（Marp → PDF/PPTX）  
9. 正本 **§6 品質ゲート** — 配布前チェック  

**チャンク生成して取捨選択・マージする場合:** 正本 **`DECK_WORKFLOW_AND_SKILLS.md` §7**。1枚である必要はない。**章・テーマごとの短い塊**で `studio_create` し、PPTX で必要スライドだけマスターへ集約する運用でよい。

## Sub-skills and docs

| 用途 | 参照 |
|------|------|
| 手順・採点軸・CANONICAL 分担 | `docs/comms/DECK_WORKFLOW_AND_SKILLS.md` |
| L0〜L3 の地図 | `docs/comms/OUTPUT_LANDSCAPE.md` |
| 聴衆別入口 | `docs/comms/INDEX.md`, `docs/comms/audience/` |
| NL ソース絞り込み | `docs/comms/notebooklm/README_STUDIO_SLIDES.md` |
| Marp スタイル | `docs/slides/style-guide.md`, `docs/slides/example-patterns.md` |

## Agent instructions

1. ユーザーの目的（聴衆・締切・最終形式 Marp/PPTX/PDF）を確認する。  
2. **`DECK_WORKFLOW_AND_SKILLS.md` を読み**、今どの段（A〜H）かを明示する。  
3. **編集可能正本**を1つ決める（推奨: `CANONICAL_slides.md` または社内 PPTX テンプレ）。NotebookLM PDF は **下書き** または **別案比較** に留めるよう提案する。  
4. 脚本と枚構成の更新が必要なら、**先に `CANONICAL.md` か `CANONICAL_slides.md` のどちらを触るか**を正本 §2 に沿って決める。  
5. 聴衆別派生は **同一プロンプトのまま聴衆だけ変えない** — 派生ファイルまたは別 `focus_prompt` + 意図シートで深さを固定する。

## Anti-patterns

- NotebookLM の PDF を **唯一のマスタ** にし、都度コピペで統合し続ける（つぎはぎの温床）。  
- `CANONICAL.md` に Marp の全スライドを複製し、**二重メンテ**する。  
- 厚いノートのまま `source_ids` 無指定で `studio_create` し、**全体ストーリー**だけを期待する。
