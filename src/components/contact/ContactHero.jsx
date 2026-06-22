import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';
import { ContactVideoObject } from './ContactVideoObject.jsx';

// Snabb, "agency"-mässig reveal: mjuk ease-out-expo, innehåll wipas upp bakom
// en mask precis som på referensen efter att preloadern lyft.
const EASE = [0.16, 1, 0.3, 1];

// Mask-rad: texten ligger i en overflow-hidden-behållare och glider upp från
// 110 % → 0. Ger den exakta "wipe up"-känslan från referensen.
function MaskReveal({ as: Tag = 'span', children, delay = 0, duration = 1, className = '', reduce }) {
  if (reduce) return <Tag className={className}>{children}</Tag>;
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: '115%' }}
        animate={{ y: '0%' }}
        transition={{ duration, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Contact-hero som efterliknar referensens komposition: en enorm ordbild som är
 * indragen från vänster och blöder ut förbi högerkanten, ett svävande objekt som
 * bryter layouten och överlappar typografin, en fet underrubrik som tuckas in
 * under ordet, en pill-CTA uppe till höger och en "Scroll"-cue nere till vänster.
 * Rörelsen kopierar referensens intro: maskad wipe-up med stagger.
 */
export function ContactHero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="contact-hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 pt-28 sm:pt-32 lg:pb-28 lg:pt-36"
    >
      {/* Pill-CTA uppe till höger – motsvarar referensens "VIEW OUR WORK". */}
      <Container className="relative z-30">
        <motion.div
          className="flex justify-end"
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        >
          <a
            href="#kontaktformular"
            className="group inline-flex items-center gap-3 rounded-full border border-brand-line bg-white/[0.03] py-2 pl-6 pr-2 text-sm font-semibold uppercase tracking-[0.14em] text-brand-white backdrop-blur-sm transition-colors duration-200 hover:border-brand-green/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            Diskutera ert behov
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-brand-black transition-transform duration-300 ease-smooth group-hover:translate-x-0.5">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </motion.div>
      </Container>

      {/* Hero-mitten: enorm ordbild + svävande objekt. */}
      <Container className="relative mt-10 flex-1 sm:mt-12 lg:mt-0 lg:flex lg:items-center">
        <div className="relative w-full">
          {/* Ordbilden: indragen, tight, blöder ut till höger (klipps av sektionen). */}
          <h1
            id="contact-hero-title"
            className="font-display font-bold uppercase leading-[0.8] tracking-[-0.07em] text-brand-white"
          >
            <MaskReveal
              reduce={reduce}
              delay={0.05}
              duration={1.15}
              className="whitespace-nowrap text-[26vw] sm:text-[24vw] lg:pl-[18%] lg:text-[22vw] xl:text-[clamp(12rem,21vw,20rem)]"
            >
              CONTACT
            </MaskReveal>
          </h1>

          {/* Svävande video-objekt – absolut, bryter layouten, ligger framför ordet. */}
          <div className="pointer-events-none absolute right-[-3vw] top-1/2 z-20 hidden w-[42vw] max-w-[720px] -translate-y-[56%] lg:block">
            <ContactVideoObject reveal />
          </div>

          {/* Underrubrik – fet, tuckad in under ordets vänstra del. */}
          <div className="relative z-10 mt-6 max-w-xl lg:-mt-[2vw] lg:pl-[18%]">
            <h2 className="font-display text-[7vw] font-semibold leading-[1.02] tracking-tight text-brand-white sm:text-4xl lg:text-[2.6rem]">
              <MaskReveal reduce={reduce} delay={0.42} duration={0.9}>
                Starta en dialog
              </MaskReveal>
              <MaskReveal reduce={reduce} delay={0.52} duration={0.9}>
                om er IT-miljö.
              </MaskReveal>
            </h2>

            <motion.p
              className="mt-6 max-w-md text-base leading-relaxed text-brand-mist/65 sm:text-lg sm:leading-8"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.72 }}
            >
              JUIT NetSec hjälper företag att skapa stabilare infrastruktur, säkrare kommunikation och
              bättre teknisk kontroll.
            </motion.p>
          </div>

          {/* Objekt som flödande block på mobil (förenklat, kontrollerat). */}
          <div className="mt-10 lg:hidden">
            <ContactVideoObject className="mx-auto w-[78%] max-w-[420px]" reveal />
          </div>
        </div>
      </Container>

      {/* "Scroll"-cue nere till vänster. */}
      <Container className="relative z-10">
        <motion.div
          className="mt-10 flex items-center gap-3 lg:mt-12"
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 1 }}
        >
          <span className="contact-scroll-line" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand-mist/45">Scrolla</span>
        </motion.div>
      </Container>
    </section>
  );
}
