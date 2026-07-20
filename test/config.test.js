import test from 'node:test';
import assert from 'node:assert/strict';
import { loadContactConfig } from '../api/_lib/config.js';

const completeEnv = {
  CONTACT_FORM_ENABLED: 'true',
  RESEND_API_KEY: 're_test',
  CONTACT_FROM_EMAIL: 'Website <website@example.com>',
  CONTACT_TO_EMAIL: 'contact@juit.se',
  TURNSTILE_SECRET_KEY: 'turnstile',
  TURNSTILE_ALLOWED_HOSTNAMES: 'juitnetsec.se,www.juitnetsec.se',
  UPSTASH_REDIS_REST_URL: 'https://redis.example/',
  UPSTASH_REDIS_REST_TOKEN: 'token',
  RATE_LIMIT_HASH_SECRET: '12345678901234567890123456789012',
};

test('fails closed when explicitly disabled', () => {
  assert.deepEqual(loadContactConfig({}), {
    enabled: false,
    environment: 'development',
  });
});

test('requires all contact secrets when enabled', () => {
  assert.throws(() => loadContactConfig({ CONTACT_FORM_ENABLED: 'true' }), /Missing required configuration/u);
});

test('loads and normalizes valid configuration', () => {
  const config = loadContactConfig(completeEnv);
  assert.equal(config.enabled, true);
  assert.equal(config.upstashUrl, 'https://redis.example');
  assert.equal(config.fromEmail, 'Website <website@example.com>');
  assert.equal(config.toEmail, 'contact@juit.se');
  assert.deepEqual(config.allowedTurnstileHostnames, ['juitnetsec.se', 'www.juitnetsec.se']);
  assert.equal(config.rateLimitMax, 5);
  assert.equal(config.rateLimitEmailMax, 2);
});

test('rejects insecure or credential-bearing Upstash URLs', () => {
  for (const url of ['http://redis.example', 'https://user:secret@redis.example', 'not-a-url']) {
    assert.throws(
      () => loadContactConfig({ ...completeEnv, UPSTASH_REDIS_REST_URL: url }),
      /UPSTASH_REDIS_REST_URL/u,
    );
  }
});

test('rejects invalid or injected email configuration', () => {
  for (const fromEmail of [
    'Website <website@example.com>\r\nBcc: attacker@example.com',
    'Website <not-an-address>',
  ]) {
    assert.throws(
      () => loadContactConfig({ ...completeEnv, CONTACT_FROM_EMAIL: fromEmail }),
      /CONTACT_FROM_EMAIL/u,
    );
  }
  assert.throws(
    () => loadContactConfig({ ...completeEnv, CONTACT_TO_EMAIL: 'not-an-address' }),
    /CONTACT_TO_EMAIL/u,
  );
});

test('rejects wildcard, URL and path values in Turnstile hostname configuration', () => {
  for (const hostname of ['*.example.com', 'https://example.com', 'example.com/path']) {
    assert.throws(
      () => loadContactConfig({ ...completeEnv, TURNSTILE_ALLOWED_HOSTNAMES: hostname }),
      /Turnstile hostname/u,
    );
  }
});
