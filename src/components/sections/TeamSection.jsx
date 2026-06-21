import { Container } from '../ui';

const facts = [
  { label: 'Namn', value: 'Ulf Wernersson' },
  { label: 'Roll', value: 'Senior IT & Security Consultant' },
  { label: 'Fokus', value: 'Infrastructure / Communication / Security' },
  { label: 'Plats', value: 'Stockholm' },
  { label: 'Bolag', value: 'JUIT NetSec AB' },
  { label: 'Org.nr', value: '559243-2727' },
];

const disciplines = ['Infrastructure', 'Communication', 'Security'];

export function TeamSection() {
  return (
    <div className="bg-brand-white text-brand-ink">
      <section className="relative min-h-screen overflow-hidden pt-28 sm:pt-32 lg:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'repeating-radial-gradient(ellipse at 72% 42%, transparent 0 28px, rgba(5,5,5,0.42) 29px 30px)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-black/10 to-transparent"
        />

        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div className="order-2 lg:order-1">
              <div className="relative max-w-[34rem]">
                <div
                  aria-hidden="true"
                  className="absolute -inset-8 rounded-[50%] border border-brand-black/10"
                />
                <div
                  aria-hidden="true"
                  className="absolute -inset-16 rounded-[50%] border border-brand-black/10"
                />
                <img
                  src="/assets/company-person.png"
                  alt="Porträtt av Ulf Wernersson"
                  className="relative aspect-[4/5] w-full object-cover object-center grayscale"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-brand-green">
                Team / JUIT NetSec
              </p>
              <h1 className="mt-8 max-w-4xl font-display text-[clamp(3rem,10vw,8.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.04em] text-brand-ink">
                Ulf
                <br />
                Wernersson
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-8 text-brand-graphite sm:text-2xl sm:leading-9">
                Senior IT & Security Consultant with focus on infrastructure, communication and security.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {disciplines.map((discipline) => (
                  <span
                    key={discipline}
                    className="rounded-[2px] border border-brand-black/15 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-brand-graphite"
                  >
                    {discipline}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 grid border-y border-brand-black/15 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className="border-b border-brand-black/15 py-6 sm:px-6 lg:border-r lg:last:border-r-0"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand-green">
                  {String(index + 1).padStart(2, '0')} / {fact.label}
                </p>
                <p className="mt-3 text-lg font-semibold text-brand-ink">{fact.value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
