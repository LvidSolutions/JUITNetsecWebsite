import { ConfigurationError } from './errors.js';

function splitCsv(value = '') {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function readPositiveInteger(value, fallback, { min, max }) {
  if (value === undefined || value === '') return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new ConfigurationError([`invalid numeric value: ${value}`]);
  }
  return parsed;
}

function requireSingleLine(env, key, maxLength = 512) {
  const value = env[key]?.trim();
  if (!value) throw new ConfigurationError([key]);
  if (value.length > maxLength || /[\r\n]/u.test(value)) {
    throw new ConfigurationError([`${key} has an invalid value`]);
  }
  return value;
}

function readHttpsUrl(env, key) {
  const value = requireSingleLine(env, key, 2048);
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new ConfigurationError([`${key} must be a valid URL`]);
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new ConfigurationError([`${key} must be a credential-free HTTPS URL`]);
  }
  return url.href.replace(/\/$/u, '');
}

function readAllowedHostnames(value) {
  const hostnames = splitCsv(value).map((hostname) => hostname.toLowerCase());
  for (const hostname of hostnames) {
    if (
      hostname.length > 253 ||
      hostname.includes('://') ||
      hostname.includes('/') ||
      hostname.includes('*') ||
      !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/u.test(hostname)
    ) {
      throw new ConfigurationError([`invalid Turnstile hostname: ${hostname}`]);
    }
  }
  return [...new Set(hostnames)];
}

function readRecipientEmail(env) {
  const email = requireSingleLine(env, 'CONTACT_TO_EMAIL', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) {
    throw new ConfigurationError(['CONTACT_TO_EMAIL must be a valid email address']);
  }
  return email;
}

export function loadContactConfig(env = process.env) {
  const enabled = env.CONTACT_FORM_ENABLED === 'true';
  const environment = env.VERCEL_ENV || env.NODE_ENV || 'development';

  if (!enabled) {
    return {
      enabled: false,
      environment,
    };
  }

  const resendApiKey = requireSingleLine(env, 'RESEND_API_KEY');
  const fromEmail = requireSingleLine(env, 'CONTACT_FROM_EMAIL', 320);
  const toEmail = readRecipientEmail(env);
  const turnstileSecretKey = requireSingleLine(env, 'TURNSTILE_SECRET_KEY');
  const upstashUrl = readHttpsUrl(env, 'UPSTASH_REDIS_REST_URL');
  const upstashToken = requireSingleLine(env, 'UPSTASH_REDIS_REST_TOKEN', 4096);
  const rateLimitHashSecret = requireSingleLine(env, 'RATE_LIMIT_HASH_SECRET', 4096);

  if (rateLimitHashSecret.length < 32) {
    throw new ConfigurationError(['RATE_LIMIT_HASH_SECRET must be at least 32 characters']);
  }

  return {
    enabled: true,
    environment,
    resendApiKey,
    fromEmail,
    toEmail,
    turnstileSecretKey,
    allowedTurnstileHostnames: readAllowedHostnames(env.TURNSTILE_ALLOWED_HOSTNAMES),
    upstashUrl,
    upstashToken,
    rateLimitHashSecret,
    rateLimitMax: readPositiveInteger(env.CONTACT_RATE_LIMIT_MAX, 5, { min: 1, max: 50 }),
    rateLimitEmailMax: readPositiveInteger(env.CONTACT_RATE_LIMIT_EMAIL_MAX, 2, { min: 1, max: 20 }),
    rateLimitWindowSeconds: readPositiveInteger(env.CONTACT_RATE_LIMIT_WINDOW_SECONDS, 900, {
      min: 60,
      max: 86_400,
    }),
  };
}
