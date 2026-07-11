import { createReadStream } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGzip } from 'node:zlib';

const directory = fileURLToPath(new URL('../dist/', import.meta.url));
const trackedExtensions = new Set(['.js', '.css']);

async function walk(currentDirectory) {
  const entries = await readdir(currentDirectory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(currentDirectory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }

  return files;
}

function gzipSize(path) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    const gzip = createGzip({ level: 9 });
    gzip.on('data', (chunk) => {
      bytes += chunk.length;
    });
    gzip.on('end', () => resolve(bytes));
    gzip.on('error', reject);
    createReadStream(path).on('error', reject).pipe(gzip);
  });
}

function format(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

const paths = (await walk(directory)).filter((path) => trackedExtensions.has(extname(path)));
const assets = [];

for (const path of paths) {
  const metadata = await stat(path);
  assets.push({
    path: relative(directory, path),
    raw: metadata.size,
    gzip: await gzipSize(path),
  });
}

assets.sort((left, right) => right.gzip - left.gzip);

console.log('Build asset size report (gzip):');
for (const asset of assets) {
  console.log(`${asset.path.padEnd(58)} ${format(asset.gzip).padStart(10)} (${format(asset.raw)} raw)`);
}

const javascript = assets.filter((asset) => extname(asset.path) === '.js');
const totalJavaScriptGzip = javascript.reduce((sum, asset) => sum + asset.gzip, 0);
const largestJavaScriptGzip = Math.max(0, ...javascript.map((asset) => asset.gzip));

console.log(`Total JavaScript gzip: ${format(totalJavaScriptGzip)}`);
console.log(`Largest JavaScript chunk gzip: ${format(largestJavaScriptGzip)}`);

const maximumChunk = Number(process.env.MAX_JS_CHUNK_GZIP_BYTES || 0);
const maximumTotal = Number(process.env.MAX_TOTAL_JS_GZIP_BYTES || 0);

if (maximumChunk > 0 && largestJavaScriptGzip > maximumChunk) {
  throw new Error(
    `Largest JavaScript chunk is ${largestJavaScriptGzip} bytes gzip; budget is ${maximumChunk}.`,
  );
}

if (maximumTotal > 0 && totalJavaScriptGzip > maximumTotal) {
  throw new Error(
    `Total JavaScript is ${totalJavaScriptGzip} bytes gzip; budget is ${maximumTotal}.`,
  );
}
