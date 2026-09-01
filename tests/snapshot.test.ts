import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { SnapshotManager } from "../src/snapshot.js";

test("SnapshotManager saves and restores file snapshots accurately", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "lb-test-"));
  const manager = new SnapshotManager(tmpDir);

  const testFile = "src/App.tsx";
  const initialContent = "export function App() { return <div>Initial</div>; }";
  const modifiedContent = "export function App() { return <div>Modified</div>; }";

  // 1. Save Initial Snapshot
  await manager.saveSnapshot({ [testFile]: initialContent }, "Initial Commit");

  // 2. Save Modified Snapshot
  await manager.saveSnapshot({ [testFile]: modifiedContent }, "Modified State");

  // Verify history
  const snapshots = await manager.loadSnapshots();
  assert.strictEqual(snapshots.length, 2);
  assert.strictEqual(snapshots[1].files[testFile].content, initialContent);
  assert.strictEqual(snapshots[0].files[testFile].content, modifiedContent);

  // 3. Restore Initial Snapshot (second in list)
  const restoreRes = await manager.restoreSnapshot(snapshots[1].id);
  assert.ok(restoreRes);
  assert.strictEqual(restoreRes.restoredFiles.length, 1);

  // 4. Verify disk content matches initial
  const diskContent = await fs.readFile(path.join(tmpDir, testFile), "utf-8");
  assert.strictEqual(diskContent, initialContent);

  // Cleanup
  await fs.rm(tmpDir, { recursive: true, force: true });
});
