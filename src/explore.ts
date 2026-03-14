/** Explore a website and generate discovery artifacts. */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { browserSession, DEFAULT_BROWSER_EXPLORE_TIMEOUT, runWithTimeout } from './runtime.js';

export async function exploreUrl(url: string, opts: any = {}): Promise<any> {
  const site = opts.site ?? new URL(url).hostname.replace(/^www\./, '').split('.')[0];
  const outDir = opts.outDir ?? path.join('.opencli', 'explore', site);
  fs.mkdirSync(outDir, { recursive: true });

  const result: any = await browserSession(opts.BrowserFactory, async (page: any) => {
    return runWithTimeout((async () => {
      await page.goto(url);
      await page.wait(opts.waitSeconds ?? 3);
      const snapshot = await page.snapshot({ raw: true });
      const endpoints: any[] = [];
      const capabilities: any[] = [];
      return { site, target_url: url, snapshot_length: typeof snapshot === 'string' ? snapshot.length : 0, endpoints, capabilities };
    })(), { timeout: DEFAULT_BROWSER_EXPLORE_TIMEOUT, label: 'explore' });
  });

  const manifest = { site, target_url: url, explored_at: new Date().toISOString() };
  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(outDir, 'endpoints.json'), JSON.stringify(result.endpoints ?? [], null, 2));
  fs.writeFileSync(path.join(outDir, 'capabilities.json'), JSON.stringify(result.capabilities ?? [], null, 2));
  fs.writeFileSync(path.join(outDir, 'auth.json'), JSON.stringify({}, null, 2));

  return { ...result, out_dir: outDir, endpoint_count: result.endpoints?.length ?? 0 };
}

export function renderExploreSummary(result: any): string {
  return [`opencli explore: OK`, `Site: ${result.site}`, `URL: ${result.target_url}`, `Endpoints: ${result.endpoint_count}`, `Output: ${result.out_dir}`].join('\n');
}
