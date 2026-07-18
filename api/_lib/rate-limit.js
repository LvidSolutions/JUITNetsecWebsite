import { HttpError } from './errors.js';
import { getClientAddress, hashRateLimitIdentifier } from './request-security.js';
const TEMPORARY_UNAVAILABLE = 'The contact form is temporarily unavailable.';

export async function consumeContactRateLimit({ request, email, upstashUrl, upstashToken, hashSecret, max = 5, emailMax = 2, windowSeconds = 900, now = Date.now(), fetchImpl = fetch }) {
  const windowId = Math.floor(Math.floor(now / 1000) / windowSeconds);
  const addressHash = hashRateLimitIdentifier(getClientAddress(request), hashSecret);
  const emailHash = hashRateLimitIdentifier(email, hashSecret);
  const keys = [`juit:contact:ip:${windowId}:${addressHash}`, `juit:contact:email:${windowId}:${emailHash}`];
  let response;
  try { response = await fetchImpl(`${upstashUrl}/multi-exec`, { method: 'POST', headers: { Authorization: `Bearer ${upstashToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify([['INCR', keys[0]], ['EXPIRE', keys[0], windowSeconds * 2], ['INCR', keys[1]], ['EXPIRE', keys[1], windowSeconds * 2]]), signal: AbortSignal.timeout(5_000) }); } catch { throw new HttpError(503, TEMPORARY_UNAVAILABLE); }
  if (!response.ok) throw new HttpError(503, TEMPORARY_UNAVAILABLE);
  let result; try { result = await response.json(); } catch { throw new HttpError(503, TEMPORARY_UNAVAILABLE); }
  if (!Array.isArray(result) || [0, 2].some((index) => result[index]?.error || !Number.isFinite(Number(result[index]?.result)))) throw new HttpError(503, TEMPORARY_UNAVAILABLE);
  const ipCount = Number(result[0].result); const emailCount = Number(result[2].result);
  const retryAfter = Math.max(1, windowSeconds - (Math.floor(now / 1000) % windowSeconds));
  return { allowed: ipCount <= max && emailCount <= emailMax, remaining: Math.max(0, max - ipCount), retryAfter };
}
