# Marp 詳細ガイド

## テーマ一覧と特徴

| テーマ名 | 特徴 | 向いている用途 |
|---------|------|--------------|
| `default` | シンプル・白背景 | 技術発表・社内共有 |
| `gaia` | ダークトーン・モダン | 対外発表・カンファレンス |
| `uncover` | ミニマル・横線アクセント | 学術・教育 |

## カスタムテーマの作成

`custom.css` を作成してスキンを定義:

```css
/* @theme my-theme */

section {
  font-family: "Noto Sans JP", sans-serif;
  font-size: 28px;
  background-color: #ffffff;
  color: #333;
}

h1 {
  color: #0066cc;
  border-bottom: 3px solid #0066cc;
}

/* コードブロック */
pre {
  background: #f4f4f4;
  border-left: 4px solid #0066cc;
}
```

使用:

```bash
marp input.md --pdf --theme custom.css
```

## 日本語対応

### PDF での日本語フォント問題

`marp.config.js` を作成:

```js
module.exports = {
  allowLocalFiles: true,
  html: true,
};
```

CSS でフォントを明示指定:

```css
section {
  font-family: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
}
```

Google Fonts を使う場合はフロントマターに追記:

```markdown
---
marp: true
style: |
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap');
  section { font-family: 'Noto Sans JP', sans-serif; }
---
```

## よく使うスライドパターン

### タイトルスライド

```markdown
---
marp: true
theme: default
---

<!-- _class: lead -->

# プレゼンタイトル

## サブタイトル

発表者名 / 日付
```

### 2カラムレイアウト

```markdown
<div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
<div>

## 左カラム
- 項目A
- 項目B

</div>
<div>

## 右カラム
- 項目C
- 項目D

</div>
</div>
```

※ `--html` フラグが必要: `marp input.md --pdf --html`

### 画像背景

```markdown
<!-- 全画面背景 -->
![bg](image.png)

<!-- 右50%に画像 -->
![bg right:50%](image.png)

<!-- 左40%に画像、明度調整 -->
![bg left:40% brightness:0.8](image.png)
```

### 強調スライド（セクション区切り）

```markdown
<!-- _backgroundColor: #0066cc -->
<!-- _color: white -->

# セクション2

## サブタイトル
```

## marp.config.js（設定ファイルの例）

プロジェクトルートに置くと `marp` コマンドが自動で読み込む:

```js
module.exports = {
  inputDir: "./slides",
  output: "./dist",
  allowLocalFiles: true,
  html: true,
  pdf: true,
  theme: "./assets/custom.css",
};
```

## よく使うCLIオプション

| オプション | 説明 |
|-----------|------|
| `--pdf` | PDF出力 |
| `--pptx` | PPTX出力 |
| `--html` | HTML出力 |
| `-o <path>` | 出力先指定 |
| `--theme <css>` | カスタムテーマ |
| `--allow-local-files` | ローカルファイル（画像等）参照許可 |
| `--html` | HTML タグ使用許可 |
| `--watch` | ファイル変更時に自動再生成 |
| `--server` | ローカルサーバーでプレビュー |

## スライド枚数の目安

| 発表時間 | 推奨枚数 |
|---------|---------|
| 5分 | 5〜8枚 |
| 10分 | 10〜15枚 |
| 20分 | 20〜25枚 |
| 30分 | 25〜35枚 |
