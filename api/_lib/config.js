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

export function loadContactConfig(env = process.env) {
  const enabled = env.CONTACT_FORM_ENABLED === 'true';

  if (!enabled) {
    return {
      enabled: false,
      environment: env.VERCEL_ENV || env.NODE_ENV || 'development',
    };
  }

  const requiredKeys = [
    'RESEND_API_KEY',
    'CONTACT_FROM_EMAIL',
    'CONTACT_TO_EMAIL',
    'TURNSTILE_SECRET_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'RATE_LIMIT_HASH_SECRET',
  ];

  const missingKeys = requiredKeys.filter((key) => !env[key]?.trim());
  if (missingKeys.length > 0) throw new ConfigurationError(missingKeys);

  if (env.RATE_LIMIT_HASH_SECRET.trim().length < 32) {
    throw new ConfigurationError(['RATE_LIMIT_HASH_SECRET must be at least 32 characters']);
  }

  return {
    enabled: true,
    environment: env.VERCEL_ENV || env.NODE_ENV || 'development',
    resendApiKey: env.RESEND_API_KEY.trim(),
    fromEmail: env.CONTACT_FROM_EMAIL.trim(),
    toEmail: env.CONTACT_TO_EMAIL.trim(),
    turnstileSecretKey: env.TURNSTILE_SECRET_KEY.trim(),
    allowedOrigins: splitCsv(env.ALLOWED_ORIGINS),
    allowedTurnstileHostnames: splitCsv(env.TURNSTILE_ALLOWED_HOSTNAMES),
    upstashUrl: env.UPSTASH_REDIS_REST_URL.trim().replace(/\/$/, ''),
    upstashToken: env.UPSTASH_REDIS_REST_TOKEN.trim(),
    rateLimitHashSecret: env.RATE_LIMIT_HASH_SECRET.trim(),
    rateLimitMax: readPositiveInteger(env.CONTACT_RATE_LIMIT_MAX, 5, { min: 1, max: 50 }),
    rateLimitWindowSeconds: readPositiveInteger(env.CONTACT_RATE_LIMIT_WINDOW_SECONDS, 900, {
      min: 60,
      max: 86_400,
    }),
  };
}
