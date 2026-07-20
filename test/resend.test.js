import test from 'node:test';
import assert from 'node:assert/strict';
import { sendContactEmail } from '../api/_lib/resend.js';

const submission = {
  name: '<script>alert(1)</script>',
  email: 'visitor@example.com\r\nBcc: attacker@example.com',
  phone: '+46 70 000 00 00',
  message: '<b>Do not render this as HTML</b>',
};

const options = (overrides = {}) => ({
  apiKey: 're_secret',
  fromEmail: 'JUIT NetSec Website <website@example.com>\r\nBcc: attacker@example.com',
  toEmail: 'contact@juit.se\r\nBcc: attacker@example.com',
  submission,
  requestId: '123e4567-e89b-42d3-a456-426614174000',
  ...overrides,
});

test('sends a sanitized, escaped and idempotent Resend request', async () => {
  let request;
  const result = await sendContactEmail(options({
    fetchImpl: async (url, init) => {
      request = { url, init };
      return Response.json({ id: 'email-id' });
    },
  }));

  const body = JSON.parse(request.init.body);
  assert.equal(request.url, 'https://api.resend.com/emails');
  assert.equal(request.init.headers.Authorization, 'Bearer re_secret');
  assert.equal(request.init.headers['Idempotency-Key'], options().requestId);
  assert.equal(body.from.includes('\r'), false);
  assert.equal(body.to[0].includes('\n'), false);
  assert.equal(body.reply_to.includes('\r'), false);
  assert.equal(body.html.includes('<script>'), false);
  assert.equal(body.html.includes('&lt;script&gt;'), true);
  assert.equal(body.html.includes('<b>Do not render'), false);
  assert.equal(body.text.includes('<b>Do not render this as HTML</b>'), true);
  assert.deepEqual(result, { id: 'email-id' });
});

test('does not expose provider response bodies when delivery is rejected', async () => {
  await assert.rejects(
    sendContactEmail(options({
      fetchImpl: async () => new Response('private provider diagnostic', { status: 422 }),
    })),
    (error) =>
      error?.name === 'EmailProviderError' &&
      error.message.includes('422') &&
      !error.message.includes('private provider diagnostic'),
  );
});

test('treats an accepted response with malformed optional JSON as delivered', async () => {
  const result = await sendContactEmail(options({
    fetchImpl: async () => new Response('{', { status: 200, headers: { 'content-type': 'application/json' } }),
  }));
  assert.deepEqual(result, { id: null });
});
