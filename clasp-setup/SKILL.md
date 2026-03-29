---
name: clasp-setup
description: "Initializes a GAS project with clasp: new spreadsheet, binding, .clasp.json, rootDir src/, appsscript.json OAuth scopes, clasp open, starter Code.js. Use for GAS + Sheets setup, clasp create, or new GAS dev environment."
metadata:
  last_verified: "2026-03-31"
---

# clasp-setup

## Mission Statement
非エンジニアのユーザーが、コマンドの詳細を意識することなく、Google Apps Script（GAS）の開発環境を「スプレッドシートと完全に紐付いた状態」で安全かつ迅速に構築できるよう支援せよ。

## Instructions

### 1. プロジェクトの初期化
エージェントは以下のコマンドステップを順次実行し、プロジェクトをセットアップすること：
- **認証確認**: `clasp login` が実行済みか確認する。
- **プロジェクト作成**: `clasp create --type sheets --title "[ユーザー指定のタイトル]"` を実行せよ。これにより「新しいスプレッドシートの作成」「スクリプトIDの取得」「.clasp.json の生成」が自動で行われる。
- **ディレクトリ構成**:
    - `src/` ディレクトリを作成し、コード管理を整理せよ。
    - `.clasp.json` を更新し、`"rootDir": "./src"` を設定して同期対象を明確化せよ。

### 2. 権限（スコープ）の自動設定
エラー（Exception: 権限不足）を未然に防ぐため、`src/appsscript.json` を作成または更新し、以下の標準スコープをデフォルトで含めよ：
- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/drive`
- `https://www.googleapis.com/auth/documents`
- `https://www.googleapis.com/auth/script.external_request`

### 3. 初期化の完了とブラウザ起動
- **成果報告**: 生成された「スプレッドシートのURL」および「スクリプトID」をユーザーに報告せよ。
- **ブラウザ起動**: 全ての設定が完了した直後に `clasp open` を実行し、即座にGoogle側のエディタおよびシートを確認できるようにせよ。

### 4. スタートアップ・テンプレートの配置
`src/Code.js`（または `Code.gs`）を作成し、以下の基本的な try-catch 構造を含むテンプレートを配置せよ：
```javascript
function main() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    console.log("初期化に成功しました: " + ss.getName());
  } catch (e) {
    console.error("エラーが発生しました: " + e.toString());
  }
}
```

## Constraints & Brand Voice
- **自動化の優先**: `.clasp.json` から情報を自動で読み取るコードを書くこと。
- **安全性**: 既に設定が存在する場合は上書きの警告を出し、承認を得ること。
- **親切なフォロー**: エラー時は `script.google.com/home/settings` でのAPI有効化が必要な可能性を日本語で提示せよ。

## Troubleshooting

### エラー: clasp login / create が失敗する

**原因**: Node/clasp 未導入、認証期限切れ、ネットワーク。

**対処**: `npm i -g @google/clasp` と `clasp login` を確認。ブラウザで Google アカウントを選び直す。
