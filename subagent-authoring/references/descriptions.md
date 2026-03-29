# サブエージェントの description（委譲のきっかけ）

親スキル: **subagent-authoring** の `SKILL.md`。

`description` が、いつ親エージェントがこのサブエージェントに任せるかを決める。具体語とトリガーを書く。

```yaml
# Too vague
description: Helps with code

# Specific
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
```

- 親が自動で任せてよいときは use proactively や同等の明示が有効。
- トリガー語句を列挙する（例: when encountering errors, for data analysis tasks）。

## Troubleshooting

### エラー: サブエージェントが選ばれない

**原因**: `description` が抽象的で、親の判断材料になっていない。

**対処**: 上記の具体例のように、いつ・どんな依頼で起動するかを短文で固定する。
