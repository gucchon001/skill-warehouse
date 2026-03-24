---
name: project-charter
description: PJC・プロジェクトチャーターを、スキル内のレファレンス（考え方・構成・チェックリスト）に沿って作成する。スプレッドシートに反映するときは「セル配置（ラベル/値の区別）」「背景・目的の質（AsIs/ToBe/卒業要件・歓迎要件）」を守り一発で正しく書き込む。「pjcを作って」「チャーターをgwsで反映して」で発動。
last_verified: 2026-03-17
---

# プロジェクトチャーター作成スキル

**「考え方・構成・チェックリスト」の型は、スキル内のレファレンス（references 内の文字起こし・要約）を参照する。** PJC の**内容**のデータソースは、スプレッドシート・パワポ・開発計画・議事録などユーザーが指定したものでよい。**書き込み**（指定スプレッドシートへの反映）には gws または Sheets API を使う。

## 使うレファレンス（毎回ここを参照する）

| ファイル | 内容 |
|----------|------|
| [references/slides-thinking.md](references/slides-thinking.md) | 考え方パワポの文字起こし・要約（背景・目的・スコープ・PJC の定義など） |
| [references/charter-structure.md](references/charter-structure.md) | サンプルシートの構成・項目一覧（who / when / why / what・How / How much / where） |
| [references/charter-checklist.md](references/charter-checklist.md) | チェックリスト・評価観点（全体・背景・目的・スコープ・内容の妥当性） |

## トリガー

- 「pjcを作って」「プロジェクトチャーターを作って」「PJC を書いて」
- 「PJC を〇〇スプレッドシートに反映して」「gws でシートに書いて」

## いつこのスキルを使うか

- 新規プロジェクトのプロジェクトチャーターを書きたいとき
- 既存のサンプル（スプレッドシート）を参照してチャーターのひな形を作りたいとき

## 前提

- **レファレンス**（考え方・構成・チェックリスト）＝スキル内の 3 ファイルを参照する。
- **書き込み**＝PJC を指定スプレッドシートに反映するときは gws または Sheets API を使う。gws の場合は `gws auth login -s sheets` が必要。

## 手順

### 1. レファレンスを読む

- **構成**は [references/charter-structure.md](references/charter-structure.md) を読む。項目の対応（who / when / why / what・How / How much / where など）を押さえる。
- **考え方**は [references/slides-thinking.md](references/slides-thinking.md) を読む。
- **評価観点**は [references/charter-checklist.md](references/charter-checklist.md) を読む。

項目の対応:

- **対応**: プロジェクト名、前提・制約メモ
- **who**: 責任者、実行担当者
- **when**: 開始日、終了予定日
- **why**: 背景、目的・成功状態
- **what・How**: 内容・方法
- **How much**: 予算・コスト見積、人的リソース
- **where**: 影響範囲・スコープ
- **その他**: オリエン情報、資料保管場所

### 2. チャーターを書く・整える

- レファレンスの構成に沿って、依頼されたプロジェクト用の文言でチャーターを書く。
- **チェックリスト**で確認する。
- 出力形式は依頼に応じて Markdown・スプレッドシート用 CSV・ドキュメント用テキストのいずれかでよい。指定がなければ Markdown で出力する。

## スプレッドシートに反映するときのルール

### 1. セル配置（ラベルと値を間違えない）

シートのレイアウトは **A列＝セクション、B列＝左ラベル、C列＝左の値、D列＝右ラベル、E列＝右の値、G列＝前提・制約メモ（ラベル）、H列＝前提・制約の値** とする。**値は絶対にラベル用の B・D・G にだけ書かない。** 値は C・E・H に書く。

| 行 | A | B（ラベル） | C（値） | D（ラベル） | E（値） | F | G（ラベル） | H（値） |
|----|---|-------------|---------|-------------|---------|---|-------------|---------|
| 2 | 対応 | プロジェクト名 | 〇〇開発 | — | — | — | 前提・制約メモ | メモ本文 |
| 3 | who | 責任者 | 名前 | 実行担当者 | 名前・役割 | — | — | — |
| 4 | when | 開始日 | 日付 | 終了予定日 | 日付 | — | — | — |
| 5 | why | 背景 | 本文（下記品質） | 目的・成功状態 | 本文（下記品質） | — | — | — |
| 6 | what・How | 内容・方法 | 本文 | — | — | — | — | — |
| 7 | How much | 予算・コスト見積 | 本文 | 人的リソース | 本文 | — | — | — |
| 8 | where | 影響範囲・スコープ | 本文 | — | — | — | — | — |
| 10 | — | その他（…） | 本文 | — | — | — | — | — |

### 2. 背景・目的・成功状態の質（レファレンス準拠）

- **背景（C5 の値）**: **【現状（AsIs）】** … 今どうなっているか、何が課題か。**【あるべき姿（ToBe）】** … このプロジェクトで実現したい状態。**【ギャップ・原因の仮説】** … AsIs と ToBe の差と、その理由の仮説。
- **目的・成功状態（E5 の値）**: **【卒業要件】** … ここまでできたらこの PJC としては完了。**【歓迎要件】** … あればよいが必須ではない範囲。よくばりすぎない。

### 3. gws での書き込み

- **values update** は **`--params`** に `spreadsheetId`, `range`, `valueInputOption: "USER_ENTERED"` を渡し、**`--json`** に **request body の `{"values": [[...], ...]}` だけ**を渡す。
- セル内改行は文字列に `\n` を含め、`valueInputOption: "USER_ENTERED"` で送る。
- 範囲は「シート名!A1:H11」のように **ラベル行も含めて全行書く** とずれを防げる。

## エラー時（gws を使う場合）

- **401 / No credentials** → `gws auth login -s sheets` を実行する。
- **403 insufficient authentication scopes** → スコープを付けて再ログインする。
- **404 や range エラー** → spreadsheetId とシート名を確認する。

## 参照

- **考え方**: [references/slides-thinking.md](references/slides-thinking.md)
- **構成・項目**: [references/charter-structure.md](references/charter-structure.md)
- **チェックリスト**: [references/charter-checklist.md](references/charter-checklist.md)

## Troubleshooting

### エラー: gws で読めない・書けない

**原因**: スコープ、ファイル ID 誤り、共有設定。

**対処**: **gws-drive** / **gws-sheets-*** と **gws-params-encoding** を確認し、ID と range を再確認する。

### エラー: Sheets API（Node 等）で更新できない

**原因**: 認証、シート名・range の誤り、権限。

**対処**: **sheet-api-update** の前提を確認し、API の有効化と認証情報を見直す。

