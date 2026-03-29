# サブエージェント作成ワークフロー

親スキル: **subagent-authoring** の `SKILL.md`。

1. **スコープ**: プロジェクト用かユーザー用か決める（[locations.md](locations.md)）。
2. **ファイル作成**: ホストの `agents/` 相当に `.md` を置く（[format.md](format.md)）。
3. **フロントマター**: `name`（小文字・ハイフン）、`description`（[descriptions.md](descriptions.md)）。Claude Code では公式どおり任意キー（`tools` 等）を検討。
4. **システムプロンプト**: 本文に役割・手順・出力形式・制約を書く。
5. **試験**: 例: 「〇〇サブエージェントで [タスク] を実行して」。

**原則**: 1 サブエージェント 1 焦点。`description` にトリガーを豊富に。プロジェクト用定義はバージョン管理に含める。

## Troubleshooting

### エラー: 期待どおりに委譲されない

**原因**: `description` が弱い、または親の会話文脈とトリガーが合っていない。

**対処**: [descriptions.md](descriptions.md) を見直し、プロアクティブ委譲の文言を足す。
