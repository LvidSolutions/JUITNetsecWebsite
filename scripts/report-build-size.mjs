import { gzipSync } from 'node:zlib';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DIST = path.resolve('dist');
const INCLUDED = new Set(['.css', '.html', '.js', '.json', '.svg', '.webmanifest']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else files.push(absolute);
  }
  return files;
}

function format(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

try {
  const files = await walk(DIST);
  const rows = [];
  let totalBytes = 0;
  let totalGzip = 0;

  for (const file of files) {
    const info = await stat(file);
    totalBytes += info.size;
    const extension = path.extname(file).toLowerCase();
    if (!INCLUDED.has(extension)) continue;
    const content = await readFile(file);
    const gzipBytes = gzipSync(content).byteLength;
    totalGzip += gzipBytes;
    rows.push({
      file: path.relative(DIST, file).split(path.sep).join('/'),
      bytes: info.size,
      gzipBytes,
    });
  }

  rows.sort((a, b) => b.gzipBytes - a.gzipBytes);
  console.log('Build size report (text assets):');
  for (const row of rows) {
    console.log(`${format(row.gzipBytes).padStart(10)} gzip  ${format(row.bytes).padStart(10)} raw  ${row.file}`);
  }
  console.log(`\nTotal dist size: ${format(totalBytes)}`);
  console.log(`Total gzip size for reported text assets: ${format(totalGzip)}`);
} catch (error) {
  console.error(`Unable to report build size: ${error.message}`);
  process.exitCode = 1;
}
