#!/usr/bin/env node
/**
 * gate.mjs — ローカル品質ゲート（lint → typecheck → build → test）
 *
 * Usage: node gate.mjs [options]
 *   --max-loops N   同一ステップの最大リトライ回数（デフォルト: 3）
 *   --pm <manager>  npm | pnpm | yarn（未指定: lockfile から自動検出）
 *   --dry-run       実行せずコマンドをプレビュー表示
 *   --skip-build    build ステップをスキップ（型チェックのみ確認したいとき）
 *
 * 失敗した段で停止し、最大 N 回まで再試行する。
 * N 回失敗したら escalating-debug-loop / 人間へのエスカレーションを促す。
 */

import { execSync, spawnSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

// ---- 引数パース ----
const args = process.argv.slice(2);
const MAX_LOOPS = parseInt(args[args.indexOf('--max-loops') + 1] ?? '3', 10) || 3;
const DRY_RUN   = args.includes('--dry-run');
const SKIP_BUILD = args.includes('--skip-build');
const PM_ARG    = args[args.indexOf('--pm') + 1];

// ---- パッケージマネージャ検出 ----
function detectPm() {
  if (PM_ARG && ['npm', 'pnpm', 'yarn'].includes(PM_ARG)) return PM_ARG;
  if (existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (existsSync('yarn.lock'))      return 'yarn';
  return 'npm';
}

// ---- package.json スクリプト読み込み ----
function loadScripts() {
  const pkgPath = resolve('package.json');
  if (!existsSync(pkgPath)) return {};
  try {
    return JSON.parse(readFileSync(pkgPath, 'utf8')).scripts ?? {};
  } catch {
    return {};
  }
}

// ---- スクリプト名の候補マップ ----
const CANDIDATES = {
  lint:      ['lint', 'lint:fix', 'eslint'],
  typecheck: ['typecheck', 'type-check', 'tsc', 'ts:check'],
  build:     ['build', 'build:prod', 'compile'],
  test:      ['test', 'test:unit', 'vitest', 'jest'],
};

function resolveStep(label, available) {
  for (const name of CANDIDATES[label]) {
    if (available[name]) return name;
  }
  return null;
}

// ---- ステップ実行 ----
function runStep(pm, scriptName) {
  if (DRY_RUN) {
    console.log(`  [dry-run] ${pm} run ${scriptName}`);
    return true;
  }
  const result = spawnSync(pm, ['run', scriptName], { stdio: 'inherit', shell: true });
  return result.status === 0;
}

// ---- メイン ----
async function main() {
  const pm = detectPm();
  const available = loadScripts();

  const steps = ['lint', 'typecheck', 'build', 'test']
    .filter(s => !(s === 'build' && SKIP_BUILD))
    .map(label => ({ label, script: resolveStep(label, available) }));

  console.log(`\n🔍 品質ゲート — パッケージマネージャ: ${pm}${DRY_RUN ? ' (dry-run)' : ''}\n`);
  steps.forEach(({ label, script }) => {
    const status = script ? `✅ ${pm} run ${script}` : '⚠️  スクリプトなし（スキップ）';
    console.log(`  ${label.padEnd(12)} ${status}`);
  });
  console.log('');

  let globalPass = true;

  for (const { label, script } of steps) {
    if (!script) {
      console.log(`⏭️  ${label}: スクリプトが見つからないためスキップ`);
      continue;
    }

    let attempt = 0;
    let passed = false;

    while (attempt < MAX_LOOPS) {
      attempt++;
      const prefix = attempt > 1 ? ` (試行 ${attempt}/${MAX_LOOPS})` : '';
      console.log(`▶ ${label}${prefix}: ${pm} run ${script}`);

      passed = runStep(pm, script);

      if (passed) {
        console.log(`✅ ${label} — 成功\n`);
        break;
      }

      console.log(`❌ ${label} — 失敗`);

      if (attempt >= MAX_LOOPS) {
        console.log(`\n🚨 ${label} が ${MAX_LOOPS} 回連続で失敗しました。`);
        console.log('   → escalating-debug-loop または systematic-debugging スキルを起動してください。');
        console.log('   → 人間にエスカレーションすることも検討してください。\n');
        globalPass = false;
        process.exit(1);
      }

      console.log(`   修正後に Enter を押すと ${label} を再実行します... (Ctrl+C で中断)`);
      await waitForEnter();
      console.log(`   最初のステップ (lint) からやり直します...\n`);
      // Iron Law: 失敗したら最初から
      break;
    }

    if (!passed) {
      // Iron Law により最初から — 外ループを再スタート
      return main();
    }
  }

  if (globalPass) {
    console.log('🎉 全ステップ成功！PR / push の準備ができました。');
    console.log('   → code-review-subagents または Git 操作へ進んでください。');
  }
}

function waitForEnter() {
  if (DRY_RUN) return Promise.resolve();
  return new Promise(resolve => {
    process.stdin.setRawMode?.(false);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.pause();
      resolve();
    });
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
