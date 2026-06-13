import { Card, Container, Section, SectionHeading } from '../ui';

const services = [
  {
    title: 'Nätverk & infrastruktur',
    text: 'Design, implementation och optimering av stabila och säkra nätverksmiljöer.',
    symbol: 'NI',
  },
  {
    title: 'Cybersäkerhet',
    text: 'Skydd av system, användare och data genom moderna säkerhetslösningar och tydliga processer.',
    symbol: 'CS',
  },
  {
    title: 'Brandväggar & säkerhetsarkitektur',
    text: 'Rådgivning, implementation och förvaltning av brandväggar, segmentering och zero-trust-principer.',
    symbol: 'SA',
  },
  {
    title: 'Moln & datacenter',
    text: 'Säkra och skalbara lösningar för moln, hybridmiljöer och datacenter.',
    symbol: 'MD',
  },
  {
    title: 'Automation',
    text: 'Effektivisera drift och konfiguration med automation, dokumentation och smarta arbetsflöden.',
    symbol: 'AU',
  },
  {
    title: 'IT-konsulting',
    text: 'Senior teknisk expertis för projekt, upphandlingar, implementationer och strategiska beslut.',
    symbol: 'IT',
  },
];

function ServiceSymbol({ children }) {
  return (
    <div className="relative mb-6 h-12 w-12 rounded-card border border-brand-green/30 bg-brand-green/10 text-brand-green transition-colors duration-200 group-hover:border-brand-green group-hover:bg-brand-green group-hover:text-brand-black">
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{children}</span>
      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-brand-green shadow-glow" />
    </div>
  );
}

export function ServicesSection() {
  return (
    <Section id="tjanster" tone="light" className="bg-brand-white">
      <Container>
        <SectionHeading
          eyebrow="Tjänster"
          title="IT-säkerhet och infrastruktur som stärker din verksamhet"
          text="Vi hjälper företag att planera, bygga och säkra tekniska miljöer som är stabila, skalbara och redo för framtiden."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.title}
              variant="light"
              className="group min-h-64 border-black/10 hover:border-brand-green/45 hover:shadow-glow"
            >
              <ServiceSymbol>{service.symbol}</ServiceSymbol>
              <h3 className="text-xl font-semibold leading-7 text-brand-ink">{service.title}</h3>
              <p className="mt-4 leading-7 text-brand-graphite">{service.text}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
