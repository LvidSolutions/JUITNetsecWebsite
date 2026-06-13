import { Card, Container, Section } from '../ui';

const trustPoints = [
  'Senior IT-kompetens',
  'Fokus på säkerhet och tillgänglighet',
  'Lösningar anpassade för verksamhetskritiska miljöer',
  'Strategisk rådgivning och praktisk implementation',
];

export function TrustSection() {
  return (
    <Section className="border-y border-brand-line bg-brand-ink py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Varför JUIT NetSec</p>
            <h2 className="mt-4 max-w-xl text-2xl font-semibold leading-tight text-brand-white sm:text-3xl">
              Trygg partner för kritiska IT-miljöer.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {trustPoints.map((point, index) => (
              <Card
                key={point}
                className="group min-h-36 border-brand-line bg-white/[0.035] hover:border-brand-green/55 hover:bg-white/[0.055]"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-card border border-brand-green/30 bg-brand-green/10 text-sm font-semibold text-brand-green transition-colors duration-200 group-hover:bg-brand-green group-hover:text-brand-black">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <p className="text-lg font-semibold leading-7 text-brand-white">{point}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
