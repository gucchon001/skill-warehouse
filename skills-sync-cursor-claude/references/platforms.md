# OS 別: グローバルスキル同期

パス（例・Windows）:

- Cursor: `%USERPROFILE%\.cursor\skills`
- Claude Code: `%USERPROFILE%\.claude\skills`

**正本 = Cursor** のときの典型（Claude 側を Cursor と同一ビューにする）を書く。正本を Claude にする場合はパスを入れ替える。

---

## Windows: ディレクトリジャンクション（推奨）

**条件**: `.claude\skills` が**空でない**場合は、中身を `.cursor\skills` にマージするか、退避してから空にする。

管理者権限は通常不要（ユーザーディレクトリ内のジャンクション）。

1. アプリ終了・バックアップ。
2. PowerShell（推奨: リンクを貼る側が **存在しない** こと）:

```powershell
$cursor = Join-Path $env:USERPROFILE '.cursor\skills'
$claude = Join-Path $env:USERPROFILE '.claude\skills'

# .claude\skills が実フォルダで中身がある場合: 退避してから続行
# Rename-Item $claude "$claude.backup-$(Get-Date -Format 'yyyyMMdd')"

# .claude\skills を削除または退避したうえで（フォルダが無い状態で）:
cmd /c mklink /J "$claude" "$cursor"
```

3. エクスプローラで `.claude\skills` を開き、`.cursor\skills` と同じサブフォルダが見えるか確認。

**逆（正本 = Claude）**: `mklink /J` の第1引数・第2引数を入れ替える。`.cursor\skills` を退避し、存在しない状態で `mklink /J "<cursor>" "<claude>"`。

---

## Windows: 一方向コピー（ジャンクション不可のとき）

削除をミラーリングしない**増分コピー**（新規・更新のみ）の例:

```powershell
$cursor = Join-Path $env:USERPROFILE '.cursor\skills'
$claude = Join-Path $env:USERPROFILE '.claude\skills'
New-Item -ItemType Directory -Force -Path $claude | Out-Null
robocopy $cursor $claude /E /XO /NFL /NDL /NJH /NJS
```

- **Cursor → Claude**: 上記のまま。
- **Claude → Cursor**: `$cursor` と `$claude` を入れ替える。

`/MIR` は宛先で余分なファイルを**削除**するため、誤方向でデータ喪失しうる。使う場合は必ずバックアップと方向の再確認を行う。

スキルフォルダ内の **`scripts/Sync-GlobalSkills.ps1`** でも同様のコピーが可能。

---

## macOS / Linux: シンボリックリンク

**正本 = Cursor**、`.claude/skills` を置き換える例:

```bash
CURSOR_SKILLS="$HOME/.cursor/skills"
CLAUDE_SKILLS="$HOME/.claude/skills"

# 既存を退避
mv "$CLAUDE_SKILLS" "${CLAUDE_SKILLS}.backup.$(date +%Y%m%d)"

ln -s "$CURSOR_SKILLS" "$CLAUDE_SKILLS"
```

`readlink -f` や `ls -la ~/.claude/skills` でリンク先を確認。

---

## macOS / Linux: rsync（コピー同期）

```bash
rsync -a --update ~/.cursor/skills/ ~/.claude/skills/
```

逆方向はパスを入れ替える。削除の同期が必要なら `rsync --delete`（**宛先の余分ファイルが消える**）のリスクを理解してから使う。
