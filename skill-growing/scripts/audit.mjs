/**
 * audit.mjs — skill-growing のスキル棚卸しスクリプト
 *
 * Usage: node scripts/audit.mjs [skills-dir]
 *   skills-dir: スキルが並んでいる親ディレクトリ（デフォルト: カレントディレクトリ）
 *
 * 出力（タブ区切りテーブル）:
 *   ! = 要注意（stale / missing）
 *   NAME        : ! prefix → last_verified が 30 日以上前または MISSING
 *   LAST_VERIFIED
 *   DAYS        : 今日から last_verified までの経過日数（MISSING → 999）
 *   DESC_LEN    : description の文字数（0 → 未入力）
 *   TS          : Troubleshooting セクションの有無（Y / !）
 *
 * 末尾に stale スキルと Troubleshooting 未設定スキルのサマリを表示。
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const STALE_DAYS = 30;
const dir = resolve(process.argv[2] || '.');
const today = new Date();

const skills = readdirSync(dir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => {
    const skillPath = join(dir, d.name, 'SKILL.md');
    if (!existsSync(skillPath)) return null;

    const content = readFileSync(skillPath, 'utf8');
    // CRLF / LF 両対応
    const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const fmMatch = normalized.match(/^---\n([\s\S]*?)\n---/);
    const fm = fmMatch?.[1] ?? '';

    const lastVerified = fm.match(/last_verified:\s*"?(\d{4}-\d{2}-\d{2})"?/)?.[1] ?? null;
    const desc = fm.match(/description:\s*"([^"]*)"/)?.[1]
      ?? fm.match(/description:\s*'([^']*)'/)?.[1]
      ?? '';
    const hasTs = /^## Troubleshooting/m.test(content);
    const days = lastVerified
      ? Math.floor((today - new Date(lastVerified)) / 86400000)
      : 999;

    return { name: d.name, lastVerified: lastVerified ?? 'MISSING', days, descLen: desc.length, hasTs, stale: days >= STALE_DAYS };
  })
  .filter(Boolean)
  .sort((a, b) => b.days - a.days); // stale が上に来る

console.log(['', 'NAME', 'LAST_VERIFIED', 'DAYS', 'DESC_LEN', 'TS'].join('\t'));
for (const s of skills) {
  const staleFlag = s.stale ? '!' : ' ';
  const tsFlag = s.hasTs ? 'Y' : '!';
  console.log(`${staleFlag}\t${s.name}\t${s.lastVerified}\t${s.days}\t${s.descLen}\t${tsFlag}`);
}

const stale = skills.filter(s => s.stale);
const noTs  = skills.filter(s => !s.hasTs);
const noDesc = skills.filter(s => s.descLen === 0);

console.log('');
if (stale.length)  console.log(`Stale  (>=${STALE_DAYS}d): ${stale.map(s => s.name).join(', ')}`);
if (noTs.length)   console.log(`No Troubleshooting: ${noTs.map(s => s.name).join(', ')}`);
if (noDesc.length) console.log(`No description:     ${noDesc.map(s => s.name).join(', ')}`);
if (!stale.length && !noTs.length && !noDesc.length) console.log('All skills OK.');
