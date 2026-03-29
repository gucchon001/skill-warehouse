---
name: project-charter
description: PJC・プロジェクトチャーターを references（考え方・構成・チェックリスト・シートレイアウト）に沿って作成し、gws または Sheets API で指定スプレッドシートへ反映する。セル配置（ラベル B/D/G・値 C/E/H）と背景・目的（AsIs/ToBe・卒業/歓迎要件）を厳守。「pjcを作って」「プロジェクトチャーター」「チャーターをgwsで反映」「シートに書いて」で発動。
last_verified: 2026-03-27
---

# プロジェクトチャーター作成スキル

**型**はスキル内 `references/` を参照する。PJC の**内容**のソースは、ユーザーが指定したスプレッドシート・パワポ・開発計画・議事録などでよい。**書き込み**は gws または Sheets API。

## 使うレファレンス（必要に応じて Read）

| ファイル | 内容 |
|----------|------|
| [references/slides-thinking.md](references/slides-thinking.md) | 考え方（背景・目的・スコープ・PJC の定義など） |
| [references/charter-structure.md](references/charter-structure.md) | 構成・項目（who / when / why / what・How / How much / where） |
| [references/charter-checklist.md](references/charter-checklist.md) | チェックリスト・評価観点 |
| [references/sheet-layout.md](references/sheet-layout.md) | **シートの列・行・C5/E5 の品質**（反映時は必読） |
| [references/gws-sheet-write.md](references/gws-sheet-write.md) | gws の `values update` の `--params` / `--json` 契約 |

## いつ使うか

- 「pjcを作って」「プロジェクトチャーターを作って」「PJC を書いて」
- 「PJC を〇〇スプレッドシートに反映」「gws でシートに書いて」
- 新規・既存サンプルに沿ったチャーターひな形の作成

## 前提

- **書き込み**前に [references/sheet-layout.md](references/sheet-layout.md) を読み、**値は C・E・H のみ**とする。
- gws 利用時は `gws auth login -s sheets` が必要。

## 手順

### 1. レファレンスを読む

- **構成** → [references/charter-structure.md](references/charter-structure.md)
- **考え方** → [references/slides-thinking.md](references/slides-thinking.md)
- **評価** → [references/charter-checklist.md](references/charter-checklist.md)
- **シートへ書く直前** → [references/sheet-layout.md](references/sheet-layout.md)、gws なら [references/gws-sheet-write.md](references/gws-sheet-write.md)

### 2. チャーターを書く・整える

- 上記の型に沿い、依頼プロジェクト用の文言で書く。チェックリストで確認する。
- 出力形式は依頼に応じて Markdown・CSV・プレーンテキスト。指定がなければ Markdown。

### 3. スプレッドシートに反映する

- レイアウト・C5/E5 の品質は [references/sheet-layout.md](references/sheet-layout.md) に従う。
- gws の具体的な引数は [references/gws-sheet-write.md](references/gws-sheet-write.md)。Sheets API は **sheet-api-update** スキルを参照。

## Troubleshooting

### エラー: 401 / No credentials または 403 scopes（gws）

**原因**: Sheets 未ログイン、またはスコープ不足。

**対処**: `gws auth login -s sheets`（必要ならスコープ付きで再ログイン）。

### エラー: 404 や range が無効（gws / Sheets API）

**原因**: `spreadsheetId`・シート名・range の誤り、または `--json` / `--params` の壊れ。

**対処**: ID と `シート名!範囲` を再確認。**gws-params-encoding** で JSON を確認。

### エラー: Sheets API（Node 等）で更新できない

**原因**: 認証、range、権限。

**対処**: **sheet-api-update** の前提を確認する。
