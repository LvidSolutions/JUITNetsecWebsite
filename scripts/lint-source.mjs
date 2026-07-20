import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parse } from '@babel/parser';

const ROOT = process.cwd();
const SOURCE_ROOTS = ['api', 'src', 'scripts', 'test', 'e2e'];
const ROOT_FILES = ['vite.config.js', 'postcss.config.js', 'tailwind.config.js', 'playwright.config.js'];
const EXTENSIONS = new Set(['.js', '.jsx', '.mjs']);
const EXCLUDED_DIRECTORIES = new Set(['node_modules', 'dist', 'playwright-report', 'test-results', 'visual-checks']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const files = [];

  for (const entry of entries) {
    if (EXCLUDED_DIRECTORIES.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else if (EXTENSIONS.has(path.extname(entry.name))) files.push(absolute);
  }

  return files;
}

function relative(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

function policyErrors(file, source) {
  const name = relative(file);
  const errors = [];

  if (/\beval\s*\(/u.test(source)) errors.push('eval() is not allowed');
  if (/\bnew\s+Function\s*\(/u.test(source)) errors.push('new Function() is not allowed');
  if (/dangerouslySetInnerHTML/u.test(source)) errors.push('dangerouslySetInnerHTML requires an explicit security review');
  if (name.startsWith('src/') && /\bprocess\.env\b/u.test(source)) {
    errors.push('browser code must use import.meta.env and may not read server environment variables');
  }

  return errors;
}

const files = [
  ...(await Promise.all(SOURCE_ROOTS.map((directory) => walk(path.join(ROOT, directory))))).flat(),
  ...ROOT_FILES.map((file) => path.join(ROOT, file)),
];

const failures = [];

for (const file of files) {
  const source = await readFile(file, 'utf8').catch(() => null);
  if (source === null) continue;

  try {
    parse(source, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
      plugins: ['jsx', 'importMeta', 'topLevelAwait'],
    });
  } catch (error) {
    failures.push(`${relative(file)}: ${error.message}`);
    continue;
  }

  for (const error of policyErrors(file, source)) failures.push(`${relative(file)}: ${error}`);
}

if (failures.length > 0) {
  console.error('Source checks failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Source checks passed for ${files.length} JavaScript files.`);
}
