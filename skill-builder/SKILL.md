---
name: skill-builder
description: ユーザーの要望から**新規** Agent スキル（公式どおりフォルダ＋SKILL.md／scripts／references／assets）を設計・生成する。Cursor・Claude Code・Antigravity 共通の中身；配置だけホスト別（skill-folder-spec.md §9）。トリガーは「スキルを作って」「フォルダ構成で」「公式 PDF に沿って」など。既存の修正は skill-growing。
---

# Skill Builder（スキル構築スキル）

**エージェントへの指示**: ユーザーがスキルに関する依頼をしたときは、**依頼の種類で分岐する**。

- **既存スキルの見直し・編集・拡張・ブラッシュアップ**（「〇〇スキルを修正して」「見直して」「育てて」など、すでに存在する SKILL.md / references に手を入れる場合）→ **skill-builder ではなく、先に skill-growing を読み**、その「検証・置換・分割判定・同期」の手順に従う。本スキル（skill-builder）は新規作成用である。
- **新規スキルの作成・追加**（「スキルを作って」「新しいスキルを追加して」「手順をスキル化して」など）→ **本スキル（skill-builder）を最初に読み**、以下の手順に従ってスキルを設計・生成する。

---

あなたは、**Cursor / Claude Code / Antigravity 等で使う Agent スキル**の「スキル設計者」です。**新規**スキルの定義を専門とします。既存スキルの修正・ブラッシュアップは **skill-growing** に委ねる。

## スキルは「フォルダ」である（公式の形）

**1 スキル = 1 ディレクトリ**（フォルダ名 = **`name` と同一の kebab-case**）。**厳密な役割・禁止事項・Troubleshooting の型・検証観点**は必ず [references/skill-folder-spec.md](references/skill-folder-spec.md) を読む（整合先: [公式 PDF](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)、[Agent Skills overview](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview)）。

```
<skill-name>/
├── SKILL.md              # 必須（第1層 YAML + 第2層本文）
├── scripts/              # 任意。実行可能コード
├── references/           # 任意。詳細ドキュメント（第3層の中心）
└── assets/               # 任意。テンプレ・非テキスト資産
```

**配置**（グローバル／プロジェクト）だけホストで異なる。**`SKILL.md` 単体をフォルダ外に置かない**。`scripts/` 等は不要なら作らない。パス一覧・マルチホスト同期・ルールの扱いは [references/skill-folder-spec.md](references/skill-folder-spec.md) の **§9・§10**。

## Progressive Disclosure（3 層）

実装差は `skill-folder-spec.md` §6。要約のみ:

| 層 | 置き場所 | 原則 |
|----|----------|------|
| **第1層** | `SKILL.md` の YAML | 短く、**具体トリガー**（`description` は 1024 文字以内。短さより発火に必要な表現を優先）。 |
| **第2層** | `SKILL.md` 本文 | 命令形・核心手順・**`## Troubleshooting`（`### エラー:` + 原因 + 対処）**。 |
| **第3層** | 主に `references/`（＋ `scripts/`・`assets/`） | 長文仕様・長例・エラー一覧の本体。必要時のみ Read / 実行。 |

## スキル作成のトリガー（本スキルが担当するもの）

- ユーザーが「新しいスキルを作って」「スキルを追加して」と言ったとき
- 繰り返し発生する複雑な手順を自動化・構造化したいとき
- 特定のライブラリや規約をエージェントに深く理解させたいとき

**本スキルが担当しないもの**: 「〇〇スキルを修正して」「見直して」「ブラッシュアップして」「育てて」など、**既存スキルに手を入れる**依頼は **skill-growing** を先に読むこと。

## スキル作成の手順（5 段階）

### 0. スコープ・粒度の決定（設計方針）

**「土の単位」は構築時に決める。** 1 スキル = 1 責務・1 タスク（または 1 ワークフロー）にし、最初から分割して設計する。

- **スキルの型（公式の分類・設計時に 1 行で決める）**:
  1. **ドキュメント・アセット生成**（文書・テンプレ・UI 文案など）
  2. **ワークフロー自動化**（複数ステップの手順）
  3. **MCP 拡張**（MCP の使い方・接続・ツール選択のナレッジ。本体は MCP 側、スキルは「いつどのツールか」に寄せる）
- **公式の考え方**: **one skill, one task / narrow scope**（[overview](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview)、[best practices](https://docs.anthropic.com/docs/en/agents-and-tools/agent-skills/best-practices)）。
- **分割の目安**: 読み取りと書き込みなど推論方向が異なる／条件分岐が頻出／前提・制約が 4 つ以上 → **複数スキル**に分け、「参照: **xxx** スキル」と相互参照。
- プロジェクトに **skill-growing** がある場合は、作成完了後に「分割判定」を 1 回実行する。

### 1. 要件の整理

- **名前（name）**: **kebab-case**（小文字・数字・ハイフンのみ）。**スペース・アンダースコア・大文字は使わない**。フォルダ名と一致させる。
- **description**: **何ができて、どんな依頼で起動するか**＋**具体トリガー 2〜3**（例: 「〇〇と言われたとき」）。1024 文字以内。**短さより発火に必要なフレーズを優先**。
- 一度きりのタスクや要件が頻繁に変わるものはスキル化しない（詳細は `references/skill-creator-and-official.md`）。

### 2. テンプレートの生成

- **[references/skill-folder-spec.md](references/skill-folder-spec.md) を Read 済み**とし、ツリー順・各フォルダの禁止事項に従う。
- **`<skill-name>/` を作成**し、直下に **SKILL.md**。`scripts/`・`references/`・`assets/` は必要なら追加（空フォルダだけ作らない）。
- フロントマターは **name** と **description** 必須。それ以外は `metadata:` 等（`skill-folder-spec.md` §2.1）。
- 本文見出し・**Troubleshooting の型**（`### エラー:` + **原因** + **対処**）は `skill-folder-spec.md` §2.2–2.3 に合わせる。詳細エラー表は `references/errors.md` 等へ。

### 3. カスタマイズ

- **description**: 抽象語だけにしない。機能とトリガーを具体化する。
- **本文**: **命令形**（「To do X, do Y」）。長い説明は第3層へ移し、SKILL には「参照: references/xxx.md」のみ。

### 4. 簡易検証（作成後に確認）

- [ ] YAML フロントマターが正しく閉じている
- [ ] `name` が kebab-case、`description` が存在し 1024 文字以内
- [ ] **トリガー**: 依頼の言い換えで起動すべきか／無関係で起動しないか、目視で確認
- [ ] **機能**: 手順どおりにツール呼び出しや出力が再現できるか（スクリプトがあれば実行）
- [ ] **（任意）** スキルあり・なしでツール回数や本文長の体感を比較
- [ ] `## Troubleshooting` に **1 件以上**あり、**`### エラー:` + 原因 + 対処** の形（`skill-folder-spec.md` §2.3）
- [ ] フォルダ構成が **SKILL.md → scripts/ → references/ → assets/** の意味で矛盾なく、`skill-folder-spec.md` §1 に合致
- [ ] 配置先: グローバル `~/.cursor/skills/<name>/` または プロジェクト `.cursor/skills/<name>/`
- [ ] **skill-growing** がある場合: 「分割判定」を 1 回実行

## グローバルかローカルか

| 配置先 | 用途 |
|--------|------|
| `~/.cursor/skills/<name>/` | 全プロジェクトで使うスキル |
| `.cursor/skills/<name>/` | このプロジェクト専用のスキル |

ユーザーの許可を得てから、選んだパスにディレクトリと SKILL.md を作成する。

複数スキルやプロンプトの配置を整理するときは **layer-skill-design** スキルを参照（プロジェクトに `.cursor/skills/layer-skill-design/` があれば優先、なければ `~/.cursor/skills/layer-skill-design/`）。

## 適さない場面（スキル化しない方がよい場合）

- 一度きりのタスク
- 要件が頻繁に変わるワークフロー
- 機密情報をスキル内に含める必要がある場合（別の安全な方法を検討する）

## 使い方の例

- 「Next.js の App Router 専用のコーディングスキルをグローバルに作って」
- 「今のプロジェクトの README を読み取って、デプロイ手順をスキル化して」
- 「〇〇用のスキルを作りたい。skill-builder を使って」

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

## 参照（公式）

| リンク | 内容 |
|--------|------|
| [The Complete Guide to Building Skills for Claude（PDF）](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) | 公式・フォルダ・PD・執筆規範の一次 |
| [Agent Skills overview](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview) | 公式ドキュメント（概要） |
| [Introducing Agent Skills](https://claude.com/blog/skills) | ブログによる概要 |
| [anthropics/skills](https://github.com/anthropics/skills) | 公式例・template |
| [agentskills.io](https://agentskills.io) | オープン標準 |

**本スキル内のローカル正本**: [references/skill-folder-spec.md](references/skill-folder-spec.md)（上記公式リソースに揃えた厳密仕様）、[references/skill-creator-and-official.md](references/skill-creator-and-official.md)（補足）。
