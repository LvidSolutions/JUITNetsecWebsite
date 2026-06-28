import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';
import { ScrambleText } from './ScrambleText.jsx';
import { ScrollFeatureSection } from './ScrollFeatureSection.jsx';
import { cn } from '../../lib/cn';

// ---------------------------------------------------------------------------
// About-sida för JUIT NetSec AB.
// Visuellt och strukturellt inspirerad av gustaffurusten.se/about (stor
// typografisk split-rubrik, editoriella data-points, tabell-lika listor, mono-
// labels och mycket whitespace) men översatt till JUIT NetSecs mörka identitet
// (svart, vitt och grön accent) och med eget, korrekt innehåll från underlaget.
// Inga påhittade partnerskap, certifieringar, awards, kundcase eller siffror.
// ---------------------------------------------------------------------------

const contactProfile = {
  name: 'Ulf Wernersson',
  role: 'CEO',
  email: 'contact@juit.se',
  phone: '+46 708-25 63 93',
  phoneHref: 'tel:+46708256393',
};

const companyContact = [
  { k: 'Company', v: 'JUIT NetSec AB' },
  { k: 'Location', v: 'Stockholm, Sweden' },
  { k: 'Web', v: 'www.juit.se', href: 'https://www.juit.se' },
];

// Ersätter referensens "Awards & Recognition" – inga påhittade priser.
const principles = [
  {
    title: 'Security before complexity',
    description: 'Solutions should reduce risk without adding unnecessary technical weight.',
    area: 'Security',
  },
  {
    title: 'Stability before short-term fixes',
    description: 'Technical decisions should work in production, not just in presentations.',
    area: 'Operations',
  },
  {
    title: 'Practical expertise before buzzwords',
    description: 'Advice should be technically grounded and possible to execute.',
    area: 'Consulting',
  },
  {
    title: 'Clear guidance',
    description: 'The client should understand the risks, the options and the next steps.',
    area: 'Advisory',
  },
  {
    title: 'Long-term function',
    description: 'Environments should be documented, maintainable and sustainable over time.',
    area: 'Management',
  },
];

// Liten mono-label med grön bullet (återkommer genom hela sidan).
function Label({ children, className = '' }) {
  return (
    <p
      className={cn(
        'flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-mist/70',
        className,
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-[1px] bg-brand-green" />
      {children}
    </p>
  );
}

// Scroll-reveal som respekterar prefers-reduced-motion.
function Reveal({ children, className = '', delay = 0 }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function ContactRow({ row }) {
  return (
    <div className="grid gap-1 border-b border-brand-line py-5 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8">
      <dt className="text-[11px] uppercase tracking-[0.24em] text-brand-mist/45">
        {row.k}
      </dt>
      <dd className="text-sm leading-6 text-brand-white/90 sm:text-base">
        {row.href ? (
          <a
            href={row.href}
            target={row.href.startsWith('http') ? '_blank' : undefined}
            rel={row.href.startsWith('http') ? 'noreferrer' : undefined}
            className="transition-colors duration-200 hover:text-brand-green"
          >
            {row.v}
          </a>
        ) : (
          row.v
        )}
      </dd>
    </div>
  );
}

export function AboutSection() {
  return (
    <div id="om-oss" className="bg-brand-black text-brand-white">
      {/* ---------------------------------------------------------------- */}
      {/* HERO – stor typografisk ABOUT-komposition                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-brand-line pt-28 pb-24 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_-10%,rgba(0,200,83,0.12),transparent_45%)]" />
        <Container className="relative">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.28em] text-brand-mist/60">
              <p className="text-brand-white/90">JUIT</p>
              <p className="text-brand-white/90">NETSEC</p>
              <p className="mt-6 flex items-center gap-2 text-brand-green">
                <span aria-hidden="true">[</span> scroll down <span aria-hidden="true">]</span>
              </p>
            </div>
            <span
              aria-hidden="true"
              className="select-none font-display text-7xl font-light leading-none text-brand-green/80 sm:text-8xl"
            >
              /
            </span>
            {/* Liten vertikal plats-tagg (motsvarar referensens hörn-badge). */}
            <div className="hidden self-stretch lg:block">
              <div className="flex h-full items-center justify-center rounded-[2px] border border-brand-line px-3 py-4">
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.4em] text-brand-mist/70"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  STHLM · SE
                </span>
              </div>
            </div>
          </div>

          {/* Split-rubrik: A BOUT / JUIT NETSEC – decodas fram vid mount,
              identiskt med referensens scramble-reveal. */}
          <h1 className="mt-8 select-none font-display font-semibold uppercase leading-[0.82] tracking-[-0.03em] sm:mt-10">
            <span className="sr-only">About JUIT NetSec</span>
            <span aria-hidden="true" className="block">
              <span className="flex items-baseline justify-between gap-4">
                <ScrambleText as="span" text="A" trigger="mount" reserveWidth startDelay={0} durationMs={650} className="text-[clamp(3.25rem,15vw,13rem)]" />
                <ScrambleText as="span" text="BOUT" trigger="mount" reserveWidth startDelay={120} durationMs={850} className="text-[clamp(3.25rem,15vw,13rem)]" />
              </span>
              <span className="mt-1 flex items-baseline justify-between gap-4 text-brand-white/90 sm:mt-2">
                <ScrambleText as="span" text="JUIT" trigger="mount" reserveWidth startDelay={240} durationMs={850} className="text-[clamp(2.5rem,11vw,9.5rem)]" />
                <span className="text-[clamp(2.5rem,11vw,9.5rem)]">
                  <ScrambleText as="span" text="NETSEC" trigger="mount" reserveWidth startDelay={360} durationMs={950} />
                  <span aria-hidden="true" className="ml-[0.12em] inline-block align-baseline text-brand-green">.</span>
                </span>
              </span>
            </span>
          </h1>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SCROLL FEATURE - infrastructure, communication and expertise      */}
      {/* ---------------------------------------------------------------- */}
      <ScrollFeatureSection />

      {/* ---------------------------------------------------------------- */}
      {/* PRINCIPLES – fristående principsektion                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-brand-line py-24 sm:py-28 lg:py-32">
        <Container>
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <Label>Principles</Label>
                <h2 className="mt-6 max-w-3xl font-display text-3xl font-semibold leading-[1.08] tracking-tight text-brand-white sm:text-5xl">
                  Principles that guide technical decisions
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-brand-mist/70 sm:text-lg sm:leading-8 lg:justify-self-end">
                JUIT NetSec works from a clear set of technical principles: reduce risk, keep
                environments understandable and make decisions that can survive real operations.
              </p>
            </div>
          </Reveal>

          <ol className="mt-14 overflow-hidden rounded-[2px] border border-brand-line bg-white/[0.02]">
            {principles.map((item, index) => (
              <li key={item.title} className="border-b border-brand-line last:border-b-0">
                <Reveal delay={index * 0.04}>
                  <div className="group grid gap-4 p-6 transition-colors duration-200 hover:bg-white/[0.025] sm:p-8 lg:grid-cols-[4rem_minmax(0,0.9fr)_minmax(0,1.25fr)_8rem] lg:items-baseline lg:gap-8">
                    <ScrambleText
                      as="span"
                      text={String(index + 1).padStart(2, '0')}
                      durationMs={500}
                      className="font-mono text-xs tracking-[0.24em] text-brand-green"
                    />
                    <ScrambleText
                      as="h3"
                      text={item.title}
                      durationMs={850}
                      className="font-display text-xl font-medium leading-snug text-brand-white transition-transform duration-200 group-hover:translate-x-1 sm:text-2xl"
                    />
                    <p className="max-w-2xl text-sm leading-6 text-brand-mist/65 sm:text-base sm:leading-7">
                      {item.description}
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-mist/45 lg:text-right">
                      {item.area}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* KONTAKT / SLUTSEKTION – kontaktperson och bolagsinformation       */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
        <Container>
          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-[0.75fr_1.25fr]">
            <Reveal>
              <Label>Contact</Label>
              <div className="mt-7 font-display text-3xl font-semibold tracking-tight text-brand-white sm:text-4xl">
                JUIT <span className="text-brand-mist/60">NetSec AB</span>
              </div>
              <p className="mt-5 max-w-sm text-base leading-7 text-brand-mist/65">
                Direct senior contact for infrastructure, communication, security and computer
                operations.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-[2px] border border-brand-line bg-white/[0.025] transition-colors duration-200 hover:border-brand-green/40">
                <div className="flex flex-col gap-8 border-b border-brand-line p-6 sm:p-8 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-green">
                      Contact person
                    </p>
                    <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-brand-white sm:text-4xl">
                      {contactProfile.name}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-brand-mist/70">{contactProfile.role}</p>
                  </div>
                  <div className="flex flex-col gap-3 text-sm leading-6 text-brand-mist/85 sm:min-w-[17rem]">
                    <a
                      href={`mailto:${contactProfile.email}`}
                      className="group flex items-center justify-between gap-4 border border-brand-line px-4 py-3 transition-colors duration-200 hover:border-brand-green/45 hover:text-brand-green"
                    >
                      <span>{contactProfile.email}</span>
                      <span aria-hidden="true" className="text-brand-green">-&gt;</span>
                    </a>
                    <a
                      href={contactProfile.phoneHref}
                      className="group flex items-center justify-between gap-4 border border-brand-line px-4 py-3 transition-colors duration-200 hover:border-brand-green/45 hover:text-brand-green"
                    >
                      <span>{contactProfile.phone}</span>
                      <span aria-hidden="true" className="text-brand-green">-&gt;</span>
                    </a>
                  </div>
                </div>

                <dl className="px-6 font-mono sm:px-8">
                  {companyContact.map((row) => (
                    <ContactRow key={row.k} row={row} />
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>

          {/* Stor dekorativ avslutningstext (motsvarar referensens bottentext). */}
          <div
            aria-hidden="true"
            className="pointer-events-none mt-16 select-none overflow-hidden"
          >
            <p className="font-display text-[clamp(3rem,15vw,12rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em] text-brand-white/[0.05]">
              JUIT NETSEC
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
