export function findElementLocation(
  html: string,
  elementHtml: string
): { line: number; column: number } {
  const lines = html.split("\n");
  let foundLine = 0;
  let foundColumn = 0;

  // Normalize both the search element and the HTML content
  const normalizedElement = elementHtml
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .trim();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const normalizedLine = line
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&apos;/g, "'")
      .trim();

    if (normalizedLine.includes(normalizedElement)) {
      foundLine = i + 1;
      foundColumn = line.indexOf(line.trim()) + 1;
      break;
    }
  }

  return {
    line: foundLine,
    column: foundColumn,
  };
}