import { useEffect, useRef } from 'react';

const SCRAMBLE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\[]<>+-_:.';
const UPDATE_INTERVAL_MS = 48;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hash(value) {
  const sine = Math.sin(value * 12.9898) * 43758.5453;
  return sine - Math.floor(sine);
}

function seedFor(text) {
  return Array.from(text).reduce(
    (seed, character) => (seed * 31 + character.charCodeAt(0)) % 2147483647,
    7,
  );
}

function scrambleCharacter(seed, index, frame) {
  const random = hash(seed + index * 97.13 + frame * 17.41);
  return SCRAMBLE_CHARACTERS[Math.floor(random * SCRAMBLE_CHARACTERS.length)];
}

function displayForProgress(text, progress, timestamp, reducedMotion, start, end) {
  const normalizedProgress = clamp(progress, 0, 1);

  if (reducedMotion) return normalizedProgress >= start ? text : '';
  if (normalizedProgress < start) return '';

  const seed = seedFor(text);
  const frame = Math.floor(timestamp / UPDATE_INTERVAL_MS);
  let display = '';

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (/\s/.test(character)) {
      display += character;
      continue;
    }

    const threshold = start + (end - start) * (0.08 + hash(seed + index * 29.17) * 0.86);
    display += normalizedProgress >= threshold
      ? character
      : scrambleCharacter(seed, index, frame);
  }

  return display;
}

function opacityForProgress(progress, reducedMotion, start) {
  if (reducedMotion) return progress >= start ? 1 : 0;
  return clamp((progress - (start - 0.06)) / 0.15, 0, 1);
}

/**
 * A DOM-only, externally driven text decoder. The canvas reveal loop supplies
 * progress, so it can reverse from the current character state without timers
 * or React renders on animation frames. Invisible final strings reserve stable
 * layout while the visible overlays decode in place.
 */
export function ProgressScrambleText({ groups, controllerRef, reducedMotion }) {
  const visualRefs = useRef(new Map());
  const shadeRefs = useRef(new Map());
  const lastDisplaysRef = useRef(new Map());
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const update = (progress, timestamp) => {
      if (timestamp - lastUpdateRef.current < UPDATE_INTERVAL_MS && progress > 0.01 && progress < 0.99) return;

      lastUpdateRef.current = timestamp;

      groups.forEach((group) => {
        group.fields.forEach((field) => {
          const element = visualRefs.current.get(field.id);
          if (!element) return;

          const start = field.start ?? 0.43;
          const end = field.end ?? 0.78;
          const next = displayForProgress(field.text, progress, timestamp, reducedMotion, start, end);

          if (next !== lastDisplaysRef.current.get(field.id)) {
            lastDisplaysRef.current.set(field.id, next);
            element.textContent = next;
            const shade = shadeRefs.current.get(field.id);
            if (shade) shade.textContent = next;
          }

          const opacity = opacityForProgress(progress, reducedMotion, start);
          element.style.opacity = String(opacity);
          const shade = shadeRefs.current.get(field.id);
          if (shade) shade.style.opacity = String(opacity * (field.shadeStrength ?? 0.72));
        });
      });
    };

    controllerRef.current = { update };
    return () => {
      if (controllerRef.current?.update === update) controllerRef.current = null;
    };
  }, [controllerRef, groups, reducedMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      {groups.map((group) => (
        <div key={group.id} className={group.className} style={group.style}>
          {group.fields.map((field) => (
            <span key={field.id} className={`relative block ${field.className ?? ''}`}>
              <span className="invisible">{field.text}</span>
              <span
                ref={(element) => {
                  if (element) shadeRefs.current.set(field.id, element);
                  else shadeRefs.current.delete(field.id);
                }}
                data-scramble-text-shade={field.id}
                className="services-selector-text-cloud absolute inset-0 z-0 whitespace-pre-wrap transition-opacity duration-100"
              />
              <span
                ref={(element) => {
                  if (element) visualRefs.current.set(field.id, element);
                  else visualRefs.current.delete(field.id);
                }}
                data-scramble-progress-text={field.id}
                className="absolute inset-0 z-[1] whitespace-pre-wrap transition-opacity duration-100"
              />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
