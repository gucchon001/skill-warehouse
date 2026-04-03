---
name: deploy-to-vercel
description: "Vercel へのデプロイ・ビルド監視・エラートリアージ。Triggers: デプロイして, 本番に反映して, deploy, push to production, build error, Module not found, gitignore, ビルド失敗, Vercel CLI, git 未追跡, TypeScript build error, deploy my app, push this live, preview deployment"
metadata:
  author: "vercel-labs (base v3.0.0) + debug extensions"
  last_verified: "2026-04-03"
---

# Deploy to Vercel

デプロイ → ビルド監視 → エラー診断の一貫フロー。**常に preview を優先**し、ユーザーが明示した場合のみ production にする。

## Step 1: プロジェクト状態の確認

4 つすべてを実行してからデプロイ方法を選ぶ。

```bash
git remote get-url origin 2>/dev/null
cat .vercel/project.json 2>/dev/null || cat .vercel/repo.json 2>/dev/null
vercel whoami 2>/dev/null
vercel teams list --format json 2>/dev/null
```

チームが複数ある場合はスラッグを列挙してユーザーに選ばせ、選択後は `--scope <team-slug>` を付けて続行する。

**注意**: `vercel ls` / `vercel link` をリンクされていないディレクトリで実行しない（対話プロンプトが出る）。状態確認は `vercel whoami` のみ安全。

## Step 2: デプロイ方法の選択

### A) linked + git remote → Git Push（推奨）

プッシュ前にユーザーへ確認を取ること。

```bash
git add .
git commit -m "deploy: <変更内容>"
git push
```

URL 確認:
```bash
sleep 5 && vercel ls --format json --scope <team-slug>
# deployments[0].url が preview URL
```

### B) linked + git remote なし → `vercel deploy`

```bash
vercel deploy [path] -y --no-wait --scope <team-slug>
vercel inspect <deployment-url>
```

production（明示指示時のみ）:
```bash
vercel deploy [path] --prod -y --no-wait --scope <team-slug>
```

### C) not linked + CLI 認証済み → link してからデプロイ

```bash
# git remote がある場合（推奨: ディレクトリ名でなく remote URL でマッチ）
vercel link --repo --scope <team-slug>

# ない場合
vercel link --scope <team-slug>
```

リンク後は A or B へ。

### D) CLI 未認証 → インストール・認証・link・デプロイ

```bash
npm install -g vercel
vercel login          # ブラウザで認証
vercel link --repo --scope <team-slug>
```

認証後は C の続きへ。トークン運用は **vercel-cli-with-tokens** 参照。

## Step 3: ビルド監視

プッシュ後 90 秒待機 → `Building` なら 60 秒ごとに再確認。スクリプトで自動化可能:

```bash
node ~/.agent-skills/vercel-deploy-debug/scripts/watch-deploy.mjs
# --prod フラグで本番デプロイを監視
```

または手動:
```bash
vercel ls --prod           # ステータス確認
vercel inspect <url>       # 詳細
```

| ステータス | 対応 |
|-----------|------|
| `● Building` | 待機（通常 1〜3 分） |
| `● Ready` | 完了 → URL をユーザーへ報告して終了 |
| `● Error` | → **Step 4** へ |

## Step 4: エラー診断

### ログ取得

```bash
vercel inspect <deployment-url> --logs 2>&1 | tail -60
```

| エラー文 | 原因 | 対処 |
|----------|------|------|
| `Module not found` / `Cannot find module` | ファイルが git 未追跡 or gitignore 誤包含 | **→ § 4A** |
| `Type error` / `TypeScript` | 型エラーが本番ビルドで検出 | **→ § 4B** |
| 依存パッケージ欠落 | `package.json` 未コミット or devDependencies 問題 | `git ls-files package.json` で確認 |

### § 4A — ファイル未追跡・gitignore 誤適用

```bash
# 未追跡確認（出力なし = 未追跡）
git ls-files <ファイルパス>

# どの gitignore ルールが除外しているか特定
git check-ignore -v <ファイルパス>
# 例: .gitignore:9:ENV/   lib/env/load-dev-env.ts
#     ↑ Python テンプレートの ENV/ が lib/env/ に誤適用されたケース
```

gitignore 誤除外の場合 — `.gitignore` に例外行を追加してからコミット:

```bash
# .gitignore に !lib/env/ などを追記した後:
git add .gitignore <対象ファイル>
git commit -m "fix(build): gitignore誤適用を修正し<ファイル>を追跡に追加"
git push
```

コミット忘れの場合:

```bash
git add <対象ファイル>
git commit -m "fix(build): <ファイル>をコミットに追加"
git push
```

修正後は **Step 3 に戻る**。

### § 4B — TypeScript / 型エラー

```bash
npm run typecheck
npm run build   # ローカルで通ることを確認してからコミット
git add <修正ファイル>
git commit -m "fix(types): <エラー内容>"
git push
```

修正後は **Step 3 に戻る**。

## Troubleshooting

### エラー: `Module not found` でファイルはローカルに存在する

**原因**: `git ls-files` で空 = git 未追跡。ローカルにあっても Vercel には届かない。gitignore の誤ルールが原因のことが多い。

**対処**: `git check-ignore -v <ファイル>` でルールを特定 → `.gitignore` に `!<パス>/` 例外を追加 → コミット・プッシュ。

### エラー: `git add` 時に「ignored by .gitignore」と怒られる

**原因**: gitignore にマッチしているため通常の `git add` が拒否される。

**対処**: `.gitignore` に例外行を先に追加してから再度 `git add`。`.env` 系の秘密情報は絶対に追加しない。

### エラー: push したのに Vercel が古いビルドのまま

**原因**: Vercel の自動デプロイブランチが想定外のブランチに設定されている。

**対処**: Vercel ダッシュボード → Project Settings → Git → Production Branch を確認。`vercel ls --prod` の最新コミット SHA と `git log --oneline -1` を突き合わせる。

### エラー: CLI 認証失敗 / `No existing credentials found`

**原因**: `vercel login` が使えない環境またはトークン期限切れ。

**対処**: `VERCEL_TOKEN` を環境変数にセットして CLI に読ませる（`--token` フラグは使わない — シェル履歴に残る）。詳細は **vercel-cli-with-tokens** スキル参照。

## 関連スキル

- **vercel-cli-with-tokens**: トークン認証・env var 管理・ドメイン管理
