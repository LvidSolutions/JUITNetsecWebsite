import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContactRequest } from '../api/_lib/contact-handler.js';
import { HttpError } from '../api/_lib/errors.js';

const submission = {
  name: 'Test Person',
  email: 'test@example.com',
  phone: '+46 70 000 00 00',
  message: 'We need help reviewing our security environment.',
  website: '',
  turnstileToken: 'turnstile-token',
  submissionId: '123e4567-e89b-42d3-a456-426614174000',
  formStartedAt: Date.now() - 2_000,
};

const config = {
  enabled: true,
  environment: 'test',
  resendApiKey: 'resend-secret',
  fromEmail: 'Website <website@example.com>',
  toEmail: 'contact@juit.se',
  turnstileSecretKey: 'turnstile-secret',
  allowedOrigins: [],
  allowedTurnstileHostnames: [],
  upstashUrl: 'https://redis.example',
  upstashToken: 'redis-secret',
  rateLimitHashSecret: '12345678901234567890123456789012',
  rateLimitMax: 5,
  rateLimitWindowSeconds: 900,
};

function request() {
  return new Request('https://juitnetsec.se/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://juitnetsec.se',
      'x-vercel-forwarded-for': '203.0.113.10',
    },
    body: JSON.stringify(submission),
  });
}

function dependencies(overrides = {}) {
  return {
    loadConfig: () => config,
    consumeRateLimit: async () => ({ allowed: true, remaining: 4, retryAfter: 900 }),
    verifyCaptcha: async () => true,
    deliverEmail: async () => ({ id: 'email-id' }),
    logger: { info() {}, warn() {}, error() {} },
    ...overrides,
  };
}

test('returns 503 when the Turnstile provider is unavailable', async () => {
  const response = await handleContactRequest(
    request(),
    dependencies({
      verifyCaptcha: async () => {
        throw new Error('provider unavailable');
      },
    }),
  );

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    ok: false,
    message: 'The security verification service is temporarily unavailable.',
  });
});

test('returns 503 when distributed rate limiting is unavailable', async () => {
  const response = await handleContactRequest(
    request(),
    dependencies({
      consumeRateLimit: async () => {
        throw new HttpError(503, 'The contact form is temporarily unavailable.');
      },
    }),
  );

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    ok: false,
    message: 'The contact form is temporarily unavailable.',
  });
});
