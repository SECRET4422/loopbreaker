# 🚀 LoopBreaker Launch & Community Distribution Kit

Everything you need to distribute **`loopbreaker`** across Reddit, Hacker News, Twitter/X, and developer communities.

---

## 1. Reddit Launch Post

*Post to: `r/Cursor`, `r/vibecoding`, `r/ClaudeAI`, and `r/ChatGPTCoding`*  
*(Optimal posting time: Tuesday–Thursday 8:00 AM – 11:00 AM EST)*

### Title:
```
I got tired of the AI "Whack-A-Mole" bug loop, so I built LoopBreaker — an open-source circuit breaker that detects code oscillation and stops trial-and-error spirals
```

### Post Body:
```markdown
Hey everyone! 👋

If you code with Cursor, Claude, or ChatGPT, you've probably experienced this exact nightmare:
1. You prompt the AI to fix **Bug A**.
2. The AI applies a patch that accidentally breaks **Feature B**.
3. You prompt to fix **Feature B**, and the AI recreates **Bug A**.
4. 15 minutes later, you've burned thousands of tokens, your files have ballooned into unreadable spaghetti code, and your project is broken.

I built **`loopbreaker`** to kill this cycle.

### ⚡ What it does:
- **Background Watcher**: Runs in your terminal with a single command (`npx loopbreaker`).
- **Tri-Factor Oscillation Detector**:
  1. *Flip-Flop Detection*: Detects when lines are added, deleted, and re-added across consecutive prompts.
  2. *High Churn Velocity*: Flags when a single file is modified 4+ times in under 6 minutes with net-zero structural progress.
  3. *Circular Ping-Pong*: Catches when modifying File A breaks File B and vice versa.
- **Circuit Breaker & 1-Click Rollback**: When an oscillation is detected, it freezes the loop and lets you press `[R]` to instantly restore the clean pre-loop snapshot (zero Git knowledge needed).
- **Surgical Reset Prompt**: Instead of generic advice, it outputs the exact root-cause prompt to paste into Cursor/Claude to break the architectural loop cleanly.

### 🚀 Try it (100% Free & Zero API Keys):
```bash
npx loopbreaker
```

- **GitHub**: https://github.com/SECRET4422/loopbreaker
- **npm**: https://www.npmjs.com/package/loopbreaker

Built with pure TypeScript heuristics, zero tracking, and zero API costs. Would love your feedback and edge cases!
```

---

## 2. Hacker News (Show HN)

*Post to: [news.ycombinator.com/submit](https://news.ycombinator.com/submit)*

### Title:
```
Show HN: LoopBreaker – An open-source circuit breaker for AI code oscillation loops
```

### URL:
```
https://github.com/SECRET4422/loopbreaker
```

### First Comment:
```markdown
Hi HN! Author here.

One of the biggest failure modes in AI-assisted coding is what I call the "Whack-a-Mole oscillation loop": the developer asks an LLM to fix a bug, the LLM applies a local heuristic that breaks an adjacent feature, and the developer gets trapped in a cycle of speculative re-prompting.

`loopbreaker` is an open-source CLI tool that monitors file system diffs in real-time during AI coding sessions.

How it works:
1. Maintains content-addressable rolling snapshots in memory/disk.
2. Analyzes symmetric diff inversion (symmetric delta > 70% across 3 edits) and high-velocity file churn.
3. Automatically triggers a circuit breaker, preventing further destructive edits.
4. Provides 1-key instant rollback and synthesizes a root-cause architectural prompt to break the oscillation.

It requires zero API keys, runs 100% locally with Node.js, and is MIT licensed:
https://github.com/SECRET4422/loopbreaker

Feedback on the oscillation heuristics and diff algorithms is warmly welcomed!
```

---

## 3. Twitter / X Launch Thread

```text
1/4 ⚡ Tired of AI coding agents getting stuck in "Whack-A-Mole" bug loops?

You prompt Cursor to fix Bug A ➔ it breaks Feature B ➔ you fix Feature B ➔ it brings back Bug A.

Introducing LoopBreaker: The open-source Circuit Breaker for AI coding. 🧵👇

2/4 🔍 How it works:
LoopBreaker runs quietly in your terminal (`npx loopbreaker`).

It watches your files in real time and detects:
- Code flip-flop oscillation (alternating diffs)
- High-churn trial-and-error edits
- Cross-file circular ping-pong

3/4 🛑 When a loop is detected, it freezes the spiral:
- Sounds a circuit breaker alert
- 1-key rollback to the clean state before the loop [R]
- Generates the exact root-cause prompt to fix the architectural conflict

4/4 🚀 100% Free, Zero API Keys required:

npx loopbreaker

⭐ Star on GitHub: https://github.com/SECRET4422/loopbreaker
📦 npm: https://www.npmjs.com/package/loopbreaker
```
