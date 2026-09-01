import { LoopPattern } from "./types.js";

export function generateLoopFixPrompt(
  fileName: string,
  pattern: LoopPattern,
  priorContent: string,
  recentContent: string
): string {
  if (pattern === "circular-pingpong") {
    return [
      `STOP: A circular dependency loop was detected between ${fileName}.`,
      `Do not modify either file in isolation. Instead:`,
      `1. Identify the shared state, types, or utilities causing the cross-dependency.`,
      `2. Extract the shared logic into a standalone module (e.g. a shared context, hook, or utils file).`,
      `3. Import the shared module into both files without circular cross-imports.`,
    ].join("\n");
  }

  if (pattern === "high-churn") {
    return [
      `STOP: We are in a high-churn trial-and-error loop on '${fileName}'.`,
      `Do not apply another incremental patch. Instead:`,
      `1. Take a step back and identify why previous edits keep failing or triggering secondary bugs.`,
      `2. State the root-cause architecture problem in 2 sentences.`,
      `3. Propose a clean, modular refactor rather than patching the existing monolithic block.`,
    ].join("\n");
  }

  // Flip-flop oscillation
  const isReact = fileName.endsWith(".tsx") || fileName.endsWith(".jsx") || recentContent.includes("useState") || recentContent.includes("useEffect");

  if (isReact) {
    return [
      `STOP: Code oscillation detected on '${fileName}'. You are alternating between two conflicting implementations.`,
      `To resolve this definitively:`,
      `1. If this is a React re-render or useEffect loop: stabilize the dependency array, move pure helper functions outside the component, and memoize callbacks with useCallback.`,
      `2. If state is conflicting between parent and child: lift the state up to a single source of truth or encapsulate it in a React Context.`,
      `3. Provide a complete, stable replacement for '${fileName}' without re-introducing previously removed code.`,
    ].join("\n");
  }

  return [
    `STOP: Oscillation loop detected on '${fileName}'. Consecutive edits are reverting and conflicting with prior versions.`,
    `1. Identify the two competing requirements causing this oscillation.`,
    `2. Define a clean separation of concerns so both requirements are met without conflicting code lines.`,
    `3. Output the finalized, stable code.`,
  ].join("\n");
}
