/**
 * Output formatting: table, JSON, Markdown, CSV.
 */

import chalk from 'chalk';
import Table from 'cli-table3';

export interface RenderOptions {
  fmt?: string;
  columns?: string[];
  title?: string;
  elapsed?: number;
  source?: string;
}

export function render(data: any, opts: RenderOptions = {}): void {
  const fmt = opts.fmt ?? 'table';
  if (data === null || data === undefined) {
    console.log(data);
    return;
  }
  switch (fmt) {
    case 'json': renderJson(data); break;
    case 'md': case 'markdown': renderMarkdown(data, opts); break;
    case 'csv': renderCsv(data, opts); break;
    default: renderTable(data, opts); break;
  }
}

function renderTable(data: any, opts: RenderOptions): void {
  const rows: any[] = Array.isArray(data) ? data : [data];
  if (!rows.length) { console.log(chalk.dim('(no data)')); return; }
  const columns = opts.columns ?? Object.keys(rows[0]);

  const header = columns.map((c, i) => i === 0 ? '#' : capitalize(c));
  const table = new Table({
    head: header.map(h => chalk.bold(h)),
    style: { head: [], border: [] },
    wordWrap: true,
    wrapOnWordBoundary: true,
    colWidths: columns.map((c, i) => {
      if (i === 0) return 4;
      if (c === 'url' || c === 'description') return null as any;
      if (c === 'title' || c === 'name' || c === 'repo') return null as any;
      return null as any;
    }).filter(() => true),
  });

  for (const row of rows) {
    table.push(columns.map(c => {
      const v = row[c];
      return v === null || v === undefined ? '' : String(v);
    }));
  }

  console.log();
  if (opts.title) console.log(chalk.dim(`  ${opts.title}`));
  console.log(table.toString());
  const footer: string[] = [];
  footer.push(`${rows.length} items`);
  if (opts.elapsed) footer.push(`${opts.elapsed.toFixed(1)}s`);
  if (opts.source) footer.push(opts.source);
  console.log(chalk.dim(footer.join(' · ')));
}

function renderJson(data: any): void {
  console.log(JSON.stringify(data, null, 2));
}

function renderMarkdown(data: any, opts: RenderOptions): void {
  const rows: any[] = Array.isArray(data) ? data : [data];
  if (!rows.length) return;
  const columns = opts.columns ?? Object.keys(rows[0]);
  console.log('| ' + columns.join(' | ') + ' |');
  console.log('| ' + columns.map(() => '---').join(' | ') + ' |');
  for (const row of rows) {
    console.log('| ' + columns.map(c => String(row[c] ?? '')).join(' | ') + ' |');
  }
}

function renderCsv(data: any, opts: RenderOptions): void {
  const rows: any[] = Array.isArray(data) ? data : [data];
  if (!rows.length) return;
  const columns = opts.columns ?? Object.keys(rows[0]);
  console.log(columns.join(','));
  for (const row of rows) {
    console.log(columns.map(c => {
      const v = String(row[c] ?? '');
      return v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
    }).join(','));
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
