# スキルフォルダ仕様（厳密版）

出典を次に揃える。**矛盾する場合は公式 PDF を優先**し、製品・バージョンによる実装差は各製品のドキュメントまたは SKILL 本文で注記する。

- 公式 PDF: [The Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)
- Anthropic ドキュメント（概要・ベストプラクティス）: [Agent Skills overview](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview) など
- オープン標準の文脈: [agentskills.io](https://agentskills.io)、[anthropics/skills](https://github.com/anthropics/skills)

---

## 1. 単位とツリー（必ず守る）

- **1 スキル = 1 ディレクトリ**。ディレクトリ名 = フロントマターの **`name`**（**kebab-case** のみ。大文字・スペース・アンダースコア不可）。
- **`SKILL.md` をフォルダ外に単体置きしない**。必ず **SKILLS_ROOT**（§9）配下に `<name>/SKILL.md` として置く。

公式ガイド（PDF 等）で示される標準ツリー（**この順で説明・生成する**）:

```
<skill-name>/
├── SKILL.md              # 必須。メイン指示（第1層＋第2層）
├── scripts/              # 任意。実行可能コード
├── references/           # 任意。詳細ドキュメント（第3層）
└── assets/               # 任意。テンプレ・非テキスト資産
```

`scripts/`・`references/`・`assets/` は**不要なら作らない**。空ディレクトリだけ置かない。

---

## 2. `SKILL.md`（第1層＋第2層）

### 2.1 YAML フロントマター（第1層）

| ルール | 内容 |
|--------|------|
| **必須キー** | `name`, `description`（トップレベル）。 |
| **name** | kebab-case。**フォルダ名と一致**。内容が伝わる語を選ぶ（`helper` / `utils` など曖昧名は非推奨）。**予約・禁止パターン**は利用する製品・ランタイムのドキュメントに従う。 |
| **description** | **1024 文字以内**。「**何ができるか**」と「**いつ起動するか**」の両方。具体トリガー語句を列挙（公式のベストプラクティスに合わせる）。**短さより発火に必要な表現を優先**。**言語**: **skill-builder / skill-growing** で定めるとおり、**日英ハイブリッド**（日本語で用途・和文トリガー、英語でドメイン語・CLI/API 名・英語ユーザー向けキーワード）を 1 フィールドに混在させてよい。**ワークフローの手順書・段階の要約は書かない**（第2層・`references/` へ。下記「description の罠」）。 |
| **その他メタ** | `version` / `author` / `last_verified` 等はプロジェクト方針に従い、多くは `metadata:` 下に置く（検証ツール互換のためトップレベル乱立を避ける）。 |

**第1層は常に軽く効く前提**なので、長文・仕様書をここに書かない。

**発見のしかた（実装は製品依存）**: 多くの環境では、スキル選択の段階で **`name` と `description` が強く参照**される。詳細な手順は **本文を Read してから**実行する設計に寄せると、意図どおりの遵守率が上がりやすい（[Agent Skills overview](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview) の Progressive disclosure と整合）。

### description の罠（Description Trap）

`description` に**手順の要約・多段ステップの中身**まで書くと、モデルが**本文を十分に読まず** `description` だけで短絡することがある。公式が第1層を軽く保てと言うのと同趣旨で、**`description` は「いつ・どんな言葉で選ぶか」に特化**し、**どう実行するかは第2層以降**に置く。

### 2.2 本文（第2層）

| ルール | 内容 |
|--------|------|
| **文体** | **命令形**（「To do X, do Y」「〜すること」）。 |
| **含める** | エージェントが**すぐ実行できる手順**、判断分岐の最小限、**Troubleshooting**、第3層への**参照パス**（1 行）。 |
| **含めない** | 長い API 仕様・大規模なコピペ例・詳細なエラー一覧の本体 → **`references/`** へ。繰り返し実行するコード本体 → **`scripts/`** へ。 |

**推奨見出し**（英日いずれかで統一）:

- `#` スキル名
- `##` When to use / いつ使うか
- `##` How to use / 手順
- `##` Troubleshooting（**必須**）
- `##` Examples（任意）

### 2.3 `## Troubleshooting`（ガイド推奨形式）

各項目は **見出し + 原因 + 対処** の 3 点セットにする（公式 Complete Guide で推奨される Troubleshooting の型に合わせる）。

```markdown
## Troubleshooting

### エラー: （ログや UI に出る短いラベル）

**原因**: （1〜2 文）

**対処**: （具体的な 1 手順以上）
```

- SKILL 内には**典型 1〜3 件**まで。増えたら **`references/errors.md`** 等に移し、SKILL には「詳細は references/errors.md」と 1 行。

---

## 3. `scripts/`（任意）

| ルール | 内容 |
|--------|------|
| **役割** | 検証・スキャフォールド生成・データ取得など、**エージェントが実行するコード**。 |
| **禁止** | API キー・パスワードのハードコード。 |
| **SKILL 側** | 各スクリプトの**目的・前提（言語・cwd）・実行例**を短く書く。 |
| **品質** | 可能なら決定的・再現可能。副作用は SKILL に明記。 |

---

## 4. `references/`（任意・第3層）

| ルール | 内容 |
|--------|------|
| **役割** | API 仕様、長い手順、**エラーパターン一覧**、プラットフォーム別ドキュメント、調査ログ。 |
| **分割** | ファイルが肥大化したら**トピック別ファイル**に分ける（例: `api-guide.md`, `errors.md`, `examples/`）。 |
| **SKILL からの参照** | `references/相対パス` を明示。エージェントは必要時に Read する。 |

---

## 5. `assets/`（任意）

| ルール | 内容 |
|--------|------|
| **役割** | テンプレ `.json` / `.yaml`、画像、**そのままコピーする雛形**など。 |
| **SKILL 側** | ファイル名と用途のみ。中身の説明が長い場合は `references/` に回す。 |

---

## 6. Progressive Disclosure（3 層との対応）

| 層 | 置き場所 | 原則 |
|----|----------|------|
| 第1層 | `SKILL.md` 先頭の YAML | 短く、トリガー明確。 |
| 第2層 | `SKILL.md` 本文 | 核心手順と最小限の Troubleshooting。 |
| 第3層 | `references/`（＋必要なら `scripts/`・`assets/`） | 重い情報はここだけ。 |

---

## 7. スキルの 3 分類（設計時に 1 行で決める）

1. **ドキュメント・アセット生成型**（文書・デザイン・コード生成の型）
2. **ワークフロー自動化型**（複数ステップの手順）
3. **MCP 拡張型**（MCP の使い方・ツール選択・接続手順のナレッジ）

---

## 8. 検証の 3 観点（リリース前）

1. **トリガー**: 言い換えで発火するか、無関係では発火しないか。
2. **機能**: 手順・スクリプトの出力が期待どおりか。
3. **（任意）パフォーマンス**: スキルあり/なしでツール回数・本文量の体感。

---

## 9. スキルルートと配置（環境・製品による差）

スキルフォルダの**中身**（§1〜8）は、Agent Skills の一般的な形として環境を問わず同一とみなす。差は **どのディレクトリがスキルルートとして解釈されるか**だけ。

### 9.1 一般形（命名・パス）

| 用語 | 意味 |
|------|------|
| **SKILLS_ROOT** | エージェントがスキル一覧を読みにいく**親ディレクトリ**。製品・バージョンで異なる。**公式ドキュメントで確認する。** |
| **配置** | `<SKILLS_ROOT>/<skill-name>/` に `SKILL.md`（必須）と任意の `scripts/`・`references/`・`assets/`。 |

- **スコープ**: 多くの製品は **ユーザー（グローバル）** と **ワークスペース（プロジェクト）** のいずれかに SKILLS_ROOT を置く。**同一 `name` を両方に重ねない**（優先順位が不明・衝突を避ける）。

### 9.2 参考: 代表的な製品での SKILLS_ROOT 例

以下は **例示**であり、パスは変更されうる。**運用前に各製品の公式を正とする。**

| 製品・系統 | グローバル（ユーザー） | ワークスペース（プロジェクト） |
|------------|------------------------|--------------------------------|
| Cursor（例） | `~/.cursor/skills/<skill-name>/` | `.cursor/skills/<skill-name>/` |
| Claude Code（例） | `~/.claude/skills/<skill-name>/` | `.claude/skills/<skill-name>/` |
| Google Antigravity（例） | `~/.gemini/antigravity/skills/<skill-name>/` | `.agent/skills/<skill-name>/` |

- Antigravity の例は [Authoring Google Antigravity Skills（Google Codelabs）](https://codelabs.developers.google.com/getting-started-with-antigravity-skills) を参照。
- Claude の Agent Skills 概要: [Agent Skills overview](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview)。

### 9.3 ルール（常時ガードレール）— スキルとは別機構

「同じルールを適用」するときは、**ポリシー本文の正本を 1 か所**に置き、各製品の**決められたディレクトリと拡張子**へ反映する（メタデータ形式は一致しない）。

| 製品・系統（例） | 主な配置（例） | メモ |
|------------------|----------------|------|
| Cursor | `.cursor/rules/*.mdc`、`~/.cursor/rules/` | YAML フロントマター（`alwaysApply` / `globs` 等） |
| Claude Code | `.claude/rules/*.md`、`~/.claude/rules/` | フロントマターで `paths:` 等（[Memory / プロジェクト指示](https://code.claude.com/docs/en/memory)） |
| Antigravity | ワークスペースの Rules（UI や `.agent/rules/` 等。**製品更新で変わりうる**） | **AGENTS.md** / **GEMINI.md** で共有する例も多い |

拡張子・キーが製品ごとに異なるため、**見出し単位の共通 Markdown** を正本にし、製品別ファイルは薄くするか、生成スクリプトで複製するのが扱いやすい。

---

## 10. 複数環境での運用（1 正本・複数配置）

### 10.1 スキルフォルダ

1. **正本を 1 つ**: 例 `~/dev/agent-skills/<skill-name>/` や専用 Git リポジトリ。
2. **各環境の SKILLS_ROOT（§9.2 の例を参照。公式で確認）へ** コピー、または **シンボリックリンク / ディレクトリ ジャンクション**（Windows は `mklink /J` 等で同期コストを下げられる）。
3. **変更は正本のみ** → `robocopy` / `rsync` / 小さな同期スクリプトで配布。

特定の製品だけが解釈するメタデータがある場合は、**`references/product-<name>.md` に隔離**し、SKILL 本文と YAML は可能な限り共通のままにする（旧称 `host-<name>.md` も可）。

### 10.2 ルール

- リポジトリ直下の **AGENTS.md**（または `docs/agent-rules.md`）を**人間・全ツール共通の正本**にし、`.mdc` / `.claude/rules/` 等には要約＋「詳細は AGENTS.md §X」と書く方法がシンプル。
- 完全に形式を揃えたい場合は、正本から各製品形式を**生成するスクリプト**を別リポジトリや `scripts/` に置く（スキル化の候補）。
