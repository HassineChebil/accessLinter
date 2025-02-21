import { JSDOM } from "jsdom";
import axe from "axe-core";
import { readFileSync } from "node:fs";
import path, { resolve } from "node:path";
import chalk from "chalk";
import { globSync } from "glob";
import { findElementLocation } from "./utils";
import type { LinterOptions, LinterResult } from "./interfaces";

export class AccessibilityLinter {
  private config: LinterOptions;

  constructor(config: LinterOptions) {
    this.config = config;
  }

  private async runAccessibilityTests(
    filePath: string
  ): Promise<LinterResult[]> {
    try {
      const htmlContent = readFileSync(resolve(filePath), "utf8");

      const isFragment =
        !htmlContent.includes("<!DOCTYPE") && !htmlContent.includes("<html");
      const fullHtml = isFragment
        ? `<!DOCTYPE html><html lang="fr"><head><title>Fragment</title></head><body><main>${htmlContent}</main></body></html>`
        : htmlContent;

      const dom = new JSDOM(fullHtml, {
        runScripts: "outside-only",
        pretendToBeVisual: true,
        url: "http://localhost",
      });
      const document = dom.window.document;
      const elementToAnalyze = isFragment
        ? document.querySelector("main")
        : document.documentElement;

      if (!elementToAnalyze) {
        throw new Error("Could not find element to analyze");
      }

      const results = await this.runAxeAnalysis(elementToAnalyze);
      return this.processViolations(results, htmlContent, filePath);
    } catch (error) {
      console.error(chalk.red("Error during linting:"), error);
      throw error;
    }
  }

  private async runAxeAnalysis(element: Element): Promise<any> {
    return new Promise((resolve) => {
      axe.run(
        element,
        {
          runOnly: {
            type: "tag",
            values: [
              "wcag2a",
              "wcag2aa",
              "wcag21a",
              "wcag21aa",
              "best-practice",
            ],
          },
          rules: {
            "color-contrast": { enabled: false },
            ...this.config.rules,
          },
        },
        (err, results) => {
          if (err) throw err;
          resolve(results);
        }
      );
    });
  }

  private generateFixSuggestion(violation: any): string {
    const configMessage = this.config?.rulesMessages
      ? this.config?.rulesMessages[violation.id]
      : undefined;
    switch (violation.id) {
      case "image-alt":
        return configMessage
          ? configMessage
          : "Add alt attribute to img element";
      case "button-name":
        return configMessage
          ? configMessage
          : "Add text content or aria-label to button";
      case "region":
        return configMessage ? configMessage : "Add role='region' attribute";
      case "landmark-one-main":
        return configMessage
          ? configMessage
          : "Add role='main' attribute to main element";
      default:
        return violation.help;
    }
  }

  private processViolations(
    results: any,
    htmlContent: string,
    filePath: string
  ): LinterResult[] {
    const linterResults: LinterResult[] = [];

    for (const violation of (results as { violations: any[] }).violations) {
      for (const node of violation.nodes) {
        const location = findElementLocation(htmlContent, node.html);
        linterResults.push({
          filePath,
          line: location.line,
          column: location.column,
          ruleId: violation.id,
          severity: violation.impact === "critical" ? "error" : "warning",
          message: violation.help,
          source: node.html,
          fix: {
            range: [
              location.column - 1,
              location.column - 1 + node.html.length,
            ],
            text: this.generateFixSuggestion(violation),
          },
        });
      }
    }
    return linterResults;
  }

  async lintDirectory(dirpath: string): Promise<LinterResult[]> {
    const pattern = path.join(
      dirpath,
      `**/*{${this.config.extensions.join(",")}}`
    );

    const files = globSync(pattern, {
      ignore: this.config.ignore,
    });

    const results = [];
    for (const file of files) {
      const fileResults = await this.lintFile(file);
      results.push(...fileResults);
    }
    return results;
  }

  async lintFile(filePath: string): Promise<LinterResult[]> {
    return this.runAccessibilityTests(filePath);
  }

  printResults(results: LinterResult[]): void {
    if (results.length > 0) {
      results.forEach((result) => {
        console.log("\n" + chalk.gray("─".repeat(50)));
        console.log(
          `${chalk.blue(result.filePath)}:${chalk.yellow(
            result.line
          )}:${chalk.yellow(result.column)}`
        );
        console.log(
          `${chalk[result.severity === "error" ? "red" : "yellow"](
            result.ruleId
          )}: ${result.message}`
        );
        console.log(chalk.gray(result.source));
        console.log(chalk.green("Suggested fix:"), result.fix?.text);
      });
    } else {
      console.log(chalk.green("No accessibility issues found! 🎉"));
    }
  }
}
