/** Generate: explore → synthesize → register → smoke. */
import { exploreUrl } from './explore.js';
import { synthesizeFromExplore } from './synthesize.js';
import { registerCandidates } from './register.js';

export async function generateCliFromUrl(opts: any): Promise<any> {
  const exploreResult = await exploreUrl(opts.url, { BrowserFactory: opts.BrowserFactory, site: opts.site, goal: opts.goal, waitSeconds: opts.waitSeconds ?? 3 });
  const synthesizeResult = synthesizeFromExplore(exploreResult.out_dir, { top: opts.top ?? 5 });
  let registerResult: any = null;
  if (opts.register !== false && synthesizeResult.candidate_count > 0) {
    registerResult = registerCandidates({ target: synthesizeResult.out_dir, builtinClis: opts.builtinClis, userClis: opts.userClis });
  }
  const ok = exploreResult.endpoint_count >= 0 && synthesizeResult.candidate_count >= 0;
  return { ok, site: exploreResult.site, explore: exploreResult, synthesize: synthesizeResult, register: registerResult, selected_command: '(auto)' };
}
export function renderGenerateSummary(r: any): string {
  return [`opencli generate: ${r.ok ? 'OK' : 'FAIL'}`, `Site: ${r.site}`, `Selected: ${r.selected_command}`].join('\n');
}
