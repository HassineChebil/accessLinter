import { existsSync } from "node:fs";
import path from "node:path";
import { ArgsResult, LinterOptions } from "../interfaces";

export const setImpactColor = (impact: string | null | undefined) => {
  switch (impact) {
    case "critical":
      return "red";
    case "serious":
      return "yellow";
    case "moderate":
      return "yellow";
    case "minor":
      return "blue";
    default:
      return "green";
  }
};

export function getTargetPath(arg0: string, config: LinterOptions): string {
  let targetPath = transformPath(arg0, config);
  if (targetPath === ".") {
    targetPath = process.cwd();
  } else {
    targetPath = path.resolve(process.cwd(), targetPath);
  }

  if (!existsSync(targetPath)) {
    console.error(`Error: Path "${targetPath}" does not exist ! ${config.lintingSrouceFolder && config.lintingSrouceFolder.length > 0 ? `Did you set lintingSrouceFolder in config file and forget to compile ?` : ''}`);
    process.exit(1);
  }

  return targetPath;
}

export function argsChecker(): ArgsResult {
  const args = process.argv.slice(2);
  const shouldFix = args.includes("--fix");
  const paths = args.filter((arg) => !arg.startsWith("--"));

  if (args.length === 0) {
    console.error("Usage: ay11lint [--fix] <file-or-directory-path>");
    console.error("       ay11lint [--fix] .  (to lint current directory)");
    process.exit(1);
  }

  // Check if path is provided
  if (args.length < 1) {
    console.error("Error: No path provided");
    console.error("Usage: ay11lint [--fix] <file-or-directory-path>");
    console.error("       ay11lint [--fix] .  (to lint current directory)");
    process.exit(1);
  }

  return { paths, shouldFix };
}

export function getFileName(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

export function transformPath(
  originalPath: string,
  config: LinterOptions
): string {
  if (!config.lintingSrouceFolder || config.lintingSrouceFolder.length === 0)
    return originalPath;

  const pathParts = originalPath.split(path.sep);

  if(pathParts.length > 1) {
    pathParts[0] = config.lintingSrouceFolder;
  } else {
    pathParts[0] = config.lintingSrouceFolder + path.sep + pathParts[0];
  }
  pathParts[pathParts.length-1] = pathParts[pathParts.length-1].replace(/\.[^/.]+$/, '');

  return pathParts.join(path.sep) + '.html';
}
