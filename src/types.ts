export interface FileSnapshot {
  id: string;
  filePath: string;
  relativePath: string;
  hash: string;
  content: string;
  timestamp: number;
}

export interface ProjectSnapshot {
  id: string;
  timestamp: number;
  message?: string;
  files: Record<string, FileSnapshot>;
}

export type LoopPattern = 'flip-flop' | 'high-churn' | 'circular-pingpong';

export interface LoopAlert {
  pattern: LoopPattern;
  file: string;
  severity: 'warning' | 'critical';
  details: string;
  conflictingDiffs?: {
    prior: string;
    recent: string;
  };
  recommendedPrompt: string;
}

export interface WatcherOptions {
  cwd: string;
  ignore?: string[];
  churnThreshold?: number;
  timeWindowMs?: number;
}
