import { LoopAlert } from "./types.js";

// Safe ANSI color formatters with zero external runtime dependencies
export const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgRed: "\x1b[41m",
  bgYellow: "\x1b[43m",
};

export function printBanner(): void {
  console.log("");
  console.log(`${colors.cyan}${colors.bold}╔═══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}║                 ⚡ LoopBreaker v1.0.0                          ║${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}║    Autonomous AI Bug-Loop Interrupter & Circuit Breaker       ║${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}╚═══════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log(`${colors.dim}  Watching for AI code oscillation & trial-and-error churn...${colors.reset}\n`);
}

export function printAlert(alert: LoopAlert): void {
  const isCritical = alert.severity === "critical";
  const headerColor = isCritical ? colors.bgRed : colors.bgYellow;
  const title = isCritical ? "🚨 CIRCUIT BREAKER TRIGGERED" : "⚠️  HIGH CHURN WARNING";

  console.log("\n" + "=".repeat(65));
  console.log(`${headerColor}${colors.bold} ${title} ${colors.reset}`);
  console.log("=".repeat(65));
  console.log(`\n${colors.bold}File:${colors.reset} ${colors.yellow}${alert.file}${colors.reset}`);
  console.log(`${colors.bold}Pattern:${colors.reset} ${colors.red}${alert.pattern.toUpperCase()}${colors.reset}`);
  console.log(`${colors.bold}Diagnosis:${colors.reset} ${alert.details}\n`);

  console.log(`${colors.green}${colors.bold}👉 Paste this fix prompt into Cursor / Claude to break the loop:${colors.reset}`);
  console.log(`${colors.dim}---------------------------------------------------------------${colors.reset}`);
  console.log(`${colors.cyan}${alert.recommendedPrompt}${colors.reset}`);
  console.log(`${colors.dim}---------------------------------------------------------------${colors.reset}`);
  console.log(`\n${colors.bold}Options:${colors.reset} Press ${colors.green}[R]${colors.reset} to rollback to pre-loop snapshot | ${colors.yellow}[C]${colors.reset} to clear alarm | ${colors.red}[Q]${colors.reset} to quit\n`);
}

export function printStatus(status: string): void {
  const time = new Date().toLocaleTimeString();
  console.log(`${colors.dim}[${time}]${colors.reset} ${status}`);
}

export function printSuccess(message: string): void {
  console.log(`${colors.green}✔ ${message}${colors.reset}`);
}

export function printWarning(message: string): void {
  console.log(`${colors.yellow}▲ ${message}${colors.reset}`);
}

export function printError(message: string): void {
  console.log(`${colors.red}✖ ${message}${colors.reset}`);
}
