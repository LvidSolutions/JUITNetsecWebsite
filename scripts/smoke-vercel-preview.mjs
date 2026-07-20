import process from 'node:process';

const rawUrl = process.env.VERCEL_PREVIEW_URL || process.env.PREVIEW_URL || '';
if (!rawUrl) {
  console.error('Set VERCEL_PREVIEW_URL or PREVIEW_URL before running the preview smoke test.');
  process.exit(1);
}

const origin = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`).origin;
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '';
const headers = bypassSecret ? { 'x-vercel-protection-bypass': bypassSecret } : {};
const routes = ['/', '/tjanster', '/om-oss', '/kontakt', '/api/health', '/robots.txt', '/sitemap.xml'];

for (const route of routes) {
  const response = await fetch(`${origin}${route}`, {
    headers,
    redirect: 'manual',
    signal: AbortSignal.timeout(10_000),
  });

  if ((response.status === 401 || response.status === 403) && !bypassSecret) {
    throw new Error(
      `${route} is protected by Vercel Deployment Protection. Configure VERCEL_AUTOMATION_BYPASS_SECRET for automated verification.`,
    );
  }

  if (!response.ok) throw new Error(`${route} returned HTTP ${response.status}`);
}

console.log(`Vercel preview smoke test passed for ${routes.length} routes at ${origin}.`);
