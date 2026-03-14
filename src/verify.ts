/** Verification: validate + smoke. */
import { validateClisWithTarget, renderValidationReport } from './validate.js';
export async function verifyClis(opts: any): Promise<any> {
  const report = validateClisWithTarget([opts.builtinClis, opts.userClis], opts.target);
  return { ok: report.ok, validation: report, smoke: null };
}
export function renderVerifyReport(report: any): string {
  return renderValidationReport(report.validation);
}
