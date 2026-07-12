import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { PixelatedServiceVideo } from './PixelatedServiceVideo.jsx';
import { serviceTracks } from './servicesData.js';

const ACTIVE = '#00C853';
const IDLE = 'rgba(229,231,235,0.32)';

// ── Tekniska line-art-grafiker (inline SVG, ingen extern asset) ─────────────
function TrackGraphic({ type, active, reduce }) {
  const color = active ? ACTIVE : IDLE;
  const spin = !reduce && active;

  if (type === 'stack') {
    // System-stack / infrastruktur-cylinder med subtil puls.
    return (
      <svg viewBox="0 0 120 120" className="h-28 w-28 sm:h-32 sm:w-32" fill="none" stroke={color}>
        {[0, 1, 2, 3].map((i) => (
          <motion.ellipse
            key={i}
            cx="60"
            cy={32 + i * 18}
            rx="34"
            ry="10"
            strokeWidth="1.3"
            initial={{ opacity: 0.85 - i * 0.14 }}
            animate={spin ? { opacity: [0.85 - i * 0.14, 1, 0.85 - i * 0.14] } : { opacity: 0.85 - i * 0.14 }}
            transition={spin ? { duration: 3.2, ease: 'easeInOut', repeat: Infinity, delay: i * 0.18 } : undefined}
          />
        ))}
        <line x1="26" y1="32" x2="26" y2="86" strokeWidth="1.1" opacity="0.5" />
        <line x1="94" y1="32" x2="94" y2="86" strokeWidth="1.1" opacity="0.5" />
        <circle cx="60" cy="32" r="2.4" fill={color} stroke="none" />
      </svg>
    );
  }

  if (type === 'orbit') {
    // Detektions-sfär / övervakningsfält med långsam orbital rörelse.
    return (
      <svg viewBox="0 0 120 120" className="h-28 w-28 sm:h-32 sm:w-32" fill="none" stroke={color}>
        <circle cx="60" cy="60" r="40" strokeWidth="1.3" opacity="0.85" />
        <circle cx="60" cy="60" r="25" strokeWidth="1" opacity="0.45" />
        <ellipse cx="60" cy="60" rx="50" ry="19" strokeWidth="1" opacity="0.4" />
        <circle cx="60" cy="60" r="3.4" fill={color} stroke="none" />
        <motion.g
          animate={spin ? { rotate: 360 } : undefined}
          transition={spin ? { duration: 14, ease: 'linear', repeat: Infinity } : undefined}
          style={{ transformOrigin: '60px 60px' }}
        >
          <circle cx="100" cy="60" r="3.6" fill={color} stroke="none" />
        </motion.g>
      </svg>
    );
  }

  // cube — lager-kub / arkitekturblock (kontrollplan).
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 sm:h-32 sm:w-32" fill="none" stroke={color}>
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M60 ${24 + i * 22} L96 ${42 + i * 22} L60 ${60 + i * 22} L24 ${42 + i * 22} Z`}
          strokeWidth="1.3"
          opacity={0.85 - i * 0.16}
          animate={spin ? { y: [0, -2, 0] } : undefined}
          transition={spin ? { duration: 3.4, ease: 'easeInOut', repeat: Infinity, delay: i * 0.2 } : undefined}
        />
      ))}
      <line x1="24" y1="42" x2="24" y2="86" strokeWidth="1" opacity="0.45" />
      <line x1="96" y1="42" x2="96" y2="86" strokeWidth="1" opacity="0.45" />
      <line x1="60" y1="60" x2="60" y2="104" strokeWidth="1" opacity="0.45" />
    </svg>
  );
}

function Panel({ track, index, isActive, onSelect, reduce }) {
  const panelRef = useRef(null);
  const revealControllerRef = useRef(null);

  return (
    <button
      ref={panelRef}
      type="button"
      onClick={() => {
        revealControllerRef.current?.activate();
        onSelect(index);
      }}
      onPointerEnter={(event) => {
        onSelect(index);
        if (!reduce && (event.pointerType === 'mouse' || event.pointerType === 'pen')) revealControllerRef.current?.enter(event);
      }}
      onPointerMove={(event) => {
        if (!reduce && (event.pointerType === 'mouse' || event.pointerType === 'pen')) revealControllerRef.current?.move(event);
      }}
      onPointerLeave={(event) => {
        if (!reduce && (event.pointerType === 'mouse' || event.pointerType === 'pen')) revealControllerRef.current?.leave();
      }}
      onFocus={() => onSelect(index)}
      aria-pressed={isActive}
      aria-label={`${track.code} — ${track.title}`}
      className={cn(
        'group relative isolate flex min-h-[28rem] flex-1 flex-col overflow-hidden p-6 text-left transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-8 lg:min-h-[37rem] lg:p-10',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green',
        isActive ? 'bg-brand-ink text-brand-white' : 'bg-transparent hover:bg-brand-ink hover:text-brand-white',
      )}
    >
      <PixelatedServiceVideo
        src={track.video}
        objectPosition={track.objectPosition}
        cropPosition={track.cropPosition}
        reducedMotion={reduce}
        interactionTargetRef={panelRef}
        revealControllerRef={revealControllerRef}
        isSelected={isActive}
        revealBrightness={track.id === 'sec' ? 0.34 : 0}
      />

      {/* aktiv topp-accent */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 top-0 z-20 h-[2px] origin-left transition-all duration-300',
          isActive ? 'scale-x-100 bg-brand-green' : 'scale-x-0 bg-brand-green group-hover:scale-x-100',
        )}
      />

      {/* topp: nummer + kod/lager */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <span
          className={cn(
            'font-display text-3xl font-semibold leading-none tracking-tight transition-colors duration-300 sm:text-4xl',
            isActive ? 'text-brand-green' : 'text-brand-white/45 group-hover:text-brand-white',
          )}
        >
          {track.number}
        </span>
        <span
          className={cn(
            'text-right font-mono text-[10px] uppercase leading-5 tracking-[0.24em] transition-colors duration-300',
            isActive ? 'text-brand-green' : 'text-brand-mist/60 group-hover:text-brand-mist',
          )}
        >
          {track.code}
          <br />
          {track.layer}
        </span>
      </div>

      {/* nederst: titel, beskrivning och CTA */}
      <div className="relative z-10 mt-auto">
        <h3
          className={cn(
            'font-display text-2xl font-semibold leading-tight tracking-tight transition-colors duration-300 sm:text-[1.7rem]',
            isActive ? 'text-brand-white' : 'text-brand-white/85 group-hover:text-brand-white',
          )}
        >
          {track.title}
        </h3>
        <p
          className={cn(
            'mt-3 max-w-sm text-sm leading-7 transition-colors duration-300',
            isActive ? 'text-brand-mist/78' : 'text-brand-mist/65 group-hover:text-brand-mist/78',
          )}
        >
          {track.description}
        </p>
        <span
          className={cn(
            'mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors duration-300',
            isActive ? 'text-brand-green' : 'text-brand-mist/60 group-hover:text-brand-mist',
          )}
        >
          {isActive ? 'Selected — see detail below' : 'Select track'}
          <span aria-hidden="true">{isActive ? '↓' : '→'}</span>
        </span>
      </div>
    </button>
  );
}

export function ShiftStyleServiceSelector({ activeIndex, onSelect }) {
  const reduce = useReducedMotion();

  return (
    <section
      id="service-selector"
      aria-label="Service tracks selector"
      className="relative isolate overflow-hidden border-b border-brand-line bg-brand-black"
    >
      <div aria-hidden="true" className="service-static pointer-events-none absolute inset-[-20%] -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.018),transparent_34%,rgba(255,255,255,0.014))]"
      />

      <div className="mx-auto w-full max-w-[1700px] px-4 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="flex flex-col gap-3 border-b border-brand-line pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-brand-green">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[1px] bg-brand-green" />
              Service tracks
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-semibold leading-tight tracking-tight text-brand-white sm:text-3xl">
              Three coordinated tracks, one operating layer.
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-mist/40">
            Select a track / {String(activeIndex + 1).padStart(2, '0')} — {String(serviceTracks.length).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* Tre paneler: rad på desktop med tunna avdelare, staplade på mobil. */}
      <div className="mx-auto flex w-full max-w-[1700px] flex-col divide-y divide-brand-line border-y border-brand-line lg:flex-row lg:divide-x lg:divide-y-0">
        {serviceTracks.map((track, i) => (
          <Panel
            key={track.id}
            track={track}
            index={i}
            isActive={i === activeIndex}
            onSelect={onSelect}
            reduce={reduce}
          />
        ))}
      </div>
    </section>
  );
}
