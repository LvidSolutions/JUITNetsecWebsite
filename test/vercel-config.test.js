import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));

function headersFor(source) {
  const entry = config.headers.find((candidate) => candidate.source === source);
  return new Map((entry?.headers || []).map(({ key, value }) => [key.toLowerCase(), value]));
}

test('Vercel rewrites expose SEO endpoints and all known SPA routes', () => {
  const rewrites = new Map(config.rewrites.map(({ source, destination }) => [source, destination]));
  assert.equal(rewrites.get('/robots.txt'), '/api/robots');
  assert.equal(rewrites.get('/sitemap.xml'), '/api/sitemap');
  for (const route of ['/tjanster', '/om-oss', '/about', '/kontakt', '/contact']) {
    assert.equal(rewrites.get(route), '/index.html');
  }
});

test('global security headers include transport, framing and privacy controls', () => {
  const headers = headersFor('/(.*)');
  assert.equal(headers.get('x-content-type-options'), 'nosniff');
  assert.equal(headers.get('x-frame-options'), 'DENY');
  assert.equal(headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.match(headers.get('permissions-policy'), /camera=\(\)/u);
  assert.equal(headers.get('strict-transport-security'), 'max-age=31536000');
  assert.equal(headers.get('cross-origin-opener-policy'), 'same-origin');
  assert.equal(headers.get('cross-origin-resource-policy'), 'same-site');
});

test('CSP is report-only until the external-origin inventory is production verified', () => {
  const headers = headersFor('/(.*)');
  assert.equal(headers.has('content-security-policy'), false);
  const policy = headers.get('content-security-policy-report-only');
  assert.match(policy, /default-src 'self'/u);
  assert.match(policy, /object-src 'none'/u);
  assert.match(policy, /frame-ancestors 'none'/u);
  assert.match(policy, /https:\/\/challenges\.cloudflare\.com/u);
});

test('API responses are non-cacheable and excluded from indexing', () => {
  const headers = headersFor('/api/(.*)');
  assert.equal(headers.get('cache-control'), 'no-store');
  assert.equal(headers.get('x-robots-tag'), 'noindex, nofollow');
});
