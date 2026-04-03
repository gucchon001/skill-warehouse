# 完全な実装例（React Hook Form + Zod + TypeScript）

このリポジトリ（jukust_career-agent-portal）の `AgApplicationForm.tsx` への適用例。

## 変更箇所一覧

### import
```diff
- import { useState } from 'react'
+ import { useState, useRef } from 'react'
```

### useForm
```diff
  const {
    register,
    control,
    handleSubmit,
    setError,
+   setValue,
+   getValues,
    formState: { errors, isSubmitting },
  } = useForm<...>({ ... })
```

### コンポーネント内（useForm の直後）
```typescript
const lastFamilyKanaRef = useRef('')
const lastGivenKanaRef = useRef('')
```

### ユーティリティ（コンポーネント外・ファイル上部）
```typescript
function toKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) + 0x60)
  )
}

function isHiragana(str: string): boolean {
  return str.length > 0 && /^[\u3041-\u309F\u309D\u309E\u30FC]+$/.test(str)
}
```

### JSX（姓・名 input）
```tsx
<input
  id="family_name"
  type="text"
  maxLength={100}
  autoComplete="family-name"
  placeholder="山田"
  {...register('family_name')}
  onCompositionUpdate={(e) => {
    if (isHiragana(e.data)) lastFamilyKanaRef.current = toKatakana(e.data)
  }}
  onCompositionEnd={() => {
    if (!getValues('family_name_kana') && lastFamilyKanaRef.current) {
      setValue('family_name_kana', lastFamilyKanaRef.current, { shouldDirty: true })
    }
  }}
  className={...}
/>

<input
  id="given_name"
  type="text"
  maxLength={100}
  autoComplete="given-name"
  placeholder="太郎"
  {...register('given_name')}
  onCompositionUpdate={(e) => {
    if (isHiragana(e.data)) lastGivenKanaRef.current = toKatakana(e.data)
  }}
  onCompositionEnd={() => {
    if (!getValues('given_name_kana') && lastGivenKanaRef.current) {
      setValue('given_name_kana', lastGivenKanaRef.current, { shouldDirty: true })
    }
  }}
  className={...}
/>
```

## Zod スキーマ側のカタカナバリデーション例

```typescript
const schema = z.object({
  family_name: z.string().min(1),
  given_name: z.string().min(1),
  family_name_kana: z
    .string()
    .min(1, '姓（カナ）を入力してください')
    .regex(/^[ァ-ヶーｦ-ﾟ\s　]+$/, '全角カタカナで入力してください'),
  given_name_kana: z
    .string()
    .min(1, '名（カナ）を入力してください')
    .regex(/^[ァ-ヶーｦ-ﾟ\s　]+$/, '全角カタカナで入力してください'),
})
```
