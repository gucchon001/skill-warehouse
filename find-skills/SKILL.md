---
name: find-skills
description: "Discovers the best Agent Skill for a task from natural language. Searches the user's global and project skill libraries (YAML descriptions), then optionally the public directory (skills.sh, npx skills find). Use when the user asks which skill to use, whether a skill exists for X, skill recommendations, or 「画像最適化のスキルはある？」style queries."
metadata:
  last_verified: "2026-04-05"
  version: "1.0.0"
---

# find-skills（スキルのためのスキル）

## いつ使うか

- 「〇〇向けのスキルはある？」「最適なスキルを探して」「ローカルに画像最適化のスキルある？」など、**自然言語でスキル候補を知りたい**とき。
- エージェントがタスク開始前に**関連スキルを列挙・優先順位付け**するとき。

## 手順

### 1. 意図を言語化する

ユーザーの一文から、**ドメイン**（例: 画像、デプロイ、BigQuery）と**動詞**（最適化、デプロイ、インストール）を抜き出し、検索用キーワード 2〜6 語に圧縮する。

### 2. ローカル（最優先）を検索する

Cursor では次の**両方**を対象にする（プロジェクト固有がグローバルより優先されやすいが、検索は両方行う）。

| ルート | 典型パス（Windows は `%USERPROFILE%`） |
|--------|----------------------------------------|
| ユーザー（グローバル） | `~/.cursor/skills/<name>/SKILL.md` |
| ワークスペース | `<workspace>/.cursor/skills/<name>/SKILL.md` |

**実装方針（エージェント向け）:**

1. `Glob` で `**/SKILL.md` を上記ルート配下に限定して列挙する（広すぎるリポジトリ全体の `Glob` は避ける）。
2. 各 `SKILL.md` の先頭 YAML の **`description:`** と **`name:`** を読む（`Read` は候補が多いときはスコアリング用に先に `Grep` で絞る）。
3. **`description` の WHEN トリガー語**とユーザーのキーワードの一致・部分一致でランク付けする。
4. 上位 3〜7 件を、**スキル名（フォルダ名）・1 行要約・いつ使うか**で提示する。最適と思う 1 件を最初に推奨し、代替を続けて並べる。

**絞り込み用 `Grep` の例（概念）:** `description:` 行と `name:` 行を含むブロックを対象に、ユーザー語を OR で検索する。

### 3. ローカルに無い・不足するときは公開ディレクトリを使う

ローカルで適切なスキルが無い、または「コミュニティの定番を知りたい」ときは **`references/ecosystem.md`** の手順に従う。

- ブラウザ: [skills.sh](https://skills.sh/) でカテゴリ・人気スキルを参照する。
- CLI: `npx skills find "<query>"` でキーワード検索する（ネットワークと `npx` が使える環境のみ）。

公開スキルは**インストール先・信頼性（リポジトリ・スター・更新日）**をユーザーに明示し、勝手に大量インストールしない。

### 4. 結果の返し方

- **推奨スキル 1 つ**＋**候補 2〜5 つ**（あれば）。
- 各候補に **`name`（kebab-case）** と **フルパスまたは `~/.cursor/skills/<name>/`** を書き、`Read` で読むよう促す。
- 公開案のみのときは **skills.sh のスラッグまたは GitHub URL** と **取得手順**（`npx skills add ...` 等）を書く。詳細は `references/ecosystem.md`。

### 5. 定型タスクとグローバル固定候補（任意）

| ユーザーが言いがちなこと | 先に Read するローカルスキル（グローバル） |
|--------------------------|---------------------------------------------|
| **新しいチャットする準備**・引き継ぎ・HANDOFF・スレッド切替 | **thread-handoff**（`~/.cursor/skills/thread-handoff/`。他ホストは skill-folder-spec §9） |
| 仕様に沿って画面モックを先に、Jinja / HTMX | **spec-driven-mock-ui**（`~/.cursor/skills/spec-driven-mock-ui/`） |
| ダッシュ・トップの情報順・ファーストビュー | **dashboard-first-view-ux** |
| 新規 UI・スタイル・DESIGN.md | **frontend-design**（`~/.cursor/skills/frontend-design/`） |
| 既存 UI をさっとチェック | **ui-frontend-patterns**（新規作り込みは **frontend-design**） |

## Troubleshooting

### ヒットが多すぎる

**原因**: `description` が似た汎用スキルが多い。

**対処**: ユーザーのタスクを一段具体化（ホスト・言語・製品名）し、キーワードを増やして再ランクする。プロジェクト `.cursor/skills` をグローバルより優先表示する。

### ローカルに SKILL.md が無い・名前とフォルダが不一致

**原因**: 配置ミスや旧形式の単体 `SKILL.md` 置き。

**対処**: **skill-folder-spec** に従い `<skill-name>/SKILL.md` を確認する。`name` とフォルダ名を kebab-case で揃えるようユーザーに伝える。

### `npx skills find` が使えない

**原因**: オフライン、プロキシ、Node 未導入、企業ポリシー。

**対処**: [skills.sh](https://skills.sh/) をブラウザで検索する。ローカル `Glob` + `Grep` のみで完結させる。

## 第3層

- 公開エコシステムの CLI・サイト・選び方: `references/ecosystem.md`
