---
name: gws-docs-to-local
description: "gws で Google Docs を扱う汎用手順。読取で JSON と Markdown をローカルに出力する。「Google Docs を保存して」「gws でドキュメント取得」「Docs を Markdown でエクスポート」「文字起こしをローカルに」で発動。"
metadata:
  last_verified: "2026-03-17"
---

# gws で Google Docs を扱う（読取・ローカル出力）

gws の `docs documents get` で Google Docs の内容を取得し、ローカルに **JSON と Markdown の両方**を保存する。文字化けを防ぐため、**取得〜保存は UTF-8 で一貫**させる。

## 関連スキル（gws スイート）

| スキル | 役割 |
|--------|------|
| **gws-params-encoding** | 共通基盤。`--params` をシェル・Node から壊さず渡す |
| **gws-drive** | Drive 上のファイル一覧・エクスポート・共有ドライブ |
| **gws-docs-to-local**（本スキル） | **Docs** 読取 → ローカル JSON / Markdown |
| **gws-sheets-to-local** | スプレッドシート values 読取 → JSON / CSV |
| **gws-sheets-manage** | シート新規・メタ取得・values 更新（gws） |

Sheets の API 書き込みは **sheet-api-update**。

## スコープ

- **対象**: ドキュメントの**読取**と、ローカルへの**出力**（JSON / Markdown）。
- **対象外**: Docs の作成・更新・共有変更は本スキルでは扱わない。必要なら Google Docs API や別スキルを参照する。

## いつこのスキルを使うか

- 「Google Docs をローカルに保存して」「gws でドキュメントを取得して」と言われたとき
- Docs の内容を Markdown や JSON で手元に置きたいとき
- 文字起こし・議事録の Doc をプロジェクトの `docs/` に取り込みたいとき
- 取得した Docs が文字化けしているとき（保存経路の見直しに本スキルを参照）

## 前提

- **gws** がインストールされ、PATH にあること。
- **認証済み**であること。未ログインなら `gws auth login -s docs` を実行する。
- 対象ドキュメントの **Document ID** が分かること。URL の `/d/<documentId>/` の部分（`/edit` や `?tab=...` は含めない）。詳細は [references/gws-docs-get.md](references/gws-docs-get.md)。

## 手順（エージェントが行うこと）

1. **Document ID を確定する**
   - ユーザーが URL または ID を指定していればそれを使う。
   - URL の場合は `/d/` の直後から、次の `/` または `?` または `#` の手前までを Document ID とする。`?tab=t.xxx` は含めない。
   - 例: `https://docs.google.com/document/d/1M_KTGel8F1uWW-g3tlpA_eptUI_ZlNI4N08cLUVG7Kk/edit?tab=t.xxx` → ID は `1M_KTGel8F1uWW-g3tlpA_eptUI_ZlNI4N08cLUVG7Kk`

2. **gws でドキュメントを取得する**
   - コマンド: `gws docs documents get --params '{"documentId": "<documentId>"}' --format json`
   - **出力は必ず UTF-8 で受け取る。** ターミナルに直接パイプしてファイルに保存すると文字化けするため、**スクリプト（Python/Node）から gws を呼び、`encoding="utf-8"`（または同等）で標準出力を読み、そのバイト列を UTF-8 でファイルに書く。** ターミナル単体で試す場合は Windows で `chcp 65001` を先に実行する。
   - スクリプトから `--params` を渡すときは **gws-params-encoding** スキルに従い、引数配列で渡してシェルで JSON を壊さないようにする。

3. **ローカルに出力する（JSON と Markdown の両方を行う）**
   - **JSON**: 取得した JSON をそのまま UTF-8 でファイルに保存する。出力先はユーザー指定またはプロジェクトの `docs/` など。
   - **Markdown**: 必須。取得した JSON の `body.content` を走査し、`paragraph.elements` からテキストを抽出、見出し（HEADING_1/2/3）を `#` / `##` / `###` に変換して **同じ base 名の .md** で UTF-8 保存する。変換ルールは [references/gws-docs-get.md](references/gws-docs-get.md) を参照。

4. **ファイル名**
   - ドキュメントの `title` を使う場合、ファイル名に使えない文字（`/` など）を置換する。例: `(title).replace("/", "-").replace(" ", "_")[:60]` で base 名を作り、`{base}.json` と `{base}.md` を出力する。

## 文字化け防止（必須）

PowerShell の `Out-File` や `> file` で gws の出力を保存しない。**スクリプトから gws を呼び、stdout を UTF-8 で受け取り、UTF-8 でファイルに書く。** 具体例・環境別の注意は [references/gws-docs-get.md](references/gws-docs-get.md)。プロジェクトに `scripts/fetch-doc-to-local.mjs`（Node）または `scripts/fetch_doc_to_md.py` があればそのワークフローを流用する。

## エラー時

401 / 403 / 404 / validationError の対処は [references/gws-docs-get.md](references/gws-docs-get.md) の「エラーと対処」を参照。`--params` は camelCase の JSON。スクリプトから渡すときは **gws-params-encoding** に従う。

## Troubleshooting

### エラー: gws コマンドが見つからない

**原因**: PATH 未設定、別シェルでインストールした。

**対処**: インストール先のフルパスで実行するか PATH を通す。

### エラー: --params の JSON が壊れる

**原因**: シェルが `"` や改行を解釈して JSON が欠ける（PowerShell / cmd で多い）。

**対処**: **gws-params-encoding** スキルを Read し、ファイル経由や安全な渡し方に従う。

### エラー: 認証・権限エラー（Drive / Sheets）

**原因**: トークン期限切れ、スコープ不足、共有ドライブ権限。

**対処**: gws の再認証手順を実行し、対象ファイル・ドライブの権限を確認する。

## 出力例・参照

- 例: `docs/文字起こし_EDUBAL生徒管理DX_2026-03-11.json` と同 base の `.md`
- 詳細: [references/gws-docs-get.md](references/gws-docs-get.md)（コマンド・Document ID・JSON→MD 変換・文字化け・エラー）
