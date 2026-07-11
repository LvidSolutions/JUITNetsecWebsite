import test from 'node:test';
import assert from 'node:assert/strict';
import { loadContactConfig } from '../api/_lib/config.js';

const completeEnv = {
  CONTACT_FORM_ENABLED: 'true',
  RESEND_API_KEY: 're_test',
  CONTACT_FROM_EMAIL: 'Website <website@example.com>',
  CONTACT_TO_EMAIL: 'info@juitnetsec.se',
  TURNSTILE_SECRET_KEY: 'turnstile',
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
  assert.throws(() => loadContactConfig({ CONTACT_FORM_ENABLED: 'true' }), /Missing required configuration/);
});

test('loads and normalizes valid configuration', () => {
  const config = loadContactConfig(completeEnv);
  assert.equal(config.enabled, true);
  assert.equal(config.upstashUrl, 'https://redis.example');
  assert.equal(config.rateLimitMax, 5);
});
