const splitCsv = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

function requireEnv(env, key) {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function loadConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV || 'development';
  const turnstileSecretKey = env.TURNSTILE_SECRET_KEY?.trim() || '';

  return {
    nodeEnv,
    port: Number(env.PORT || 3000),
    host: env.HOST || '0.0.0.0',
    trustProxy: env.TRUST_PROXY === 'true',
    allowedOrigins: splitCsv(env.ALLOWED_ORIGINS),
    resendApiKey: requireEnv(env, 'RESEND_API_KEY'),
    fromEmail: requireEnv(env, 'FROM_EMAIL'),
    contactToEmail: env.CONTACT_TO_EMAIL?.trim() || 'info@juitnetsec.se',
    turnstileSecretKey,
    turnstileEnabled: Boolean(turnstileSecretKey),
  };
}
