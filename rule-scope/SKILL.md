---
name: rule-scope
description: Decides when a Cursor rule should always apply vs apply to specific files. Use when choosing alwaysApply or globs for a new rule, or when asking "should this rule apply to all files or only some?"
---
# Rule Scope Configuration

## 関連スキル（Cursor ルール）

| スキル | 役割 |
|--------|------|
| **rule-scope**（本スキル） | **alwaysApply** vs **globs** の判断 |
| **rule-format** | フロントマター構文 |
| **rule-authoring** | 本文の書き方 |
| **migrate-rule-to-skill** | 「常時ではなくオンデマンド」ならスキル化の候補 |

## Always Apply

Use when the rule is a **universal standard** for every conversation:

```yaml
---
description: Core coding standards for the project
alwaysApply: true
---
```

Omit `globs` when `alwaysApply: true`.

## Apply to Specific Files

Use when the rule applies only when working with certain file types:

```yaml
---
description: TypeScript conventions for this project
globs: **/*.ts
alwaysApply: false
---
```

Examples: `**/*.ts`, `**/*.tsx`, `backend/**/*.py`, `**/components/**/*.tsx`.

## Choosing

- **alwaysApply: true** → Coding standards, security, naming, error-handling that apply everywhere.
- **globs + alwaysApply: false** → Language/framework-specific (TypeScript, React, API routes).

## Troubleshooting

### エラー: alwaysApply にしたら無関係なタスクまで拘束される

**原因**: 本当はファイル種別だけに効かせたかった。

**対処**: `alwaysApply: false` にし、**globs** で対象を限定する（本スキル「Apply to Specific Files」）。

### エラー: globs なのにルールが付かない／付きすぎる

**原因**: パターン誤り、または `alwaysApply` と併用の誤解。

**対処**: `alwaysApply: true` のときは **globs を省略**する。パターンは **rule-format** の例を参照して修正。

### エラー: この内容はルールではなくスキルの方がよい

**原因**: トリガーが「ユーザーが〇〇と言ったとき」の方が自然。

**対処**: **migrate-rule-to-skill** の対象条件を確認し、**skill-builder** でスキル化する。

