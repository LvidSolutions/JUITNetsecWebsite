import test from 'node:test';
import assert from 'node:assert/strict';
import { ContactRequestError, submitContactRequest } from '../src/lib/contactApi.js';

const payload = {
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

test('submits JSON to the fixed same-origin contact endpoint', async () => {
  let capturedUrl;
  let capturedInit;

  const result = await submitContactRequest(payload, {
    fetchImpl: async (url, init) => {
      capturedUrl = url;
      capturedInit = init;
      return Response.json({ ok: true, requestId: payload.submissionId }, { status: 202 });
    },
  });

  assert.equal(capturedUrl, '/api/contact');
  assert.equal(capturedInit.method, 'POST');
  assert.deepEqual(capturedInit.headers, { 'Content-Type': 'application/json' });
  assert.deepEqual(JSON.parse(capturedInit.body), payload);
  assert.ok(capturedInit.signal instanceof AbortSignal);
  assert.deepEqual(result, { ok: true, requestId: payload.submissionId });
});

test('preserves a short public server error and its HTTP status', async () => {
  await assert.rejects(
    submitContactRequest(payload, {
      fetchImpl: async () => Response.json(
        { ok: false, message: 'Too many requests. Please try again later.' },
        { status: 429 },
      ),
    }),
    (error) => {
      assert.ok(error instanceof ContactRequestError);
      assert.equal(error.code, 'http_error');
      assert.equal(error.status, 429);
      assert.equal(error.message, 'Too many requests. Please try again later.');
      return true;
    },
  );
});

test('does not display an unbounded or malformed server error', async () => {
  await assert.rejects(
    submitContactRequest(payload, {
      fetchImpl: async () => Response.json(
        { ok: false, message: 'x'.repeat(241) },
        { status: 500 },
      ),
    }),
    (error) => {
      assert.equal(error.message, 'The request could not be sent.');
      assert.equal(error.status, 500);
      return true;
    },
  );

  await assert.rejects(
    submitContactRequest(payload, {
      fetchImpl: async () => new Response('<html>provider failure</html>', { status: 502 }),
    }),
    (error) => {
      assert.equal(error.message, 'The request could not be sent.');
      assert.equal(error.status, 502);
      return true;
    },
  );
});

test('rejects malformed successful responses instead of showing false success', async () => {
  for (const response of [
    new Response('not-json', { status: 202 }),
    Response.json({ ok: true, requestId: '' }, { status: 202 }),
    Response.json({ ok: false, requestId: payload.submissionId }, { status: 202 }),
  ]) {
    await assert.rejects(
      submitContactRequest(payload, { fetchImpl: async () => response }),
      (error) => {
        assert.ok(error instanceof ContactRequestError);
        assert.equal(error.code, 'invalid_response');
        assert.equal(error.status, 202);
        return true;
      },
    );
  }
});

test('maps transport failures to a stable network error', async () => {
  await assert.rejects(
    submitContactRequest(payload, {
      fetchImpl: async () => {
        throw new Error('sensitive transport detail');
      },
    }),
    (error) => {
      assert.ok(error instanceof ContactRequestError);
      assert.equal(error.code, 'network_error');
      assert.equal(error.status, null);
      assert.equal(error.message.includes('sensitive transport detail'), false);
      return true;
    },
  );
});

test('aborts timed-out requests and always clears the timer', async () => {
  let clearedTimer = null;

  await assert.rejects(
    submitContactRequest(payload, {
      timeoutMs: 5,
      setTimeoutImpl(callback) {
        callback();
        return 'contact-timeout';
      },
      clearTimeoutImpl(timer) {
        clearedTimer = timer;
      },
      fetchImpl: async (_url, init) => {
        assert.equal(init.signal.aborted, true);
        const error = new Error('aborted');
        error.name = 'AbortError';
        throw error;
      },
    }),
    (error) => {
      assert.ok(error instanceof ContactRequestError);
      assert.equal(error.code, 'timeout');
      assert.equal(error.message, 'The request timed out. Please check your connection and try again.');
      return true;
    },
  );

  assert.equal(clearedTimer, 'contact-timeout');
});
