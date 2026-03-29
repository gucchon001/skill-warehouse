# クリティック用サブエージェント定義の例

**配置**: [subagent-authoring の locations.md](../../subagent-authoring/references/locations.md) に従う。

3 ファイルに分ける（`critic-accuracy.md`, `critic-coverage.md`, `critic-alternatives.md`）か、1 ファイルで `name` だけ変える運用は非推奨（description が混線する）。

## 共通

- `tools`: Read, Grep, Glob 等 **読み取り中心**
- 本文で **default-critic-prompts.md の該当節**を読むよう指示するか、プロンプトを短く埋め込む

## critic-accuracy.md（例・要約）

```markdown
---
name: critic-accuracy
description: Pre-implementation critique ONLY for evidence and factual correctness. Invoked in parallel with other critics before coding. Read-only.
tools: Read, Grep, Glob
---
Apply the "Critic A" section from the project's pre-implementation-critics references (default-critic-prompts.md). Output structured findings; do not write production code.
```

`critic-coverage.md` / `critic-alternatives.md` は B・C 節に置き換えて同型で作成する。
