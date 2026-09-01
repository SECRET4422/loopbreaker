#!/usr/bin/env node
import { ProjectWatcher } from "./watcher.js";
import { SnapshotManager } from "./snapshot.js";
import { printBanner, printStatus, printSuccess, printError, colors } from "./ui.js";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "watch";

  if (args.includes("--help") || args.includes("-h") || command === "help") {
    printBanner();
    console.log(`Usage:
  npx loopbreaker               Start live background watcher (default)
  npx loopbreaker watch         Start live background watcher
  npx loopbreaker rollback      Revert to the last clean snapshot
  npx loopbreaker history       View recent file snapshots
  npx loopbreaker --version     Show version

Options:
  --help, -h                    Show this help message
  --version, -v                 Show version number

Repository: https://github.com/SECRET4422/loopbreaker
`);
    return;
  }

  if (args.includes("--version") || args.includes("-v") || command === "version") {
    console.log("loopbreaker v1.0.0");
    return;
  }

  const manager = new SnapshotManager();

  if (command === "rollback" || command === "undo") {
    printBanner();
    printStatus("Initiating 1-click rollback...");
    const res = await manager.restoreSnapshot(args[1]);
    if (res) {
      printSuccess(`Successfully restored ${res.restoredFiles.length} file(s) to snapshot from ${new Date(res.timestamp).toLocaleTimeString()}`);
      for (const f of res.restoredFiles) {
        console.log(`  ${colors.cyan}↺ ${f}${colors.reset}`);
      }
    } else {
      printError("No previous snapshot available to restore.");
    }
    return;
  }

  if (command === "history") {
    printBanner();
    const snapshots = await manager.loadSnapshots();
    if (snapshots.length === 0) {
      printStatus("No snapshots recorded yet.");
      return;
    }

    console.log(`${colors.bold}Recent Snapshots (${snapshots.length}):${colors.reset}\n`);
    for (const s of snapshots) {
      const time = new Date(s.timestamp).toLocaleString();
      const filesCount = Object.keys(s.files).length;
      console.log(`  ${colors.green}${s.id}${colors.reset} - ${colors.dim}${time}${colors.reset} (${filesCount} files) - ${s.message}`);
    }
    console.log(`\nTo restore a specific snapshot: ${colors.cyan}npx loopbreaker rollback <id>${colors.reset}`);
    return;
  }

  if (command === "watch" || command === "") {
    printBanner();
    const watcher = new ProjectWatcher();
    await watcher.start();
    return;
  }

  printError(`Unknown command: ${command}`);
  console.log("Run 'npx loopbreaker --help' for usage.");
}

main().catch((err) => {
  printError(`Fatal error: ${err.message}`);
  process.exit(1);
});
