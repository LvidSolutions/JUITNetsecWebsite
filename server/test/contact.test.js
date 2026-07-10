import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';

const baseConfig = {
  nodeEnv: 'test',
  trustProxy: false,
  allowedOrigins: ['https://juitnetsec.se'],
  resendApiKey: 'test-key',
  fromEmail: 'Website <website@example.com>',
  contactToEmail: 'info@juitnetsec.se',
  turnstileSecretKey: '',
  turnstileEnabled: false,
};

const validPayload = {
  name: 'Test Person',
  company: 'Example AB',
  email: 'test@example.com',
  phone: '+46 70 000 00 00',
  need: 'Cybersecurity',
  message: 'We need help reviewing our security environment.',
  website: '',
  turnstileToken: '',
};

test('health endpoint responds', async () => {
  const app = await buildApp({ config: baseConfig, sendContactEmail: async () => ({}) });
  const response = await app.inject({ method: 'GET', url: '/health' });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), { ok: true });
  await app.close();
});

test('valid contact request sends email', async () => {
  let called = false;
  const app = await buildApp({
    config: baseConfig,
    sendContactEmail: async ({ submission }) => {
      called = submission.email === validPayload.email;
      return {};
    },
  });

  const response = await app.inject({
    method: 'POST',
    url: '/api/contact',
    headers: { origin: 'https://juitnetsec.se' },
    payload: validPayload,
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.json().ok, true);
  assert.equal(called, true);
  await app.close();
});

test('invalid payload is rejected', async () => {
  const app = await buildApp({ config: baseConfig, sendContactEmail: async () => ({}) });
  const response = await app.inject({
    method: 'POST',
    url: '/api/contact',
    headers: { origin: 'https://juitnetsec.se' },
    payload: { ...validPayload, email: 'not-an-email' },
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json().ok, false);
  await app.close();
});

test('honeypot submissions do not send email', async () => {
  let called = false;
  const app = await buildApp({
    config: baseConfig,
    sendContactEmail: async () => {
      called = true;
      return {};
    },
  });

  const response = await app.inject({
    method: 'POST',
    url: '/api/contact',
    headers: { origin: 'https://juitnetsec.se' },
    payload: { ...validPayload, website: 'https://spam.example' },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(called, false);
  await app.close();
});

test('turnstile is required when configured', async () => {
  const app = await buildApp({
    config: { ...baseConfig, turnstileEnabled: true, turnstileSecretKey: 'secret' },
    sendContactEmail: async () => ({}),
    verifyTurnstile: async () => true,
  });

  const response = await app.inject({
    method: 'POST',
    url: '/api/contact',
    headers: { origin: 'https://juitnetsec.se' },
    payload: validPayload,
  });

  assert.equal(response.statusCode, 400);
  await app.close();
});
