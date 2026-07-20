import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContactRequest } from '../api/_lib/contact-handler.js';

const now = 10_000;
const validSubmission = {
  name: 'Åsa O\'Neil',
  email: 'test+contact@example.com',
  phone: '+46 70 000 00 00',
  message: 'We need help reviewing our security environment.',
  website: '',
  turnstileToken: 'turnstile-token',
  submissionId: '123e4567-e89b-42d3-a456-426614174000',
  formStartedAt: 8_000,
};
const config = {
  enabled: true,
  environment: 'test',
  resendApiKey: 'resend-secret',
  fromEmail: 'Website <website@example.com>',
  toEmail: 'contact@juit.se',
  turnstileSecretKey: 'turnstile-secret',
  allowedTurnstileHostnames: ['juitnetsec.se'],
  upstashUrl: 'https://redis.example',
  upstashToken: 'redis-secret',
  rateLimitHashSecret: '12345678901234567890123456789012',
  rateLimitMax: 5,
  rateLimitEmailMax: 2,
  rateLimitWindowSeconds: 900,
};

function request(payload = validSubmission, options = {}) {
  return new Request(options.url || 'https://juitnetsec.se/api/contact', {
    method: options.method || 'POST',
    headers: {
      'content-type': options.contentType || 'application/json',
      ...(options.origin === null ? {} : { origin: options.origin || 'https://juitnetsec.se' }),
      'x-vercel-forwarded-for': '203.0.113.10',
    },
    body: (options.method || 'POST') === 'POST'
      ? (options.rawBody === undefined ? JSON.stringify(payload) : options.rawBody)
      : undefined,
  });
}

function dependencies(overrides = {}) {
  return {
    now,
    loadConfig: () => config,
    consumeRateLimit: async () => ({ allowed: true, remaining: 1, retryAfter: 900 }),
    verifyCaptcha: async () => true,
    deliverEmail: async () => ({ id: 'email-id' }),
    logger: { info() {}, warn() {}, error() {} },
    ...overrides,
  };
}

test('accepts a valid four-field contact submission', async () => {
  let delivered;
  let rateLimitInput;
  const response = await handleContactRequest(
    request(),
    dependencies({
      consumeRateLimit: async (input) => {
        rateLimitInput = input;
        return { allowed: true, remaining: 1, retryAfter: 900 };
      },
      deliverEmail: async (input) => {
        delivered = input;
        return { id: 'email-id' };
      },
    }),
  );

  assert.equal(response.status, 202);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-ratelimit-remaining'), '1');
  assert.equal(delivered.submission.email, validSubmission.email);
  assert.equal(delivered.submission.company, undefined);
  assert.equal(rateLimitInput.keyPrefix, 'juit:test:contact');
});

test('rejects malformed and whitespace email addresses', async () => {
  for (const email of ['invalid', 'a@', 'a..b@example.com', 'a@domain', 'a @example.com']) {
    const response = await handleContactRequest(request({ ...validSubmission, email }), dependencies());
    assert.equal(response.status, 400);
  }
});

test('rejects old form fields and missing bot token', async () => {
  const oldField = await handleContactRequest(request({ ...validSubmission, company: 'Example' }), dependencies());
  const bot = await handleContactRequest(request({ ...validSubmission, turnstileToken: '' }), dependencies());
  assert.equal(oldField.status, 400);
  assert.equal(bot.status, 400);
});

test('rejects short message, impossible phone, and automated timing', async () => {
  for (const payload of [
    { ...validSubmission, message: 'Short' },
    { ...validSubmission, phone: 'not a number' },
    { ...validSubmission, formStartedAt: 9_500 },
  ]) {
    const response = await handleContactRequest(request(payload), dependencies());
    assert.equal(response.status, 400);
  }
});

test('returns fake success for a honeypot submission without CAPTCHA or email delivery', async () => {
  let captchaChecked = false;
  let delivered = false;
  const response = await handleContactRequest(
    request({ ...validSubmission, website: 'spam.example' }),
    dependencies({
      verifyCaptcha: async () => { captchaChecked = true; return true; },
      deliverEmail: async () => { delivered = true; },
    }),
  );
  assert.equal(response.status, 202);
  assert.equal(captchaChecked, false);
  assert.equal(delivered, false);
});

test('rejects unsupported methods, content types, malformed JSON and origins', async () => {
  const method = await handleContactRequest(request(validSubmission, { method: 'GET' }), dependencies());
  const wrongType = await handleContactRequest(request(validSubmission, { contentType: 'text/plain' }), dependencies());
  const malformed = await handleContactRequest(request(validSubmission, { rawBody: '{' }), dependencies());
  const crossOrigin = await handleContactRequest(request(validSubmission, { origin: 'https://attacker.invalid' }), dependencies());
  const missingOrigin = await handleContactRequest(request(validSubmission, { origin: null }), dependencies());

  assert.equal(method.status, 405);
  assert.equal(method.headers.get('allow'), 'POST');
  assert.equal(wrongType.status, 415);
  assert.equal(malformed.status, 400);
  assert.equal(crossOrigin.status, 403);
  assert.equal(missingOrigin.status, 403);
});

test('fails closed when the contact service is disabled', async () => {
  const response = await handleContactRequest(
    request(),
    dependencies({ loadConfig: () => ({ enabled: false, environment: 'test' }) }),
  );
  assert.equal(response.status, 503);
});

test('returns generic failure on provider and rate-limit failures', async () => {
  const provider = await handleContactRequest(
    request(),
    dependencies({ deliverEmail: async () => { throw new Error('private detail'); } }),
  );
  const limited = await handleContactRequest(
    request(),
    dependencies({ consumeRateLimit: async () => ({ allowed: false, remaining: 0, retryAfter: 60 }) }),
  );

  assert.equal(provider.status, 502);
  assert.equal((await provider.json()).message.includes('private detail'), false);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '60');
});
