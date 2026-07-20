import test from 'node:test';
import assert from 'node:assert/strict';
import { assertSameOrigin, getClientAddress, hashRateLimitIdentifier } from '../api/_lib/request-security.js';

function request(origin, headers = {}) {
  return new Request('https://juitnetsec.se/api/contact', {
    headers: {
      ...(origin === null ? {} : { origin }),
      ...headers,
    },
  });
}

test('accepts only the exact request origin', () => {
  assert.doesNotThrow(() => assertSameOrigin(request('https://juitnetsec.se')));
  for (const origin of [null, 'https://www.juitnetsec.se', 'https://juitnetsec.se.attacker.invalid', 'not-a-url']) {
    assert.throws(() => assertSameOrigin(request(origin)), (error) => error?.status === 403);
  }
});

test('prefers the Vercel-supplied client address header', () => {
  const value = getClientAddress(request('https://juitnetsec.se', {
    'x-vercel-forwarded-for': '203.0.113.10, 198.51.100.20',
    'x-forwarded-for': '192.0.2.20',
    'x-real-ip': '192.0.2.30',
  }));
  assert.equal(value, '203.0.113.10');
});

test('hashes rate-limit identifiers with a secret-specific HMAC', () => {
  const first = hashRateLimitIdentifier('person@example.com', 'a'.repeat(32));
  const second = hashRateLimitIdentifier('person@example.com', 'b'.repeat(32));
  assert.match(first, /^[0-9a-f]{64}$/u);
  assert.notEqual(first, second);
  assert.equal(first.includes('person@example.com'), false);
});
