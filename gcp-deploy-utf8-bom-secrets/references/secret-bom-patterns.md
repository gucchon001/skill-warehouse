# Secret・UTF-8 BOM: パターンとコマンド例

プレースホルダ: `PROJECT_ID`、`SECRET_NAME`、値は実キーに置き換える。秘密をログに出さないこと。

## なぜ 65279 か

- Unicode BOM = U+FEFF。`charCodeAt(0) === 65279` と一致する。
- 一部 API はヘッダやキー文字列を ByteString 相当として扱い、**0–255 外の先頭文字**で失敗する。

## bash（推奨パターン）

改行を入れない:

```bash
printf '%s' "PASTE_KEY_HERE" | gcloud secrets versions add SECRET_NAME --data-file=- --project=PROJECT_ID
```

ファイル経由（エディタは **UTF-8 無 BOM** で保存）:

```bash
gcloud secrets versions add SECRET_NAME --data-file=./key.txt --project=PROJECT_ID
```

## PowerShell（UTF-8 無 BOM でファイル化）

```powershell
$key = "PASTE_KEY_HERE"
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText("$PWD\key.txt", $key, $utf8NoBom)
gcloud secrets versions add SECRET_NAME --data-file=key.txt --project=PROJECT_ID
Remove-Item key.txt
```

## BOM 除去（文字列変数）

```powershell
$s = $Value -replace "\uFEFF", ''
```

`.Replace([char]0xFEFF, '')` 系は環境によっては意図と違うオーバーロードになるため、**`-replace "\uFEFF"` を優先**。

## Node.js（環境変数・入力の保険）

```javascript
function stripBOM(s) {
  if (s == null) return s;
  const t = typeof s === 'string' ? s : String(s);
  return t.replace(/\uFEFF/g, '');
}
// 例: const apiKey = stripBOM(process.env.GEMINI_API_KEY || '');
```

## 混入しやすい操作

- GCP コンソールのシークレット画面に**そのまま貼り付け**（エディタによっては BOM が付く）
- Windows のメモ帳の「UTF-8」（BOM 付きになる版）
- Word / Excel 経由のコピー

## 確認のヒント（開発時のみ）

- 先頭 1 文字のコードポイントをログに出す（本番ではキー全文を出さない）。
