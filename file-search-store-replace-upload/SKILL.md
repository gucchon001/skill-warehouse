---
name: file-search-store-replace-upload
description: "Gemini File Search で同一 display_name のドキュメントを delete してから再アップロードする設計。ea_saiten_prottype の file_search_store_replace・upload/sync/採点に対応。File Search 差し替え・重複なし更新・documents.list/delete・--no-replace で発火。"
metadata:
  last_verified: "2026-03-27"
---

# File Search Store: 同一扱いドキュメントの削除→再アップロード

## いつ使うか

- `upload_to_file_search_store` を繰り返し、**同じ論理キー**の PDF を更新したい。
- Store 内の**重複チャンク**を増やしたくない。
- **ea_saiten_prottype** のアップロード／sync／採点での Store 投入を説明・変更する。

## 同一扱いの定義

- Store 上のキーは **`display_name`**（`config["display_name"]`）。
- 本リポジトリでは `file_search_display.file_search_display_name(rel)` が用いられる（ASCII 相対パス or `nonascii_{hash}.pdf`）。**この文字列が一致すれば同一扱い**で `documents.delete` する。

## 手順（エージェント向け）

1. `documents.list(parent=store_name)` で列挙し、`display_name` が今回アップロード予定の集合に含まれるドキュメントを `documents.delete(name=...)`。
2. 対象が複数なら **display_name 集合を先に構築**し、Store は **1 パス**列挙で該当をすべて削除してから `upload_to_file_search_store`。
3. ローカルパスに非 ASCII が含まれる場合は `ascii_staged_pdf_path` で一時コピー（Windows 対策）。削除キーは `display_name` のみ。
4. 重複を許す場合のみ `--no-replace`（本リポジトリの CLI）。

## 参照実装

- `file_search_store_replace.remove_store_documents_by_display_names`
- 呼び出し: `scripts/upload_to_file_search.py`、`scripts/sync_store.py`、`scripts/sync_store_service_account.py`、`grading_service.run_grading`

詳細は `references/design.md`。

## Troubleshooting

### Drive で同じ file ID のまま中身だけ差し替えたが sync しない

**原因**: `sync_log.json` は **Drive file ID** で新規判定。ID が変わらないと再アップロードされない。

**対処**: `synced_files` から該当キーを削除、または別ファイルとして扱う。`modifiedTime` 比較は未実装（design.md）。

### documents.list / delete が失敗

**原因**: キー権限、Store 名誤り、クォータ。

**対処**: `file_search_stores.get` で存在確認。公式エラーに従う。

### 意図せず削除

**原因**: 別 PDF なのに **同一 `display_name`**（相対パスが衝突）。

**対処**: `data/pdfs` 下のパスを一意にする。
