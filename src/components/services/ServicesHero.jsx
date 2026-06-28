import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';

const EASE = [0.22, 1, 0.36, 1];

// Tunn, teknisk koncentrisk ring-grafik (inline SVG, ingen extern asset).
function HeroRings({ reduce }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
    >
      {[60, 110, 160, 196].map((r, i) => (
        <circle key={r} cx="200" cy="200" r={r} strokeWidth="1" opacity={0.16 - i * 0.025} />
      ))}
      {!reduce && (
        <motion.circle
          cx="200"
          cy="200"
          r="160"
          strokeWidth="1.4"
          stroke="#A9E8B4"
          strokeDasharray="2 12"
          opacity="0.5"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
          style={{ transformOrigin: '200px 200px' }}
        />
      )}
      <circle cx="200" cy="200" r="3" fill="#A9E8B4" stroke="none" />
      <line x1="200" y1="4" x2="200" y2="396" strokeWidth="0.6" opacity="0.1" />
      <line x1="4" y1="200" x2="396" y2="200" strokeWidth="0.6" opacity="0.1" />
    </svg>
  );
}

export function ServicesHero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="services-hero-title"
      className="relative isolate overflow-hidden border-b border-brand-line bg-brand-black pb-20 pt-32 sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-44"
    >
      {/* Teknisk bakgrund: nodgrid, glow, ringar och animerat brus. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_-10%,rgba(0,200,83,0.16),transparent_40%),radial-gradient(circle_at_8%_30%,rgba(169,232,180,0.07),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:34px_34px] opacity-50 [mask-image:radial-gradient(120%_90%_at_70%_10%,#000,transparent_75%)]" />
        <div className="service-static absolute inset-[-20%]" />
        <div className="absolute right-[-8%] top-1/2 hidden h-[34rem] w-[34rem] -translate-y-1/2 text-brand-white lg:block">
          <HeroRings reduce={reduce} />
        </div>
      </div>

      <Container className="relative">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.34em] text-brand-pastel"
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[1px] bg-brand-pastel" />
          Netsec Services
        </motion.p>

        <motion.h1
          id="services-hero-title"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
          className="mt-7 max-w-4xl font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-semibold leading-[1.02] tracking-tight text-brand-white"
        >
          IT operations and cybersecurity, managed as one{' '}
          <span className="text-brand-pastel">connected environment.</span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
          className="mt-8 max-w-2xl text-base leading-8 text-brand-mist/70 sm:text-lg sm:leading-9"
        >
          JUIT NetSec operates across device, identity, network, infrastructure, SOC, help desk and
          cloud — replacing fragmented IT and security tooling with one coordinated operating layer.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.28 }}
          className="mt-11 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <a
            href="#service-selector"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-pastel px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-black transition-colors duration-200 hover:bg-brand-pastel-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pastel"
          >
            Explore services
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="/kontakt"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-brand-line px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-white transition-colors duration-200 hover:border-brand-pastel/60 hover:text-brand-pastel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pastel"
          >
            Talk to Netsec
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
