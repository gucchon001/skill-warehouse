# スキル貯蔵庫（skill-warehouse）

個人用 **Agent Skills** の正本です。Cursor / Claude Code / Antigravity のグローバル `skills` を同一ディレクトリにジャンクションし、[GitHub: gucchon001/skill-warehouse](https://github.com/gucchon001/skill-warehouse)（パブリック）でバージョン管理しています。

同期手順はスキル **`skills-multi-host-sync`** を参照してください。

---

## 目次

1. [ライブラリ運用・マルチホスト](#1-ライブラリ運用マルチホスト)
2. [スキルの設計・作成・移行](#2-スキルの設計作成移行)
3. [Cursor ルールとサブエージェント](#3-cursor-ルールとサブエージェント)
4. [エディタ設定（VS Code / Cursor）](#4-エディタ設定vs-code--cursor)
5. [品質・デバッグ・UI / UX](#5-品質デバッグui--ux)
6. [Google Workspace（gws）と Sheets API](#6-google-workspacegwsと-sheets-api)
7. [企画・要件・課題・DB 定義](#7-企画要件課題db-定義)
8. [GCP・Chrome 拡張・API 方針](#8-gcpchrome-拡張api-方針)
9. [BigQuery・MCP・NotebookLM・File Search](#9-bigquerymcpnotebooklmfile-search)
10. [Postgres / Supabase](#10-postgres--supabase)
11. [Google Apps Script](#11-google-apps-script)
12. [Python 環境](#12-python-環境)

---

## 1. ライブラリ運用・マルチホスト

| スキル | 概要 |
|--------|------|
| [**find-skills**](./find-skills/) | 自然言語で「〇〇向けのスキルは？」と探す。ローカルの `SKILL.md` の `description` を優先し、必要なら skills.sh 等の公開ディレクトリを案内。 |
| [**skills-multi-host-sync**](./skills-multi-host-sync/) | 正本 1 つに Cursor / Claude / Antigravity のグローバル `skills` をジャンクションまたはシンボリックリンクで揃える。Git commit/push 用スクリプト同梱。「スキルを同期して」で発火想定。 |

## 2. スキルの設計・作成・移行

| スキル | 概要 |
|--------|------|
| [**skill-builder**](./skill-builder/) | 新規スキルフォルダ（SKILL.md / scripts / references / assets）を公式構成で設計・生成。 |
| [**skill-growing**](./skill-growing/) | 既存スキルの修正・圧縮・第3層への退避。skill-folder-spec 準拠の育成ループ。 |
| [**skill-structure**](./skill-structure/) | ディレクトリレイアウトと SKILL.md フォーマットの定義。 |
| [**skill-workflow**](./skill-workflow/) | スキル作成の E2E ワークフロー（発見→設計→実装→検証）。 |
| [**skill-authoring**](./skill-authoring/) | Agent Skill 執筆のベストプラクティス。 |
| [**skill-descriptions**](./skill-descriptions/) | `description` フィールドの書き方（WHAT/WHEN・トリガー語）。 |
| [**skill-patterns**](./skill-patterns/) | テンプレ・ワークフロー・条件分岐など再利用パターン。 |
| [**skill-requirements**](./skill-requirements/) | 新規スキル化の前に目的・範囲・トリガーを整理。 |
| [**skill-scripts**](./skill-scripts/) | スキル内 `scripts/` の使いどころと品質。 |
| [**layer-skill-design**](./layer-skill-design/) | 思考 / 制作 / データのレイヤー分けとフォルダ構成。 |
| [**migrate-locations**](./migrate-locations/) | ルール・スラッシュコマンドから Skills への移行パス。 |

## 3. Cursor ルールとサブエージェント

| スキル | 概要 |
|--------|------|
| [**rule-authoring**](./rule-authoring/) | `.cursor/rules` の書き方（長さ・単一関心・例示）。 |
| [**rule-format**](./rule-format/) | `.mdc` のフロントマターと構造。 |
| [**rule-scope**](./rule-scope/) | `alwaysApply` と `globs` の選び方。 |
| [**subagent-descriptions**](./subagent-descriptions/) | サブエージェントの description の書き方。 |
| [**subagent-format**](./subagent-format/) | サブエージェント `.md` のフォーマット。 |
| [**subagent-locations**](./subagent-locations/) | プロジェクト vs ユーザー配置と優先順位。 |
| [**subagent-workflow**](./subagent-workflow/) | サブエージェント作成の手順。 |

## 4. エディタ設定（VS Code / Cursor）

| スキル | 概要 |
|--------|------|
| [**cursor-user-settings**](./cursor-user-settings/) | `settings.json` の場所（OS 別）・要望→キー対応・JSONC を壊さない編集を 1 本に統合。 |

## 5. 品質・デバッグ・UI / UX

| スキル | 概要 |
|--------|------|
| [**test-driven-development**](./test-driven-development/) | 実装前にテストから書く TDD の流れ。 |
| [**systematic-debugging**](./systematic-debugging/) | バグ・テスト失敗の体系的な切り分け（修正提案の前に）。 |
| [**vibesec**](./vibesec/) | Web アプリのセキュリティ意識・簡易監査。 |
| [**ui-frontend-patterns**](./ui-frontend-patterns/) | フロントのコンポーネント・a11y・視覚階層の基準。 |
| [**dashboard-first-view-ux**](./dashboard-first-view-ux/) | ダッシュボードのファーストビューと情報優先順位。 |

## 6. Google Workspace（gws）と Sheets API

| スキル | 概要 |
|--------|------|
| [**gws-drive**](./gws-drive/) | gws で Drive の一覧・検索・アップロード・エクスポート。 |
| [**gws-docs-to-local**](./gws-docs-to-local/) | Google Docs を JSON / Markdown でローカルに取得。 |
| [**gws-params-encoding**](./gws-params-encoding/) | gws の `--params` に JSON を渡すときのシェル崩れ対策。 |
| [**gws-sheets-manage**](./gws-sheets-manage/) | スプレッドシートの作成・一覧・構造取得・範囲更新。 |
| [**gws-sheets-to-local**](./gws-sheets-to-local/) | シート範囲を JSON / CSV でローカルに出力。 |
| [**sheet-api-update**](./sheet-api-update/) | Node / googleapis で Sheets API 書き込み（gws ではなく API）。 |

## 7. 企画・要件・課題・DB 定義

| スキル | 概要 |
|--------|------|
| [**project-charter**](./project-charter/) | PJC・プロジェクトチャーターをレイアウトどおりに作成しシートへ反映。 |
| [**wbs**](./wbs/) | PJC から WBS を作成しスプレッドシートに落とす。 |
| [**requirements-to-sheet**](./requirements-to-sheet/) | 要件・開発計画 Markdown をシート用フォーマットにして出力。 |
| [**issue-table**](./issue-table/) | 課題管理表の列定義とシート作成・書き出し。 |
| [**issue-table-format**](./issue-table-format/) | 課題表の装飾・プルダウン・列幅の一括適用。 |
| [**table-definition-database-design**](./table-definition-database-design/) | テーブル定義書と DB 設計の手順。 |

## 8. GCP・Chrome 拡張・API 方針

| スキル | 概要 |
|--------|------|
| [**app-code-apis-not-cli**](./app-code-apis-not-cli/) | アプリコードでは subprocess+CLI に依存せず HTTP API / SDK を使う。 |
| [**gcp-deploy-utf8-bom-secrets**](./gcp-deploy-utf8-bom-secrets/) | Secret / API キーの BOM 混入（65279）による Gemini 等の失敗の切り分けと対処。 |
| [**chrome-extension-proxy-cloudrun-deploy**](./chrome-extension-proxy-cloudrun-deploy/) | 拡張用プロキシを Cloud Run に安全にデプロイ。 |
| [**chrome-extension-refactor**](./chrome-extension-refactor/) | MV3 拡張の責務分離とリファクタ。 |

## 9. BigQuery・MCP・NotebookLM・File Search

| スキル | 概要 |
|--------|------|
| [**bigquery-mcp**](./bigquery-mcp/) | BigQuery MCP（toolbox）の設定と接続トラブルシュート。 |
| [**bigquery-mcp-install**](./bigquery-mcp-install/) | toolbox の導入と `mcp.json` 登録。 |
| [**bigquery-mcp-usage**](./bigquery-mcp-usage/) | MCP ツールの選び方とパラメータ。 |
| [**dataplex-catalog-entry-names**](./dataplex-catalog-entry-names/) | Data Catalog と Dataplex のエントリ名形式の差（403/404 回避）。 |
| [**notebooklm-mcp**](./notebooklm-mcp/) | NotebookLM MCP の導入・認証・ツール選択。 |
| [**file-search-store-replace-upload**](./file-search-store-replace-upload/) | Gemini File Search の display_name 単位の差し替えアップロード。 |

## 10. Postgres / Supabase

| スキル | 概要 |
|--------|------|
| [**supabase-postgres-best-practices**](./supabase-postgres-best-practices/) | Postgres / Supabase の公式観点での性能・セキュリティ・RLS・インデックスのレビュー。 |

## 11. Google Apps Script

| スキル | 概要 |
|--------|------|
| [**clasp-setup**](./clasp-setup/) | clasp でスプレッドシート紐付け GAS プロジェクトを初期化（`clasp create`・scopes・`clasp open`）。 |
| [**gas-refactor**](./gas-refactor/) | GAS の冗長排除・一括 get/setValues・JSDoc・トリガー破壊の警告。 |

## 12. Python 環境

| スキル | 概要 |
|--------|------|
| [**python-venv-requirements**](./python-venv-requirements/) | プロジェクトローカル venv と `requirements.txt` で依存を管理。 |

---

## 件数

上記グループに含まれるスキルは **52** 件（各フォルダに `SKILL.md` あり）。プロジェクト固有の `.cursor/skills`（業務アプリ用）は本リポジトリには含めていません。
