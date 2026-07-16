import test from 'node:test';
import assert from 'node:assert/strict';
import { readJsonBody } from '../api/_lib/validation.js';

function isTooLarge(error) {
  return error?.status === 413 && error?.publicMessage === 'The request is too large.';
}

test('rejects an oversized declared Content-Length without consuming body data', async () => {
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
  // Node's Request implementation may prefetch one chunk while constructing the
  // request. The handler must still reject from Content-Length without reading
  // the stream itself.
  assert.ok(pulls <= 1, `Unexpected stream pull count: ${pulls}`);
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

test('requires the exact application/json media type', async () => {
  const request = new Request('https://juitnetsec.se/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/jsonp' },
    body: '{}',
  });

  await assert.rejects(
    readJsonBody(request),
    (error) => error?.status === 415 && error?.publicMessage === 'Unsupported content type.',
  );
});

test('accepts valid multibyte JSON with a charset parameter within the byte limit', async () => {
  const payload = { message: 'säkerhet '.repeat(100) };
  const request = new Request('https://juitnetsec.se/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  assert.deepEqual(await readJsonBody(request), payload);
});
