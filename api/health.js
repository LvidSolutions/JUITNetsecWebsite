export function GET() {
  return Response.json(
    {
      ok: true,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || 'local',
    },
    {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  );
}
