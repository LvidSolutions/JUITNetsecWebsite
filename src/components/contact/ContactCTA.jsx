import { Container } from '../ui';

/**
 * Avslutande CTA-band. Lugn, premium-känsla som knyter ihop sidan och leder
 * tillbaka till en dialog.
 */
export function ContactCTA() {
  return (
    <section aria-label="Nästa steg" className="relative py-20 lg:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-card border border-brand-line bg-white/[0.02] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,200,83,0.16),transparent_60%)]"
          />
          <p className="font-mono text-xs font-medium uppercase tracking-[0.32em] text-brand-green sm:text-sm">
            Nästa steg
          </p>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-semibold leading-tight text-brand-white sm:text-4xl lg:text-5xl">
            Låt oss ta ett första samtal om er IT-miljö
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-brand-mist/65 sm:text-lg sm:leading-8">
            Inget krångel, ingen press. Bara en teknisk dialog om vart ni vill och hur ni kommer dit.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#kontaktformular"
              className="inline-flex min-h-12 items-center justify-center rounded-card bg-brand-green px-7 text-base font-semibold text-brand-black transition-all duration-200 ease-smooth hover:bg-brand-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              Diskutera ert behov
            </a>
            <a
              href="mailto:info@juitnetsec.se"
              className="inline-flex min-h-12 items-center justify-center rounded-card border border-brand-line bg-transparent px-7 text-base font-semibold text-brand-white transition-all duration-200 ease-smooth hover:border-brand-green hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              info@juitnetsec.se
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
