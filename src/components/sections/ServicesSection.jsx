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

const vendorCategories = [
  {
    name: 'New',
    description: 'Produkter, plattformar och leverantörer som kan ingå i moderna infrastruktur-, moln- och säkerhetsmiljöer.',
    vendors: [
      { name: 'VMware', url: 'https://www.vmware.com/', symbol: 'VM' },
      { name: 'Veeam', symbol: 'VE' },
      {
        name: 'Dell',
        url: 'https://www.dell.com/sv-se/shop/scc/sc/private-cloud-solutions',
        symbol: 'DE',
      },
      {
        name: 'Trend Micro',
        url: 'https://www.trendmicro.com/en_us/business.html',
        symbol: 'TM',
      },
      { name: 'Microsoft', url: 'https://www.microsoft.com', symbol: 'MS' },
      { name: 'Smart Cloud Solutions', symbol: 'SC' },
      { name: 'Microsoft Azure', symbol: 'AZ' },
      { name: 'AWS', symbol: 'AW' },
    ],
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

function VendorCard({ vendor }) {
  const content = (
    <Card
      variant="light"
      className="group flex min-h-44 flex-col justify-between border-black/10 hover:border-brand-green/45 hover:shadow-glow"
    >
      <ServiceSymbol>{vendor.symbol}</ServiceSymbol>
      <div>
        <h4 className="text-xl font-semibold leading-7 text-brand-ink">{vendor.name}</h4>
        <p className="mt-3 text-sm leading-6 text-brand-graphite">
          {vendor.url ? 'Besök leverantörens webbplats' : 'Leverantörskort'}
        </p>
      </div>
    </Card>
  );

  if (!vendor.url) {
    return content;
  }

  return (
    <a
      href={vendor.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Öppna ${vendor.name} i en ny flik`}
      className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-4 focus-visible:ring-offset-brand-white"
    >
      {content}
    </a>
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

        {vendorCategories.map((category) => (
          <div key={category.name} className="mt-16 border-t border-black/10 pt-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-brand-green">Bransch / kategori</p>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
                  {category.name}
                </h3>
              </div>
              <p className="max-w-2xl leading-7 text-brand-graphite md:text-right">{category.description}</p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.vendors.map((vendor) => (
                <VendorCard key={vendor.name} vendor={vendor} />
              ))}
            </div>
          </div>
        ))}
      </Container>
    </Section>
  );
}
