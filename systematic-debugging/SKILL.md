---
name: systematic-debugging
description: "Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes"
metadata:
  last_verified: "2026-03-17"
---

# Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## When to Use

Use for ANY technical issue: test failures, bugs in production, unexpected behavior, performance problems, build failures, integration issues.

**Use this ESPECIALLY when:** under time pressure, "just one quick fix" seems obvious, you've already tried multiple fixes, or you don't fully understand the issue.

## The Four Phases

You MUST complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read Error Messages Carefully** — Don't skip past errors; read stack traces completely; note line numbers, file paths, error codes.
2. **Reproduce Consistently** — Can you trigger it reliably? Exact steps? If not reproducible → gather more data, don't guess.
3. **Check Recent Changes** — Git diff, recent commits, new dependencies, config changes, environmental differences.
4. **Gather Evidence in Multi-Component Systems** — For each component boundary: log what enters/exits, verify config propagation, check state at each layer. Run once to gather evidence showing WHERE it breaks, then investigate that component.
5. **Trace Data Flow** — Where does bad value originate? What called this with bad value? Keep tracing up until you find the source. Fix at source, not at symptom.

### Phase 2: Pattern Analysis

- Find working examples in the same codebase.
- Compare against references; read reference implementation completely.
- Identify differences between working and broken; list every difference.
- Understand dependencies: settings, config, environment, assumptions.

### Phase 3: Hypothesis and Testing

1. **Form Single Hypothesis** — State clearly: "I think X is the root cause because Y."
2. **Test Minimally** — Smallest possible change to test hypothesis; one variable at a time.
3. **Verify Before Continuing** — Worked? → Phase 4. Didn't work? → Form NEW hypothesis. Don't add more fixes on top.
4. **When You Don't Know** — Say "I don't understand X"; don't pretend; ask for help or research more.

### Phase 4: Implementation

1. **Create Failing Test Case** — Simplest possible reproduction; automated test if possible. MUST have before fixing. Use the skill `test-driven-development` for writing proper failing tests.
2. **Implement Single Fix** — Address root cause; ONE change at a time; no "while I'm here" improvements.
3. **Verify Fix** — Test passes? No other tests broken? Issue actually resolved?
4. **If Fix Doesn't Work** — STOP. If < 3 attempts: return to Phase 1. If ≥ 3: question the architecture (see below).
5. **If 3+ Fixes Failed: Question Architecture** — Each fix reveals new shared state/coupling elsewhere? STOP and question fundamentals with your human partner.

## Red Flags - STOP and Follow Process

- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "It's probably X, let me fix that"
- Proposing solutions before tracing data flow
- "One more fix attempt" (when already tried 2+)

**ALL of these mean: STOP. Return to Phase 1.**

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|----------------|------------------|
| **1. Root Cause** | Read errors, reproduce, check changes, gather evidence | Understand WHAT and WHY |
| **2. Pattern** | Find working examples, compare | Identify differences |
| **3. Hypothesis** | Form theory, test minimally | Confirmed or new hypothesis |
| **4. Implementation** | Create test, fix, verify | Bug resolved, tests pass |

## Related

- Use skill **test-driven-development** for creating the failing test case (Phase 4, Step 1).
- If **two fix attempts** still reproduce the bug, or **local-quality-gate** fails **three times** on the same step, use **escalating-debug-loop** (stop, research, parallel critics, then one patch).

---
*Source: [awesome-claude-skills](https://github.com/BehiSecc/awesome-claude-skills) → [obra/superpowers systematic-debugging](https://github.com/obra/superpowers/tree/main/skills/systematic-debugging). Adapted for Cursor.*

## Troubleshooting

### エラー: 手順に沿っても再現しない

**原因**: 環境・バージョン・データ依存。

**対処**: 再現手順・期待値・実際のログを 1 セットにしてから、本文の次ステップへ進む。

### エラー: テストや検証が不安定

**原因**: テスト間の共有状態、非決定的な時間・ネットワーク。

**対処**: 分離・モック・タイムアウトを見直す。

な時間・ネットワーク。

**対処**: 分離・モック・タイムアウトを見直す。



な時間・ネットワーク。

**対処**: 分離・モック・タイムアウトを見直す。

��



な時間・ネットワーク。

**対処**: 分離・モック・タイムアウトを見直す。



��



な時間・ネットワーク。

**対処**: 分離・モック・タイムアウトを見直す。

