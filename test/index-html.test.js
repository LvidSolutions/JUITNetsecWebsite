import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('HTML shell keeps essential language, viewport and metadata declarations', () => {
  assert.match(html, /<html\s+lang="[a-z]{2}(?:-[A-Z]{2})?"/u);
  assert.match(html, /<meta\s+name="viewport"\s+content="width=device-width, initial-scale=1\.0"/u);
  assert.match(html, /<meta\s+name="description"/u);
  assert.match(html, /<meta\s+name="theme-color"\s+content="#050505"/u);
  assert.match(html, /<meta\s+name="color-scheme"\s+content="dark"/u);
  assert.match(html, /<meta\s+property="og:type"\s+content="website"/u);
  assert.match(html, /<title>[^<]+<\/title>/u);
});

test('HTML shell includes a no-script fallback and module entrypoint', () => {
  assert.match(html, /<noscript>[\s\S]*JavaScript is required[\s\S]*<\/noscript>/u);
  assert.match(html, /<script\s+type="module"\s+src="\/src\/main\.jsx"><\/script>/u);
});
