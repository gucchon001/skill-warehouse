# 公式 skill-creator とスキル設計の要点

**フォルダ構成・各ディレクトリの役割・Troubleshooting の型の厳密版**は同ディレクトリの **[skill-folder-spec.md](skill-folder-spec.md)** に集約した（公式 PDF・Anthropic ドキュメントに揃えた正本）。

Anthropic 公式の [skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)、[Introducing Agent Skills](https://claude.com/blog/skills)、[The Complete Guide to Building Skills for Claude（PDF）](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)、[Agent Skills overview](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview) を踏まえた**補足**要点。URL 参照のみでよく、リポジトリのフルクローンは不要。日本語の解説記事（例: [Zenn: skill-creator 完全ガイド](https://zenn.dev/yamato_snow/articles/30e8dcf9490c88)）は**非公式**の参照用。

## Progressive Disclosure（3 層の補足）

| 層 | 典型の内容 | 読み込まれやすいタイミング（設計上の目安） |
|----|------------|---------------------------------------------|
| 第1層 | `name`, `description` | スキル一覧・マッチング（**常に軽く効かせる前提で短く・トリガー明確**） |
| 第2層 | SKILL.md 本文 | スキルが選ばれたあと |
| 第3層 | references / scripts / assets | 必要になったときだけ |

**実装差**: Claude Code / Claude.ai / Cursor では、スキル本文の読み込みタイミングが完全一致しない可能性がある。SKILL.md の第2層は**単体で手順が通る**ように書く。

**トークン**: 重い情報を `references/` に分離して本文を薄くすると、コンテキスト効率が上がりやすい（製品・実装依存）。**原則として「第3層へ寄せるほど本文は薄くできる」**と捉える。

## 公式 skill-creator の流れ（Claude Code 向け・参考）

1. 対話で要件定義 — できること・トリガー・使用例
2. init_skill.py — テンプレ生成
3. カスタマイズ — SKILL.md と references/
4. quick_validate.py — フロントマター・description 長
5. package_skill.py — .skill パッケージ

Cursor では 2・4・5 は必須ではないが、「要件 → テンプレ → カスタマイズ → 検証」の順は同じにするとよい。

## description の書き方

- **悪い例**: 「PDF 処理」「〇〇用」
- **良い例**: 機能の列挙＋**具体トリガー語句**（「PDF を編集して」等）
- 長さ: API では 1024 文字まで。**短文化よりトリガー明確さを優先**し、収まらない部分は第2層・第3層へ。

## Troubleshooting（本文・references）

推奨構造: **症状 → 原因 → 対処**（公式 Complete Guide で推奨）。

### サンプル（MCP・接続系）

- **症状**: Cursor の MCP にサーバーが出ない  
  **原因**: `mcp.json` 未登録、または別の Python 環境にパッケージのみインストール  
  **対処**: グローバルまたはプロジェクトの `mcp.json` に `command` / `args` を追加し、使うインタプリタのフルパスで固定。Cursor 再起動。

- **症状**: ツールは見えるが認証エラー  
  **原因**: トークン未取得・期限切れ  
  **対処**: パッケージ付属の認証 CLI を実行（exe が無い場合は `python -m …` で代替）。

長いエラー一覧は `references/troubleshooting.md` などに分離する。

## 本文の指示は命令形で

- **避ける**: 「You should first check the file format.」
- **推奨**: 「To process the file, first verify the format using the validate script.」

## フロントマターの注意

- **必須**: `name`, `description`（トップレベル）。
- **version / author / last_verified**: プロジェクト方針に合わせ、`metadata:` 下または許可されたトップレベルキーに。許可外キーを増やしすぎない。

## Fit / 適さない場面

- **向く**: 繰り返しタスク、手順が明確なワークフロー、共有ナレッジ、定型出力。
- **向かない**: 一度きり、頻繁に変わる要件、外部 API が主で MCP の方が適切、機密をスキルに直書きすべき場合。

## 参考リンク

- [Introducing Agent Skills](https://claude.com/blog/skills)
- [Agent Skills overview](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview)
- [anthropics/skills](https://github.com/anthropics/skills)
- [agentskills.io](https://agentskills.io)
- [Zenn: Anthropic 公式 skill-creator 完全ガイド](https://zenn.dev/yamato_snow/articles/30e8dcf9490c88)（非公式・日本語解説）
