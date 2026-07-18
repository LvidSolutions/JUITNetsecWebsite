import { domainToASCII } from 'node:url';
import { HttpError } from './errors.js';

const ALLOWED_KEYS = new Set(['name', 'email', 'phone', 'message', 'website', 'turnstileToken', 'submissionId', 'formStartedAt']);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const GENERIC_ERROR = 'Please check the form fields and try again.';

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function readString(value, { required = false, min = 0, max }) {
  if (value === undefined || value === null) {
    if (required) throw new HttpError(400, GENERIC_ERROR);
    return '';
  }
  if (typeof value !== 'string') throw new HttpError(400, GENERIC_ERROR);
  const normalized = value.replace(/\u0000/g, '').trim();
  if ((required && !normalized) || normalized.length < min || normalized.length > max) throw new HttpError(400, GENERIC_ERROR);
  return normalized;
}

export function normalizeAndValidateEmail(value) {
  const email = readString(value, { required: true, min: 3, max: 254 });
  if (/\s/u.test(email)) throw new HttpError(400, GENERIC_ERROR);
  const separator = email.lastIndexOf('@');
  if (separator < 1 || separator !== email.indexOf('@')) throw new HttpError(400, GENERIC_ERROR);
  const local = email.slice(0, separator);
  const rawDomain = email.slice(separator + 1);
  if (local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) throw new HttpError(400, GENERIC_ERROR);
  const domain = domainToASCII(rawDomain).toLowerCase();
  if (!domain || domain.length > 253 || domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) throw new HttpError(400, GENERIC_ERROR);
  const labels = domain.split('.');
  if (labels.length < 2 || labels.some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/iu.test(label))) throw new HttpError(400, GENERIC_ERROR);
  return `${local}@${domain}`;
}

function validatePhone(value) {
  const phone = readString(value, { max: 40 });
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (!/^[+()\-\s\d.]+$/u.test(phone) || digits.length < 6 || digits.length > 20) throw new HttpError(400, GENERIC_ERROR);
  return phone;
}

export function validateContactSubmission(input, now = Date.now()) {
  if (!isPlainObject(input)) throw new HttpError(400, GENERIC_ERROR);
  if (Object.keys(input).some((key) => !ALLOWED_KEYS.has(key))) throw new HttpError(400, GENERIC_ERROR);
  const startedAt = Number(input.formStartedAt);
  if (!Number.isFinite(startedAt) || startedAt > now + 5_000 || now - startedAt < 900 || now - startedAt > 7_200_000) throw new HttpError(400, GENERIC_ERROR);

  const submission = {
    name: readString(input.name, { required: true, min: 2, max: 100 }),
    email: normalizeAndValidateEmail(input.email),
    phone: validatePhone(input.phone),
    message: readString(input.message, { required: true, min: 10, max: 5000 }),
    website: readString(input.website, { max: 200 }),
    turnstileToken: readString(input.turnstileToken, { required: true, min: 1, max: 2048 }),
    submissionId: readString(input.submissionId, { required: true, min: 36, max: 36 }),
  };
  if (!UUID_PATTERN.test(submission.submissionId)) throw new HttpError(400, GENERIC_ERROR);
  return submission;
}

async function readBoundedBody(request, maxBytes) {
  const contentLength = Number.parseInt(request.headers.get('content-length') || '', 10);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) throw new HttpError(413, 'The request is too large.');
  if (!request.body) return '';
  const reader = request.body.getReader(); const chunks = []; let totalBytes = 0;
  try {
    while (true) { const { done, value } = await reader.read(); if (done) break; totalBytes += value.byteLength; if (totalBytes > maxBytes) { await reader.cancel('body limit exceeded').catch(() => {}); throw new HttpError(413, 'The request is too large.'); } chunks.push(value); }
  } finally { reader.releaseLock(); }
  const body = new Uint8Array(totalBytes); let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(body);
}

export async function readJsonBody(request, maxBytes = 20 * 1024) {
  const mediaType = (request.headers.get('content-type') || '').split(';', 1)[0].trim().toLowerCase();
  if (mediaType !== 'application/json') throw new HttpError(415, 'Unsupported content type.');
  try { return JSON.parse(await readBoundedBody(request, maxBytes)); } catch (error) { if (error instanceof HttpError) throw error; throw new HttpError(400, 'Invalid request.'); }
}
