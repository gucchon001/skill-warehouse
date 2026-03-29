---
name: notebooklm-mcp
description: "NotebookLM 連携 MCP（PyPI notebooklm-mcp-cli）の導入・認証・stdio 登録・接続トラブル・ツール選択を案内する。NotebookLM MCP、MCP 接続エラー、nlm login、notebook_list、ソース追加・削除、notebook_query、リサーチ、スタジオ生成、日本語文字化け、サーバー立ち上げ直しを依頼されたときに使う。"
metadata:
  last_verified: "2026-03-21"
---

# NotebookLM MCP

**実装:** [notebooklm-mcp-cli](https://github.com/jacob-bd/notebooklm-mcp-cli)（PyPI: `notebooklm-mcp-cli`）。公式 README を一次情報とし、本スキルは運用とツール選択の補助とする。

## いつ使うか

- NotebookLM を **MCP 経由で使う・直す・起動確認**するとき
- **`nlm login`**・認証切れ・接続エラー
- ノート／ソースの **一覧・取得・追加・削除・質問・生成**（ツール名は [references/tools-overview.md](references/tools-overview.md)）
- **どのツールに何を渡すか**迷うとき（必ずホストのツールスキーマを確認する）

## 手順

1. **インストール:** `python -m pip install -U notebooklm-mcp-cli`。`where notebooklm-mcp` または `pip show notebooklm-mcp-cli` で exe の場所を確認する。
2. **認証:** `nlm login`。`nlm` が無いときは `notebooklm-mcp.exe` と同じ `Scripts` を PATH に通すかフルパスで実行する。
3. **MCP 登録:** ホストの公式手順に従い **stdio** で `notebooklm-mcp.exe` を起動する。JSON 例・注意点は [references/mcp-config.md](references/mcp-config.md) を読む。
4. **反映:** 設定変更後は **ホストの再起動** または **MCP 再接続** を行う。
5. **操作:** ツール呼び出し前に **接続済みスキーマ** を正とする。`notebook_id` は UUID（`notebook_list` / `notebook_get` で取得）。

### エージェント向け（安全）

- **`source_delete`**: 不可逆。**ユーザー承認後**にのみ `confirm=true` で実行する。
- **`studio_create`**: **ユーザー承認後**にのみ `confirm=true` で実行する。

## Troubleshooting

### エラー: MCP が接続しない・ツールが出ない

**原因:** 起動コマンドのパス誤り、設定未反映、ホスト未再起動。

**対処:** `command` を `notebooklm-mcp.exe` の**フルパス**にする。設定保存後にホストを再起動するか MCP を再接続する。追加パターンは [references/errors.md](references/errors.md)。

### エラー: `nlm` / `nlm login` が見つからない

**原因:** Python の `Scripts` が PATH に含まれていない。

**対処:** exe と同じディレクトリを PATH に追加するか、`nlm` をフルパスで実行する。

### エラー: `source_delete` や `studio_create` が拒否される

**原因:** 破壊的・生成系ツールで `confirm` 未指定。

**対処:** ユーザー承認を得たうえで `confirm=true` を付けて再実行する。

その他の失敗パターン（文字化け・二重登録・レート制限など）: [references/errors.md](references/errors.md)

## 第3層（詳細）

- 設定例・UTF-8・二重登録: [references/mcp-config.md](references/mcp-config.md)
- **Cursor 固有**（`mcp.json` の場所・表示名・反映）: [references/host-cursor.md](references/host-cursor.md)
- ツール早見: [references/tools-overview.md](references/tools-overview.md)
- エラー・環境別: [references/errors.md](references/errors.md)

## リンク

- [notebooklm-mcp-cli（GitHub）](https://github.com/jacob-bd/notebooklm-mcp-cli)
- [NotebookLM](https://notebooklm.google.com)
