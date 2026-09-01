---
name: loop-breaker
description: "Detect and break out of AI trial-and-error bug loops, code oscillation, and circular edits. Use when encountering repeating errors, when code edits keep breaking previously working features, or to revert to pre-loop snapshots."
category: debugging
risk: safe
author: Prabhakar Pal
tags: [debugging, circuit-breaker, oscillation, loopbreaker, ai-coding]
tools: [loopbreaker, claude, cursor]
---

# LoopBreaker Agent Skill

This skill guides AI coding agents on how to use `loopbreaker` to detect cognitive oscillation loops, halt trial-and-error spirals, and restore working snapshots.

## When to Use

- When an agent notices it is modifying the same file $\ge 3$ times to fix the same error.
- When an edit to fix Feature A accidentally breaks Feature B.
- When you need to restore the last clean project snapshot before an AI regression bug.

---

## Quick CLI Reference

```bash
# Start background watcher
npx loopbreaker

# Revert to last clean pre-loop snapshot
npx loopbreaker rollback

# View history of recent file snapshots
npx loopbreaker history
```

---

## Self-Correction Loop for AI Agents

When `loopbreaker` triggers an oscillation alert:

1. **Halt Immediate Patching**: Do NOT apply another micro-patch to the same file.
2. **Isolate the Architectural Conflict**:
   - Check if two components are fighting over state ownership.
   - Check if a `useEffect` or hook dependency array has circular dependencies.
3. **Execute Clean Rollback**:
   Run `npx loopbreaker rollback` to reset the file to its clean pre-loop state.
4. **Apply Root-Cause Refactor**:
   Extract shared logic into a standalone provider/module rather than continuing inline patching.
