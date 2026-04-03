/**
 * verify.mjs — 各ホストのスキルルートが CANON を指しているか確認（クロスプラットフォーム）
 *
 * Usage: node scripts/verify.mjs [canonical-path]
 *   canonical-path: 正本ディレクトリ（デフォルト: ~/agent-skills）
 *
 * 出力:
 *   ! 行 = 要対応（リンク切れ・別パスを指している・存在しない）
 *   OK  = CANON と一致
 *
 * 修復が必要な場合:
 *   Windows: pwsh scripts/sync-global-skills-junctions.ps1 -CanonicalPath <CANON>
 *   Unix:    bash scripts/sync-global-skills-symlinks.sh <CANON>
 */

import { existsSync, realpathSync } from 'fs';
import { resolve } from 'path';
import os from 'os';

const HOME = os.homedir();
const CANON = resolve(process.argv[2] ?? `${HOME}/.agent-skills`);

const HOSTS = [
  { label: 'Cursor',      path: `${HOME}/.cursor/skills` },
  { label: 'Claude Code', path: `${HOME}/.claude/skills` },
  { label: 'Antigravity', path: `${HOME}/.gemini/antigravity/skills` },
];

console.log(`CANON: ${CANON}\n`);
console.log(['', 'HOST', 'STATUS', 'RESOLVED'].join('\t'));

let allOk = true;

for (const h of HOSTS) {
  if (!existsSync(h.path)) {
    console.log(`!\t${h.label}\tMISSING\t${h.path}`);
    allOk = false;
    continue;
  }
  try {
    const real = realpathSync(h.path);
    // Windows は大文字小文字を区別しない
    const ok = real.toLowerCase() === CANON.toLowerCase();
    const flag = ok ? ' ' : '!';
    console.log(`${flag}\t${h.label}\t${ok ? 'OK' : 'WRONG'}\t${real}`);
    if (!ok) allOk = false;
  } catch (e) {
    console.log(`!\t${h.label}\tERROR\t${e.message}`);
    allOk = false;
  }
}

console.log('');
if (allOk) {
  console.log('All hosts -> CANON. OK');
} else {
  console.log('Repair needed:');
  console.log('  Windows: pwsh scripts/sync-global-skills-junctions.ps1 -CanonicalPath "<CANON>"');
  console.log('  Unix:    bash scripts/sync-global-skills-symlinks.sh "<CANON>"');
  process.exit(1);
}
