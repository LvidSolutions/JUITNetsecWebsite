export function readPublicContactConfig(env = {}) {
  const enabled = env.VITE_CONTACT_FORM_ENABLED === 'true';
  const turnstileSiteKey = typeof env.VITE_TURNSTILE_SITE_KEY === 'string'
    ? env.VITE_TURNSTILE_SITE_KEY.trim()
    : '';

  return Object.freeze({
    enabled,
    turnstileSiteKey,
    configured: enabled && turnstileSiteKey.length > 0,
  });
}
