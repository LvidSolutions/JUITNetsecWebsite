import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';
import { ScrambleText } from './ScrambleText.jsx';
import { cn } from '../../lib/cn';

// ---------------------------------------------------------------------------
// About-sida för JUIT NetSec AB.
// Visuellt och strukturellt inspirerad av gustaffurusten.se/about (stor
// typografisk split-rubrik, editoriella data-points, tabell-lika listor, mono-
// labels och mycket whitespace) men översatt till JUIT NetSecs mörka identitet
// (svart, vitt och grön accent) och med eget, korrekt innehåll från underlaget.
// Inga påhittade partnerskap, certifieringar, awards, kundcase eller siffror.
// ---------------------------------------------------------------------------

// Editoriella fakta-block – endast bekräftade uppgifter.
const facts = [
  { label: 'Plats', value: 'STHLM', sub: 'Stockholm, Sverige' },
  { label: 'Org.nr', value: '559243-2727', sub: 'Svenskt aktiebolag' },
  { label: 'Inriktning', value: 'IT / SEC', sub: 'Infrastruktur, kommunikation och säkerhet' },
  { label: 'Fokus', value: 'DRIFT', sub: 'Datakonsult­verksamhet och datordrifttjänster' },
];

const values = [
  'Säkerhet',
  'Stabilitet',
  'Tydlighet',
  'Ansvar',
  'Långsiktighet',
  'Teknisk precision',
  'Praktisk expertis',
  'Förtroende',
];

// Ersätter referensens "Awards & Recognition" – inga påhittade priser.
const principles = [
  {
    title: 'Säkerhet före komplexitet',
    description: 'Lösningar ska minska risk utan att skapa onödig teknisk tyngd.',
    area: 'Security',
  },
  {
    title: 'Stabilitet före kortsiktiga lösningar',
    description: 'Tekniska beslut ska fungera i drift, inte bara i presentationer.',
    area: 'Operations',
  },
  {
    title: 'Praktisk expertis före buzzwords',
    description: 'Rådgivning ska vara tekniskt förankrad och möjlig att genomföra.',
    area: 'Consulting',
  },
  {
    title: 'Tydlig rådgivning',
    description: 'Kunden ska förstå risker, vägval och nästa steg.',
    area: 'Advisory',
  },
  {
    title: 'Långsiktig funktion',
    description: 'Miljöer ska vara dokumenterade, förvaltningsbara och hållbara över tid.',
    area: 'Management',
  },
];

// Ersätter referensens "Experience" – kompetens-/tjänsteområden.
const competencies = [
  {
    title: 'IT-infrastruktur',
    description:
      'Planering, förbättring och förvaltning av stabila IT-miljöer med fokus på säkerhet, driftsäkerhet och skalbarhet.',
    area: 'Infrastructure',
  },
  {
    title: 'Nätverk & säker kommunikation',
    description:
      'Design och optimering av säkra kommunikationslösningar för användare, kontor, system och externa anslutningar.',
    area: 'Network',
  },
  {
    title: 'Cybersäkerhet',
    description:
      'Praktisk rådgivning, teknisk granskning och implementation av säkerhetslösningar som minskar risk.',
    area: 'Security',
  },
  {
    title: 'Datordrift & förvaltning',
    description:
      'Tekniskt stöd, driftkompetens och förvaltning för företag som behöver stabila och säkra IT-system över tid.',
    area: 'Operations',
  },
  {
    title: 'IT-management & rådgivning',
    description:
      'Teknisk rådgivning, kravställning, projektledning och strategiska vägval inom IT och säkerhet.',
    area: 'Advisory',
  },
];

const trustPoints = [
  'Fokus på infrastruktur, kommunikation och säkerhet',
  'Erfarenhet av praktiska IT-miljöer',
  'Teknisk rådgivning från analys till implementation',
  'Säkerhetsmedvetet arbetssätt',
  'Tydlig dokumentation',
  'Långsiktigt förvaltningsperspektiv',
  'Baserat i Stockholm',
  'Registrerat svenskt aktiebolag',
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

export function AboutSection() {
  return (
    <div id="om-oss" className="bg-brand-black text-brand-white">
      {/* ---------------------------------------------------------------- */}
      {/* HERO – stor typografisk ABOUT-komposition + fakta-block          */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-brand-line pt-28 sm:pt-32 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_-10%,rgba(0,200,83,0.12),transparent_45%)]" />
        <Container className="relative">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.28em] text-brand-mist/60">
              <p className="text-brand-white/90">JUIT</p>
              <p className="text-brand-white/90">NETSEC</p>
              <p className="mt-6 flex items-center gap-2 text-brand-green">
                <span aria-hidden="true">[</span> scroll ned <span aria-hidden="true">]</span>
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

          {/* Fakta-block – editoriella data-points, inte vanliga cards. */}
          <div className="mt-16 grid grid-cols-1 border-t border-brand-line sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact, index) => (
              <Reveal
                key={fact.label}
                delay={index * 0.06}
                className={cn(
                  'border-brand-line px-1 py-7 sm:px-6',
                  // tunna avdelare mellan kolumnerna på större skärmar
                  index !== 0 && 'sm:border-t-0',
                  'border-t sm:border-t',
                  'lg:border-l lg:first:border-l-0',
                )}
              >
                <Label>{fact.label}</Label>
                <ScrambleText
                  as="p"
                  text={fact.value}
                  durationMs={900}
                  startDelay={index * 90}
                  className="mt-5 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-none tracking-tight tabular-nums text-brand-white"
                />
                <p className="mt-3 max-w-[16rem] text-sm leading-6 text-brand-mist/55">{fact.sub}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* OM JUIT NETSEC – stor rubrik + brödtext + värdeord               */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-brand-line py-24 sm:py-28 lg:py-36">
        <Container>
          <Reveal>
            <Label>[ Om JUIT NetSec ]</Label>
          </Reveal>
          <div className="mt-10 grid gap-x-12 gap-y-12 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <h2
                lang="sv"
                className="max-w-3xl hyphens-auto break-words font-display text-3xl font-semibold leading-[1.05] tracking-tight text-brand-white sm:text-5xl lg:text-6xl"
              >
                Senior IT- och säkerhetskompetens för stabila tekniska miljöer
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="space-y-6 text-lg leading-8 text-brand-mist/85">
              <p>
                JUIT NetSec AB är ett IT-konsultbolag baserat i Stockholm med inriktning mot
                infrastruktur, kommunikation och säkerhet. Bolaget hjälper företag att skapa stabila,
                säkra och välfungerande IT-miljöer genom teknisk expertis, rådgivning och praktisk
                implementation.
              </p>
              <p>
                Med fokus på nätverk, drift, säkerhet och management fungerar JUIT NetSec som en erfaren
                partner för organisationer som behöver pålitlig IT-kompetens utan onödig komplexitet.
              </p>
              <p className="text-brand-mist/65">
                JUIT NetSec är byggt kring senior teknisk kompetens och praktisk erfarenhet från
                IT-miljöer där säkerhet, stabilitet och tydlig kommunikation är avgörande. Arbetet utgår
                från verkliga behov, befintliga miljöer och lösningar som ska fungera i praktiken — inte
                bara på papper.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-14">
            <div className="flex flex-wrap gap-x-3 gap-y-3 border-t border-brand-line pt-8">
              {values.map((value) => (
                <span
                  key={value}
                  className="rounded-[2px] border border-brand-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-mist/70 transition-colors duration-200 hover:border-brand-green/50 hover:text-brand-white"
                >
                  {value}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* PRINCIPER – tabell-lik lista (ersätter awards)                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-brand-line py-24 sm:py-28 lg:py-32">
        <Container>
          <Reveal>
            <Label>Principer</Label>
            <h2 className="mt-6 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-brand-white sm:text-4xl">
              Vad vi sätter främst
            </h2>
          </Reveal>

          <div className="mt-12">
            {/* kolumnrubriker – syns på lg */}
            <div className="hidden border-b border-brand-line pb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-brand-mist/45 lg:grid lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.1fr)_8rem] lg:gap-6">
              <span>Idx</span>
              <span>Princip</span>
              <span>Förklaring</span>
              <span className="text-right">Område</span>
            </div>

            <ul>
              {principles.map((item, index) => (
                <li key={item.title}>
                  <Reveal delay={index * 0.04}>
                    <div className="group grid grid-cols-1 gap-2 border-b border-brand-line py-6 transition-colors duration-200 hover:bg-white/[0.025] lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.1fr)_8rem] lg:items-baseline lg:gap-6">
                      <ScrambleText
                        as="span"
                        text={String(index + 1).padStart(2, '0')}
                        durationMs={500}
                        className="font-mono text-xs tracking-[0.2em] text-brand-green"
                      />
                      <ScrambleText
                        as="h3"
                        text={item.title}
                        durationMs={850}
                        className="font-display text-xl font-medium leading-snug text-brand-white transition-transform duration-200 group-hover:translate-x-1 sm:text-2xl"
                      />
                      <p className="max-w-xl text-sm leading-6 text-brand-mist/65">{item.description}</p>
                      <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-brand-mist/55 lg:text-right">
                        {item.area}
                      </span>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* KOMPETENSOMRÅDEN – stora rubriker (ersätter experience)           */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-brand-line py-24 sm:py-28 lg:py-32">
        <Container>
          <Reveal>
            <Label>Kompetensområden</Label>
          </Reveal>

          <ul className="mt-12">
            {competencies.map((item, index) => (
              <li key={item.title}>
                <Reveal delay={index * 0.04}>
                  <div className="group border-t border-brand-line py-9 transition-colors duration-200 hover:bg-white/[0.02] sm:py-10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                      <ScrambleText
                        as="h3"
                        text={item.title}
                        durationMs={950}
                        className="font-display text-3xl font-semibold leading-[1.02] tracking-tight text-brand-white transition-transform duration-200 group-hover:translate-x-1 sm:text-4xl lg:text-5xl"
                      />
                      <ScrambleText
                        as="span"
                        text={`${String(index + 1).padStart(2, '0')} / ${item.area}`}
                        durationMs={750}
                        startDelay={120}
                        className="shrink-0 font-mono text-[11px] uppercase tracking-[0.3em] text-brand-green/90"
                      />
                    </div>
                    <p className="mt-5 max-w-3xl text-base leading-7 text-brand-mist/70 sm:text-lg sm:leading-8">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
            <li aria-hidden="true" className="border-t border-brand-line" />
          </ul>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* TRUST / CREDIBILITY                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-brand-line py-24 sm:py-28 lg:py-32">
        <Container>
          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <Reveal>
              <Label>Trovärdighet</Label>
              <h2 className="mt-6 max-w-xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-brand-white sm:text-4xl lg:text-[2.75rem]">
                Erfaren IT-kompetens med fokus på säkerhet och stabilitet
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-brand-mist/80">
                När IT-miljön är affärskritisk behövs teknisk kompetens som kombinerar säkerhetstänk,
                praktisk erfarenhet och tydlig rådgivning. JUIT NetSec arbetar med lösningar som ska vara
                robusta, begripliga och möjliga att förvalta över tid.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="grid grid-cols-1 border-t border-brand-line sm:grid-cols-2">
                {trustPoints.map((point, index) => (
                  <li
                    key={point}
                    className={cn(
                      'flex items-start gap-3 border-b border-brand-line py-5 pr-4 sm:py-6',
                      index % 2 === 0 && 'sm:border-r sm:pr-8',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-[1px] bg-brand-green"
                    />
                    <span className="text-sm leading-6 text-brand-mist/85 sm:text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* KONTAKT / SLUTSEKTION – inspirerad av referensens footer-känsla   */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
        <Container>
          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <div className="font-display text-2xl font-semibold tracking-tight text-brand-white">
                JUIT <span className="text-brand-mist/60">NetSec AB</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-6 text-brand-mist/60">
                IT-konsulting inom infrastruktur, kommunikation, säkerhet och datordrift.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <Label>Kontakt</Label>
              <dl className="mt-8 space-y-0 border-t border-brand-line font-mono text-sm">
                {[
                  { k: 'Mail', v: 'info@juitnetsec.se', href: 'mailto:info@juitnetsec.se' },
                  { k: 'Plats', v: 'Stockholm, Sverige' },
                  { k: 'Org.nr', v: '559243-2727' },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex flex-col gap-1 border-b border-brand-line py-4 sm:flex-row sm:items-center sm:gap-8"
                  >
                    <dt className="w-28 shrink-0 text-[11px] uppercase tracking-[0.24em] text-brand-mist/45">
                      {row.k}
                    </dt>
                    <dd className="text-brand-white/90">
                      {row.href ? (
                        <a
                          href={row.href}
                          className="transition-colors duration-200 hover:text-brand-green"
                        >
                          {row.v}
                        </a>
                      ) : (
                        row.v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
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
