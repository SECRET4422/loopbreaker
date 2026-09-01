import { FileSnapshot, LoopAlert } from "./types.js";
import { generateLoopFixPrompt } from "./prompt-generator.js";

export class OscillationDetector {
  private fileHistory: Map<string, FileSnapshot[]> = new Map();
  private globalEdits: { file: string; timestamp: number }[] = [];

  recordEdit(snapshot: FileSnapshot): LoopAlert | null {
    const file = snapshot.relativePath;
    const history = this.fileHistory.get(file) || [];
    history.push(snapshot);
    this.fileHistory.set(file, history);

    this.globalEdits.push({ file, timestamp: snapshot.timestamp });
    if (this.globalEdits.length > 50) this.globalEdits.shift();

    // 1. Exact or Partial Flip-Flop Detection (requires at least 3 versions)
    if (history.length >= 3) {
      const v1 = history[history.length - 3];
      const v2 = history[history.length - 2];
      const v3 = history[history.length - 1];

      // Exact loop: V3 reverted back to V1
      if (v3.hash === v1.hash && v3.hash !== v2.hash) {
        return {
          pattern: "flip-flop",
          file,
          severity: "critical",
          details: `Exact oscillation detected! '${file}' was modified and then immediately reverted back to its previous state.`,
          conflictingDiffs: {
            prior: v2.content.slice(0, 500),
            recent: v3.content.slice(0, 500),
          },
          recommendedPrompt: generateLoopFixPrompt(file, "flip-flop", v2.content, v3.content),
        };
      }

      // Partial line-inversion check
      const inversionScore = this.calculateInversionScore(v1.content, v2.content, v3.content);
      if (inversionScore > 0.7) {
        return {
          pattern: "flip-flop",
          file,
          severity: "critical",
          details: `Code oscillation detected (${Math.round(inversionScore * 100)}% symmetric conflict in '${file}'). The AI is fighting its own changes.`,
          conflictingDiffs: {
            prior: v2.content.slice(0, 500),
            recent: v3.content.slice(0, 500),
          },
          recommendedPrompt: generateLoopFixPrompt(file, "flip-flop", v2.content, v3.content),
        };
      }
    }

    // 2. High Churn Velocity Check (4+ edits in 6 minutes with net-zero growth)
    const recentEdits = history.filter((h) => Date.now() - h.timestamp < 6 * 60 * 1000);
    if (recentEdits.length >= 4) {
      const first = recentEdits[0];
      const latest = recentEdits[recentEdits.length - 1];
      const lineDelta = Math.abs(
        first.content.split("\n").length - latest.content.split("\n").length
      );

      if (lineDelta < 15) {
        return {
          pattern: "high-churn",
          file,
          severity: "warning",
          details: `High churn detected on '${file}' (${recentEdits.length} edits in <6 mins with net delta of only ${lineDelta} lines). The AI is stuck in a trial-and-error loop.`,
          recommendedPrompt: generateLoopFixPrompt(file, "high-churn", first.content, latest.content),
        };
      }
    }

    // 3. Circular Ping-Pong between 2 files (A -> B -> A -> B)
    if (this.globalEdits.length >= 4) {
      const last4 = this.globalEdits.slice(-4).map((e) => e.file);
      if (
        last4[0] === last4[2] &&
        last4[1] === last4[3] &&
        last4[0] !== last4[1]
      ) {
        const fileA = last4[0];
        const fileB = last4[1];
        return {
          pattern: "circular-pingpong",
          file: `${fileA} ↔ ${fileB}`,
          severity: "critical",
          details: `Circular ping-pong loop detected between '${fileA}' and '${fileB}'. Modifying one is breaking the other.`,
          recommendedPrompt: generateLoopFixPrompt(
            `${fileA} & ${fileB}`,
            "circular-pingpong",
            "",
            ""
          ),
        };
      }
    }

    return null;
  }

  private calculateInversionScore(c1: string, c2: string, c3: string): number {
    const lines1 = new Set(c1.split("\n").map((l) => l.trim()).filter(Boolean));
    const lines2 = new Set(c2.split("\n").map((l) => l.trim()).filter(Boolean));
    const lines3 = new Set(c3.split("\n").map((l) => l.trim()).filter(Boolean));

    // Lines removed in step 2 but re-added in step 3
    let reAdded = 0;
    for (const line of lines1) {
      if (!lines2.has(line) && lines3.has(line)) {
        reAdded++;
      }
    }

    // Lines added in step 2 but removed in step 3
    let revertedAdd = 0;
    for (const line of lines2) {
      if (!lines1.has(line) && !lines3.has(line)) {
        revertedAdd++;
      }
    }

    const totalConflict = reAdded + revertedAdd;
    if (totalConflict === 0) return 0;

    const baseLines = Math.max(lines1.size, lines2.size, lines3.size, 1);
    return Math.min(1.0, (totalConflict * 3) / baseLines);
  }

  reset(): void {
    this.fileHistory.clear();
    this.globalEdits = [];
  }
}
