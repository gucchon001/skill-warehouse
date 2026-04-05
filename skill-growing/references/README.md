# skill-growing references ガイド

本ディレクトリは **人間向け** の設計思想・根拠・履歴を格納する。エージェントは実行時に SKILL.md のみ読めばよい。

## 正規参照（設計判断時に読むべきもの）

| ファイル | 役割 |
|----------|------|
| [proposal-integrated.md](proposal-integrated.md) | 4モデル統合提案。設計思想・4軸診断・gws安定化・ロードマップ・証拠駆動の昇格ルール。SKILL.md の設計判断はここを入口にする |
| [dialectic-3models-strict-integration.md](dialectic-3models-strict-integration.md) | 3モデル（Claude/GPT/Gemini）の妥協なき議論の結論。現 SKILL.md の「3制約・3トリガー」の直接的根拠 |
| （別スキル）`skill-builder/references/skill-folder-spec.md`（skill-builder フォルダの実パスは環境依存） | **フォルダ・各層・Troubleshooting 型・検証観点の厳密正本**＋**§9 SKILLS_ROOT・§10 複数環境の同期・ルール**（公式 PDF・Anthropic ドキュメントに整合）。育成・新規の両方で最優先 |
| （別スキル）`skill-builder/references/skill-creator-and-official.md`（skill-builder の実際の配置パス経由） | skill-folder-spec の補足（skill-creator 流れ・追加例） |

## 履歴（経緯の理解が必要な時に参照）

| ファイル | 内容 |
|----------|------|
| [context-loop-dialectic.md](context-loop-dialectic.md) | 弁証法 v1（Auto） |
| [context-loop-dialectic-v2.md](context-loop-dialectic-v2.md) | 弁証法 v2（Opus 4.6） |
| [context-loop-dialectic-v3.md](context-loop-dialectic-v3.md) | 弁証法 v3（GPT-5.4） |
| [context-loop-dialectic-v4.md](context-loop-dialectic-v4.md) | 弁証法 v4（Gemini 3.1 Pro） |
| [context-loop-dialectic-cross-model-comparison.md](context-loop-dialectic-cross-model-comparison.md) | 4モデル横断比較 |

## 統合済み（proposal-integrated に統合。個別参照は不要）

| ファイル | 統合先 |
|----------|--------|
| [autonomous-growth-proposal.md](autonomous-growth-proposal.md) | proposal-integrated §3.1 A-1〜A-3, §3.2 B-1 |
| [context-loop-dialectic-proposal.md](context-loop-dialectic-proposal.md) | proposal-integrated §3.3 C-3 |
| [proposal-autonomous-growth-and-gws-stability.md](proposal-autonomous-growth-and-gws-stability.md) | proposal-integrated 全体 |
