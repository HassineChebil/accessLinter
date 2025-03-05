import { LinterOptions } from "../interfaces";

type Severity = 'error' | 'warning' | 'info';

function isValidSeverity(severity: string): severity is Severity {
  return ['error', 'warning', 'info'].includes(severity);
}

export function validateConfig(config: any): LinterOptions {
  const severity = isValidSeverity(config.severity) ? config.severity : 'error';
  
  return {
    ...config,
    severity
  };
}