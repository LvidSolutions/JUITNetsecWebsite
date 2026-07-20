import test from 'node:test';
import assert from 'node:assert/strict';
import { consumeContactRateLimit } from '../api/_lib/rate-limit.js';

const options = (overrides = {}) => ({
  request: new Request('https://juitnetsec.se/api/contact', {
    headers: { 'x-vercel-forwarded-for': '203.0.113.10' },
  }),
  email: 'person@example.com',
  upstashUrl: 'https://redis.example',
  upstashToken: 'token',
  hashSecret: '12345678901234567890123456789012',
  keyPrefix: 'juit:preview:contact',
  now: 1_800_000,
  ...overrides,
});

test('uses environment-scoped hashed IP and email keys', async () => {
  let body;
  const result = await consumeContactRateLimit(options({
    fetchImpl: async (_url, init) => {
      body = init.body;
      return Response.json([{ result: 1 }, { result: 1 }, { result: 1 }, { result: 1 }]);
    },
  }));

  assert.equal(body.includes('203.0.113.10'), false);
  assert.equal(body.includes('person@example.com'), false);
  assert.equal(body.includes('juit:preview:contact'), true);
  assert.deepEqual(result, { allowed: true, remaining: 1, retryAfter: 900 });
});

test('reports the stricter remaining allowance', async () => {
  const result = await consumeContactRateLimit(options({
    max: 10,
    emailMax: 2,
    fetchImpl: async () => Response.json([{ result: 1 }, {}, { result: 2 }, {}]),
  }));
  assert.equal(result.allowed, true);
  assert.equal(result.remaining, 0);
});

test('blocks an over-limit email', async () => {
  const limited = await consumeContactRateLimit(options({
    fetchImpl: async () => Response.json([{ result: 1 }, {}, { result: 3 }, {}]),
  }));
  assert.equal(limited.allowed, false);
  assert.equal(limited.remaining, 0);
});

test('fails closed for Redis HTTP, transport and response-format failures', async () => {
  const failures = [
    async () => new Response('down', { status: 503 }),
    async () => { throw new Error('network detail'); },
    async () => new Response('{', { status: 200, headers: { 'content-type': 'application/json' } }),
    async () => Response.json([{ result: 'not-a-number' }, {}, { result: 1 }, {}]),
  ];

  for (const fetchImpl of failures) {
    await assert.rejects(
      consumeContactRateLimit(options({ fetchImpl })),
      (error) => error?.status === 503 && !error.publicMessage.includes('network detail'),
    );
  }
});
