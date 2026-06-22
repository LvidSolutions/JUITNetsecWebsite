import { Card, Container, Section, SectionHeading } from '../ui';

const values = [
  'Säkerhet först',
  'Tydlig kommunikation',
  'Teknisk kvalitet',
  'Långsiktiga lösningar',
];

const processSteps = [
  {
    title: 'Analys',
    text: 'Vi kartlägger nuläge, risker och affärsbehov.',
  },
  {
    title: 'Strategi',
    text: 'Vi tar fram en tydlig teknisk plan.',
  },
  {
    title: 'Implementation',
    text: 'Vi bygger, konfigurerar och säkrar miljön.',
  },
  {
    title: 'Förvaltning',
    text: 'Vi hjälper till med optimering, dokumentation och vidareutveckling.',
  },
];

export function AboutSection() {
  return (
    <Section id="om-oss" className="bg-brand-black">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Om oss</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-brand-white sm:text-4xl">
              Specialister inom säker IT-infrastruktur
            </h2>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-brand-mist">
            JUIT NetSec AB är ett IT-konsultföretag med fokus på nätverk, cybersäkerhet och robust
            infrastruktur. Vi hjälper företag att minska risker, stärka sin tekniska miljö och fatta bättre
            beslut kring säkerhet och drift.
          </p>
        </div>

        <div className="mt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Värderingar</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card
                key={value}
                className="min-h-40 bg-white/[0.035]"
              >
                <div className="mb-6 h-1 w-12 rounded-full bg-brand-green" />
                <h3 className="text-xl font-semibold leading-7 text-brand-white">{value}</h3>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading
            eyebrow="Process"
            title="En tydlig process från analys till förvaltning"
            align="left"
            className="text-brand-white"
          />

          <div className="relative mt-12 grid gap-5 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-brand-green/70 via-brand-line to-transparent lg:block" />
            {processSteps.map((step, index) => (
              <div key={step.title} className="relative">
                <Card className="h-full bg-brand-ink">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-brand-green/35 bg-brand-black text-sm font-semibold text-brand-green shadow-glow">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-semibold text-brand-white">{step.title}</h3>
                  <p className="mt-4 leading-7 text-brand-mist">{step.text}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
