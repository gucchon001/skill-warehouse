# ホスト別: スキル配置と HANDOFF の載せ方

本スキル（`thread-handoff`）の**手順は全ホスト共通**。差は **スキルフォルダの場所**と **ファイルを会話に含める UI** だけ。

## 1. スキル（Agent Skills）の配置

**正本**: **skill-builder** `references/skill-folder-spec.md` **§9.1**（更新に追随）。

| ホスト | グローバル（ユーザー） | ワークスペース（プロジェクト） |
|--------|--------------------------|--------------------------------|
| **Cursor** | `~/.cursor/skills/<name>/` | `.cursor/skills/<name>/` |
| **Claude Code** | `~/.claude/skills/<name>/` | `.claude/skills/<name>/` |
| **Google Antigravity** | `~/.gemini/antigravity/skills/<name>/` | `.agent/skills/<name>/` |
| **Kilo 等** | 製品ドキュメントの Agent Skills / 拡張ディレクトリに従う（**公式を正とし、変わりうる**） | 同左またはプロジェクト直下の指示 |

- マルチホストで 1 正本を symlink / junction で配る手順: **skill-folder-spec** §10、**skills-multi-host-sync**（利用時）。

## 2. HANDOFF 正本を「次の会話」に載せる

| ホスト | 典型操作（製品更新で変わりうる） |
|--------|----------------------------------|
| **Cursor** | チャット入力で `@HANDOFF.md` またはファイルを参照 |
| **Claude Code** | プロンプトにファイルパスを明示、またはメモリ／ドキュメント参照の手順に従う |
| **Antigravity** | ワークスペース内ファイルをコンテキストに追加する UI に従う |
| **その他** | 「リポジトリ上の `HANDOFF.md` を開き、会話のコンテキストに含める」で足りる |

**秘密**は HANDOFF に書かない（環境変数名・ドキュメントへのポインタのみ）。

## 3. 常時ルール（Rules）の場所

**skill-folder-spec §9.2**（Cursor `.mdc`、Claude Code `.md`、Antigravity の Rules / `AGENTS.md` 等）。長文 HANDOFF はここに貼らない。
