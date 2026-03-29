---
name: rule-authoring
description: Best practices for writing Cursor rules (length, one concern, examples). Use when drafting rule content, reviewing rules, or ensuring rules are actionable and maintainable.
---
# Rule Authoring Best Practices

## 関連スキル（Cursor ルール）

| スキル | 役割 |
|--------|------|
| **rule-authoring**（本スキル） | ルール本文の**書き方**（短さ・例・1 関心） |
| **rule-format** | `.mdc` の**形式** |
| **rule-scope** | いつ **alwaysApply** / **globs** にするか |

- **Under 50 lines**: Keep each rule concise.
- **One concern per rule**: Split large rules into focused pieces (e.g. error-handling.mdc, naming.mdc).
- **Actionable**: Write like clear internal docs; avoid vague advice.
- **Concrete examples**: Prefer "do this / don't do that" with code samples.

## Example: Error Handling

```markdown
# Error Handling

\`\`\`typescript
// ❌ BAD
try { await fetchData(); } catch (e) {}

// ✅ GOOD
try {
  await fetchData();
} catch (e) {
  logger.error('Failed to fetch', { error: e });
  throw new DataFetchError('Unable to retrieve data', { cause: e });
}
\`\`\`
```

## Checklist

- [ ] Content under 50 lines (split if longer)
- [ ] Single concern
- [ ] At least one concrete example where helpful

## Troubleshooting

### エラー: ルールが長すぎて誰も読まない

**原因**: 複数関心が 1 ファイルに混在。

**対処**: **One concern per rule** で分割し、**rule-format** に沿った複数 `.mdc` にする。

### エラー: 抽象的でエージェントが従えない

**原因**: 「きれいに書く」だけで、具体例や禁止例がない。

**対処**: 本スキルの **Checklist** と **Example** に合わせ、do/don't のコードブロックを足す。

### エラー: ルールとスキルどちらに書くべきか迷う

**原因**: 常時適用か、依頼時だけかが未定義。

**対処**: 常時ガードは **rule-scope** + `.mdc`。オンデマンド手順は **skill-builder** で新規スキル化し、既存の手直しは **skill-growing**。

