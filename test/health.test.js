import test from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../api/health.js';

test('health endpoint is non-cacheable and exposes no secrets', async () => {
  const response = GET();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');

  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(typeof body.environment, 'string');
  assert.equal(typeof body.version, 'string');
  assert.deepEqual(Object.keys(body).sort(), ['environment', 'ok', 'version']);
});
