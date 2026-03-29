---
name: chrome-extension-refactor
description: "Chrome 拡張機能（Manifest V3・JavaScript）のリファクタリングを案内。責務分離・重複削除・命名・エラーハンドリングの統一。Content Script / Service Worker / Side Panel の境界を崩さず安全に改善する。トリガーは「拡張の JS をリファクタして」「Chrome 拡張のコードを整理して」「責務を分けてきれいにして」など。"
metadata:
  last_verified: "2026-03-31"
---

# Chrome 拡張機能（JS）リファクタリング

Chrome 拡張（Manifest V3）の JavaScript を、責務を保ったまま安全にリファクタリングする手順とルール。構築・メッセージング・注入の詳細は **chrome-extension-build** スキルを参照する。

## When to Use

- ユーザーが「Chrome 拡張の JS をリファクタして」「拡張のコードを整理して」と依頼したとき
- 「Content Script と Background の責務を分けたい」「重複を減らして保守しやすくして」と依頼したとき

## リファクタリングの原則

1. **MV3 の境界を守る** — Content Script / Service Worker / Side Panel の責務を変えず、メッセージの `type` とペイロードの契約を壊さない。
2. **動作確認を前提にする** — 変更後は「Receiving end does not exist」や Port 切断を招かないよう、該当タブ・SW 起動・権限を確認する。
3. **小さく進める** — 1 回のリファクタで 1 つの関心（例: メッセージハンドラの分割のみ）に絞り、テストしやすい単位で進める。

## How to Use

### 1. 現状の把握

- **manifest.json** の `content_scripts`（ファイル順）・`background.service_worker`・`permissions` / `host_permissions` を確認する。
- **メッセージの流れ**を整理する: 誰が誰に `sendMessage` しているか、`type` とペイロードの対応。
- **二重登録ガード**（`window.__*ContentLoaded` 等）の有無と場所を把握する。リファクタでガードを消したり二重にしたりしない。

### 2. 責務ごとに改善箇所を決める

| 層 | 改善の例 |
|----|----------|
| **Content Script** | DOM 取得・解析を小さな関数に分割、セレクタを定数・別ファイルに集約 |
| **Service Worker** | ハンドラを `type` ごとの関数に分割、API 呼び出しを 1 か所に集約、`sendResponse` の非同期パターン統一 |
| **Side Panel** | UI 更新とメッセージ送信を分離、イベントハンドラの重複削除 |

### 3. 実施する

- **命名**: メッセージ `type` は UPPER_SNAKE、ハンドラは `handle*` や `on*` でプロジェクト内一貫させる。
- **重複削除**: 同じ送信・エラー処理が複数箇所にあれば、共通ラッパー（例: `sendToTab(tabId, type, payload)`）にまとめる。
- **エラーハンドリング**: `chrome.runtime.lastError` のチェックとタイムアウト（`Promise.race`）を漏れなく入れる。
- **ファイル分割**: 新規ファイルを増やす場合は、manifest の `content_scripts.js` の**順序**を変えず、依存するものを先に並べる（chrome-extension-build 参照）。

### 4. 変更後の確認

- Content Script が注入されるページで、必要なメッセージが届くか（プログラム注入パスも試す）。
- Service Worker を PING で起動したあと、他のメッセージが応答するか。
- 拡張更新前から開いていたタブで、再送・プログラム注入が期待どおり動くか。

詳細チェックリストは `references/refactor-checklist.md` を参照する。

## やってよいこと・避けること

| 推奨 | 避ける |
|------|--------|
| ハンドラを関数に分割する | メッセージ `type` やペイロードの意味を変える |
| セレクタ・URL パターンを定数にまとめる | `content_scripts` のファイル順を無意味に変える |
| `sendResponse` を 1 回だけ・非同期時は `return true` に統一 | 二重登録ガードの削除や二重追加 |
| エラー処理を共通化する | `host_permissions` を広げる・`<all_urls>` にする |

## Examples

- 「この拡張の content.js と background の責務を分けてリファクタして」
- 「Chrome 拡張の JS の重複を減らして保守しやすくして」
- 「メッセージハンドラを type ごとに分割して」

## 関連スキル（役割分担）

| スキル | 役割 |
|--------|------|
| **chrome-extension-refactor**（本スキル） | MV3 の**コード整理**・責務分離・命名・エラーハンドリング統一 |
| **chrome-extension-build** | メッセージング契約・注入・SW 起動・トラブルシュートの**詳細手順** |
| **chrome-extension-proxy-cloudrun-deploy** | プロキシ API の **Cloud Run デプロイ**（コードリファクタとは別） |

## Troubleshooting

### エラー: Receiving end does not exist / メッセージに応答がない

**原因**: Service Worker 休眠、Content Script 未注入、リファクタでリスナ登録や `type` 分岐が欠けた、`sendResponse` の非同期パターン不整合。

**対処**: **chrome-extension-build** を Read。SW を起動してから再試行し、`return true` と非同期 `sendResponse` を確認する。

### エラー: リファクタ後に一部の URL やタブだけ壊れる

**原因**: `matches` / `host_permissions` の見直し、`content_scripts` の**ファイル順**変更による依存崩れ、二重登録ガードの誤削除。

**対処**: manifest の `matches` と実 URL を突き合わせ、JS の読み込み順を元に戻す。**references/refactor-checklist.md** を再確認する。

### エラー: プロキシ・Cloud Run の疎通（コードは触っていないのに失敗）

**原因**: デプロイ・CORS・URL・Secret（リファクタの外因）。

**対処**: **chrome-extension-proxy-cloudrun-deploy** または **gcloud-cloudrun-deploy** を参照する。

## 参照

- メッセージング・プログラム注入・SW 起動・「Receiving end does not exist」の対処: **chrome-extension-build** スキル。
- リファクタ前・変更時・リファクタ後のチェックリスト: `references/refactor-checklist.md`。
