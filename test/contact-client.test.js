import test from 'node:test';
import assert from 'node:assert/strict';
import { ContactRequestError, submitContact } from '../src/lib/contactClient.js';

const payload = {
  name: 'Test Person',
  email: 'test@example.com',
  phone: '',
  message: 'A sufficiently detailed test message.',
  website: '',
  turnstileToken: 'token',
  submissionId: '123e4567-e89b-42d3-a456-426614174000',
  formStartedAt: 1_000,
};

test('submits to the fixed same-origin endpoint and accepts a valid response', async () => {
  let request;
  const result = await submitContact(payload, {
    fetchImpl: async (url, init) => {
      request = { url, init };
      return Response.json({ ok: true, requestId: payload.submissionId }, { status: 202 });
    },
  });

  assert.equal(request.url, '/api/contact');
  assert.equal(request.init.method, 'POST');
  assert.equal(request.init.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(request.init.body), payload);
  assert.deepEqual(result, { requestId: payload.submissionId });
});

test('maps rate limiting to a stable public message', async () => {
  await assert.rejects(
    submitContact(payload, {
      fetchImpl: async () => Response.json({ ok: false, message: 'private detail' }, { status: 429 }),
    }),
    (error) =>
      error instanceof ContactRequestError &&
      error.status === 429 &&
      error.publicMessage === 'Too many requests have been sent. Please wait a while and try again.' &&
      !error.publicMessage.includes('private detail'),
  );
});

test('rejects a malformed success response', async () => {
  await assert.rejects(
    submitContact(payload, {
      fetchImpl: async () => Response.json({ ok: true, requestId: 'not-a-request-id' }, { status: 202 }),
    }),
    (error) => error instanceof ContactRequestError && error.code === 'invalid-response',
  );
});

test('aborts a request that exceeds the configured timeout', async () => {
  await assert.rejects(
    submitContact(payload, {
      timeoutMs: 5,
      fetchImpl: async (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener(
            'abort',
            () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })),
            { once: true },
          );
        }),
    }),
    (error) => error instanceof ContactRequestError && error.code === 'timeout',
  );
});

test('returns a connection-safe error for network failures', async () => {
  await assert.rejects(
    submitContact(payload, {
      fetchImpl: async () => {
        throw new Error('provider hostname and private details');
      },
    }),
    (error) =>
      error instanceof ContactRequestError &&
      error.code === 'network' &&
      !error.publicMessage.includes('provider hostname'),
  );
});
