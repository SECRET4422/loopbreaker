import fs from "node:fs/promises";
import path from "node:path";
import { watch, FSWatcher } from "node:fs";
import { SnapshotManager } from "./snapshot.js";
import { OscillationDetector } from "./detector.js";
import { printAlert, printStatus, printSuccess, printError } from "./ui.js";

const DEFAULT_IGNORES = [
  "node_modules",
  ".git",
  ".loopbreaker",
  "build",
  "dist",
  ".next",
  ".cache",
  "coverage",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
];

export class ProjectWatcher {
  private baseDir: string;
  private snapshotManager: SnapshotManager;
  private detector: OscillationDetector;
  private fsWatcher: FSWatcher | null = null;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private isProcessing = false;

  constructor(baseDir: string = process.cwd()) {
    this.baseDir = baseDir;
    this.snapshotManager = new SnapshotManager(baseDir);
    this.detector = new OscillationDetector();
  }

  private isIgnored(relPath: string): boolean {
    const normalized = relPath.replace(/\\/g, "/");
    return DEFAULT_IGNORES.some((ignored) => 
      normalized === ignored || normalized.startsWith(`${ignored}/`) || normalized.includes(`/${ignored}/`)
    );
  }

  async start(): Promise<void> {
    await this.snapshotManager.init();
    printStatus(`Active in: ${this.baseDir}`);

    try {
      this.fsWatcher = watch(
        this.baseDir,
        { recursive: true },
        (eventType, filename) => {
          if (!filename) return;
          const relPath = filename.toString();
          if (this.isIgnored(relPath)) return;

          // Debounce rapid writes
          const existing = this.debounceTimers.get(relPath);
          if (existing) clearTimeout(existing);

          const timer = setTimeout(() => {
            this.handleFileChange(relPath).catch((err) => {
              // Ignore transient file lock / deleted file errors
            });
          }, 300);

          this.debounceTimers.set(relPath, timer);
        }
      );

      this.setupInteractiveKeyboard();
    } catch (err: any) {
      printError(`Failed to start file watcher: ${err.message}`);
    }
  }

  private async handleFileChange(relPath: string): Promise<void> {
    if (this.isProcessing) return;
    const fullPath = path.join(this.baseDir, relPath);

    try {
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory() || stats.size > 2 * 1024 * 1024) return; // ignore directories and files >2MB

      const content = await fs.readFile(fullPath, "utf-8");
      const hash = this.snapshotManager.calculateHash(content);

      const snapshot = await this.snapshotManager.saveSnapshot(
        { [relPath]: content },
        `Edit on ${relPath}`
      );

      const fileSnapshot = snapshot.files[relPath];
      if (!fileSnapshot) return;

      printStatus(`Detected update in ${relPath}`);

      const alert = this.detector.recordEdit(fileSnapshot);
      if (alert) {
        printAlert(alert);
      }
    } catch {
      // File may have been deleted or moved; ignore
    }
  }

  private setupInteractiveKeyboard(): void {
    if (!process.stdin.isTTY) return;

    try {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding("utf8");

      process.stdin.on("data", async (key: string) => {
        if (key === "\u0003" || key.toLowerCase() === "q") {
          // Ctrl+C or Q
          printStatus("Exiting LoopBreaker...");
          this.stop();
          process.exit(0);
        }

        if (key.toLowerCase() === "r") {
          printStatus("Rolling back to pre-loop snapshot...");
          const res = await this.snapshotManager.restoreSnapshot();
          if (res) {
            printSuccess(`Restored ${res.restoredFiles.length} file(s) cleanly to state from ${new Date(res.timestamp).toLocaleTimeString()}`);
          } else {
            printError("No previous snapshot available to restore.");
          }
        }

        if (key.toLowerCase() === "c") {
          this.detector.reset();
          printSuccess("Cleared oscillation alerts.");
        }
      });
    } catch {
      // Non-interactive terminal environment
    }
  }

  stop(): void {
    if (this.fsWatcher) {
      this.fsWatcher.close();
      this.fsWatcher = null;
    }
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }
}
