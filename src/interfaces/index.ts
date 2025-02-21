export interface LinterResult {
    filePath: string;
    line: number;
    column: number;
    ruleId: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    source: string;
    fix?: {
      range: [number, number];
      text: string;
    };
  }
  
  export interface ViolationLocation {
    line: number;
    column: number;
    source: string;
  }

  export interface ArgsResult {
    paths: string[];
    shouldFix: boolean;
  }

  export interface LinterOptions {
    ignore?: string[];
    extensions: string[];
    lintingSrouceFolder?: string;
    rules?: {
      [key: string]: { enabled: boolean };
    };
    rulesMessages?: {
      [key: string]: string;
    };
  }