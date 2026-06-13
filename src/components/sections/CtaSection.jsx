import { Button, Container, Section } from '../ui';

export function CtaSection() {
  return (
    <Section className="relative overflow-hidden border-y border-brand-line bg-brand-ink">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,200,83,0.18),transparent_30%)]" />
      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Nästa steg</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-brand-white sm:text-4xl">
              Behöver du stärka din IT-säkerhet?
            </h2>
            <p className="mt-5 text-lg leading-8 text-brand-mist">
              Kontakta JUIT NetSec för en första dialog om hur vi kan hjälpa din verksamhet att bygga en
              säkrare och mer robust IT-miljö.
            </p>
          </div>
          <Button href="#kontakt" className="w-full sm:w-auto">
            Kontakta oss
          </Button>
        </div>
      </Container>
    </Section>
  );
}
