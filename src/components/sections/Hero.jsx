import { Button, Container } from '../ui';

const heroPillars = ['Nätverk', 'Cybersäkerhet', 'Moln', 'Zero trust'];

const signalNodes = [
  { label: 'Brandvägg', className: 'left-[9%] top-[20%]' },
  { label: 'Identitet', className: 'right-[8%] top-[18%]' },
  { label: 'Moln', className: 'left-[14%] bottom-[18%]' },
  { label: 'Datacenter', className: 'right-[10%] bottom-[22%]' },
];

const statusRows = [
  { label: 'Segmentering', value: 'Kontrollerad' },
  { label: 'Tillgänglighet', value: 'Stabil' },
  { label: 'Riskbild', value: 'Synlig' },
];

const proofPoints = [
  'Senior säkerhetsarkitektur',
  'Robusta nätverksmiljöer',
  'Praktisk implementation',
];

export function Hero() {
  return (
    <section
      id="hem"
      className="relative isolate overflow-hidden bg-brand-black pb-20 pt-14 sm:pb-24 sm:pt-20 lg:min-h-[calc(100vh-5rem)] lg:pb-24 lg:pt-20"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(0,200,83,0.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_22%),linear-gradient(180deg,#050505_0%,#0A0A0A_100%)]" />
      <div className="hero-grid absolute inset-0 -z-10 opacity-45" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-brand-green/70 to-transparent" />

      <Container className="grid items-center gap-14 lg:grid-cols-[0.96fr_1.04fr]">
        <div className="max-w-4xl">
          <p className="mb-5 inline-flex rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-sm font-medium text-brand-green shadow-glow">
            Säker IT-infrastruktur för verksamhetskritiska miljöer
          </p>
          <h1 className="max-w-5xl text-4xl font-semibold leading-[1.04] text-brand-white sm:text-5xl lg:text-7xl">
            Bygg ett nätverk som håller när hotbilden skärps
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-brand-mist sm:text-xl sm:leading-9">
            JUIT NetSec hjälper företag att skapa kontrollerad risk, stabil drift och tydlig teknisk
            riktning genom senior expertis inom nätverk, cybersäkerhet, moln och infrastruktur.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {heroPillars.map((pillar) => (
              <span
                key={pillar}
                className="rounded-full border border-brand-line bg-white/[0.035] px-4 py-2 text-sm font-medium text-brand-mist"
              >
                {pillar}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/kontakt">Boka konsultation</Button>
            <Button href="/tjanster" variant="secondary">
              Se våra tjänster
            </Button>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {proofPoints.map((point) => (
              <div key={point} className="border-l border-brand-green/60 pl-4">
                <p className="text-sm font-semibold text-brand-white">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[32rem] lg:min-h-[38rem]" aria-hidden="true">
          <div className="absolute inset-0 rounded-card border border-brand-line bg-white/[0.025] shadow-glow" />
          <div className="absolute inset-4 rounded-card border border-brand-green/15 bg-brand-black/35 backdrop-blur" />
          <div className="hero-scan absolute inset-x-6 top-10 h-px bg-brand-green/70" />

          <div className="absolute left-6 right-6 top-6 flex items-center justify-between rounded-card border border-brand-line bg-brand-black/80 px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">JUIT NetSec</p>
              <p className="mt-1 text-sm font-semibold text-brand-white">Control layer</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-brand-mist">
              <span className="h-2 w-2 rounded-full bg-brand-green shadow-glow" />
              Aktivt skydd
            </div>
          </div>

          <div className="absolute left-1/2 top-[48%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-green/35 bg-brand-green/10 shadow-glow">
            <div className="hero-orbit absolute inset-4 rounded-full border border-brand-green/25" />
            <div className="absolute inset-12 rounded-full border border-brand-green/45 bg-brand-black" />
            <div className="absolute inset-[4.35rem] rounded-full bg-brand-green hero-pulse" />
          </div>

          <div className="absolute inset-x-12 top-[48%] h-px bg-gradient-to-r from-transparent via-brand-green/80 to-transparent" />
          <div className="absolute inset-y-20 left-1/2 w-px bg-gradient-to-b from-transparent via-brand-green/80 to-transparent" />

          {signalNodes.map((node) => (
            <div key={node.label} className={`absolute ${node.className}`}>
              <div className="rounded-card border border-brand-line bg-brand-black/90 px-3 py-2 text-xs font-semibold text-brand-mist shadow-glow backdrop-blur">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-green" />
                {node.label}
              </div>
            </div>
          ))}

          <div className="absolute bottom-6 left-6 right-6 grid gap-3 sm:grid-cols-3">
            {statusRows.map((row) => (
              <div key={row.label} className="rounded-card border border-brand-line bg-brand-black/85 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">{row.label}</p>
                <p className="mt-2 text-sm font-semibold text-brand-white">{row.value}</p>
              </div>
            ))}
          </div>

          <div className="absolute right-10 top-24 hidden w-44 rounded-card border border-brand-green/25 bg-brand-black/80 p-4 backdrop-blur sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">Incidentyta</p>
            <div className="mt-4 space-y-3">
              <div className="h-2 rounded-full bg-brand-green" />
              <div className="h-2 w-3/4 rounded-full bg-brand-mist/30" />
              <div className="h-2 w-1/2 rounded-full bg-brand-mist/20" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
