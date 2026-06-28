import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';

const EASE = [0.22, 1, 0.36, 1];

function DetailList({ label, items, accent = false }) {
  return (
    <div>
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-brand-mist/45">
        <span aria-hidden="true" className={accent ? 'h-1.5 w-1.5 rounded-[1px] bg-brand-pastel' : 'h-1.5 w-1.5 rounded-[1px] bg-brand-mist/40'} />
        {label}
      </p>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-6 text-brand-mist/70">
            <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-brand-pastel/60" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceDetailPanel({ track }) {
  const reduce = useReducedMotion();

  return (
    <section aria-label="Selected service detail" className="relative border-b border-brand-line bg-brand-black py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30"
      />
      <div aria-hidden="true" className="service-static pointer-events-none absolute inset-0" />
      <Container className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={track.id}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
              {/* Vänster: kod/lager, titel, paragraf, CTA */}
              <div className="border-l border-brand-pastel/40 pl-6 sm:pl-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand-pastel">
                  {track.number} / {track.code} · {track.layer}
                </p>
                <h3 className="mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-brand-white sm:text-4xl lg:text-5xl">
                  {track.title}
                </h3>
                <p className="mt-6 max-w-xl text-base leading-8 text-brand-mist/72 sm:text-lg">
                  {track.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a
                    href="/kontakt"
                    className="group inline-flex items-center gap-3 rounded-full bg-brand-pastel px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-black transition-colors duration-200 hover:bg-brand-pastel-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pastel"
                  >
                    Discuss {track.code}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  </a>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-mist/40">
                    Related: {track.related.join(' · ')}
                  </span>
                </div>
              </div>

              {/* Höger: covers / outcomes */}
              <div className="grid gap-10 sm:grid-cols-2">
                <DetailList label="What this covers" items={track.covers} accent />
                <DetailList label="Typical outcomes" items={track.outcomes} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
