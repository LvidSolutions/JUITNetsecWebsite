import { useMemo, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { PixelatedServiceVideo } from './PixelatedServiceVideo.jsx';
import { ProgressScrambleText } from './ProgressScrambleText.jsx';
import { serviceTracks } from './servicesData.js';

function Panel({ track, index, isActive, onSelect, reduce }) {
  const panelRef = useRef(null);
  const revealControllerRef = useRef(null);
  const textControllerRef = useRef(null);
  const descriptionId = `service-selector-${track.id}-description`;
  const contentPosition = track.selectorText.alignment === 'right'
    ? 'right-[8%] text-right'
    : 'left-[8%] text-left';
  const contentVerticalPosition = track.selectorText.verticalAlignment === 'bottom'
    ? 'bottom-[11%]'
    : 'top-[11%]';
  const isSecurityPanel = track.id === 'sec';
  const toneClass = track.id === 'ops'
    ? 'services-selector-tone--ops'
    : track.id === 'sec'
      ? 'services-selector-tone--sec'
      : 'services-selector-tone--gov';
  const scrambleGroups = useMemo(() => [
    {
      id: 'content',
      className: isSecurityPanel
        ? 'absolute w-[78%] max-w-[18rem] sm:max-w-[19rem]'
        : `absolute ${contentVerticalPosition} ${contentPosition} w-[78%] max-w-[18rem] sm:max-w-[19rem]`,
      style: isSecurityPanel ? { bottom: '11%', right: '8%', textAlign: 'right' } : undefined,
      fields: [
        {
          id: `${track.id}-eyebrow`,
          text: track.selectorText.eyebrow,
          start: 0.35,
          end: 0.57,
          shadeStrength: 0.45,
          className: 'services-selector-bitcount text-[10px] uppercase tracking-[0.16em]',
        },
        {
          id: `${track.id}-title`,
          text: track.title,
          start: 0.43,
          end: 0.78,
          shadeStrength: 0.88,
          className: 'services-selector-bitcount mt-4 text-3xl leading-[0.98] tracking-[0.01em] sm:text-4xl',
        },
        {
          id: `${track.id}-description`,
          text: track.description,
          start: 0.62,
          end: 0.91,
          shadeStrength: 0.72,
          className: 'services-selector-bitcount mt-5 text-[13px] leading-[1.55] tracking-[0.01em] sm:text-sm',
        },
        {
          id: `${track.id}-capability`,
          text: track.selectorText.capability,
          start: 0.78,
          end: 1,
          shadeStrength: 0.58,
          className: 'services-selector-bitcount mt-5 text-[9px] uppercase tracking-[0.12em] sm:text-[10px]',
        },
      ],
    },
    {
      id: 'index',
      className: 'absolute bottom-[7%] left-[8%]',
      fields: [
        {
          id: `${track.id}-index`,
          text: track.number,
          start: 0.84,
          end: 1,
          shadeStrength: 0.52,
          className: 'services-selector-bitcount text-3xl tracking-[0.05em] sm:text-4xl',
        },
      ],
    },
  ], [contentPosition, contentVerticalPosition, isSecurityPanel, track]);

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
      aria-label={`${track.code} - ${track.title}`}
      aria-describedby={descriptionId}
      className={`${toneClass} group relative isolate block min-h-[28rem] flex-1 overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green lg:min-h-[37rem]`}
    >
      <PixelatedServiceVideo
        src={track.video}
        objectPosition={track.objectPosition}
        cropPosition={track.cropPosition}
        reducedMotion={reduce}
        interactionTargetRef={panelRef}
        revealControllerRef={revealControllerRef}
        textControllerRef={textControllerRef}
        isSelected={isActive}
        dimBrightRevealBackground={track.id === 'sec' ? 0.42 : 0}
      />
      <span id={descriptionId} className="sr-only">
        {track.title}. {track.description}. {track.selectorText.capability}.
      </span>
      <ProgressScrambleText groups={scrambleGroups} controllerRef={textControllerRef} reducedMotion={reduce} />
    </button>
  );
}

export function ShiftStyleServiceSelector({ activeIndex, onSelect }) {
  const reduce = useReducedMotion();

  return (
    <section
      id="service-selector"
      aria-label="Service tracks selector"
      className="services-selector-surface relative isolate overflow-hidden"
    >
      <div className="services-selector-frame">
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
