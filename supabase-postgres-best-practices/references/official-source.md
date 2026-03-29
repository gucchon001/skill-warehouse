# Supabase Postgres Best Practices（公式）

- **Skills.sh**: https://skills.sh/supabase/agent-skills/supabase-postgres-best-practices
- **GitHub（正本・ルールファイル一式）**: https://github.com/supabase/agent-skills/tree/main/skills/supabase-postgres-best-practices
- **ライセンス**: MIT（`SKILL.md` frontmatter 参照）

## ルールファイルの場所（リポジトリ内）

`references/query-*.md`, `references/security-*.md`, `references/schema-*.md` など。詳細は公式 `SKILL.md` の「How to Use」。

## CLI で取り込む（推奨）

```bash
npx skills add https://github.com/supabase/agent-skills --skill supabase-postgres-best-practices
```

ホスト（Cursor / Claude Code）のスキル配置先は **skill-builder** の `references/skill-folder-spec.md` §9 を参照。
