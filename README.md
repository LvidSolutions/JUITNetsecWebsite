# JUIT NetSec AB

React/Vite-webbplats för JUIT NetSec AB med Vercel Functions för kontaktformulär, hälsokontroll och teknisk SEO.

## Teknik

- React 19 och Vite 7
- Tailwind CSS och Framer Motion
- Vercel Functions under `api/`
- Resend för e-postleverans
- Cloudflare Turnstile för botskydd
- Upstash Redis för distribuerad rate limiting
- Node.js 24

Ingen separat databas, publik inloggning, betalningslösning eller filuppladdning används eftersom webbplatsens nuvarande funktioner inte kräver det.

## Kom igång

```bash
npm ci
npm run dev
```

Produktions- och säkerhetskontroller:

```bash
npm run check
```

Browserkontroller:

```bash
npx playwright install chromium
npm run test:visual
```

## Struktur

- `src/components/ui` – återanvändbara grundkomponenter
- `src/components/contact` – kontaktupplevelse och formulär
- `src/styles/index.css` – global styling och Tailwind-lager
- `api/` – Vercel Functions och server-only moduler
- `test/` – API-, säkerhets- och konfigurationstester
- `e2e/` – Playwright smoke tests
- `scripts/` – lint, buildrapport och smoke tests
- `docs/BACKEND_DEPLOYMENT.md` – backendarkitektur, miljövariabler och lanseringsguide

## Deployment

Den anslutna produktionsbranchen är `merge`. Alla hemligheter ska ligga i Vercels Environment Variables och aldrig i Git. Kopiera endast variabelnamn från `.env.example`.

Läs [backend- och deploymentguiden](docs/BACKEND_DEPLOYMENT.md) innan kontaktformuläret aktiveras i Preview eller Production.
