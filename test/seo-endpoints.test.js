import test from 'node:test';
import assert from 'node:assert/strict';
import { GET as getRobots } from '../api/robots.js';
import { GET as getSitemap } from '../api/sitemap.js';

async function withVercelEnv(value, callback) {
  const previous = process.env.VERCEL_ENV;
  if (value === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = value;
  try {
    return await callback();
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
}

test('production robots allows crawling and points to the current origin sitemap', async () => {
  await withVercelEnv('production', async () => {
    const response = getRobots(new Request('https://www.example.se/robots.txt'));
    const body = await response.text();
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /^text\/plain/u);
    assert.match(body, /Allow: \//u);
    assert.match(body, /Sitemap: https:\/\/www\.example\.se\/sitemap\.xml/u);
  });
});

test('non-production robots blocks indexing', async () => {
  await withVercelEnv('preview', async () => {
    const response = getRobots(new Request('https://preview.example/robots.txt'));
    assert.equal(await response.text(), 'User-agent: *\nDisallow: /\n');
    assert.equal(response.headers.get('cache-control'), 'no-store');
  });
});

test('sitemap is valid XML for all current public routes', async () => {
  await withVercelEnv('production', async () => {
    const response = getSitemap(new Request('https://www.example.se/sitemap.xml'));
    const body = await response.text();
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /^application\/xml/u);
    for (const route of ['/', '/tjanster', '/om-oss', '/about', '/kontakt', '/contact']) {
      assert.ok(body.includes(new URL(route, 'https://www.example.se').href));
    }
    assert.equal((body.match(/<url>/gu) || []).length, 6);
  });
});

test('preview sitemap is explicitly noindex and non-cacheable', async () => {
  await withVercelEnv('preview', async () => {
    const response = getSitemap(new Request('https://preview.example/sitemap.xml'));
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.equal(response.headers.get('cache-control'), 'no-store');
  });
});
