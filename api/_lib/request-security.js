import { createHmac } from 'node:crypto';
import { HttpError } from './errors.js';

function normalizeOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function assertSameOrigin(request) {
  const originHeader = request.headers.get('origin');
  if (!originHeader) {
    throw new HttpError(403, 'Request origin is not allowed.');
  }

  const requestOrigin = new URL(request.url).origin;
  const normalizedOrigin = normalizeOrigin(originHeader);

  if (!normalizedOrigin || normalizedOrigin !== requestOrigin) {
    throw new HttpError(403, 'Request origin is not allowed.');
  }
}

export function getClientAddress(request) {
  const forwarded =
    request.headers.get('x-vercel-forwarded-for') ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    '';

  const first = forwarded.split(',')[0]?.trim();
  return first || 'unknown';
}

export function hashRateLimitIdentifier(identifier, secret) {
  return createHmac('sha256', secret).update(identifier).digest('hex');
}
