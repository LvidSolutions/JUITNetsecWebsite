import { Button, Container } from '../ui';

const signalPoints = [
  { label: 'Nätverk', className: 'left-[10%] top-[28%]' },
  { label: 'Moln', className: 'right-[12%] top-[18%]' },
  { label: 'Identitet', className: 'left-[22%] bottom-[20%]' },
  { label: 'Skydd', className: 'right-[18%] bottom-[26%]' },
];

export function Hero() {
  return (
    <section
      id="hem"
      className="relative isolate overflow-hidden bg-brand-black pb-20 pt-16 sm:pb-24 sm:pt-20 lg:min-h-[calc(100vh-5rem)] lg:pb-28 lg:pt-24"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(0,200,83,0.16),transparent_28%),linear-gradient(180deg,#050505_0%,#0A0A0A_100%)]" />
      <div className="hero-grid absolute inset-0 -z-10 opacity-35" />

      <Container className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-sm font-medium text-brand-green">
            Cybersäkerhet, nätverk och infrastruktur
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] text-brand-white sm:text-5xl lg:text-6xl">
            Trygg IT-säkerhet och robusta nätverk för moderna företag
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-mist sm:text-xl sm:leading-9">
            JUIT NetSec hjälper företag att bygga säkra, stabila och skalbara IT-miljöer genom expertis
            inom nätverk, cybersäkerhet, moln och infrastruktur.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/kontakt">Boka konsultation</Button>
            <Button href="/tjanster" variant="secondary">
              Se våra tjänster
            </Button>
          </div>
        </div>

        <div className="relative min-h-[22rem] sm:min-h-[28rem]" aria-hidden="true">
          <div className="absolute inset-0 rounded-card border border-brand-line bg-white/[0.025] shadow-glow" />
          <div className="absolute inset-6 rounded-card border border-brand-green/15" />
          <div className="absolute inset-x-10 top-1/2 h-px bg-gradient-to-r from-transparent via-brand-green/70 to-transparent" />
          <div className="absolute inset-y-10 left-1/2 w-px bg-gradient-to-b from-transparent via-brand-green/70 to-transparent" />
          <div className="hero-scan absolute inset-x-6 top-10 h-px bg-brand-green/70" />

          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-green/40 bg-brand-green/10 shadow-glow">
            <div className="absolute inset-4 rounded-full border border-brand-green/30" />
            <div className="absolute inset-[2.1rem] rounded-full bg-brand-green" />
          </div>

          {signalPoints.map((point) => (
            <div key={point.label} className={`absolute ${point.className}`}>
              <div className="flex items-center gap-3 rounded-card border border-brand-line bg-brand-black/85 px-3 py-2 text-xs font-medium text-brand-mist backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-brand-green shadow-glow" />
                {point.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
