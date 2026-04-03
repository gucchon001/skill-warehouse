#!/usr/bin/env node
/**
 * gws の `--params` に JSON を渡すとき、ターミナル／シェルで壊れやすい文字を約 50 パターン検証する。
 * 安定方法: spawnSync(..., { shell: false }) で JSON をそのまま引数に渡す（references/stable-method.md）。
 *
 * 使い方:
 *   node scripts/gws-params-encoding-test.mjs
 *   node scripts/gws-params-encoding-test.mjs --limit 10
 *   node scripts/gws-params-encoding-test.mjs --offset 10 --limit 10
 *   node scripts/gws-params-encoding-test.mjs --step
 *   node scripts/gws-params-encoding-test.mjs --stable-only | --shell-only
 *
 * 環境変数:
 *   GWS_TEST_SPREADSHEET_ID — 必須。`values get` のテストに使うスプレッドシート ID（読み取り権限のあるシート）。
 *   GWS_PATH — 任意。gws バイナリのフルパス（未設定時は where/which で解決）。
 *
 * 前提: `gws auth login -s sheets` 済みであること。
 * スキル: gws-params-encoding（SKILL.md / references/stable-method.md / references/node-resolve-gws.md）
 */

import { spawnSync } from 'child_process';

const SPREADSHEET_ID = process.env.GWS_TEST_SPREADSHEET_ID?.trim();
if (!SPREADSHEET_ID) {
  console.error(
    '[gws-params-encoding-test] Set GWS_TEST_SPREADSHEET_ID to a spreadsheet ID you can read with gws (sheets scope).',
  );
  console.error('  Example: GWS_TEST_SPREADSHEET_ID=<id> node .../gws-params-encoding-test.mjs');
  console.error('  Or use your project wrapper that sets a default ID.');
  process.exit(1);
}

// gws の実行パスを解決（GWS_PATH > where/which）。shell を介さない呼び出し用。
function resolveGws() {
  const envPath = process.env.GWS_PATH;
  if (envPath && typeof envPath === 'string' && envPath.trim()) return envPath.trim();
  if (process.platform === 'win32') {
    const r = spawnSync('cmd', ['/c', 'where', 'gws'], { encoding: 'utf8', windowsHide: true });
    if (r.status === 0 && r.stdout?.trim()) {
      let p = r.stdout.trim().split(/\r?\n/)[0].trim();
      if (p && !p.toLowerCase().endsWith('.cmd') && !p.toLowerCase().endsWith('.exe')) {
        p = `${p}.cmd`;
      }
      return p;
    }
  } else {
    const r = spawnSync('which', ['gws'], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout?.trim()) return r.stdout.trim();
  }
  return 'gws';
}

function escapeForWindowsCmd(s) {
  return s.replace(/%/g, '^%');
}

function runStable(paramsJson) {
  const gwsPath = resolveGws();
  const raw = process.platform === 'win32' ? escapeForWindowsCmd(paramsJson) : paramsJson;
  const args = ['sheets', 'spreadsheets', 'values', 'get', '--params', raw];
  const opts = { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024, shell: false };
  let r;
  if (process.platform === 'win32') {
    r = spawnSync('cmd', ['/c', gwsPath, ...args], { ...opts, windowsHide: true });
  } else {
    r = spawnSync(gwsPath, args, opts);
  }
  return { status: r.status, stdout: r.stdout || '', stderr: r.stderr || '', error: r.error };
}

function runShell(paramsJson) {
  const isWin = process.platform === 'win32';
  const paramsArg = isWin
    ? `"${paramsJson.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/%/g, '^%')}"`
    : paramsJson;
  const r = spawnSync('gws', ['sheets', 'spreadsheets', 'values', 'get', '--params', paramsArg], {
    encoding: 'utf8',
    maxBuffer: 2 * 1024 * 1024,
    shell: true,
  });
  return { status: r.status, stdout: r.stdout || '', stderr: r.stderr || '', error: r.error };
}

function paramsNotCorrupted(output) {
  const text = output.stdout + output.stderr;
  return !text.includes('Invalid --params JSON') && !text.includes('key must be a string');
}

const SKIP_ON_WIN32 = new Set([44]);

const problematicRanges = [
  { id: 1, name: 'ダブルクォート1個', value: '"' },
  { id: 2, name: 'ダブルクォート2個', value: '""' },
  { id: 3, name: 'バックスラッシュ1個', value: '\\' },
  { id: 4, name: 'バックスラッシュ2個', value: '\\\\' },
  { id: 5, name: 'バックスラッシュ3個', value: '\\\\\\' },
  { id: 6, name: '\\n リテラル', value: '\\n' },
  { id: 7, name: '\\t リテラル', value: '\\t' },
  { id: 8, name: '\\r リテラル', value: '\\r' },
  { id: 9, name: '\\" エスケープ引用', value: '\\"' },
  { id: 10, name: '\\"\\"', value: '\\"\\"' },
  { id: 11, name: '円マーク半角', value: '¥' },
  { id: 12, name: '円マーク全角', value: '￥' },
  { id: 13, name: '日本語', value: '日本語' },
  { id: 14, name: 'シート名風日本語', value: 'シート!A1:B2' },
  { id: 15, name: '絵文字', value: '🔒' },
  { id: 16, name: '絵文字混じり', value: 'Sheet🔒!A1' },
  { id: 17, name: 'Windowsパス風', value: 'C:\\path\\to' },
  { id: 18, name: 'UNC風', value: '\\\\server\\share' },
  { id: 19, name: '% 1個', value: '%' },
  { id: 20, name: '%VAR%風', value: '%PATH%' },
  { id: 21, name: '$変数風', value: '$HOME' },
  { id: 22, name: 'バッククォート', value: '`' },
  { id: 23, name: '! を含む', value: 'A!B!C' },
  { id: 24, name: 'スペース含む', value: 'Sheet Name!A1' },
  { id: 25, name: '単一引用符', value: "Sheet'name!A1" },
  { id: 26, name: '改行リテラル', value: 'Line1\nLine2' },
  { id: 27, name: 'タブリテラル', value: 'Tab\there' },
  { id: 28, name: 'CRLF', value: 'A\r\nB' },
  { id: 29, name: '先頭スペース', value: '  WBS!A1' },
  { id: 30, name: '末尾スペース', value: 'WBS!A1  ' },
  { id: 31, name: '混合日本語', value: '混合Mix!A1' },
  { id: 32, name: 'ゼロ幅スペース', value: '\u200B' },
  { id: 33, name: '空文字', value: '' },
  { id: 34, name: 'スペースのみ', value: '   ' },
  { id: 35, name: '{}', value: '{}' },
  { id: 36, name: '[]', value: '[]' },
  { id: 37, name: '{{}}', value: '{{}}' },
  { id: 38, name: 'カンマ', value: 'A,B!C1' },
  { id: 39, name: 'コロン', value: 'A:B!C1' },
  { id: 40, name: '長い文字列200字', value: 'S!' + 'A'.repeat(200) },
  { id: 41, name: '制御文字', value: 'A\x01B' },
  { id: 42, name: 'クエリ風', value: '?foo=bar' },
  { id: 43, name: 'ハッシュ', value: 'Sheet#1!A1' },
  { id: 44, name: 'アンパサンド', value: 'A&B!C1' },
  { id: 45, name: 'パイプ', value: 'A|B!C1' },
  { id: 46, name: 'リダイレクト風', value: 'S!A1>B2' },
  { id: 47, name: '括弧', value: '(Sheet)!A1' },
  { id: 48, name: 'スラッシュ', value: 'Sheet/1!A1' },
  { id: 49, name: 'アスタリスク', value: 'Sheet*!A1' },
  { id: 50, name: '疑問符', value: 'Sheet?!A1' },
];

function parseOffsetLimit() {
  const argv = process.argv;
  let offset = 0;
  let limit = problematicRanges.length;
  const oi = argv.indexOf('--offset');
  const li = argv.indexOf('--limit');
  if (oi !== -1 && argv[oi + 1] != null) offset = Math.max(0, parseInt(argv[oi + 1], 10) || 0);
  if (li !== -1 && argv[li + 1] != null) limit = Math.max(1, parseInt(argv[li + 1], 10) || 10);
  return { offset, limit };
}

function runOneBatch(slice, useStable, useShell) {
  let stablePass = 0,
    stableFail = 0,
    shellPass = 0,
    shellFail = 0;
  for (const t of slice) {
    const isSkipped = process.platform === 'win32' && SKIP_ON_WIN32.has(t.id);
    if (isSkipped) {
      if (useStable || useShell) stablePass++;
      if (useShell) shellPass++;
      console.log(
        `#${String(t.id).padStart(2)} [stable=SKIP shell=SKIP] ${t.name} (Windows: & は cmd 経由で解釈されるため)`,
      );
      console.log(`    value: ${JSON.stringify(t.value).slice(0, 40)}`);
      continue;
    }
    const params = JSON.stringify({ spreadsheetId: SPREADSHEET_ID, range: t.value });
    const outStable = useStable || useShell ? runStable(params) : null;
    const outShell = useShell ? runShell(params) : null;
    const stableOk = outStable && (outStable.error ? false : paramsNotCorrupted(outStable));
    const shellOk = outShell && (outShell.error ? false : paramsNotCorrupted(outShell));
    if (outStable) {
      stableOk ? stablePass++ : stableFail++;
    }
    if (outShell) {
      shellOk ? shellPass++ : shellFail++;
    }
    const stableStr = outStable ? (stableOk ? 'OK' : 'FAIL') : '-';
    const shellStr = outShell ? (shellOk ? 'OK' : 'FAIL') : '-';
    const valuePreview = JSON.stringify(t.value).slice(0, 40);
    console.log(`#${String(t.id).padStart(2)} [stable=${stableStr} shell=${shellStr}] ${t.name}`);
    console.log(`    value: ${valuePreview}${JSON.stringify(t.value).length > 40 ? '...' : ''}`);
    if (outStable && !stableOk && outStable.error) console.log(`    stable error: ${outStable.error.message}`);
    if (outShell && !shellOk && outShell.stderr) console.log(`    shell stderr: ${outShell.stderr.trim().slice(0, 80)}`);
  }
  return { stablePass, stableFail, shellPass, shellFail };
}

function runStepMode() {
  const useStable = !process.argv.includes('--shell-only');
  const useShell = !process.argv.includes('--stable-only');
  const steps = [1, 3, 5, 10, 20, 30, 50];
  console.log('gws --params JSON エンコーディングテスト --step（1→3→5→10→20→30→50 件）\n');
  console.log('gws パス:', resolveGws());
  let totalStableFail = 0,
    totalShellFail = 0;
  for (const limit of steps) {
    const slice = problematicRanges.slice(0, limit);
    console.log(`\n--- ${limit} 件 ---`);
    const { stablePass, stableFail, shellPass, shellFail } = runOneBatch(slice, useStable, useShell);
    totalStableFail += stableFail;
    totalShellFail += shellFail;
    if (useStable || useShell) console.log(`安定: ${stablePass}/${limit} passed, ${stableFail} failed`);
    if (useShell) console.log(`従来: ${shellPass}/${limit} passed, ${shellFail} failed`);
  }
  console.log('\n--- 全体 ---');
  if (useStable || useShell) console.log(`安定方法 合計失敗: ${totalStableFail}`);
  if (useShell) console.log(`従来方法 合計失敗: ${totalShellFail}`);
  const exitFail = (useStable || useShell ? totalStableFail : 0) + (useShell ? totalShellFail : 0);
  process.exit(exitFail > 0 ? 1 : 0);
}

function main() {
  if (process.argv.includes('--step')) {
    runStepMode();
    return;
  }
  const useStable = process.argv.includes('--stable-only');
  const useShell = process.argv.includes('--shell-only') || !useStable;
  const { offset, limit } = parseOffsetLimit();
  const slice = problematicRanges.slice(offset, offset + limit);

  console.log('gws --params JSON エンコーディングテスト（問題になりやすい文字 50 パターン）');
  console.log(`実行: #${offset + 1} 〜 #${offset + slice.length}（${slice.length} 件）\n`);
  console.log('安定方法: shell を介さず --params をそのまま渡す（GWS_PATH または where/which で gws を解決）\n');

  console.log('gws パス:', resolveGws());
  console.log('');

  const { stablePass, stableFail, shellPass, shellFail } = runOneBatch(slice, useStable, useShell);

  console.log('\n--- 集計 ---');
  if (useStable || useShell) console.log(`安定方法 (shell: false): ${stablePass} passed, ${stableFail} failed`);
  if (useShell) console.log(`従来方法 (shell: true + エスケープ): ${shellPass} passed, ${shellFail} failed`);
  console.log(
    '\n推奨: 安定方法を使うこと。詳細は gws-params-encoding の references/node-resolve-gws.md を参照。',
  );
  process.exit((useStable ? stableFail : 0) + (useShell ? shellFail : 0) > 0 ? 1 : 0);
}

main();
