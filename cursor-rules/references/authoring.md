# ルール本文の書き方

親スキル: **cursor-rules** の `SKILL.md`。

- **Under 50 lines**: Keep each rule concise.
- **One concern per rule**: Split large rules into focused pieces (e.g. error-handling.mdc, naming.mdc).
- **Actionable**: Write like clear internal docs; avoid vague advice.
- **Concrete examples**: Prefer "do this / don't do that" with code samples.

## Example: Error Handling（`.mdc` 本文に置く例）

見出し `# Error Handling` の下に、次のような do/don't を書く。

```typescript
// ❌ BAD
try { await fetchData(); } catch (e) {}

// ✅ GOOD
try {
  await fetchData();
} catch (e) {
  logger.error('Failed to fetch', { error: e });
  throw new DataFetchError('Unable to retrieve data', { cause: e });
}
```

## Checklist

- [ ] Content under 50 lines (split if longer)
- [ ] Single concern
- [ ] At least one concrete example where helpful

## Troubleshooting

### エラー: ルールが長すぎて誰も読まない

**原因**: 複数関心が 1 ファイルに混在。

**対処**: **One concern per rule** で分割し、[format.md](format.md) に沿った複数 `.mdc` にする。

### エラー: 抽象的でエージェントが従えない

**原因**: 「きれいに書く」だけで、具体例や禁止例がない。

**対処**: 本ファイルの **Checklist** と **Example** に合わせ、do/don't のコードブロックを足す。

### エラー: ルールとスキルどちらに書くべきか迷う

**原因**: 常時適用か、依頼時だけかが未定義。

**対処**: 常時ガードは [scope.md](scope.md) + `.mdc`。オンデマンド手順は **skill-builder** で新規スキル化し、既存の手直しは **skill-growing**。
