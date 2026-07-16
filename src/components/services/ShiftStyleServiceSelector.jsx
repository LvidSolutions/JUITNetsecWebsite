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
  const toneClass = track.id === 'ops'
    ? 'services-selector-tone--ops'
    : track.id === 'sec'
      ? 'services-selector-tone--sec'
      : 'services-selector-tone--gov';
  const readabilityShadeClass = track.id === 'ops'
    ? 'services-selector-readability-shade--ops'
    : track.id === 'sec'
      ? 'services-selector-readability-shade--sec'
    : track.id === 'gov'
      ? 'services-selector-readability-shade--gov'
      : null;
  const scrambleGroups = useMemo(() => [
    {
      id: 'content',
      className: `absolute top-[11%] ${contentPosition} w-[78%] max-w-[18rem] sm:max-w-[19rem]`,
      fields: [
        {
          id: `${track.id}-eyebrow`,
          text: track.selectorText.eyebrow,
          start: 0.35,
          end: 0.57,
          className: 'services-selector-bitcount text-[10px] uppercase tracking-[0.16em]',
        },
        {
          id: `${track.id}-title`,
          text: track.title,
          start: 0.43,
          end: 0.78,
          className: 'services-selector-bitcount mt-4 text-3xl leading-[0.98] tracking-[0.01em] sm:text-4xl',
        },
        {
          id: `${track.id}-description`,
          text: track.description,
          start: 0.62,
          end: 0.91,
          className: 'services-selector-bitcount mt-5 text-[13px] leading-[1.55] tracking-[0.01em] sm:text-sm',
        },
        {
          id: `${track.id}-capability`,
          text: track.selectorText.capability,
          start: 0.78,
          end: 1,
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
          className: 'services-selector-bitcount text-3xl tracking-[0.05em] sm:text-4xl',
        },
      ],
    },
  ], [contentPosition, track]);

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
      {readabilityShadeClass && (
        <span
          aria-hidden="true"
          className={`${readabilityShadeClass} pointer-events-none absolute z-[4]`}
        />
      )}
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
            Select a track / {String(activeIndex + 1).padStart(2, '0')} - {String(serviceTracks.length).padStart(2, '0')}
          </p>
        </div>
      </div>

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
