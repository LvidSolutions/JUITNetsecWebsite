import test from 'node:test';
import assert from 'node:assert/strict';
import { readJsonBody } from '../api/_lib/validation.js';

function isTooLarge(error) {
  return error?.status === 413 && error?.publicMessage === 'The request is too large.';
}

test('rejects an oversized declared Content-Length before reading the body', async () => {
  let pulls = 0;
  const body = new ReadableStream({
    pull(controller) {
      pulls += 1;
      controller.enqueue(new TextEncoder().encode('{}'));
      controller.close();
    },
  });

  const request = new Request('https://juitnetsec.se/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'content-length': String(50 * 1024),
    },
    body,
    duplex: 'half',
  });

  await assert.rejects(readJsonBody(request), isTooLarge);
  assert.equal(pulls, 0);
});

test('cancels a streamed request as soon as it crosses the byte limit', async () => {
  let pulls = 0;
  let cancelReason = '';
  const chunk = new Uint8Array(12 * 1024);

  const body = new ReadableStream({
    pull(controller) {
      pulls += 1;
      controller.enqueue(chunk);
    },
    cancel(reason) {
      cancelReason = String(reason);
    },
  });

  const request = new Request('https://juitnetsec.se/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    duplex: 'half',
  });

  await assert.rejects(readJsonBody(request), isTooLarge);
  assert.ok(pulls >= 2 && pulls <= 3, `Unexpected stream pull count: ${pulls}`);
  assert.equal(cancelReason, 'body limit exceeded');
});

test('accepts valid multibyte JSON when its encoded byte length is within the limit', async () => {
  const payload = { message: 'säkerhet '.repeat(100) };
  const request = new Request('https://juitnetsec.se/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  assert.deepEqual(await readJsonBody(request), payload);
});
