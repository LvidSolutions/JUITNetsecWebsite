import test from 'node:test';
import assert from 'node:assert/strict';
import { consumeContactRateLimit } from '../api/_lib/rate-limit.js';

function request(ip = '203.0.113.10') {
  return new Request('https://juitnetsec.se/api/contact', {
    headers: { 'x-vercel-forwarded-for': ip },
  });
}

test('uses an atomic Redis transaction and never stores the raw IP address', async () => {
  let capturedBody = '';
  const result = await consumeContactRateLimit({
    request: request(),
    upstashUrl: 'https://redis.example',
    upstashToken: 'token',
    hashSecret: '12345678901234567890123456789012',
    max: 5,
    windowSeconds: 900,
    now: 1_800_000,
    fetchImpl: async (_url, init) => {
      capturedBody = init.body;
      return Response.json([{ result: 1 }, { result: 1 }]);
    },
  });

  const commands = JSON.parse(capturedBody);
  assert.equal(commands[0][0], 'INCR');
  assert.equal(commands[1][0], 'EXPIRE');
  assert.equal(capturedBody.includes('203.0.113.10'), false);
  assert.deepEqual(result, { allowed: true, remaining: 4, retryAfter: 900 });
});

test('blocks requests over the configured limit', async () => {
  const result = await consumeContactRateLimit({
    request: request(),
    upstashUrl: 'https://redis.example',
    upstashToken: 'token',
    hashSecret: '12345678901234567890123456789012',
    max: 5,
    windowSeconds: 900,
    now: 1_800_000,
    fetchImpl: async () => Response.json([{ result: 6 }, { result: 1 }]),
  });

  assert.equal(result.allowed, false);
  assert.equal(result.remaining, 0);
});
