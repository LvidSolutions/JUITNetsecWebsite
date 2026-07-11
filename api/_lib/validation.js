import { HttpError } from './errors.js';

export const CONTACT_NEEDS = Object.freeze([
  'IT infrastructure',
  'Networking & communication',
  'Cybersecurity',
  'Computer operations',
  'IT advisory',
  'Technical project management',
  'Other',
]);

const ALLOWED_KEYS = new Set([
  'name',
  'company',
  'email',
  'phone',
  'need',
  'message',
  'website',
  'turnstileToken',
  'submissionId',
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function readString(value, { required = false, min = 0, max }) {
  if (value === undefined || value === null) {
    if (required) throw new HttpError(400, 'Please check the form fields and try again.');
    return '';
  }

  if (typeof value !== 'string') {
    throw new HttpError(400, 'Please check the form fields and try again.');
  }

  const normalized = value.replace(/\u0000/g, '').trim();
  if ((required && normalized.length === 0) || normalized.length < min || normalized.length > max) {
    throw new HttpError(400, 'Please check the form fields and try again.');
  }

  return normalized;
}

export function validateContactSubmission(input) {
  if (!isPlainObject(input)) {
    throw new HttpError(400, 'Please check the form fields and try again.');
  }

  for (const key of Object.keys(input)) {
    if (!ALLOWED_KEYS.has(key)) {
      throw new HttpError(400, 'Please check the form fields and try again.');
    }
  }

  const submission = {
    name: readString(input.name, { required: true, min: 2, max: 100 }),
    company: readString(input.company, { max: 120 }),
    email: readString(input.email, { required: true, min: 3, max: 254 }).toLowerCase(),
    phone: readString(input.phone, { max: 40 }),
    need: readString(input.need, { required: true, min: 1, max: 80 }),
    message: readString(input.message, { required: true, min: 10, max: 5000 }),
    website: readString(input.website, { max: 200 }),
    turnstileToken: readString(input.turnstileToken, { required: true, min: 1, max: 2048 }),
    submissionId: readString(input.submissionId, { required: true, min: 36, max: 36 }),
  };

  if (!EMAIL_PATTERN.test(submission.email)) {
    throw new HttpError(400, 'Please check the form fields and try again.');
  }

  if (!CONTACT_NEEDS.includes(submission.need)) {
    throw new HttpError(400, 'Please check the form fields and try again.');
  }

  if (!UUID_PATTERN.test(submission.submissionId)) {
    throw new HttpError(400, 'Please check the form fields and try again.');
  }

  return submission;
}

async function readBoundedBody(request, maxBytes) {
  const contentLength = Number.parseInt(request.headers.get('content-length') || '', 10);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new HttpError(413, 'The request is too large.');
  }

  if (!request.body) return '';

  const reader = request.body.getReader();
  const chunks = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel('body limit exceeded').catch(() => {});
        throw new HttpError(413, 'The request is too large.');
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(body);
}

export async function readJsonBody(request, maxBytes = 20 * 1024) {
  const contentType = request.headers.get('content-type') || '';
  const mediaType = contentType.split(';', 1)[0].trim().toLowerCase();
  if (mediaType !== 'application/json') {
    throw new HttpError(415, 'Unsupported content type.');
  }

  const raw = await readBoundedBody(request, maxBytes);

  try {
    return JSON.parse(raw);
  } catch {
    throw new HttpError(400, 'Invalid request.');
  }
}
