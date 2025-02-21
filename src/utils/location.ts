export function findElementLocation(
  html: string,
  elementHtml: string
): { line: number; column: number } {
  const lines = html.split("\n");
  let foundLine = 0;
  let foundColumn = 0;

  const cleanElementHtml = elementHtml.trim().replace(/\s+/g, " ");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLine = line.trim().replace(/\s+/g, " ");

    if (cleanLine.includes(cleanElementHtml)) {
      foundLine = i + 1;
      foundColumn = line.indexOf(elementHtml.trim()) + 1;
      break;
    }
  }

  return {
    line: foundLine,
    column: foundColumn,
  };
}
