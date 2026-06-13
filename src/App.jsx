import { Button, Card, Container, Section, SectionHeading } from './components/ui';

const foundationCards = [
  {
    label: '01',
    title: 'Säker grund',
    text: 'Designsystem, komponenter och layout är satta för en professionell cybersäkerhetswebb.',
  },
  {
    label: '02',
    title: 'Responsiv från start',
    text: 'Strukturen skalar från mobil till desktop med tydliga ytor, luft och läsbar typografi.',
  },
  {
    label: '03',
    title: 'Redo att växa',
    text: 'Sektioner för tjänster, kundcase, partners och kontakt kan byggas vidare ovanpå samma system.',
  },
];

function App() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      <header className="border-b border-brand-line bg-brand-black/95">
        <Container className="flex h-20 items-center justify-between gap-6">
          <a href="/" className="text-base font-semibold tracking-wide text-brand-white">
            JUIT NetSec AB
          </a>
          <nav aria-label="Huvudnavigering" className="hidden items-center gap-8 text-sm text-brand-mist md:flex">
            <a className="transition-colors duration-200 hover:text-brand-green" href="#grund">
              Grund
            </a>
            <a className="transition-colors duration-200 hover:text-brand-green" href="#system">
              Designsystem
            </a>
            <a className="transition-colors duration-200 hover:text-brand-green" href="#kontakt">
              Kontakt
            </a>
          </nav>
          <Button href="mailto:info@juitnetsec.se" size="sm">
            Starta dialog
          </Button>
        </Container>
      </header>

      <Section id="grund" className="overflow-hidden">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-brand-green/30 px-4 py-2 text-sm font-medium text-brand-green">
              IT och cybersäkerhet
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-brand-white sm:text-5xl lg:text-6xl">
              Modern grund för en tryggare digital närvaro.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-mist">
              En ren, teknisk och nordisk startpunkt för JUIT NetSec AB med tydliga komponenter,
              mörka sektioner och gröna accentdetaljer.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="#system">Se grunden</Button>
              <Button href="#kontakt" variant="secondary">
                Kontakta oss
              </Button>
            </div>
          </div>

          <Card variant="dark" className="relative">
            <div className="absolute right-6 top-6 h-2 w-2 rounded-full bg-brand-green shadow-glow" />
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-green">Systemstatus</p>
            <div className="mt-8 space-y-5">
              {['Nätverk', 'Identitet', 'Moln', 'Övervakning'].map((item) => (
                <div key={item} className="flex items-center justify-between border-b border-brand-line pb-4">
                  <span className="text-brand-mist">{item}</span>
                  <span className="text-sm font-medium text-brand-green">Redo</span>
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </Section>

      <Section id="system" tone="light">
        <Container>
          <SectionHeading
            eyebrow="Designsystem"
            title="Komponenter som håller ihop uttrycket."
            text="Grunden innehåller färger, typografi, spacing, knappar och cards för kommande sektioner."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {foundationCards.map((card) => (
              <Card key={card.title} variant="light">
                <span className="text-sm font-semibold text-brand-green">{card.label}</span>
                <h3 className="mt-5 text-xl font-semibold text-brand-ink">{card.title}</h3>
                <p className="mt-3 leading-7 text-brand-graphite">{card.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="kontakt" className="border-t border-brand-line">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <SectionHeading
            eyebrow="Nästa steg"
            title="Redo för fler sektioner."
            text="Nästa leverans kan bygga vidare med tjänster, kundnytta, referenser, kontaktflöde och tydligare konverteringspunkter."
            align="left"
            className="md:mb-0"
          />
          <Button href="mailto:info@juitnetsec.se">Planera innehåll</Button>
        </Container>
      </Section>
    </main>
  );
}

export default App;
