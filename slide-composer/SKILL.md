---
name: slide-composer
description: "マークダウンからスライドを生成・変換する。Marp を主軸に Markdown → PDF / HTML / PPTX へ変換。Triggers: マークダウンをスライドに, MDをPPTXに変換, Marpでスライド作成, スライドを作って, プレゼン資料をMarkdownから生成, slide from markdown, presentation from md, marp, convert md to pptx, marp cli"
metadata:
  last_verified: "2026-04-03"
---

# slide-composer

## いつ使うか

- Markdown ファイルをスライド（PDF / HTML / PPTX）に変換したいとき
- Marp のセットアップ・テーマ設定・変換コマンドを知りたいとき
- スライド構成（見出し・箇条書き・図）のベストプラクティスを適用したいとき
- 「マークダウンからプレゼンを作って」「MD を PowerPoint に変換して」と言われたとき

## 手順

### 0. 前提確認

Marp CLI が必要。未インストールなら:

```bash
npm install -g @marp-team/marp-cli
```

または npx で都度実行（インストール不要）:

```bash
npx @marp-team/marp-cli <input.md> --pdf
```

### 1. Markdown にフロントマターを追加する

Marp スライドは `marp: true` をフロントマターに必ず入れる:

```markdown
---
marp: true
theme: default
paginate: true
---

# スライド1タイトル

内容

---

# スライド2タイトル

- 箇条書き1
- 箇条書き2
```

`---` がスライドの区切り。

### 2. 変換コマンド

| 出力形式 | コマンド |
|---------|---------|
| PDF | `marp input.md --pdf` |
| HTML | `marp input.md --html` |
| PPTX | `marp input.md --pptx` |
| すべて | `marp input.md --pdf --pptx` |

出力先を指定する場合: `marp input.md --pdf -o output/slides.pdf`

### 3. テーマ設定

組み込みテーマ（`default` / `gaia` / `uncover`）は `theme:` で指定:

```markdown
---
marp: true
theme: gaia
---
```

カスタム CSS を使う場合:

```bash
marp input.md --pdf --theme custom.css
```

カスタムテーマの詳細は `references/marp-guide.md` を参照。

### 4. スライド構成のベストプラクティス

- **1スライド1メッセージ**: 1枚に伝えることは1つに絞る
- **見出しは体言止め or 動詞で完結**: 「〇〇の実装」より「〇〇を実装した理由」
- **箇条書きは3〜5項目まで**: それ以上はスライドを分割
- **画像・図は `![bg right]` で右配置**が視認性が高い:

```markdown
# タイトル

説明テキスト

![bg right:40%](image.png)
```

- **コードブロック**はシンタックスハイライト付きで:

```markdown
```python
def hello():
    return "world"
```
```

詳細な構成パターンは `references/marp-guide.md` を参照。

### 5. VS Code で使う場合

Marp for VS Code 拡張をインストールするとプレビューが使える:

1. 拡張: `Marp for VS Code`（marp-team.marp-vscode）をインストール
2. `.md` を開いてプレビューボタンをクリック
3. `Ctrl+Shift+P` → `Marp: Export Slide Deck` でエクスポート

## Troubleshooting

### エラー: `marp: command not found`

**原因**: Marp CLI がインストールされていないか PATH に含まれていない。

**対処**: `npm install -g @marp-team/marp-cli` を実行するか、`npx @marp-team/marp-cli` で代用する。

### エラー: スライドが1枚しか生成されない

**原因**: スライドの区切り `---` がフロントマターの閉じと混同されている。

**対処**: フロントマターの直後の `---` はフロントマター終端。2枚目以降のスライド区切りは本文中の `---` を使う。フロントマター内に `marp: true` があるか確認する。

### エラー: 日本語フォントが PDF で文字化けする

**原因**: Marp の PDF 生成（Chromium 依存）でシステムフォントが見つからない。

**対処**: `--allow-local-files` フラグを追加し、CSS で `font-family` を明示指定する。詳細は `references/marp-guide.md` の「日本語対応」セクションを参照。

## 参照

- 詳細なテーマ・CSS・日本語対応・スライドパターン: `references/marp-guide.md`
- [Marp 公式ドキュメント](https://marp.app/)
- [Marp CLI GitHub](https://github.com/marp-team/marp-cli)
