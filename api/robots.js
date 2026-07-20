function textResponse(body, cacheControl) {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export function GET(request) {
  const production = process.env.VERCEL_ENV === 'production';
  if (!production) {
    return textResponse('User-agent: *\nDisallow: /\n', 'no-store');
  }

  const origin = new URL(request.url).origin;
  return textResponse(
    `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
    'public, s-maxage=3600, stale-while-revalidate=86400',
  );
}
