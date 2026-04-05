---
name: frontend-design
description: "Webコンポーネント・ページ・ダッシュボード・ランディングページなど新規UIを作るとき。DESIGN.md でデザイントークンを管理しつつ大胆な美的方向性を実装。Triggers: UIを作って, かっこよくして, build a landing page, create a UI for X, make it look great, style/beautify web UI, avoid AI slop aesthetics."
metadata:
  last_verified: "2026-04-05"
  sources:
    - https://github.com/anthropics/skills/tree/main/skills/frontend-design
    - https://stitch.withgoogle.com/docs/design-md/overview
---

# Frontend Design Skill

Implements distinctive, production-grade frontend UI backed by a living `DESIGN.md` design system. Two goals: **unforgettable aesthetics** (Anthropic) and **brand consistency** (Stitch). Consistency is what makes bold design repeatable.

> **UI レビュー・既存改善のみなら**: Phase 3 の Visual Checklist だけ使えばよい。新規作成なら Phase 1 から順に進む。

## When to Use

- 新規 Web コンポーネント・ページ・ダッシュボード・アプリを作るとき
- 既存 UI のスタイリング・美化
- デザインシステムを一貫して拡張するとき
- `ui-frontend-patterns` でチェック対象が大きすぎるとき（→ こちらで全体設計から）

---

## Phase 1 — Design Thinking（コードの前に）

### 1-A. DESIGN.md を確認

プロジェクトルートまたは親ディレクトリに `DESIGN.md` があれば全文 Read する。トークンは**提案ではなく制約**。→ Phase 2 へ。

なければ 1-B → 1-C → DESIGN.md 生成。

### 1-B. コンテキストを把握

- **Purpose**: このUIが解く問題は何か？誰が使うか？
- **Tone**: 感情的なトーンは何か？（信頼・遊び・プレミアム・緊迫・落ち着き…）
- **Constraints**: フレームワーク・パフォーマンス・アクセシビリティ要件
- **Differentiation**: このUIで1つだけ覚えてもらえるとしたら何か？

### 1-C. 大胆な美的方向性を決める

1つ選んで名前をつけ、そこに全力を注ぐ:

| 方向性 | 性格 |
|---|---|
| Brutally minimal | フォント1つ・色2つ・沈黙 |
| Maximalist editorial | 密度高・層・雑誌エネルギー |
| Retro-futuristic | CRTグロー・モノスペース・ネオン |
| Organic / natural | 暖色・不規則な形・テクスチャ |
| Luxury / refined | ゴールドアクセント・広い余白・セリフ |
| Industrial / utilitarian | グリッド・サンセリフ・機能密度 |

**禁止**: Inter/Roboto/Arial をデフォルトに、白地に紫グラデ、ありきたりなカードレイアウト、Space Grotesk を「おしゃれな選択」として。

---

## Phase 2 — DESIGN.md（唯一の真実）

### 読む場合

各トークンをハードルールとして扱う:
- 色の hex → そのまま使用、代用禁止
- フォント → ファイル更新なしに新フォント導入禁止
- スペーシング → 定義済みスケール内に留まる
- コンポーネント記述 → 形状言語と elevation に準拠

### 書く場合（新規プロジェクト）

美的方向性を決めた後、UIコードより先に生成する。詳細テンプレート: `references/design-md-template.md`

**記述ルール**:
- 色: 説明的な名前 + hex + 役割。`"Ocean-deep Cerulean (#0077B6) — primary actions"`
- 形状: CSS値ではなく物理的な記述。`"Pill-shaped"` not `"rounded-full"`
- 影: CSSではなく質感で。`"Whisper-soft diffused shadow"` not `"0 2px 4px …"`

```markdown
# Design System: [Project Name]

## 1. Visual Theme & Atmosphere
## 2. Color Palette & Roles
## 3. Typography
## 4. Spacing & Layout
## 5. Component Stylings
## 6. Motion & Interaction
```

---

## Phase 3 — 実装

### コード品質基準

- **本番品質**: 動く実装、プロトタイプシェル禁止
- **スタック適合**: React / Vue / HTML+CSS をプロジェクトに合わせる
- **アクセシブル**: WCAG AA コントラスト、セマンティック HTML、キーボード操作
- **レスポンシブ**: 特段の理由がなければモバイルファースト

### タイポグラフィ

- ディスプレイフォント × ボディフォントをペアリング
- Google Fonts またはローカル — システムフォントスタック単体禁止
- CSS カスタムプロパティでタイプスケールを定義

### カラー & テーマ

```css
:root {
  --color-primary: #1A73E8;
  --color-surface: #F8F9FA;
  --color-text-primary: #1C1C1E;
  --color-accent: #EA4335;
}
```

支配的な色 + シャープなアクセント > 均等分散の無難なパレット。

### モーション

- HTML アーティファクトは CSS のみ、React では Motion ライブラリ推奨
- ページロード時の staggered reveal（`animation-delay` 60ms ずつ）1発 > 散発的なマイクロインタラクション多数
- `prefers-reduced-motion` 必須対応

### Visual Checklist（レビュー・確認用）

- [ ] コントラスト: 本文テキストが WCAG AA (4.5:1) を満たしているか
- [ ] タイプ階層: display / heading / body / caption が視覚的に区別できるか
- [ ] 主要 CTA: アクセントカラーで明確に支配的か
- [ ] スペーシング: グルーピングが明確、DESIGN.md のスケールと一致するか
- [ ] 状態: hover / focus / active / disabled / loading / error をカバーしているか
- [ ] モバイル: タッチターゲット ≥ 44px、360px 幅で可読か
- [ ] モーション: アニメーションが美的方向性に奉仕しているか
- [ ] DESIGN.md 整合: 未登録の色・フォント・radius 値を導入していないか

---

## Phase 4 — DESIGN.md を更新

実装後、新パターンが生まれたら更新:
- 新コンポーネントスタイル → Section 5 に追記
- 新アニメーションパターン → Section 6 に追記
- 色の使い方の調整 → Section 2 を更新

DESIGN.md をデザインの意図とコードの間の**生きた契約**として維持する。

---

## Troubleshooting

### DESIGN.md を読んだのにUIがブレる

**原因**: カラー hex を近似値で代用した、またはフォントを追加した。

**対処**: Phase 2「読む場合」のルールを再確認。変更が必要なら DESIGN.md を先に更新してからコードを書く。

### 美的方向性が定まらずコードが迷走する

**原因**: Phase 1-C をスキップしてコードを書き始めた。

**対処**: 先にテーブルから方向性を1つ選び、名前をつける（例: "Industrial minimal"）。その後コードを書く。

### 既存UIのちょっとした修正には重すぎる

**対処**: Phase 3 の Visual Checklist だけを使う。DESIGN.md があれば token に従う。なければチェックリスト単体で十分。

---

## Reference

- `references/design-md-template.md` — DESIGN.md の空テンプレート
- [Anthropic frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design) — 美的哲学とアンチパターン
- [Google Stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/overview) — デザインシステムマニフェスト形式
