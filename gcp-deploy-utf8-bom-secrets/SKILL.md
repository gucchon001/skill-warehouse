---
name: gcp-deploy-utf8-bom-secrets
description: "Cloud Run・Secret Manager 経由の API キー／トークンで Gemini 等が ByteString・65279 エラーを返すときの切り分けと対処。BOM (U+FEFF) 混入の防止・再登録、bash/PowerShell、Node stripBOM。トリガー例：65279、ByteString、デプロイ後だけ失敗、Secret をコンソール貼り付けした、API キー先頭がおかしい。"
metadata:
  last_verified: "2026-03-28"
---

# GCP デプロイ: Secret の UTF-8 BOM（ByteString / 65279）

## いつ使うか

- **本番（Cloud Run 等）だけ**で Gemini / 一部 Google API クライアントが失敗し、ローカルでは通るとき
- ログやレスポンスに **`65279`** または **`ByteString`** が含まれるとき
- Secret Manager に **`GEMINI_API_KEY`** や Bot トークン、Bearer 相当の値を**コンソール貼り付け**や **BOM 付きファイル**から登録した直後

詳細・長いコマンド例は [references/secret-bom-patterns.md](references/secret-bom-patterns.md)。

---

## 手順（エージェント向け）

1. **症状を確認する**  
   - メッセージに `65279` がある → 多くは Unicode BOM（U+FEFF）。  
   - `Cannot convert argument to a ByteString` など → クライアントが「1 バイト文字列」前提の経路に **BOM（コードポイント 65279）** を渡している。

2. **先頭文字の切り分け**（アプリがログを出せるとき）  
   - API キー文字列の **`charCodeAt(0)` が `65279`** → Secret の値の先頭に BOM。  
   - システムプロンプト／ユーザープロンプト側が `65279` → 入力・テンプレート・拡張からのペイロードを疑う。

3. **正本の対処（推奨）**  
   - 対象 Secret を **BOM なし**で **新バージョン**として入れ直す（下記「再登録」）。  
   - コンソールの「そのまま貼り」だけに頼らない。

4. **再発防止**  
   - 値は **`echo -n`** または **UTF-8 無 BOM の一時ファイル**経由で `gcloud secrets versions add --data-file=...` に渡す。  
   - PowerShell では **`[System.Text.UTF8Encoding]::new($false)`** でファイルに書いてから `gcloud` に渡す（[references/secret-bom-patterns.md](references/secret-bom-patterns.md)）。

5. **アプリ側の保険（任意）**  
   - 環境変数から API キーを読んだ直後に `stripBOM` 相当をかける：  
     `s.replace(/\uFEFF/g, '')`（JavaScript）。  
   - 正本はあくまで **Secret を BOM なしで登録**すること。

6. **PowerShell で BOM を除去するスクリプトを書くとき**  
   - **`.Replace(char, '')` のオーバーロード解釈で失敗することがある**。BOM 除去は **`$s -replace "\uFEFF", ''`** を使う。

---

## Troubleshooting

### エラー: Cannot convert argument to a ByteString ... character at index 0 has a value of **65279**

**原因**: 文字列の先頭が U+FEFF（BOM）。多くは **Secret Manager の API キー**が Cloud Run の環境変数にそのまま載り、クライアント初期化やリクエストに混入している。

**対処**: 該当 Secret を **BOM なし**で再登録する。`printf` / UTF-8 無 BOM ファイル / 正規化スクリプトを使い、`gcloud secrets versions add` で新バージョンを追加。再デプロイまたは新リビジョンで環境変数を取り直す。

### エラー: ローカルでは動くが Cloud Run だけ Gemini（要約・generateContent）が失敗する

**原因**: ローカルの `.env` は手元で正しいが、**Secret にだけ BOM が付いたバージョン**が載っているケース。

**対処**: 本番が参照している Secret 名を特定し、**手順「再登録」**で BOM なしバージョンを追加。ログで API キー先頭が 65279 か確認できるなら Secret 確定。

### エラー: PowerShell で BOM 除去・正規化が意図どおり動かない

**原因**: `String.Replace` と空文字の組み合わせで、意図しないオーバーロードが選ばれることがある。

**対処**: BOM 除去は **`-replace "\uFEFF", ''`** を使う。ファイルは **UTF-8 無 BOM** で `gcloud --data-file=` に渡す（詳細は [references/secret-bom-patterns.md](references/secret-bom-patterns.md)）。

---

## プロジェクト固有スキルとの関係

- リポジトリ別の **サービス名・プロジェクト ID・Secret 名**は各プロジェクトの **Cloud Run デプロイスキル**に書く。  
- 本スキルは **BOM / 65279 / Secret 登録パターンの汎用**のみを扱う。
