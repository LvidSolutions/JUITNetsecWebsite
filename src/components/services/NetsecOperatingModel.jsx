import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';
import { processStages } from './servicesData.js';

const EASE = [0.22, 1, 0.36, 1];
const SIZE = 400;
const PASTEL = '#A9E8B4';
const BLACK = '#050505';
const INSETS = [20, 65, 110, 155];

function ringPath(outerInset, innerInset) {
  const outerEnd = SIZE - outerInset;
  const innerEnd = SIZE - innerInset;

  return [
    `M ${outerInset} ${outerInset} H ${outerEnd} V ${outerEnd} H ${outerInset} Z`,
    `M ${innerInset} ${innerInset} H ${innerEnd} V ${innerEnd} H ${innerInset} Z`,
  ].join(' ');
}

function SquareLayer({ stage, index, lit, onActivate }) {
  const isCenter = index === processStages.length - 1;
  const inset = INSETS[index];
  const nextInset = INSETS[index + 1];
  const end = SIZE - inset;
  const labelInset = inset + 17;
  const titleY = isCenter ? SIZE / 2 + 8 : labelInset + 17;
  const labelY = isCenter ? SIZE / 2 - 14 : labelInset;

  const commonProps = {
    role: 'button',
    tabIndex: 0,
    focusable: 'true',
    'aria-label': `${stage.number} ${stage.title}`,
    onMouseEnter: () => onActivate(index),
    onFocus: () => onActivate(index),
    onClick: () => onActivate(index),
    onKeyDown: (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onActivate(index);
      }
    },
    className: 'cursor-pointer outline-none',
  };

  return (
    <g {...commonProps}>
      {isCenter ? (
        <rect
          x={inset}
          y={inset}
          width={end - inset}
          height={end - inset}
          fill={lit ? PASTEL : 'rgba(5,5,5,0.84)'}
          stroke={lit ? BLACK : 'rgba(229,231,235,0.26)'}
          strokeWidth="1.2"
          className="transition-colors duration-200"
        />
      ) : (
        <path
          d={ringPath(inset, nextInset)}
          fill={lit ? PASTEL : 'rgba(5,5,5,0.72)'}
          fillRule="evenodd"
          stroke={lit ? BLACK : 'rgba(229,231,235,0.22)'}
          strokeWidth="1.2"
          className="transition-colors duration-200"
        />
      )}

      <text
        x={isCenter ? SIZE / 2 : labelInset}
        y={labelY}
        textAnchor={isCenter ? 'middle' : 'start'}
        className="select-none font-mono"
        style={{
          fill: lit ? BLACK : 'rgba(229,231,235,0.48)',
          fontSize: isCenter ? 12 : 10,
          fontWeight: 700,
          letterSpacing: '0.18em',
        }}
      >
        {stage.number}
      </text>
      <text
        x={isCenter ? SIZE / 2 : labelInset}
        y={titleY}
        textAnchor={isCenter ? 'middle' : 'start'}
        className="select-none font-display"
        style={{
          fill: lit ? BLACK : 'rgba(229,231,235,0.72)',
          fontSize: isCenter ? 17 : 15,
          fontWeight: 650,
          letterSpacing: 0,
        }}
      >
        {stage.title}
      </text>
    </g>
  );
}

function SquareProcess({ hoverLevel, onActivate, onClear }) {
  const litThrough = hoverLevel ?? -1;

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[560px]"
      onMouseLeave={onClear}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onClear();
        }
      }}
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label="Four nested square layers: Discover, Map, Secure, Operate"
        className="h-full w-full"
      >
        <rect x="1" y="1" width="398" height="398" fill="rgba(5,5,5,0.52)" stroke="rgba(229,231,235,0.14)" />
        {processStages.map((stage, index) => (
          <SquareLayer
            key={stage.id}
            stage={stage}
            index={index}
            lit={index <= litThrough}
            onActivate={onActivate}
          />
        ))}
      </svg>
    </div>
  );
}

export function NetsecOperatingModel({ activeIndex, onSelect }) {
  const reduce = useReducedMotion();
  const [hoverLevel, setHoverLevel] = useState(null);
  const active = processStages[activeIndex] ?? processStages[0];

  function activateLayer(index) {
    setHoverLevel(index);
    onSelect(index);
  }

  function clearLayer() {
    setHoverLevel(null);
  }

  return (
    <section
      aria-label="How Netsec works - square process"
      className="relative isolate overflow-hidden border-b border-brand-line bg-brand-black pb-20 pt-28 sm:pb-24 sm:pt-32 lg:py-28"
    >
      <div aria-hidden="true" className="service-static pointer-events-none absolute inset-[-15%] -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.018),transparent_42%,rgba(255,255,255,0.012))]"
      />

      <Container className="relative">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-brand-pastel">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[1px] bg-brand-pastel" />
            Operating model
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-brand-white sm:text-4xl lg:text-5xl">
            Four layers of controlled service delivery
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-brand-mist/70 sm:text-lg">
            JUIT NetSec connects infrastructure, secure communication, cybersecurity and operations
            into a practical workflow from context to long-term support.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <SquareProcess hoverLevel={hoverLevel} onActivate={activateLayer} onClear={clearLayer} />

          <div className="border-l border-brand-line pl-6 sm:pl-8">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.26em]">
              <span className="text-brand-pastel">
                {active.number} <span className="text-brand-mist/35">/ {String(processStages.length).padStart(2, '0')}</span>
              </span>
              <span className="text-brand-mist/45">{active.code}</span>
            </div>
            <div className="mt-4 h-px w-full bg-brand-line">
              <div
                className="h-px bg-brand-pastel transition-all duration-300"
                style={{ width: `${((((activeIndex ?? 0) + 1) / processStages.length) * 100)}%` }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.number}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: EASE }}
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
                  className="group mt-8 inline-flex items-center gap-3 border border-brand-pastel/55 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-pastel transition-colors duration-200 hover:bg-brand-pastel hover:text-brand-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pastel"
                >
                  Discuss this layer
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">-&gt;</span>
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
