import test from 'node:test';
import assert from 'node:assert/strict';
import { sendContactEmail } from '../api/_lib/resend.js';
import { verifyTurnstile } from '../api/_lib/turnstile.js';

const submission = {
  name: '<script>alert(1)</script>',
  company: 'Example AB',
  email: 'reply@example.com',
  phone: '+46 70 000 00 00',
  need: 'Cybersecurity',
  message: '<img src=x onerror=alert(1)>',
};

test('escapes HTML and keeps the visitor address in reply_to', async () => {
  let payload;
  await sendContactEmail({
    apiKey: 'api-key',
    fromEmail: 'JUIT Website <website@example.com>',
    toEmail: 'info@juitnetsec.se',
    submission,
    requestId: '123e4567-e89b-42d3-a456-426614174000',
    fetchImpl: async (_url, init) => {
      payload = JSON.parse(init.body);
      return Response.json({ id: 'email-id' });
    },
  });

  assert.equal(payload.from, 'JUIT Website <website@example.com>');
  assert.equal(payload.reply_to, 'reply@example.com');
  assert.equal(payload.html.includes('<script>'), false);
  assert.equal(payload.html.includes('&lt;script&gt;'), true);
  assert.equal(payload.html.includes('<img'), false);
});

test('requires matching Turnstile action and hostname', async () => {
  const valid = await verifyTurnstile({
    secret: 'secret',
    token: 'token',
    remoteIp: '203.0.113.10',
    expectedAction: 'contact_form',
    allowedHostnames: ['juitnetsec.se'],
    fetchImpl: async () => Response.json({
      success: true,
      action: 'contact_form',
      hostname: 'juitnetsec.se',
    }),
  });
  assert.equal(valid, true);

  const wrongAction = await verifyTurnstile({
    secret: 'secret',
    token: 'token',
    expectedAction: 'contact_form',
    allowedHostnames: ['juitnetsec.se'],
    fetchImpl: async () => Response.json({
      success: true,
      action: 'different_action',
      hostname: 'juitnetsec.se',
    }),
  });
  assert.equal(wrongAction, false);
});
