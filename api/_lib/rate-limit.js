import { HttpError } from './errors.js';
import { getClientAddress, hashRateLimitIdentifier } from './request-security.js';

const TEMPORARY_UNAVAILABLE = 'The contact form is temporarily unavailable.';

export async function consumeContactRateLimit({
  request,
  upstashUrl,
  upstashToken,
  hashSecret,
  max = 5,
  windowSeconds = 900,
  now = Date.now(),
  fetchImpl = fetch,
}) {
  const addressHash = hashRateLimitIdentifier(getClientAddress(request), hashSecret);
  const unixSeconds = Math.floor(now / 1000);
  const windowId = Math.floor(unixSeconds / windowSeconds);
  const redisKey = `juit:contact:${windowId}:${addressHash}`;

  let response;
  try {
    response = await fetchImpl(`${upstashUrl}/multi-exec`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${upstashToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', redisKey],
        ['EXPIRE', redisKey, windowSeconds * 2],
      ]),
      signal: AbortSignal.timeout(5_000),
    });
  } catch {
    throw new HttpError(503, TEMPORARY_UNAVAILABLE);
  }

  if (!response.ok) {
    throw new HttpError(503, TEMPORARY_UNAVAILABLE);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new HttpError(503, TEMPORARY_UNAVAILABLE);
  }

  if (!Array.isArray(result) || result[0]?.error || !Number.isFinite(Number(result[0]?.result))) {
    throw new HttpError(503, TEMPORARY_UNAVAILABLE);
  }

  const count = Number(result[0].result);
  const retryAfter = Math.max(1, windowSeconds - (unixSeconds % windowSeconds));

  return {
    allowed: count <= max,
    remaining: Math.max(0, max - count),
    retryAfter,
  };
}
