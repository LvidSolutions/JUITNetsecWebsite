import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContactRequest } from '../api/_lib/contact-handler.js';

const validSubmission = {
  name: 'Test Person',
  company: 'Example AB',
  email: 'test@example.com',
  phone: '+46 70 000 00 00',
  need: 'Cybersecurity',
  message: 'We need help reviewing our security environment.',
  website: '',
  turnstileToken: 'turnstile-token',
  submissionId: '123e4567-e89b-42d3-a456-426614174000',
};

const config = {
  enabled: true,
  environment: 'test',
  resendApiKey: 'resend-secret',
  fromEmail: 'Website <website@example.com>',
  toEmail: 'info@juitnetsec.se',
  turnstileSecretKey: 'turnstile-secret',
  allowedOrigins: ['https://juitnetsec.se'],
  allowedTurnstileHostnames: ['juitnetsec.se'],
  upstashUrl: 'https://redis.example',
  upstashToken: 'redis-secret',
  rateLimitHashSecret: '12345678901234567890123456789012',
  rateLimitMax: 5,
  rateLimitWindowSeconds: 900,
};

function request(payload = validSubmission, options = {}) {
  return new Request(options.url || 'https://juitnetsec.se/api/contact', {
    method: 'POST',
    headers: {
      'content-type': options.contentType || 'application/json',
      origin: options.origin === undefined ? 'https://juitnetsec.se' : options.origin,
      'x-vercel-forwarded-for': options.ip || '203.0.113.10',
    },
    body: options.rawBody === undefined ? JSON.stringify(payload) : options.rawBody,
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

test('accepts a valid same-origin contact request', async () => {
  let delivered = null;
  const response = await handleContactRequest(
    request(),
    dependencies({
      deliverEmail: async (input) => {
        delivered = input;
        return { id: 'email-id' };
      },
    }),
  );

  assert.equal(response.status, 202);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-ratelimit-remaining'), '4');
  assert.deepEqual(await response.json(), {
    ok: true,
    requestId: validSubmission.submissionId,
  });
  assert.equal(delivered.submission.email, validSubmission.email);
  assert.equal(delivered.requestId, validSubmission.submissionId);
});

test('allows the deployment origin even when it is not in configured origins', async () => {
  const response = await handleContactRequest(
    request(validSubmission, {
      url: 'https://branch-preview.vercel.app/api/contact',
      origin: 'https://branch-preview.vercel.app',
    }),
    dependencies(),
  );
  assert.equal(response.status, 202);
});

test('rejects a mismatched origin', async () => {
  const response = await handleContactRequest(
    request(validSubmission, { origin: 'https://attacker.example' }),
    dependencies(),
  );
  assert.equal(response.status, 403);
});

test('rejects requests without an origin', async () => {
  const req = new Request('https://juitnetsec.se/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(validSubmission),
  });
  const response = await handleContactRequest(req, dependencies());
  assert.equal(response.status, 403);
});

test('rejects non-JSON content', async () => {
  const response = await handleContactRequest(
    request(validSubmission, { contentType: 'text/plain' }),
    dependencies(),
  );
  assert.equal(response.status, 415);
});

test('rejects malformed JSON', async () => {
  const response = await handleContactRequest(
    request(validSubmission, { rawBody: '{' }),
    dependencies(),
  );
  assert.equal(response.status, 400);
});

test('rejects oversized requests', async () => {
  const response = await handleContactRequest(
    request(validSubmission, { rawBody: JSON.stringify({ data: 'x'.repeat(21 * 1024) }) }),
    dependencies(),
  );
  assert.equal(response.status, 413);
});

test('rejects unknown input properties', async () => {
  const response = await handleContactRequest(
    request({ ...validSubmission, admin: true }),
    dependencies(),
  );
  assert.equal(response.status, 400);
});

test('rejects invalid email input', async () => {
  const response = await handleContactRequest(
    request({ ...validSubmission, email: 'invalid' }),
    dependencies(),
  );
  assert.equal(response.status, 400);
});

test('returns fake success for a honeypot submission without captcha or email', async () => {
  let captchaCalled = false;
  let emailCalled = false;
  const response = await handleContactRequest(
    request({ ...validSubmission, website: 'https://spam.example' }),
    dependencies({
      verifyCaptcha: async () => {
        captchaCalled = true;
        return true;
      },
      deliverEmail: async () => {
        emailCalled = true;
        return { id: 'unexpected' };
      },
    }),
  );

  assert.equal(response.status, 202);
  assert.equal(captchaCalled, false);
  assert.equal(emailCalled, false);
});

test('rejects failed Turnstile verification', async () => {
  const response = await handleContactRequest(
    request(),
    dependencies({ verifyCaptcha: async () => false }),
  );
  assert.equal(response.status, 400);
});

test('returns 429 and Retry-After when rate limit is exceeded', async () => {
  const response = await handleContactRequest(
    request(),
    dependencies({
      consumeRateLimit: async () => ({ allowed: false, remaining: 0, retryAfter: 321 }),
    }),
  );
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '321');
});

test('fails closed when the form is disabled', async () => {
  const response = await handleContactRequest(
    request(),
    dependencies({ loadConfig: () => ({ enabled: false }) }),
  );
  assert.equal(response.status, 503);
});

test('returns a generic provider error without leaking details', async () => {
  const response = await handleContactRequest(
    request(),
    dependencies({
      deliverEmail: async () => {
        throw new Error('provider secret detail');
      },
    }),
  );
  assert.equal(response.status, 502);
  const body = await response.json();
  assert.equal(body.message.includes('secret detail'), false);
});
