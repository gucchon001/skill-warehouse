---
name: thread-handoff
description: "エージェントのチャット／セッション切替前に HANDOFF を整え、新スレッドで続きを無駄なく進める（Cursor / Claude Code / Antigravity 等のホスト共通）。主トリガー（日本語）: 新しいチャットする準備。同義: 新しくチャットを切り替える準備・チャット切替の準備・新チャット準備・引き継ぎメモ。Triggers: 新しいチャットする準備, 新チャット準備, 引き継ぎメモ, チャット切替の準備, スレッド引き継ぎ, thread handoff, prepare new chat, refresh thread, 新スレッド, 長い会話, cutoff, HANDOFF.md, 続きから, context pollution, token. 旧フォルダ名: cursor-thread-handoff."
metadata:
  last_verified: "2026-04-05"
---

# スレッド引き継ぎ（HANDOFF + カットオフ）

**適用**: **Agent Skills を読み込むエージェント製品**（Cursor、Claude Code、Google Antigravity、その他）。スキル本文は**ホスト非依存**。配置パスだけ **`references/host-paths.md`** と **skill-builder の skill-folder-spec §9** に従う。

**エージェントへの指示**: ワークフロー型。**第1層の `description` だけで短絡しない**。

## 発火するユーザー表現（優先マッチ）

次のいずれかなら **本スキルを Read してから** `assets/handoff-template.md` 手順へ進む（**推測だけで引き継ぎ文を書かない**）。

| 優先度 | 日本語 | 英語 |
|--------|--------|------|
| 高 | **新しいチャットする準備**、新チャット準備、チャット切替の準備、新しくチャットを切り替える準備 | prepare new chat, new thread handoff |
| 中 | 引き継ぎメモ、スレッド引き継ぎ、続きから、長い会話を整理 | thread handoff, refresh thread, context handoff |
| 補助 | （ユーザーが `HANDOFF.md` を会話に含める／添付すると明示） | HANDOFF.md, cutoff |

## いつ使うか / When to use

- **主トリガー**: 「**新しいチャットする準備**」および上表の同義語
- 長文スレッドで繰り返し説明・推論のブレ・トークン／汚染が気になる、マイルストーン／話題切替直前、**HANDOFF を書いて**／新セッションで続きたい

## 手順 / How to use

### 1. 正本を決める

- 既定: リポジトリルートの **`HANDOFF.md`**（無ければ作成を提案）
- プロジェクトが **`PLAN.md` / `TODO.md`** を正とするなら **「現在のスレッド」** セクションでも可（既存ルールに合わせる）

### 2. カットオフ判断

**`references/cutoff-criteria.md`** に沿い、引き継ぎを更新してから新スレッドへ切り替えるよう案内する。

### 3. 文書の中身

**`assets/handoff-template.md`** をコピーしプレースホルダを埋める。最低限: 目的、完了／未完了、パス・ブランチ・コマンド、決定と理由、次の一手。**秘密は書かない**（環境変数名・パスのみ）。

### 4. 常時ルール（各ホストの Rules）との分担

スキル＝手順・テンプレ・判断。各ホストの **Rules / AGENTS.md** 等＝必要なら **1〜2 行**（「`HANDOFF.md` を会話に含めたときは正とする」等）。**長文ハンドオフを常時ルールに貼らない**。詳細: **`references/rules-vs-skill.md`** · **`references/host-paths.md`**

### 5. 新セッションでの再開

ユーザーへ: 新しいチャット／セッションを開く → **正本（`HANDOFF.md`）をコンテキストに含める**（製品によっては `@ファイル`・ドラッグ添付・「ファイルを追加」等。**`references/host-paths.md`**）→「前スレッドの続き。上記を正として」。

### 6. 続きを引き受ける側

**正本を Read** し推測で上書きしない（ユーザーが添付しなくても、パスが分かればリポジトリから Read）。

## 他スキル

- 開発計画やロードマップの更新が次タスクなら **`dev-plan-update`** を併用してよい（本スキルは引き継ぎが主）。
- スキルの配置・マルチホスト同期: **skill-builder** の `skill-folder-spec.md` §9〜10、**skills-multi-host-sync**（利用時）。

## Troubleshooting

### エラー: 新スレッドで文脈が消え同じ説明の繰り返し

**原因**: 引き継ぎ未更新、または新セッションで正本をコンテキストに含めていない。

**対処**: `assets/handoff-template.md` で正本を更新し、**ファイル添付／`@`／コンテキスト追加**の手順を案内する（**`references/host-paths.md`**）。

### エラー: 常時ルールに長文ハンドオフを貼ったら固定トークンが増えた

**原因**: ルールは繰り返し読み込まれるため、可変長文はコストが高い。

**対処**: 可変文脈は **`HANDOFF.md` 等 1 ファイル**、ルールは短いポインタのみ（**`references/rules-vs-skill.md`**）。

### エラー: グローバルとプロジェクトで同名スキルが衝突

**原因**: `skill-folder-spec` §9 どおり同一 `name` の重複は非推奨。

**対処**: 別 `name` にするか、正本をリポジトリ内に置きスキルはパスのみ変える。

## 参照

- **`assets/handoff-template.md`** · **`references/cutoff-criteria.md`** · **`references/rules-vs-skill.md`** · **`references/host-paths.md`**
