#!/usr/bin/env node
/**
 * watch-deploy.mjs — Vercel デプロイ完了を自動ポーリング
 *
 * Usage: node watch-deploy.mjs [--prod]
 *   --prod  本番デプロイを監視（デフォルト: 最新デプロイ）
 *
 * フロー: 90 秒待機 → vercel ls でステータス確認 → Ready/Error で終了
 *         Building の間は 60 秒ごとに再確認
 */

import { execSync } from 'child_process';

const INITIAL_WAIT_MS = 90_000;
const POLL_INTERVAL_MS = 60_000;

const args = process.argv.slice(2);
const prod = args.includes('--prod');

function getLatestDeployment() {
  try {
    const flags = prod ? '--prod' : '';
    const out = execSync(`npx vercel ls ${flags} --format json`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const data = JSON.parse(out);
    return data.deployments?.[0] ?? null;
  } catch {
    return null;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(`⏳ ${INITIAL_WAIT_MS / 1000} 秒待機中（Vercel がビルドを開始するまで）...`);
  await sleep(INITIAL_WAIT_MS);

  let attempts = 0;
  while (true) {
    attempts++;
    const dep = getLatestDeployment();

    if (!dep) {
      console.log(`[${attempts}] ステータス取得失敗 — ${POLL_INTERVAL_MS / 1000} 秒後に再試行`);
      await sleep(POLL_INTERVAL_MS);
      continue;
    }

    const url = `https://${dep.url}`;
    const state = dep.state ?? dep.readyState ?? '?';

    if (state === 'READY') {
      console.log(`✅ Ready: ${url}`);
      process.exit(0);
    }

    if (state === 'ERROR') {
      console.log(`❌ Error: ${url}`);
      console.log('ログ確認コマンド:');
      console.log(`  npx vercel inspect ${url} --logs 2>&1 | tail -60`);
      process.exit(1);
    }

    console.log(`[${attempts}] ${state} — ${POLL_INTERVAL_MS / 1000} 秒後に再確認...`);
    await sleep(POLL_INTERVAL_MS);
  }
}

main();
