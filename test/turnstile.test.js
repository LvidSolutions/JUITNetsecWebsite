import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyTurnstile } from '../api/_lib/turnstile.js';

const options = (overrides = {}) => ({
  secret: 'turnstile-secret',
  token: 'turnstile-token',
  remoteIp: '203.0.113.10',
  expectedAction: 'contact_form',
  allowedHostnames: ['juitnetsec.se'],
  ...overrides,
});

test('verifies token, action, hostname and remote address', async () => {
  let request;
  const valid = await verifyTurnstile(options({
    fetchImpl: async (url, init) => {
      request = { url, init };
      return Response.json({ success: true, action: 'contact_form', hostname: 'juitnetsec.se' });
    },
  }));

  assert.equal(valid, true);
  assert.equal(request.url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  assert.equal(request.init.method, 'POST');
  assert.equal(request.init.body.get('secret'), 'turnstile-secret');
  assert.equal(request.init.body.get('response'), 'turnstile-token');
  assert.equal(request.init.body.get('remoteip'), '203.0.113.10');
});

test('rejects unsuccessful, wrong-action and wrong-hostname responses', async () => {
  const results = [
    { success: false, action: 'contact_form', hostname: 'juitnetsec.se' },
    { success: true, action: 'other_action', hostname: 'juitnetsec.se' },
    { success: true, action: 'contact_form', hostname: 'attacker.invalid' },
  ];

  for (const result of results) {
    const valid = await verifyTurnstile(options({ fetchImpl: async () => Response.json(result) }));
    assert.equal(valid, false);
  }
});

test('fails closed for transport, HTTP and malformed provider responses', async () => {
  const providers = [
    async () => { throw new Error('private network detail'); },
    async () => new Response('unavailable', { status: 503 }),
    async () => new Response('{', { status: 200, headers: { 'content-type': 'application/json' } }),
  ];

  for (const fetchImpl of providers) {
    await assert.rejects(
      verifyTurnstile(options({ fetchImpl })),
      (error) => error?.name === 'TurnstileProviderError' && !error.message.includes('private network detail'),
    );
  }
});

test('omits unknown client addresses from the provider request', async () => {
  let form;
  await verifyTurnstile(options({
    remoteIp: 'unknown',
    fetchImpl: async (_url, init) => {
      form = init.body;
      return Response.json({ success: true, action: 'contact_form', hostname: 'juitnetsec.se' });
    },
  }));
  assert.equal(form.has('remoteip'), false);
});
