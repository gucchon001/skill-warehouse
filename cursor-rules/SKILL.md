---
name: cursor-rules
description: "Cursor `.cursor/rules/*.mdc` を一括で扱う。.mdc の YAML（description / globs / alwaysApply）、適用範囲の判断、本文の短さ・1 関心・例示。Triggers: Cursor rules, .mdc, alwaysApply, globs, ルール, frontmatter, サブエージェントではない。"
---

# Cursor Rules（`.mdc`）

**旧スキル統合**: `rule-format` / `rule-scope` / `rule-authoring` を **cursor-rules** にまとめた。詳細は第3層 `references/`。

## いつ使うか

- `.mdc` の**フロントマター**を書く・直すとき
- **常時適用**か **globs でファイル限定**かを決めるとき
- ルール**本文**を短く・1 関心・具体例つきで書くとき
- ルールに残すか **skill-builder** でスキル化するか迷うとき

## 第3層（詳細は Read）

| ファイル | 内容 |
|----------|------|
| [references/format.md](references/format.md) | `.mdc` 構造・`description` / `globs` / `alwaysApply` |
| [references/scope.md](references/scope.md) | alwaysApply vs globs の判断・例 |
| [references/authoring.md](references/authoring.md) | 本文のベストプラクティス・チェックリスト |

## 関連スキル

| スキル | 役割 |
|--------|------|
| **skill-builder** `references/migration-paths.md` | ルール・コマンド → スキル移行の**パス** |
| **skill-builder** / **skill-growing** | オンデマンド手順の**新規スキル**／既存スキルの育成 |
| **rules-hooks-skills**（skill-builder 内 `references/`） | Rules と Hooks と Skills の違い |

## Troubleshooting

### エラー: ルールが UI に出ない・効かない

**原因**: 配置・拡張子・フロントマター未閉じ。

**対処**: [references/format.md](references/format.md)。

### エラー: alwaysApply / globs の誤設定

**原因**: 全セッションに効かせたつもりが狭すぎる、またはその逆。

**対処**: [references/scope.md](references/scope.md)。

### エラー: ルールが長く抽象的で従えない

**原因**: 複数関心の混在、例がない。

**対処**: [references/authoring.md](references/authoring.md)。分割は [references/format.md](references/format.md) に沿って複数 `.mdc` に。

### エラー: ルールとスキルどちらに書くべきか迷う

**原因**: トリガーが「常時ガード」か「依頼ベース」か未定。

**対処**: 常時は **scope + .mdc**。依頼時は **skill-builder**。詳細は [references/authoring.md](references/authoring.md)。
