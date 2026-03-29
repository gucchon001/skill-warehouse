# 発見の補助と任意パターン（公式との境界）

一次情報は [Agent Skills overview](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview) と [Complete Guide（PDF）](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)。プロダクト紹介: [Skills（Claude）](https://claude.com/ja-jp/skills)。

## 公式と整合する考え方

- **第1層（YAML）**: `name` / `description` で「何が・いつ」。**手順の細部は第2層・第3層**（`skill-folder-spec.md` §2.1・「description の罠」）。
- **Progressive disclosure**: 本文を薄くし、詳細は `references/`（公式どおり）。

## ホスト固有の補助（任意・公式必須ではない）

### Claude Code とプロジェクトメモリ

プロジェクトに **キーワード → スキル名** の対応表を書く運用は、**チーム内の一貫性**には有効。ファイル名・仕様は **Claude Code / Memory のドキュメント**に従う（本リポジトリでは `CLAUDE.md` 等の名称が使われることが多いが、**全ホスト共通の必須要件ではない**）。

### Cursor / その他

ルール（`.mdc`）やユーザープロンプトで「〇〇のときはスキル X を読め」と書くのも**運用**。スキル仕様の**代替にはならない**（`description` の整備が先）。

## コミュニティ由来の執筆パターン（任意）

以下は **Anthropic 公式ドキュメントに必須とされていない**。トーンやチーム文化で選ぶ。

| パターン | 内容 | 注意 |
|----------|------|------|
| **強い禁止の宣言**（いわゆる Iron Law 系） | 本文冒頭で「〜なしに〜するな」と例外を狭める | 過度に攻撃的な文言は不要。**命令形・検証可能**なら足りることが多い。 |
| **開始時の宣言** | スキル適用時に利用スキル名を明示する | ログ可読性には効く。**公式要件ではない**。 |

## SKILL.md の行数

「500 行以内」などの数値は **公式 PDF の固定ルールとして本 spec には掲げていない**。目安として **skill-growing** の「本文は原則肥大化させない・第3層へ」に従う。
