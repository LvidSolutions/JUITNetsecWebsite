import { Button, Container } from '../ui';

const heroPillars = ['CYBERSÄKERHET', 'NÄTVERK', 'INFRASTRUKTUR'];

const proofPoints = [
  { value: 'Senior', label: 'IT-kompetens' },
  { value: '24/7', label: 'Säkerhetsfokus' },
  { value: 'Skalbart', label: 'från nätverk till moln' },
];

const floatingPanels = [
  {
    title: 'Perimeter Defense',
    meta: 'Firewall policy',
    status: 'Hardened',
    className: 'left-2 top-10 w-64 hero-float-slow',
    bars: ['w-11/12', 'w-8/12', 'w-10/12'],
  },
  {
    title: 'Identity Layer',
    meta: 'Zero trust',
    status: 'Verified',
    className: 'right-0 top-28 w-56 hero-float-medium',
    bars: ['w-7/12', 'w-11/12', 'w-6/12'],
  },
  {
    title: 'Network Core',
    meta: 'Segmentation',
    status: 'Stable',
    className: 'bottom-16 left-8 w-60 hero-float-medium',
    bars: ['w-10/12', 'w-5/12', 'w-9/12'],
  },
  {
    title: 'Cloud Edge',
    meta: 'Hybrid access',
    status: 'Monitored',
    className: 'bottom-6 right-6 hidden w-64 hero-float-slow sm:block',
    bars: ['w-9/12', 'w-7/12', 'w-11/12'],
  },
];

const matrixRows = ['AUTH OK', 'FW RULE', 'TLS 1.3', 'EDR SYNC', 'VPN UP', 'LOG FLOW'];

function CTAButtons() {
  return (
    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
      <Button href="/kontakt" className="group shadow-glow">
        Boka konsultation
        <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
          →
        </span>
      </Button>
      <Button href="/tjanster" variant="secondary" className="bg-white/[0.03] backdrop-blur hover:bg-brand-green/10">
        Se våra tjänster
      </Button>
    </div>
  );
}

function HeroStats() {
  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-3">
      {proofPoints.map((point) => (
        <div
          key={point.label}
          className="rounded-card border border-brand-line bg-white/[0.035] p-4 backdrop-blur transition duration-300 hover:border-brand-green/50 hover:bg-brand-green/[0.07]"
        >
          <p className="text-lg font-semibold text-brand-white">{point.value}</p>
          <p className="mt-1 text-sm text-brand-mist">{point.label}</p>
        </div>
      ))}
    </div>
  );
}

function FloatingPanel({ panel }) {
  return (
    <div
      className={`absolute ${panel.className} rounded-card border border-brand-line bg-brand-black/70 p-4 shadow-glow backdrop-blur-xl`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">{panel.meta}</p>
          <p className="mt-2 text-sm font-semibold text-brand-white">{panel.title}</p>
        </div>
        <span className="rounded-full border border-brand-green/30 bg-brand-green/10 px-2 py-1 text-[0.65rem] font-semibold text-brand-green">
          {panel.status}
        </span>
      </div>
      <div className="mt-5 space-y-2">
        {panel.bars.map((bar, index) => (
          <div key={`${panel.title}-${bar}-${index}`} className="h-2 rounded-full bg-white/10">
            <div className={`h-full rounded-full bg-brand-green/70 ${bar}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(0,200,83,0.28),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(0,200,83,0.16),transparent_26%),radial-gradient(circle_at_55%_100%,rgba(255,255,255,0.08),transparent_34%),linear-gradient(135deg,#050505_0%,#07110b_46%,#020302_100%)]" />
      <div className="hero-grid absolute inset-0 opacity-50" />
      <div className="hero-network absolute inset-0 opacity-70" />
      <div className="hero-marquee absolute left-0 top-32 flex w-[200%] gap-6 opacity-20">
        {Array.from({ length: 2 }).map((_, groupIndex) => (
          <div key={groupIndex} className="flex w-1/2 shrink-0 gap-6 text-xs font-semibold uppercase tracking-[0.28em] text-brand-green">
            {matrixRows.map((row) => (
              <span key={`${groupIndex}-${row}`} className="whitespace-nowrap rounded-full border border-brand-green/25 bg-brand-green/10 px-4 py-2">
                {row}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-brand-green/20 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent" />
    </div>
  );
}

function FloatingMediaCards() {
  return (
    <div className="relative min-h-[31rem] sm:min-h-[35rem] lg:min-h-[42rem]" aria-hidden="true">
      <div className="absolute inset-0 rounded-[1.25rem] border border-brand-line bg-white/[0.025] shadow-glow" />
      <div className="absolute inset-4 rounded-[1rem] border border-brand-green/15 bg-brand-black/35 backdrop-blur" />
      <div className="hero-scan absolute inset-x-8 top-10 h-px bg-brand-green/80" />

      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-green/25 bg-brand-green/10 shadow-glow sm:h-80 sm:w-80">
        <div className="hero-orbit absolute inset-5 rounded-full border border-dashed border-brand-green/35" />
        <div className="hero-orbit-reverse absolute inset-14 rounded-full border border-brand-green/20" />
        <div className="absolute inset-24 rounded-full border border-brand-green/40 bg-brand-black/80" />
        <div className="hero-pulse absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green" />
      </div>

      <div className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-brand-green/70 to-transparent" />
      <div className="absolute inset-y-12 left-1/2 w-px bg-gradient-to-b from-transparent via-brand-green/70 to-transparent" />

      {floatingPanels.map((panel) => (
        <FloatingPanel key={panel.title} panel={panel} />
      ))}

      <div className="absolute left-6 right-6 top-6 flex items-center justify-between rounded-card border border-brand-line bg-brand-black/80 px-4 py-3 backdrop-blur-xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">JUIT NetSec</p>
          <p className="mt-1 text-sm font-semibold text-brand-white">Live security cockpit</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-brand-mist">
          <span className="h-2 w-2 rounded-full bg-brand-green shadow-glow" />
          Aktivt skydd
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hem"
      className="relative isolate -mt-20 overflow-hidden bg-brand-black pb-20 pt-28 sm:pb-24 sm:pt-32 lg:min-h-screen lg:pb-28 lg:pt-36"
    >
      <HeroBackground />

      <Container className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10 max-w-4xl">
          <div className="mb-5 flex flex-wrap gap-2">
            {heroPillars.map((pillar) => (
              <span
                key={pillar}
                className="rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-brand-green shadow-glow backdrop-blur"
              >
                {pillar}
              </span>
            ))}
          </div>

          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-brand-green/90">
            Cybersäkerhet, nätverk och robust infrastruktur
          </p>
          <h1 className="max-w-5xl text-4xl font-semibold leading-[1.02] text-brand-white sm:text-6xl lg:text-7xl">
            Trygg IT-säkerhet och robusta nätverk för moderna företag
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-brand-mist sm:text-xl sm:leading-9">
            JUIT NetSec hjälper företag att bygga säkra, stabila och skalbara IT-miljöer genom expertis inom
            nätverk, cybersäkerhet, moln och infrastruktur.
          </p>

          <CTAButtons />
          <HeroStats />
        </div>

        <FloatingMediaCards />
      </Container>
    </section>
  );
}
