/** Synthesize candidate CLIs from explore artifacts. */
import * as fs from 'node:fs';
import * as path from 'node:path';
import yaml from 'js-yaml';

export function synthesizeFromExplore(target: string, opts: any = {}): any {
  const exploreDir = fs.existsSync(target) ? target : path.join('.opencli', 'explore', target);
  if (!fs.existsSync(exploreDir)) throw new Error(`Explore dir not found: ${target}`);
  const manifest = JSON.parse(fs.readFileSync(path.join(exploreDir, 'manifest.json'), 'utf-8'));
  const capabilities = JSON.parse(fs.readFileSync(path.join(exploreDir, 'capabilities.json'), 'utf-8'));
  const targetDir = opts.outDir ?? path.join(exploreDir, 'candidates');
  fs.mkdirSync(targetDir, { recursive: true });
  return { site: manifest.site, explore_dir: exploreDir, out_dir: targetDir, candidate_count: capabilities.length, candidates: capabilities };
}
export function renderSynthesizeSummary(r: any): string {
  return [`opencli synthesize: OK`, `Site: ${r.site}`, `Candidates: ${r.candidate_count}`].join('\n');
}
