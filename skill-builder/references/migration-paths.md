# ルール・スラッシュコマンド → スキル移行パス

**旧スキル `migrate-locations` を統合。** 配置の正本は **skill-folder-spec.md** §9 と併せて参照する。

## 関連

| リソース | 役割 |
|----------|------|
| **本ファイル** | 移行元・移行先パス一覧（プロジェクト / ユーザー） |
| **cursor-rules** | ルールを**残す**ときの `.mdc`（形式・`alwaysApply` / `globs`・本文） |
| **skill-builder** / **skill-growing** | 内容をベースに**新規スキル**を作る／育てる |
| **skill-folder-spec.md** | 公式フォルダ構成・ホスト別パス |

## パス一覧

| Level | Source | Destination |
|-------|--------|-------------|
| Project | `{workspaceFolder}/**/.cursor/rules/*.mdc`, `{workspaceFolder}/**/.cursor/commands/*.md` | `{workspaceFolder}/.cursor/skills/` |
| User | — | `~/.cursor/skills/` |
| User commands | `~/.cursor/commands/*.md` | `~/.cursor/skills/` |

**無視するパス**: `~/.cursor/worktrees`, `~/.cursor/skills-cursor`。ルールはネストした `.cursor/rules/` にも置けるため、移行元の探索は glob で行う。

## Troubleshooting

### エラー: 移行したスキルが一覧に出ない・読まれない

**原因**: グローバルとプロジェクトの取り違え、フォルダ名と `SKILL.md` の `name` の不一致、配置が `skills` 以外。

**対処**: `~/.cursor/skills/<name>/` または `.cursor/skills/<name>/` を確認。**skill-folder-spec.md** §9 でホスト別パスを確認。

### エラー: どこからどこへコピーすればよいか分からない

**原因**: ネストした `.cursor/rules` や user commands の場所が曖昧。

**対処**: 上記 **パス一覧**を再確認。`worktrees` は無視。プロジェクト内で `.cursor/commands` / `.cursor/rules` を glob 検索する。

### エラー: ルールをスキル化すべきか判断できない

**原因**: `alwaysApply` や `globs` 付きルールはスキル化ポリシーと相性が悪いことがある。

**対処**: **cursor-rules**（`references/scope.md`）で「常時 `.mdc`」か判断する。**オンデマンド**なら **skill-builder** で `SKILL.md` を新規作成し、本文をルール／コマンドから移す。
