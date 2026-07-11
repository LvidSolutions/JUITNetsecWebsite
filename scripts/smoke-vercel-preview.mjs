const baseUrl = process.env.PREVIEW_URL?.replace(/\/$/, '');
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim() || '';
const routes = ['/', '/tjanster', '/om-oss', '/kontakt', '/api/health'];
const requiredHeaders = new Map([
  ['x-content-type-options', 'nosniff'],
  ['x-frame-options', 'DENY'],
  ['referrer-policy', 'strict-origin-when-cross-origin'],
]);

if (!baseUrl) {
  console.error('PREVIEW_URL is required.');
  process.exit(1);
}

const requestHeaders = bypassSecret
  ? {
      'x-vercel-protection-bypass': bypassSecret,
      'x-vercel-set-bypass-cookie': 'true',
    }
  : {};

async function request(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    return await fetch(`${baseUrl}${path}`, {
      headers: requestHeaders,
      redirect: 'follow',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

const probe = await request('/api/health');

if ((probe.status === 401 || probe.status === 403) && !bypassSecret) {
  console.log(
    `::warning title=Vercel Preview is protected::The deployment returned HTTP ${probe.status}. ` +
      'The exact commit deployed successfully, but live route checks require a VERCEL_AUTOMATION_BYPASS_SECRET repository secret.',
  );
  process.exit(0);
}

if (probe.status !== 200) {
  console.error(`Preview health check returned HTTP ${probe.status}.`);
  process.exit(1);
}

for (const route of routes) {
  const response = route === '/api/health' ? probe : await request(route);

  if (response.status !== 200) {
    console.error(`Preview returned HTTP ${response.status} for ${route}.`);
    process.exit(1);
  }
}

const page = await request('/kontakt');
for (const [name, expectedValue] of requiredHeaders) {
  const actualValue = page.headers.get(name);
  if (actualValue?.toLowerCase() !== expectedValue.toLowerCase()) {
    console.error(
      `Missing or incorrect ${name} header. Expected "${expectedValue}", received "${actualValue || 'missing'}".`,
    );
    process.exit(1);
  }
}

if (!page.headers.get('permissions-policy')) {
  console.error('Missing permissions-policy header.');
  process.exit(1);
}

console.log(`Vercel Preview smoke test passed for ${routes.length} routes and required security headers.`);
