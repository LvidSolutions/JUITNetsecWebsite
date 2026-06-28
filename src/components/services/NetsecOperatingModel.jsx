import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';
import { processStages } from './servicesData.js';

const EASE = [0.22, 1, 0.36, 1];
const SIZE = 400;
const LAYERS = processStages.length; // 4

// JUIT-loggans gröna kvadrat (brand-green). Platt, ingen glow/skugga/bloom.
const GREEN = '#00C853';
const PANEL = '#0A0A0A'; // platt, opak panelyta (ingen static inuti rutan)

// Bottenförankrade, horisontellt centrerade nästlade kvadrater. Den minsta
// "boxen" vilar mot rutans nederkant; varje yttre lager växer uppåt + utåt.
//   g = 0 -> yttersta (hela rutan), g = 3 -> minsta boxen längst ned.
function squareFor(g) {
  const side = SIZE - 100 * g; // 400, 300, 200, 100
  return { x: 50 * g, y: 100 * g, w: side, h: side }; // botten = y + h = 400
}

function rectPath({ x, y, w, h }) {
  return `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;
}

// ⊓-bandet mellan lager g och g+1 (delar nederkant -> öppet i botten).
function bandPath(g) {
  return `${rectPath(squareFor(g))} ${rectPath(squareFor(g + 1))}`;
}

// Grön fyllnad = den hovrade kvadraten (innehåller alla inre lager). I viloläge
// kollapsar den till en punkt vid nederkantens mitt, så den "startar i boxen".
function greenFor(g) {
  if (g == null) return { x: SIZE / 2, y: SIZE, width: 0, height: 0 };
  const s = squareFor(g);
  return { x: s.x, y: s.y, width: s.w, height: s.h };
}

function HitLayer({ g, stageIndex, onActivate }) {
  const stage = processStages[stageIndex];
  const handlers = {
    role: 'button',
    tabIndex: 0,
    'aria-label': `${stage.number} ${stage.title}`,
    onMouseEnter: () => onActivate(g),
    onFocus: () => onActivate(g),
    onClick: () => onActivate(g),
    onKeyDown: (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onActivate(g);
      }
    },
    style: { pointerEvents: 'all', cursor: 'pointer', outline: 'none' },
  };

  if (g === LAYERS - 1) {
    const s = squareFor(g);
    return <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="transparent" {...handlers} />;
  }
  return <path d={bandPath(g)} fillRule="evenodd" fill="transparent" {...handlers} />;
}

function SquareProcess({ hoverG, onActivate, onClear, reduce }) {
  const green = greenFor(hoverG);
  const linesLit = hoverG === 0; // sista (yttersta) lagret -> linjerna tonar bort
  const tween = reduce ? { duration: 0 } : { duration: 0.55, ease: EASE };
  const lineTween = reduce ? { duration: 0 } : { duration: 0.5, ease: EASE };

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[680px]"
      onMouseLeave={onClear}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onClear();
        }
      }}
    >
      <svg
        viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`}
        role="img"
        aria-label="Four bottom-anchored square layers that fill upward and outward: Discover, Map, Secure, Operate"
        className="h-full w-full"
      >
        <defs>
          <clipPath id="wf-clip">
            <rect x="0" y="0" width={SIZE} height={SIZE} />
          </clipPath>
        </defs>

        {/* 1. Platt, opak panel – ingen static inuti rutan. */}
        <rect x="0" y="0" width={SIZE} height={SIZE} fill={PANEL} pointerEvents="none" />

        {/* 2. Grön fyllnad – platt JUIT-grön som växer uppåt/utåt från botten-boxen. */}
        <motion.rect
          clipPath="url(#wf-clip)"
          initial={false}
          animate={{ x: green.x, y: green.y, width: green.width, height: green.height }}
          transition={tween}
          fill={GREEN}
          pointerEvents="none"
        />

        {/* 3. Separatorlinjer ovanpå fyllnaden – subtila, kvar under de tre inre
              lagren, men tonar bort när det yttersta lagret aktiveras (en hel
              grön kvadrat). */}
        <motion.g
          initial={false}
          animate={{ opacity: linesLit ? 0 : 1 }}
          transition={lineTween}
          fill="none"
          pointerEvents="none"
        >
          {Array.from({ length: LAYERS }, (_, k) => {
            const s = squareFor(k);
            return (
              <rect
                key={k}
                x={s.x}
                y={s.y}
                width={s.w}
                height={s.h}
                stroke={k === 0 ? 'rgba(229,231,235,0.16)' : 'rgba(229,231,235,0.10)'}
                strokeWidth="1.2"
              />
            );
          })}
        </motion.g>

        {/* 4. Träffytor per lager (överst, fångar hover/fokus). */}
        <g>
          {Array.from({ length: LAYERS }, (_, g) => (
            <HitLayer key={g} g={g} stageIndex={LAYERS - 1 - g} onActivate={onActivate} />
          ))}
        </g>
      </svg>
    </div>
  );
}

export function NetsecOperatingModel({ activeIndex, onSelect }) {
  const reduce = useReducedMotion();
  // hoverG = hovrat geometri-lager (0 = yttersta, 3 = botten-boxen) eller null.
  const [hoverG, setHoverG] = useState(null);
  const active = processStages[activeIndex] ?? processStages[0];

  function activateLayer(g) {
    setHoverG(g);
    onSelect(LAYERS - 1 - g); // botten-boxen = Discover (01), yttersta = Operate (04)
  }

  function clearLayer() {
    setHoverG(null);
  }

  return (
    <section
      aria-label="How Netsec works - square process"
      className="relative isolate overflow-hidden border-b border-brand-line bg-brand-black pb-20 pt-28 sm:pb-24 sm:pt-32 lg:py-28"
    >
      {/* Sidövergripande Shift5-static ligger bakom innehållet; den opaka rutan
          blockerar den, så det finns ingen static inuti själva rutan. */}
      <div aria-hidden="true" className="service-static pointer-events-none absolute inset-0 -z-10" />
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

        {/* Rebalanserad layout: den stora kvadraten centreras i en bred, flexibel
            vänsterkolumn, medan textpanelen är smalare och skjuts åt höger. */}
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-24">
          <SquareProcess hoverG={hoverG} onActivate={activateLayer} onClear={clearLayer} reduce={reduce} />

          <div className="lg:ml-auto lg:w-full lg:max-w-[24rem] lg:border-l lg:border-brand-line lg:pl-8">
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
