---
name: skill-growing
description: "既存スキルフォルダの修正・ブラッシュアップ（検証・置換・PD・分割・Troubleshooting・description 同期）。仕様は skill-builder の skill-folder-spec.md。Triggers: 修正して, 育てて, ブラッシュアップ, 見直して, 拡張して, skill-growing, refine skill, update skill, revise skill, improve skill, skill maintenance."
metadata:
  last_verified: "2026-04-03"
---

# スキルを育てる（差分駆動・置換型ループ）

## スキルは「フォルダ」単位で扱う

**1 スキル = 1 ディレクトリ**（標準ツリー: `SKILL.md` → `scripts/` → `references/` → `assets/`。不要なサブフォルダは作らない）。編集は **常にフォルダ根を単位**とし、**SKILL.md だけをバラで扱わない**。

**正規仕様（各フォルダの役割・禁止・Troubleshooting の型・3 層・検証 3 観点・ホスト別配置・ルール同期）**: **skill-builder** をインストールしているホストでは必ず Read — `skill-builder/references/skill-folder-spec.md`（例: `~/.cursor/skills/...`、`~/.claude/skills/...` など**実際に skill-builder があるパス**）。一次情報: [公式 PDF](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)、[Agent Skills overview](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview)。**発見補助・CLAUDE.md 対応・任意の強い禁止文など（公式必須ではない）**: `skill-builder/references/discovery-and-optional-patterns.md`。

### 育成時のフォルダ別ルール

| 対象 | 厳守 |
|------|------|
| **SKILL.md** | 第1層を肥大化させない。第2層は命令形の核心のみ。**`## Troubleshooting` は `### エラー:` + 原因 + 対処**（典型数件）。長い列挙は `references/` へ退避。**`description` は skill-builder と同じく日英ハイブリッド**（日本語トリガー + 英語キーワード、1024 字・WHAT/WHEN）。**description に手順要約を置かない**（Description Trap）。 |
| **references/** | 長文化・仕様・エラー一覧の**正本**。ファイル分割はトピック単位。SKILL からパスで参照。 |
| **scripts/** | 実行可能性・秘密不含を維持。変更時は SKILL 内の**実行例・前提**を同期。 |
| **assets/** | パスと用途が SKILL の記述と一致しているか確認。大きな説明は references へ。 |

**エージェントへの絶対指示**: 上記フォルダに**手を入れる前に**本スキルを読み、**追記を禁じ**「検証・置換・分割判定・同期」のループを回すこと。

## 発動トリガー（自律ループの起点）

1. **既存スキルの見直し・編集・拡張・ブラッシュアップ時**: 「修正して」「ブラッシュアップして」「見直して」「拡張して」など。
2. **構築直後**: **skill-builder** で新規作成した直後。分割判定を 1 回（skill-builder 手順 0・4）。
3. **問題発生時**: エラー・反映失敗 → **再発パターンは `references/`（例: `errors.md`）に集約**。SKILL の `## Troubleshooting` は **`skill-folder-spec.md` §2.3 の形式**を保ち、**典型 1〜3 件**＋「詳細は references/…」1 行。
4. **賞味期限切れ**: 対象スキルの `last_verified` が今日から 30 日以上前。
5. **明示的指示**: 「更新して」「育てて」。

## 実行すべき4つの絶対制約

### 1. 検証（Execution）

**棚卸しスクリプトで全スキルを一括確認（トークン節約・推奨）**:

```bash
node <skill-growing のパス>/scripts/audit.mjs [skills-dir]
# 例（グローバル Claude Code）:
node ~/.claude/skills/skill-growing/scripts/audit.mjs ~/.claude/skills
```

出力の `!` 行が要対応スキル（stale / Troubleshooting 未設定 / description 未入力）。**個別スキルを Read する前にこの出力を見て優先順位を決める**。

対象スキルや references に記載された検証手順（スクリプト等）を**必ず最初に実行**する。失敗したら解消を最優先。

- **スクリプトが無い場合**: ドキュメント上の**再現手順を 1 回実行**するか、**トリガー妥当性**（依頼の言い換えで起動すべきか・無関係で不発か）を目視で確認する。**チェックを形骸化させない**（できたことだけを事実として書く）。

### 2. 置換（Injection管理）

新しい知見や回避策を得た場合、**単なる追記は絶対に行わない**。古い記述・冗長・失効手順を**削除・圧縮・入れ替え**する。**対象スキルの SKILL.md 総行数は原則増やさない**。長い背景は references に退避。

- **Progressive Disclosure の維持**: 本文が肥大化したら、それは**第3層（references 等）へ移すのも有効な置換**である（トークン効率と一貫）。
- **例外（削減禁止）**: **安全・コンプライアンス・必須の警告**は、行数削減のために削除しない。圧縮する場合も意味が損なわれないようにする。

### 3. 分割判定（Adherence管理）

推論方向の異なる操作の混在、頻出する条件分岐、制約が 4 つ以上に膨らんでいる場合は**スキル分割**を提案する。

- **思考／制作／データのレイヤー分け**やプロジェクト直下 `prompt/`・`os/` との整理を依頼されたときは **layer-skill-design** と本ループを**併用**（再配置も置換・フォルダ単位）。

### 4. 同期（Selectionとグラウンディング）

更新後、対象スキルのフロントマターを更新する:

- **description**: 実態と一致しているか。**日英ハイブリッド**で不足している言語側のトリガーを足すか、冗長なら圧縮（**skill-builder** の「description（日英ハイブリッド）」§に合わせる）。**手順・多段フローの要約が description に残っていないか**確認し、あれば **Description Trap**（`skill-folder-spec.md`）どおり **第2層・`references/` へ移す**。
- **last_verified**: 今日の日付（`YYYY-MM-DD`）。内容を変えなかった読み直しだけなら据え置き可だが、**賞味期限ルール**を満たすよう方針に合わせる。

**一括整形（任意）**: 正本リポジトリ（skill-warehouse）で `node scripts/normalize-skill-frontmatter.mjs` を実行すると、各 `SKILL.md` の `metadata.last_verified` と `name` / `description` の表記を揃えられる（実行後は差分を確認してからコミットする）。

## Troubleshooting

### エラー: スキルが読み込まれない・参照先が無い

**原因**: `~/.cursor/skills/<name>/` のフォルダ名と `SKILL.md` の `name` が不一致、または `references/` の相対パスが誤り。

**対処**: フォルダ名と YAML の `name` を同一 kebab-case に揃える。`references/` へのリンクをスキル根からの相対パスで確認する。

### エラー: 手順どおりに反映されない

**原因**: Cursor のバージョン差、または別ホスト（Claude Code / Antigravity）ではスキル配置パスが異なる。

**対処**: **skill-folder-spec.md** §9 でホスト別パスを確認する（**skill-builder** 内の `references/skill-folder-spec.md`）。

---

*設計思想の詳細は [references/README.md](references/README.md)。**フォルダ・各層の厳密ルール**は **skill-builder** の `references/skill-folder-spec.md`。補足は同 `references/skill-creator-and-official.md`。執筆パターン・`scripts/`・移行パスは同 `references/skill-writing-supplement.md` / `migration-paths.md`。エージェントは実行時に本 SKILL.md を読めばよい。*

タスク完了後の自己採点から改善対象を決めるときは **skill-run-scoring**（5 軸ルーブリック）を併用する。
