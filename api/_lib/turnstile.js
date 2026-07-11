const VERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile({
  secret,
  token,
  remoteIp,
  expectedAction = 'contact_form',
  allowedHostnames = [],
  fetchImpl = fetch,
}) {
  const form = new FormData();
  form.set('secret', secret);
  form.set('response', token);
  if (remoteIp && remoteIp !== 'unknown') form.set('remoteip', remoteIp);

  const response = await fetchImpl(VERIFY_ENDPOINT, {
    method: 'POST',
    body: form,
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) return false;

  const result = await response.json();
  if (result.success !== true) return false;
  if (expectedAction && result.action !== expectedAction) return false;

  if (allowedHostnames.length > 0) {
    const normalized = new Set(allowedHostnames.map((hostname) => hostname.trim().toLowerCase()).filter(Boolean));
    if (!result.hostname || !normalized.has(String(result.hostname).toLowerCase())) return false;
  }

  return true;
}
