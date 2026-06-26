import { Container } from '../ui';

export function ServicesCTA() {
  return (
    <section aria-label="Contact call to action" className="relative isolate overflow-hidden bg-brand-black py-24 sm:py-28 lg:py-36">
      <div aria-hidden="true" className="tech-noise tech-noise--anim pointer-events-none absolute inset-[-15%] -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(169,232,180,0.12),transparent_55%)]"
      />
      <Container className="relative text-center">
        <p className="flex items-center justify-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-brand-pastel">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[1px] bg-brand-pastel" />
          Next step
        </p>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-semibold leading-[1.08] tracking-tight text-brand-white sm:text-4xl lg:text-5xl">
          Operate IT and security from one clearer layer.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-mist/70 sm:text-lg">
          Talk to JUIT NetSec about your current environment, where operations are fragmented, where
          risk is building up, and what should be improved first.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/kontakt"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-pastel px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-black transition-colors duration-200 hover:bg-brand-pastel-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pastel"
          >
            Talk to Netsec
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="/kontakt"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-brand-line px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-white transition-colors duration-200 hover:border-brand-pastel/60 hover:text-brand-pastel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pastel"
          >
            View contact options
          </a>
        </div>
      </Container>
    </section>
  );
}
