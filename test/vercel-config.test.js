import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const config = JSON.parse(
  await readFile(new URL('../vercel.json', import.meta.url), 'utf8'),
);

const expectedSpaRoutes = [
  '/tjanster',
  '/om-oss',
  '/about',
  '/kontakt',
  '/contact',
];

const requiredHeaders = new Map([
  ['X-Content-Type-Options', 'nosniff'],
  ['X-Frame-Options', 'DENY'],
  ['X-XSS-Protection', '0'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
]);

test('Vercel rewrites every supported client-side route to index.html', () => {
  const rewrites = new Map(
    (config.rewrites || []).map((rewrite) => [rewrite.source, rewrite.destination]),
  );

  for (const route of expectedSpaRoutes) {
    assert.equal(rewrites.get(route), '/index.html', `Missing SPA rewrite for ${route}`);
  }

  for (const source of rewrites.keys()) {
    assert.equal(source.startsWith('/api/'), false, `API route ${source} must not be rewritten`);
  }
});

test('Vercel applies the required baseline security headers', () => {
  const globalRule = (config.headers || []).find((rule) => rule.source === '/(.*)');
  assert.ok(globalRule, 'Missing global security-header rule');

  const headers = new Map(
    globalRule.headers.map((header) => [header.key, header.value]),
  );

  for (const [name, expectedValue] of requiredHeaders) {
    assert.equal(headers.get(name), expectedValue, `Incorrect ${name} header`);
  }

  const permissionsPolicy = headers.get('Permissions-Policy');
  assert.ok(permissionsPolicy, 'Missing Permissions-Policy header');
  assert.match(permissionsPolicy, /camera=\(\)/u);
  assert.match(permissionsPolicy, /microphone=\(\)/u);
  assert.match(permissionsPolicy, /geolocation=\(\)/u);
});
