import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';
import { serviceDomains, vendors } from './servicesData.js';

const EASE = [0.22, 1, 0.36, 1];

export function ServiceSupportMatrix() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Service domains and partners"
      className="relative border-b border-brand-line bg-brand-black py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:96px_96px] opacity-30"
      />
      <Container className="relative">
        <div className="flex flex-col gap-3 border-b border-brand-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-brand-pastel">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[1px] bg-brand-pastel" />
              Capability matrix
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-semibold leading-tight tracking-tight text-brand-white sm:text-3xl">
              Six service domains behind the operating layer.
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-mist/40">
            06 domains / senior delivery
          </p>
        </div>

        {/* Kompakt matris: de sex ursprungliga tjänstedomänerna. */}
        <ul className="mt-2 grid grid-cols-1 gap-px border-x border-b border-brand-line bg-brand-line sm:grid-cols-2 lg:grid-cols-3">
          {serviceDomains.map((domain, index) => (
            <motion.li
              key={domain.symbol}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : index * 0.04 }}
              className="group relative flex min-h-[15rem] flex-col bg-brand-black p-6 transition-colors duration-300 hover:bg-brand-pastel/[0.03] sm:p-7"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-3xl font-semibold leading-none text-brand-white/15 transition-colors duration-300 group-hover:text-brand-pastel/40">
                  {domain.number}
                </span>
                <span className="flex h-10 w-10 items-center justify-center border border-brand-pastel/25 bg-brand-pastel/5 font-mono text-[11px] font-semibold tracking-[0.12em] text-brand-pastel">
                  {domain.symbol}
                </span>
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold leading-tight tracking-tight text-brand-white">
                {domain.title}
              </h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-mist/40">{domain.layer}</p>
              <p className="mt-4 text-sm leading-6 text-brand-mist/60">{domain.text}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                {domain.focus.map((f) => (
                  <span key={f} className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-mist/45">
                    {f}
                    <span aria-hidden="true" className="ml-1.5 text-brand-pastel/40">/</span>
                  </span>
                ))}
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Partner-/vendor-lager: kompakt mono-rad. */}
        <div className="mt-14 border-t border-brand-line pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand-mist/40">
            Partner / vendor layer
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {vendors.map((vendor) => {
              const inner = (
                <span className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-brand-mist/55 transition-colors duration-200 group-hover/v:text-brand-pastel">
                  <span className="text-brand-pastel/50">{vendor.symbol}</span>
                  {vendor.name}
                </span>
              );
              return (
                <li key={vendor.name}>
                  {vendor.url ? (
                    <a
                      href={vendor.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${vendor.name} in a new tab`}
                      className="group/v rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pastel focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
                    >
                      {inner}
                    </a>
                  ) : (
                    <span className="group/v">{inner}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
