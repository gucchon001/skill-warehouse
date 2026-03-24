# Chrome 拡張リファクタ チェックリスト

## リファクタ前

- [ ] manifest.json の content_scripts / background / permissions を把握した
- [ ] メッセージの type と送信元・送信先を一覧にした
- [ ] 二重登録ガード（window.__*ContentLoaded）の有無と場所を確認した

## 変更時

- [ ] メッセージの type や payload の意味を変えていない
- [ ] content_scripts の js ファイルの順序を変えていない（依存順を維持）
- [ ] 非同期 sendResponse の場合は return true と 1 回だけの sendResponse にしている
- [ ] chrome.runtime.lastError を送信・受信の両方で確認している

## リファクタ後

- [ ] 対象 URL のタブでメッセージが届くことを確認した
- [ ] 拡張更新前から開いていたタブでプログラム注入が必要な場合の動きを確認した
- [ ] Service Worker を PING で起動してから他のメッセージを送る流れが壊れていないことを確認した
