/**
 * Aria snapshot formatter: parses Playwright MCP snapshot text into clean format.
 */

export interface FormatOptions {
  interactive?: boolean;
  compact?: boolean;
  maxDepth?: number;
}

export function formatSnapshot(raw: string, opts: FormatOptions = {}): string {
  if (!raw || typeof raw !== 'string') return '';
  const lines = raw.split('\n');
  const result: string[] = [];
  let refCounter = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    const indent = line.length - line.trimStart().length;
    const depth = Math.floor(indent / 2);
    if (opts.maxDepth && depth > opts.maxDepth) continue;

    let content = line.trimStart();

    // Skip non-interactive elements in interactive mode
    if (opts.interactive) {
      const interactiveRoles = ['button', 'link', 'textbox', 'checkbox', 'radio', 'combobox', 'tab', 'menuitem', 'option'];
      const role = content.split(/[\s[]/)[0]?.toLowerCase() ?? '';
      if (!interactiveRoles.some(r => role.includes(r)) && depth > 1) continue;
    }

    // Compact: strip verbose role descriptions
    if (opts.compact) {
      content = content
        .replace(/\s*\[.*?\]\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Assign refs to interactive elements
    const interactivePattern = /^(button|link|textbox|checkbox|radio|combobox|tab|menuitem|option)\b/i;
    if (interactivePattern.test(content)) {
      refCounter++;
      content = `[@${refCounter}] ${content}`;
    }

    result.push('  '.repeat(depth) + content);
  }

  return result.join('\n');
}
