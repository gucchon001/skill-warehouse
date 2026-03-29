# wf / task / agent / ref と既存概念の対応

## 語と位置づけ

- **Workflow（WF）** — エンドツーエンドの流れ（例: 調査→設計→実装→ゲート→PR）。**claude-md-workflow-routing** の表とプロジェクト **CLAUDE.md** の章立てに相当。
- **Task** — WF 内の 1 ステップ（人間が依頼する単位）。Issue・チャット 1 スレッド・「〇〇して」1 回。
- **Agent** — そのタスクを実行するエージェント設定（親＋サブ）。**subagent-authoring**、`.cursor/agents/` や `.claude/agents/`。
- **Reference（ref）** — 長文仕様・コマンド一覧・ルーブリック。スキルの **references/**、**layer-skill-design** のデータ層（`prompt/`・`os/`）。

## layer-skill-design との関係

- **思考**: WF の「なぜこの順か」、タスク分解。
- **制作**: 実装・パッチ・UI。
- **データ**: ref に固定する入力仕様・シート定義・プロンプト素片。

## skill-builder との関係

- 1 スキル = 1 フォルダ。Task が「スキルを読め」と言ったら、そのスキルの **SKILL.md（第2層）** がエントリ。ref は **references/**。
