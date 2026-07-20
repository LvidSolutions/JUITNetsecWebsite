const ROUTES = ['/', '/tjanster', '/om-oss', '/about', '/kontakt', '/contact'];

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function GET(request) {
  const origin = new URL(request.url).origin;
  const urls = ROUTES.map((route) => `  <url><loc>${escapeXml(new URL(route, origin).href)}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': process.env.VERCEL_ENV === 'production'
        ? 'public, s-maxage=3600, stale-while-revalidate=86400'
        : 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...(process.env.VERCEL_ENV === 'production' ? {} : { 'X-Robots-Tag': 'noindex, nofollow' }),
    },
  });
}
