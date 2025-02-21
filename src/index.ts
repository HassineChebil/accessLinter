#!/usr/bin/env node

import { statSync } from "node:fs";
import { argsChecker, getTargetPath } from "./utils";
import { loadConfig } from "./utils";
import { AccessibilityLinter } from "./accessLint";
import { LinterResult } from "./interfaces";

async function main() {
  const args = argsChecker();
  const config = await loadConfig(process.cwd());
  const linter = new AccessibilityLinter(config);

  let targetPath = getTargetPath(args.paths[0], config);
  let results: LinterResult[] = [];

  try {
    const stats = statSync(targetPath);

    if (stats.isDirectory()) {
      console.log(`Linting directory: ${targetPath}`);
      results = await linter.lintDirectory(targetPath);
    } else if (stats.isFile()) {
      console.log(`Linting file: ${targetPath}`);
      results = await linter.lintFile(targetPath);
    } else {
      console.error("Error: Path is neither a file nor a directory");
      process.exit(1);
    }

    linter.printResults(results);
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
