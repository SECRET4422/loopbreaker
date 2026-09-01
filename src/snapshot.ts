import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { FileSnapshot, ProjectSnapshot } from "./types.js";

const MAX_SNAPSHOTS = 30;

export class SnapshotManager {
  private baseDir: string;
  private snapshotsDir: string;
  private indexFile: string;

  constructor(baseDir: string = process.cwd()) {
    this.baseDir = baseDir;
    this.snapshotsDir = path.join(baseDir, ".loopbreaker", "snapshots");
    this.indexFile = path.join(baseDir, ".loopbreaker", "index.json");
  }

  async init(): Promise<void> {
    await fs.mkdir(this.snapshotsDir, { recursive: true });
    try {
      await fs.access(this.indexFile);
    } catch {
      await fs.writeFile(this.indexFile, JSON.stringify({ snapshots: [] }, null, 2), "utf-8");
    }
  }

  calculateHash(content: string): string {
    return crypto.createHash("sha256").update(content).digest("hex");
  }

  async loadSnapshots(): Promise<ProjectSnapshot[]> {
    await this.init();
    try {
      const data = await fs.readFile(this.indexFile, "utf-8");
      const parsed = JSON.parse(data);
      return Array.isArray(parsed.snapshots) ? parsed.snapshots : [];
    } catch {
      return [];
    }
  }

  async saveSnapshot(files: Record<string, string>, message?: string): Promise<ProjectSnapshot> {
    await this.init();
    const snapshots = await this.loadSnapshots();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const timestamp = Date.now();

    const fileSnapshots: Record<string, FileSnapshot> = {};

    for (const [relPath, content] of Object.entries(files)) {
      const hash = this.calculateHash(content);
      const snapshotFile = path.join(this.snapshotsDir, `${hash}.blob`);

      // Write content blob if it does not exist
      try {
        await fs.access(snapshotFile);
      } catch {
        await fs.writeFile(snapshotFile, content, "utf-8");
      }

      fileSnapshots[relPath] = {
        id,
        filePath: path.join(this.baseDir, relPath),
        relativePath: relPath,
        hash,
        content,
        timestamp,
      };
    }

    const newSnapshot: ProjectSnapshot = {
      id,
      timestamp,
      message: message || `Auto-snapshot at ${new Date(timestamp).toLocaleTimeString()}`,
      files: fileSnapshots,
    };

    snapshots.unshift(newSnapshot);

    // Keep up to MAX_SNAPSHOTS
    const trimmed = snapshots.slice(0, MAX_SNAPSHOTS);
    await fs.writeFile(this.indexFile, JSON.stringify({ snapshots: trimmed }, null, 2), "utf-8");

    return newSnapshot;
  }

  async restoreSnapshot(snapshotId?: string): Promise<{ restoredFiles: string[]; timestamp: number } | null> {
    const snapshots = await this.loadSnapshots();
    if (snapshots.length === 0) return null;

    const target = snapshotId 
      ? snapshots.find((s) => s.id === snapshotId)
      : (snapshots.length > 1 ? snapshots[1] : snapshots[0]);

    if (!target) return null;

    const restored: string[] = [];

    for (const [relPath, fileInfo] of Object.entries(target.files)) {
      const fullPath = path.join(this.baseDir, relPath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      // Atomic write via temp file
      const tempPath = `${fullPath}.tmp.${Date.now()}`;
      await fs.writeFile(tempPath, fileInfo.content, "utf-8");
      await fs.rename(tempPath, fullPath);
      restored.push(relPath);
    }

    return {
      restoredFiles: restored,
      timestamp: target.timestamp,
    };
  }
}
