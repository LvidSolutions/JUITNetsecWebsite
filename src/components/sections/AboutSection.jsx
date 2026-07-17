import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';
import { ScrambleText } from './ScrambleText.jsx';
import { ScrollFeatureSection } from './ScrollFeatureSection.jsx';
import { AboutRevealGallery } from './AboutRevealGallery.jsx';
import { cn } from '../../lib/cn';

// ---------------------------------------------------------------------------
// About-sida för JUIT NetSec AB.
// Visuellt och strukturellt inspirerad av gustaffurusten.se/about (stor
// typografisk split-rubrik, editoriella data-points, tabell-lika listor, mono-
// labels och mycket whitespace) men översatt till JUIT NetSecs mörka identitet
// (svart, vitt och grön accent) och med eget, korrekt innehåll från underlaget.
// Inga påhittade partnerskap, certifieringar, awards, kundcase eller siffror.
// ---------------------------------------------------------------------------

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
      <section className="relative overflow-hidden border-b border-brand-line py-24 sm:py-28 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(0,200,83,0.12),transparent_36%)]" />
        <Container className="relative">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <Label>Our Principles</Label>
                <h2 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-tight text-brand-white sm:text-6xl lg:text-7xl">
                  Principles that guide our work
                </h2>
              </div>
              <div className="max-w-2xl text-base leading-7 text-brand-mist/70 sm:text-lg sm:leading-8 lg:justify-self-end">
                <p>
                  The best security work is calm, practical and built for continuity. These
                  principles shape how JUIT NetSec advises, implements and supports technical
                  environments over time.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="relative mt-16">
            <AboutRevealGallery />
          </div>
        </Container>
      </section>

    </div>
  );
}
