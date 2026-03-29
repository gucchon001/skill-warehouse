# スキル執筆の補足（旧メタスキル統合）

**旧スキル** `skill-authoring` / `skill-descriptions` / `skill-patterns` / `skill-requirements` / `skill-scripts` の実用部分を集約。厳密仕様は **skill-folder-spec.md**、新規手順は **skill-builder** の `SKILL.md`、既存の圧縮・置換は **skill-growing**。

---

## 作成前チェック（要件の整理）

スキル化の前に把握する:

1. **Purpose and scope**: どのタスク／ワークフローか
2. **Target location**: 個人 `~/.cursor/skills/` か プロジェクト `.cursor/skills/` か
3. **Trigger scenarios**: エージェントがいつ自動適用すべきか
4. **Key domain knowledge**: 特化して渡す知識
5. **Output format**: テンプレ・体裁の必須
6. **Existing patterns**: 従うべき規約・例

会話から推測できる場合は確認を省略してよい。

**禁止**: **`~/.cursor/skills-cursor/`** にユーザー用スキルを置かない（Cursor 組み込み用の予約領域）。

---

## 執筆原則（簡潔さ・PD・自由度）

- **Concise**: エージェントが既に知っていることは書かない。各段落で「本当に必要か」を問う。
- **SKILL.md は薄く**: 詳細は `references/`。行数目安は **skill-folder-spec** と **skill-growing**（原則 SKILL を肥大化させない）に従う。
- **Progressive disclosure**: 核心は `SKILL.md`、詳細は **1 階層**の `references/` へ。深いネストは避ける。
- **Degrees of freedom**:
  - **High**（テキストのみ）: 複数妥当解（例: コードレビュー）
  - **Medium**（テンプレ）: 推奨パターン＋許容される変形
  - **Low**（スクリプト固定）: 壊れやすい／一貫性が必須な手順
- **時期に依存する表現**は避ける（「2025年8月まで」等）。必要なら「現行」「レガシー」で分ける。

---

## `description` の文体（補足）

**skill-builder** の「description（日英ハイブリッド）」§ が標準。追加の指針:

- **三人称**: 「Processes Excel…」— 「I can help…」「You can use…」は避ける。
- **WHAT / WHEN**: 能力と、エージェントが使うべき状況。
- **Description Trap**: 手順の要約は `description` に書かない（**skill-folder-spec.md** の「description の罠」）。

例:

```yaml
# Good
description: Extract text and tables from PDFs, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# Too vague
description: Helps with documents
```

---

## 本文のパターン（ガイドの型）

### Template

出力形式を定義する（例: レポート見出し構造）。

### Examples

品質が敏感なときは具体例（入力 → 出力）。

### Workflow

番号付き手順 ＋ 任意チェックリスト。エージェントが進捗を追えるように。

### Conditional

「If X → A; if Y → B」の分岐。

### Feedback loop

実行後に検証（例: スクリプト）。失敗したら修正してから次へ。

タスクの壊れやすさ・一貫性要件に合わせて選ぶ。

---

## `scripts/` の使い方

生成コードよりスクリプトの方が再現性が高くトークンも節約しやすい。

- **When**: 壊れやすい手順、編集後の検証など一貫性が重要なとき
- **Where**: `skill-name/scripts/`（例: `validate.py`, `helper.sh`）
- **Paths**: `scripts/helper.py` のように **スラッシュ**（Windows でもバックスラッシュにしない）

`SKILL.md` では、エージェントがスクリプトを**実行する**のか**参照として読む**のかを明記する。依存パッケージと実行例（例: `python scripts/validate.py output/`）を書く。デフォルト手順を 1 つにし、逃げ道は必要なときだけ（例: OCR で `pdf2image` 代替）。
