---
name: ja-form-kana-autofill
description: "日本語フォームで氏名（漢字）入力欄からカナ欄へ自動補完する実装パターン。Triggers: カナを自動入力したい, ふりがな自動補完, IME kana autofill, 読み仮名を自動で入れたい, kana autofill, Japanese form, compositionupdate, React Hook Form"
metadata:
  last_verified: "2026-04-03"
---

# ja-form-kana-autofill

日本語フォームで **姓・名などの漢字入力欄からカナ欄を自動補完** する実装パターン。
React Hook Form + TypeScript を前提とするが、考え方は他の構成にも転用できる。

## 問題と原因

IME で「山田」と入力するとき、ブラウザは次の順で `compositionupdate` を発火する：

1. 「ya」→ 「や」（ひらがな）
2. 「yamada」→ 「やまだ」（ひらがな）← ここでカナを取りたい
3. スペースで変換候補 → 「山田」（漢字）← `e.data` が漢字になる
4. Enter で確定 → `compositionend`

**ナイーブに `compositionupdate` の `e.data` をそのままカナ欄に入れると漢字が入ってしまう。**  
`isHiragana()` でひらがなのみキャプチャし、漢字変換後のデータは無視することで解決する。

## 実装手順

### 1. ユーティリティ関数（コンポーネント外）

```typescript
/** ひらがな → 全角カタカナ（U+3041-U+3096 → U+30A1-U+30F6） */
function toKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) + 0x60)
  )
}

/** ひらがなのみかチェック（漢字変換後データを除外するフィルタ） */
function isHiragana(str: string): boolean {
  return str.length > 0 && /^[\u3041-\u309F\u309D\u309E\u30FC]+$/.test(str)
}
```

### 2. フォームコンポーネントに追加

```typescript
// useRef をインポート
import { useState, useRef } from 'react'

// useForm に setValue / getValues を追加
const { register, setValue, getValues, ...rest } = useForm<MyFormValues>({ ... })

// 最後にキャプチャしたひらがな読みを保持（state にしない → 再レンダー不要）
const lastFamilyKanaRef = useRef('')
const lastGivenKanaRef = useRef('')
```

### 3. 入力欄に compositionUpdate / compositionEnd を追加

```tsx
{/* 姓 */}
<input
  {...register('family_name')}
  onCompositionUpdate={(e) => {
    if (isHiragana(e.data)) lastFamilyKanaRef.current = toKatakana(e.data)
  }}
  onCompositionEnd={() => {
    if (!getValues('family_name_kana') && lastFamilyKanaRef.current) {
      setValue('family_name_kana', lastFamilyKanaRef.current, { shouldDirty: true })
    }
  }}
/>

{/* 名 */}
<input
  {...register('given_name')}
  onCompositionUpdate={(e) => {
    if (isHiragana(e.data)) lastGivenKanaRef.current = toKatakana(e.data)
  }}
  onCompositionEnd={() => {
    if (!getValues('given_name_kana') && lastGivenKanaRef.current) {
      setValue('given_name_kana', lastGivenKanaRef.current, { shouldDirty: true })
    }
  }}
/>
```

### 4. UX のポイント

- `getValues('xxx_kana')` で **カナ欄が空のときのみ補完**（手動入力済みを上書きしない）
- `setValue(..., { shouldDirty: true })` でフォームの dirty 状態を正しく反映
- `shouldValidate: false`（デフォルト）のまま → 入力途中にバリデーションエラーを出さない
- カナ欄の `autoComplete="off"` 推奨（ブラウザ候補と競合防止）

## 注意事項

- **ローマ字直打ち（IME オフ）では compositionUpdate が発火しない** → 自動補完なし。カナ欄は手動入力を促す hint を残す
- **Android Chrome** など一部モバイルブラウザは composition イベントの挙動が異なる場合がある。フォールバックとしてカナ欄を必須にしてバリデーションで担保する
- Zod スキーマ側でカタカナ正規表現バリデーション（`/^[ァ-ヶー]+$/`）と組み合わせると不正値を防げる

## Troubleshooting

### エラー: カナ欄に漢字が入る

**原因**: `compositionupdate` の `e.data` をそのままセットしている（`isHiragana` チェックなし）。  
**対処**: `if (isHiragana(e.data))` でガードを入れ、ひらがな以外は ref を更新しないようにする。

### エラー: 手動で入力したカナが上書きされる

**原因**: `compositionEnd` で `getValues` チェックなしに `setValue` している。  
**対処**: `!getValues('xxx_kana')` の条件を入れ、空のときだけ補完する。

### エラー: IDEが「ref が読み取られない」と警告

**原因**: 編集直後の TypeScript LSP キャッシュ遅延による誤検知。  
**対処**: ファイルを保存して少し待てば消える。実際には `onCompositionUpdate` / `onCompositionEnd` 内で使用されている。

## 参照

詳細コード例（完全な AgApplicationForm.tsx への適用例）: `references/full-example.md`
