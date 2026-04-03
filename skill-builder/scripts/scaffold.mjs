/**
 * scaffold.mjs — skill-builder のスキャフォールドスクリプト
 *
 * Usage: node scripts/scaffold.mjs <skill-name> [skills-root] [--dry-run]
 *   skill-name  : kebab-case のスキル名（例: my-skill）
 *   skills-root : スキルフォルダを作る親ディレクトリ（デフォルト: カレントディレクトリ）
 *   --dry-run   : ファイルを作らず、作成予定の内容を標準出力に表示する
 *
 * 作成するもの:
 *   <skills-root>/<skill-name>/SKILL.md  … テンプレート付き
 *
 * オプションフォルダ（scripts/ / references/ / assets/）は必要なら手動で追加する。
 * このスクリプトは空ディレクトリを作りません（spec §1 準拠）。
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const args = process.argv.slice(2).filter(a => a !== '--dry-run');
const dryRun = process.argv.includes('--dry-run');
const [name, root = '.'] = args;

if (!name || !/^[a-z0-9-]+$/.test(name)) {
  console.error('Error: skill-name は kebab-case（小文字・数字・ハイフンのみ）で指定してください。');
  console.error('Usage: node scripts/scaffold.mjs <skill-name> [skills-root] [--dry-run]');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const dir = resolve(root, name);
const skillPath = join(dir, 'SKILL.md');

const template = `---
name: ${name}
description: ""
metadata:
  last_verified: "${today}"
---

# ${name}

## いつ使うか / When to use

（このスキルを選ぶトリガーとなる依頼・状況を書く）

## 手順 / How to use

（命令形で核心手順のみ。長い仕様は references/ へ）

## Troubleshooting

### エラー: （典型的なエラー名）

**原因**:

**対処**:
`;

if (dryRun) {
  console.log('[DRY RUN] 実際にはファイルを作成しません。\n');
  console.log(`作成予定ディレクトリ: ${dir}`);
  console.log(`作成予定ファイル    : ${skillPath}`);
  if (existsSync(dir)) {
    console.warn(`  ⚠ 警告: ディレクトリがすでに存在します → 実行時は Error になります`);
  }
  console.log('\n--- SKILL.md の内容（プレビュー）---');
  console.log(template);
  console.log('--- プレビュー終わり ---');
  process.exit(0);
}

if (existsSync(dir)) {
  console.error(`Error: すでに存在します → ${dir}`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });
writeFileSync(skillPath, template, 'utf8');
console.log(`Created: ${skillPath}`);
console.log(`Next: description を埋めて skill-growing で分割判定を 1 回実行する。`);
