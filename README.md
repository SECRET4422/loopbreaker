<h1 align="center">⚡ LoopBreaker</h1>
<p align="center"><b>Autonomous AI Bug-Loop Interrupter & Circuit Breaker for Cursor, Claude Code, and ChatGPT.</b></p>

<p align="center">
  <a href="https://github.com/SECRET4422/loopbreaker/actions"><img src="https://img.shields.io/github/actions/workflow/status/SECRET4422/loopbreaker/ci.yml?branch=main&label=CI&logo=github" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/@ssgk4422/loopbreaker"><img src="https://img.shields.io/npm/v/@ssgk4422/loopbreaker?logo=npm&color=red" alt="npm" /></a>
  <a href="https://www.npmjs.com/package/@ssgk4422/loopbreaker"><img src="https://img.shields.io/npm/dm/@ssgk4422/loopbreaker?logo=npm" alt="downloads" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-3ddc97.svg" alt="MIT" /></a>
  <a href="https://github.com/SECRET4422/loopbreaker/stargazers"><img src="https://img.shields.io/github/stars/SECRET4422/loopbreaker?style=flat&logo=github" alt="stars" /></a>
  <a href="skills/loop-breaker/SKILL.md"><img src="https://img.shields.io/badge/Agent%20Skill-Compatible-8a2be2" alt="Agent Skill" /></a>
  <img src="https://img.shields.io/badge/Zero%20API%20Keys-Free-2ea44f" alt="Zero API Keys" />
</p>

---

### The Problem: The AI "Whack-a-Mole" Loop

When building apps with AI (Cursor, Claude Code, Lovable, Bolt), non-technical builders frequently get trapped in **oscillation loops**:
1. You prompt the AI to fix **Bug A**.
2. The AI applies a patch that accidentally breaks **Feature B**.
3. You prompt to fix **Feature B**, and the AI recreates **Bug A**.
4. Within 15 minutes, you burn thousands of tokens, your files balloon into spaghetti code, and your project is broken.

```
                  ┌───────────────────────────────┐
                  ▼                               │
      Prompt to fix Bug A ──► AI breaks Feature B │ (Whack-a-Mole Loop)
                  │                               │
                  └───────► Prompt to fix Feature B
```

**LoopBreaker stops this cycle cold.**

---

### ⚡ Quickstart

Run a single zero-config command inside any project:

```bash
npx @ssgk4422/loopbreaker
```

> No installation, no accounts, and **zero API keys required**. LoopBreaker runs 100% locally on your machine.

---

### 🛠️ How It Works

```
╔═══════════════════════════════════════════════════════════════╗
║                 ⚡ LoopBreaker v1.0.0                          ║
║    Autonomous AI Bug-Loop Interrupter & Circuit Breaker       ║
╚═══════════════════════════════════════════════════════════════╝

=================================================================
 🚨 CIRCUIT BREAKER TRIGGERED 
=================================================================

File: src/App.tsx
Pattern: FLIP-FLOP
Diagnosis: Exact oscillation detected! 'src/App.tsx' was modified 
           and then immediately reverted back to its previous state.

👉 Paste this fix prompt into Cursor / Claude to break the loop:
---------------------------------------------------------------
STOP: Code oscillation detected on 'src/App.tsx'. You are alternating
between two conflicting implementations.
1. Stabilize the useEffect dependency array.
2. Lift state to a standalone AuthContext instead of inline patching.
---------------------------------------------------------------

Options: Press [R] to rollback to pre-loop snapshot | [C] to clear alarm
```

---

### 🧠 Tri-Factor Detection Heuristics

| Heuristic | Detection Mechanism | Why it Happens |
|---|---|---|
| **Flip-Flop Inversion** | Symmetric diff inversion $\ge 70\%$ across 3 consecutive edits | AI alternates between two conflicting patches |
| **High Churn Velocity** | $\ge 4$ edits in $<6$ mins with net delta $<15$ lines | AI is blindly guessing without understanding the bug |
| **Circular Ping-Pong** | Alternating edits across 2 files (`A ↔ B`) | Cross-file circular dependency conflict |

---

### ⌨️ CLI Commands

```bash
# Start background watcher (default)
npx @ssgk4422/loopbreaker

# 1-click rollback to clean state before the loop began
npx @ssgk4422/loopbreaker rollback

# View history of recent file snapshots & timestamps
npx @ssgk4422/loopbreaker history

# Display help and options
npx @ssgk4422/loopbreaker --help
```

---

### 🤖 Agent Skill Integration

LoopBreaker includes an open-standard [Agent Skill](skills/loop-breaker/SKILL.md) compliant with `agentskills.io`. AI coding agents can inspect their own edit history and halt their own loops autonomously.

---

### 📄 License

MIT © 2026 [Prabhakar Pal](https://github.com/SECRET4422). Free and open source.
