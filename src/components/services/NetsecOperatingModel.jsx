import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';
import { operatingStages, ringLabels } from './servicesData.js';

const EASE = [0.22, 1, 0.36, 1];
const SIZE = 620;
const C = SIZE / 2;
const R_NODE = 253;
const PASTEL = '#A9E8B4';
const RINGS = [
  { r: 290, label: ringLabels.outer },
  { r: 216, label: ringLabels.ring2 },
  { r: 142, label: ringLabels.ring3 },
];

const polar = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
};
const nodeAngle = (i) => -90 + i * 60;

function arcPath(r, a0, a1) {
  const p0 = polar(r, a0);
  const p1 = polar(r, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y}`;
}

export function NetsecOperatingModel({ activeIndex, onSelect }) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(null);
  const active = operatingStages[activeIndex];
  const activeDeg = nodeAngle(activeIndex);
  const spokeStart = polar(86, activeDeg);
  const spokeEnd = polar(R_NODE, activeDeg);

  return (
    <section
      aria-label="How Netsec works — operating model"
      className="relative isolate overflow-hidden border-b border-brand-line bg-brand-black py-20 sm:py-24 lg:py-28"
    >
      <div aria-hidden="true" className="tech-noise tech-noise--anim pointer-events-none absolute inset-[-15%] -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_50%,rgba(169,232,180,0.07),transparent_50%)]"
      />

      <Container className="relative">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-brand-pastel">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[1px] bg-brand-pastel" />
            Operating model
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-brand-white sm:text-4xl lg:text-5xl">
            How Netsec works
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-brand-mist/70 sm:text-lg">
            JUIT NetSec operates IT and security as one connected environment — from discovery and
            onboarding to protection, monitoring, support and continuous improvement.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* ── Radar ─────────────────────────────────────────────── */}
          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="relative aspect-square w-full">
              <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full" fill="none">
                {/* koncentriska ringar + raka ring-etiketter */}
                {RINGS.map((ring) => (
                  <g key={ring.r}>
                    <circle cx={C} cy={C} r={ring.r} stroke="rgba(229,231,235,0.14)" strokeWidth="1" />
                    <text
                      x={C}
                      y={C - ring.r + 18}
                      textAnchor="middle"
                      className="fill-brand-mist/40 font-mono"
                      style={{ fontSize: 11, letterSpacing: '0.22em' }}
                    >
                      {ring.label}
                    </text>
                  </g>
                ))}

                {/* radar-ticks runt ytterringen */}
                {Array.from({ length: 60 }).map((_, i) => {
                  const a = polar(290, i * 6);
                  const b = polar(i % 5 === 0 ? 281 : 285, i * 6);
                  return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(229,231,235,0.16)" strokeWidth="1" />;
                })}

                {/* roterande radar-svep */}
                {!reduce && (
                  <motion.line
                    x1={C}
                    y1={C}
                    x2={C}
                    y2={C - 290}
                    stroke={PASTEL}
                    strokeWidth="1.4"
                    opacity="0.28"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
                    style={{ transformOrigin: `${C}px ${C}px` }}
                  />
                )}

                {/* aktiv: arc + eker */}
                <path d={arcPath(R_NODE, activeDeg - 26, activeDeg + 26)} stroke={PASTEL} strokeWidth="2.4" opacity="0.85" />
                <line x1={spokeStart.x} y1={spokeStart.y} x2={spokeEnd.x} y2={spokeEnd.y} stroke={PASTEL} strokeWidth="1.4" opacity="0.6" />

                {/* center-ring + aktivt nummer + center-etikett */}
                <circle cx={C} cy={C} r="86" stroke="rgba(169,232,180,0.4)" strokeWidth="1" />
                <text x={C} y={C - 6} textAnchor="middle" className="fill-brand-pastel font-display" style={{ fontSize: 46, fontWeight: 600 }}>
                  {active.number}
                </text>
                <text x={C} y={C + 20} textAnchor="middle" className="fill-brand-mist/55 font-mono" style={{ fontSize: 9, letterSpacing: '0.2em' }}>
                  {ringLabels.center.split(' & ')[0]} &amp;
                </text>
                <text x={C} y={C + 33} textAnchor="middle" className="fill-brand-mist/55 font-mono" style={{ fontSize: 9, letterSpacing: '0.2em' }}>
                  {ringLabels.center.split(' & ')[1]}
                </text>

                {/* noder (prickar + nummer) */}
                {operatingStages.map((stage, i) => {
                  const p = polar(R_NODE, nodeAngle(i));
                  const lp = polar(R_NODE + 26, nodeAngle(i));
                  const isActive = i === activeIndex;
                  const isHover = i === hovered;
                  return (
                    <g key={stage.number}>
                      {isActive && <circle cx={p.x} cy={p.y} r="14" stroke={PASTEL} strokeWidth="1.4" opacity="0.55" />}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isActive ? 7 : 5}
                        fill={isActive ? PASTEL : isHover ? 'rgba(169,232,180,0.7)' : 'rgba(229,231,235,0.5)'}
                      />
                      <text
                        x={lp.x}
                        y={lp.y + 4}
                        textAnchor="middle"
                        className="font-mono"
                        style={{
                          fontSize: 12,
                          letterSpacing: '0.1em',
                          fill: isActive ? PASTEL : isHover ? 'rgba(229,231,235,0.85)' : 'rgba(229,231,235,0.45)',
                        }}
                      >
                        {stage.number}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* osynliga, tillgängliga knappar ovanpå noderna */}
              {operatingStages.map((stage, i) => {
                const p = polar(R_NODE, nodeAngle(i));
                return (
                  <button
                    key={stage.number}
                    type="button"
                    onClick={() => onSelect(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    aria-pressed={i === activeIndex}
                    aria-label={`Stage ${stage.number} — ${stage.title}`}
                    className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pastel"
                    style={{ left: `${(p.x / SIZE) * 100}%`, top: `${(p.y / SIZE) * 100}%` }}
                  />
                );
              })}
            </div>
          </div>

          {/* ── Höger detaljpanel ─────────────────────────────────── */}
          <div className="border-l border-brand-line pl-6 sm:pl-8">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.26em]">
              <span className="text-brand-pastel">
                {active.number} <span className="text-brand-mist/35">/ {String(operatingStages.length).padStart(2, '0')}</span>
              </span>
              <span className="text-brand-mist/45">{active.code}</span>
            </div>
            <div className="mt-4 h-px w-full bg-brand-line">
              <div
                className="h-px bg-brand-pastel transition-all duration-500"
                style={{ width: `${((activeIndex + 1) / operatingStages.length) * 100}%` }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.number}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <h3 className="mt-7 font-display text-3xl font-semibold leading-tight tracking-tight text-brand-white sm:text-4xl">
                  {active.title}
                </h3>
                <p className="mt-5 text-base leading-8 text-brand-mist/72">{active.text}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-brand-pastel/30 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-pastel"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="/kontakt"
                  className="group mt-8 inline-flex items-center gap-3 rounded-full border border-brand-pastel/50 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-pastel transition-colors duration-200 hover:bg-brand-pastel hover:text-brand-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pastel"
                >
                  Discuss this stage
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
