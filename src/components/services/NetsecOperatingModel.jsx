import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { processStages } from './servicesData.js';
import './NetsecOperatingModel.css';

const EASE = [0.22, 1, 0.36, 1];
const SIZE = 400;
const LAYERS = processStages.length;

function squareFor(g) {
  const side = SIZE * (LAYERS - g) / LAYERS;
  return { x: (SIZE - side) / 2, y: SIZE - side, side };
}
function rectPath({ x, y, side }) {
  return 'M ' + x + ' ' + y + ' H ' + (x + side) + ' V ' + (y + side) + ' H ' + x + ' Z';
}

function SquareProcess({ activeIndex, onSelect, reduce, panelId }) {
  const activeGeometry = LAYERS - 1 - activeIndex;
  const scale = (activeIndex + 1) / LAYERS;
  return (
    <div className="operating-model__diagram">
      <svg viewBox="-2 -2 404 404" role="group" aria-label="Service delivery layers" className="operating-model__squares">
        <motion.rect x="0" y="0" width={SIZE} height={SIZE}
          className="operating-model__fill"
          initial={false} animate={{ clipPath: `inset(${(1 - scale) * 100}% ${(1 - scale) * 50}% 0 ${(1 - scale) * 50}%)` }}
          transition={{ duration: reduce ? 0 : 0.4, ease: EASE }} pointerEvents="none" />
        <g fill="none" pointerEvents="none" aria-hidden="true">
          {processStages.map((_, g) => {
            const s = squareFor(g);
            return <rect key={g} x={s.x} y={s.y} width={s.side} height={s.side}
              className={'operating-model__line' + (g > activeGeometry ? ' is-filled' : '')}
              vectorEffect="non-scaling-stroke" />;
          })}
        </g>
        <g aria-hidden="true" pointerEvents="none">
          {processStages.map((stage, index) => {
            const g = LAYERS - 1 - index;
            return <text key={stage.id} x="200" y={g * 100 + 40} textAnchor="middle"
              className={'operating-model__layer-label' + (index <= activeIndex ? ' is-filled' : '')}>
              <tspan x="200" dy="0" className="operating-model__layer-number">{stage.number}</tspan>
              <tspan x="200" dy="14">{stage.title}</tspan>
            </text>;
          })}
        </g>
        {processStages.map((stage, index) => {
          const g = LAYERS - 1 - index;
          const d = g === LAYERS - 1 ? rectPath(squareFor(g)) : rectPath(squareFor(g)) + ' ' + rectPath(squareFor(g + 1));
          return <path key={stage.id} d={d} fillRule="evenodd" className="operating-model__hit"
            role="button" tabIndex={0} aria-label={stage.number + ' ' + stage.title}
            aria-pressed={index === activeIndex} aria-controls={panelId}
            onPointerEnter={event => { if (event.pointerType === 'mouse') onSelect(index); }}
            onFocus={() => onSelect(index)} onClick={() => onSelect(index)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(index); }
              const direction = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[event.key];
              if (direction) {
                event.preventDefault();
                const next = (index + direction + LAYERS) % LAYERS;
                event.currentTarget.parentElement.querySelectorAll('[role="button"]')[next].focus();
              }
            }} />;
        })}
      </svg>
      <div className="operating-model__axis" aria-hidden="true"><span />JUIT NETSEC<span /></div>
    </div>
  );
}

export function NetsecOperatingModel({ activeIndex, onSelect }) {
  const reduce = useReducedMotion();
  const panelId = useId();
  const selected = processStages[activeIndex] ? activeIndex : 0;
  const active = processStages[selected];
  return (
    <section id="operating-model" aria-label="How Netsec works - square process" className="operating-model">
      <div className="operating-model__layout">
        <header className="operating-model__intro">
          <p className="operating-model__eyebrow"><span />Operating model</p>
          <h2>Four layers of controlled service delivery</h2>
          <p className="operating-model__summary">JUIT NetSec connects infrastructure, secure communication, cybersecurity and operations into a practical workflow from context to long-term support.</p>
          <div className="operating-model__readout" aria-hidden="true">
            <span>PROCESS / {active.code}</span>
            <span>{selected.toString(2).padStart(8, '0')} 01001010 01010101</span>
            <span>01001001 01010100 01001110</span>
            <span>01000101 01010100 01010011</span>
          </div>
        </header>
        <SquareProcess activeIndex={selected} onSelect={onSelect} reduce={reduce} panelId={panelId} />
        <div className="operating-model__detail" id={panelId}>
          <div className="operating-model__connector" aria-hidden="true"><span /></div>
          <p className="operating-model__status"><span>{active.number}</span> / 04 <span>{active.code}</span></p>
          <motion.div key={active.id} initial={reduce ? false : {opacity:0, y:5}}
            animate={{opacity:1,y:0}} transition={{duration:reduce ? 0 : 0.2,ease:EASE}}
            className="operating-model__copy">
            <h3>{active.title}</h3>
            <p>{active.text}</p>
            <ul className="operating-model__tags">{active.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>
          </motion.div>
          <a href="/kontakt" className="operating-model__cta">Discuss this layer <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
