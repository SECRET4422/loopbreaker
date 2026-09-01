import { test } from "node:test";
import assert from "node:assert";
import { OscillationDetector } from "../src/detector.js";
import { FileSnapshot } from "../src/types.js";

test("OscillationDetector catches exact flip-flop oscillation", () => {
  const detector = new OscillationDetector();
  const file = "src/components/Header.tsx";

  const v1: FileSnapshot = {
    id: "1",
    filePath: file,
    relativePath: file,
    hash: "hash-A",
    content: "const a = 1;",
    timestamp: Date.now() - 10000,
  };

  const v2: FileSnapshot = {
    id: "2",
    filePath: file,
    relativePath: file,
    hash: "hash-B",
    content: "const a = 2;",
    timestamp: Date.now() - 5000,
  };

  const v3: FileSnapshot = {
    id: "3",
    filePath: file,
    relativePath: file,
    hash: "hash-A", // Exact revert to V1!
    content: "const a = 1;",
    timestamp: Date.now(),
  };

  assert.strictEqual(detector.recordEdit(v1), null);
  assert.strictEqual(detector.recordEdit(v2), null);

  const alert = detector.recordEdit(v3);
  assert.ok(alert, "Expected loop alert to be triggered on oscillation back to state A");
  assert.strictEqual(alert.pattern, "flip-flop");
  assert.strictEqual(alert.file, file);
  assert.strictEqual(alert.severity, "critical");
  assert.ok(alert.recommendedPrompt.includes("STOP:"));
});

test("OscillationDetector catches circular ping-pong between two files", () => {
  const detector = new OscillationDetector();
  const fileA = "src/Auth.tsx";
  const fileB = "src/api.ts";

  const createSnap = (file: string, id: string): FileSnapshot => ({
    id,
    filePath: file,
    relativePath: file,
    hash: id,
    content: `content ${id}`,
    timestamp: Date.now(),
  });

  // A -> B -> A -> B
  detector.recordEdit(createSnap(fileA, "1"));
  detector.recordEdit(createSnap(fileB, "2"));
  detector.recordEdit(createSnap(fileA, "3"));
  const alert = detector.recordEdit(createSnap(fileB, "4"));

  assert.ok(alert);
  assert.strictEqual(alert.pattern, "circular-pingpong");
  assert.ok(alert.file.includes(fileA));
  assert.ok(alert.file.includes(fileB));
});
