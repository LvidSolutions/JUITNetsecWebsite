import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContactRequest } from '../api/_lib/contact-handler.js';
import { ConfigurationError } from '../api/_lib/errors.js';

const submission = {
  name: 'Sensitive Person',
  company: 'Sensitive Company AB',
  email: 'sensitive@example.com',
  phone: '+46 70 123 45 67',
  need: 'Cybersecurity',
  message: 'Sensitive incident details that must never enter application logs.',
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
  allowedOrigins: [],
  allowedTurnstileHostnames: [],
  upstashUrl: 'https://redis.example',
  upstashToken: 'redis-secret',
  rateLimitHashSecret: '12345678901234567890123456789012',
  rateLimitMax: 5,
  rateLimitWindowSeconds: 900,
};

function makeRequest(payload = submission) {
  return new Request('https://juitnetsec.se/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://juitnetsec.se',
      'x-vercel-forwarded-for': '203.0.113.10',
    },
    body: JSON.stringify(payload),
  });
}

function captureLogger() {
  const entries = [];
  const write = (value) => entries.push(String(value));
  return {
    entries,
    logger: { info: write, warn: write, error: write, log: write },
  };
}

function dependencies(overrides = {}) {
  return {
    loadConfig: () => config,
    consumeRateLimit: async () => ({ allowed: true, remaining: 4, retryAfter: 900 }),
    verifyCaptcha: async () => true,
    deliverEmail: async () => ({ id: 'email-id' }),
    ...overrides,
  };
}

function assertNoSensitiveData(logText) {
  for (const value of [
    submission.name,
    submission.company,
    submission.email,
    submission.phone,
    submission.message,
    submission.turnstileToken,
    config.resendApiKey,
    config.turnstileSecretKey,
    config.upstashToken,
  ]) {
    assert.equal(logText.includes(value), false, `Sensitive value was written to logs: ${value}`);
  }
}

test('provider failures are logged without form content or credentials', async () => {
  const { entries, logger } = captureLogger();
  const response = await handleContactRequest(
    makeRequest(),
    dependencies({
      logger,
      deliverEmail: async () => {
        throw new Error(`provider failed for ${submission.email}`);
      },
    }),
  );

  assert.equal(response.status, 502);
  const logText = entries.join('\n');
  assert.match(logText, /contact_unhandled_error/u);
  assertNoSensitiveData(logText);
});

test('validation failures are logged without rejected field values', async () => {
  const { entries, logger } = captureLogger();
  const response = await handleContactRequest(
    makeRequest({ ...submission, email: 'invalid-sensitive-address' }),
    dependencies({ logger }),
  );

  assert.equal(response.status, 400);
  const logText = entries.join('\n');
  assert.match(logText, /contact_request_rejected/u);
  assert.equal(logText.includes('invalid-sensitive-address'), false);
  assertNoSensitiveData(logText);
});

test('configuration errors expose key names but never secret values', async () => {
  const { entries, logger } = captureLogger();
  const response = await handleContactRequest(
    makeRequest(),
    dependencies({
      logger,
      loadConfig: () => {
        throw new ConfigurationError(['RESEND_API_KEY']);
      },
    }),
  );

  assert.equal(response.status, 503);
  const logText = entries.join('\n');
  assert.match(logText, /RESEND_API_KEY/u);
  assertNoSensitiveData(logText);
});
