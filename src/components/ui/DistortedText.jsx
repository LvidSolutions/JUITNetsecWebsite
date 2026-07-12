import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './DistortedText.css';
import { createSelectiveSequence, reloadConfig } from './textReload.js';

function getTextValue(children) {
  return Array.isArray(children)
    ? children.filter((child) => typeof child === 'string' || typeof child === 'number').join('')
    : typeof children === 'string' || typeof children === 'number'
      ? String(children)
      : '';
}

export const DistortedText = forwardRef(function DistortedText(
  {
    as: Component = 'span',
    className = '',
    children,
    selective = false,
    colorSeparation: _colorSeparation = false,
    duration,
    onPointerEnter,
    onPointerLeave,
    style,
    ...props
  },
  forwardedRef,
) {
  const timeoutRef = useRef(0);
  const hoverStartedRef = useRef(false);
  const proximityActiveRef = useRef(false);
  const elementRef = useRef(null);
  const [active, setActive] = useState(false);
  const [sequence, setSequence] = useState(1);
  const textValue = getTextValue(children);
  const config = useMemo(() => {
    const base = reloadConfig();
    return { ...base, duration: duration || base.duration };
  }, [duration]);
  const selectiveSequence = useMemo(
    () => createSelectiveSequence(textValue, sequence * 7919, config),
    [
      config.duration,
      config.glyphStagger,
      config.maxIntermediates,
      config.maxSegment,
      config.minIntermediates,
      config.minSegment,
      config.stripCount,
      config.stripStagger,
      sequence,
      textValue,
    ],
  );

  const stopReload = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    setActive(false);
  }, []);

  const startReload = useCallback(() => {
    if (!selective || hoverStartedRef.current || !textValue) return;
    hoverStartedRef.current = true;
    window.clearTimeout(timeoutRef.current);
    setSequence((value) => value + 1);
    setActive(true);
    timeoutRef.current = window.setTimeout(
      () => setActive(false),
      config.duration + (config.stripCount - 1) * config.stripStagger + (config.maxSegment - 1) * config.glyphStagger + config.settleDelay,
    );
  }, [config, selective, textValue]);

  useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !selective) return undefined;

    const onProximityEnter = () => {
      proximityActiveRef.current = true;
      startReload();
    };
    const onProximityLeave = () => {
      proximityActiveRef.current = false;
      hoverStartedRef.current = false;
      stopReload();
    };

    element.addEventListener('homecursorenter', onProximityEnter);
    element.addEventListener('homecursorleave', onProximityLeave);
    return () => {
      element.removeEventListener('homecursorenter', onProximityEnter);
      element.removeEventListener('homecursorleave', onProximityLeave);
    };
  }, [selective, startReload, stopReload]);

  const setElementRef = (node) => {
    elementRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  const handlePointerEnter = (event) => {
    onPointerEnter?.(event);
    if (!event.defaultPrevented) startReload();
  };

  const handlePointerLeave = (event) => {
    if (!proximityActiveRef.current) {
      hoverStartedRef.current = false;
      stopReload();
    }
    onPointerLeave?.(event);
  };

  return (
    <Component
      {...props}
      ref={setElementRef}
      className={`distorted-text ${className}`.trim()}
      data-cursor={selective ? props['data-cursor'] || 'text' : props['data-cursor']}
      data-hover-radius={selective ? props['data-hover-radius'] || '34' : props['data-hover-radius']}
      data-reload-active={active ? 'true' : undefined}
      data-reload-proximity={selective ? 'true' : undefined}
      style={{
        '--reload-duration': `${config.duration}ms`,
        ...style,
      }}
      onPointerEnter={selective ? handlePointerEnter : onPointerEnter}
      onPointerLeave={selective ? handlePointerLeave : onPointerLeave}
      onPointerMove={selective ? startReload : undefined}
    >
      {selective ? (
        <span className="selective-text-source">
          {selectiveSequence.words.map((word) =>
            word.type === 'space' ? (
              word.value
            ) : word.type === 'break' ? (
              <br key={word.key} />
            ) : (
              <span className="selective-text-word" key={word.key}>
                {word.glyphs.map((glyph) => {
                  const isGlitching = active && glyph.rail;
                  return (
                    <span
                      className="selective-text-glyph"
                      data-glitching={isGlitching ? 'true' : undefined}
                      key={glyph.index}
                    >
                      <span className="selective-text-glyph__source">{glyph.character}</span>
                      {isGlitching && (
                        <span className="selective-text-glyph__slot" aria-hidden="true">
                          <span
                            className="selective-text-glyph__track"
                            style={{
                              '--glyph-delay': `${glyph.delay}ms`,
                              '--glyph-travel': `-${((glyph.rail.length - 1) / glyph.rail.length) * 100}%`,
                              '--glyph-steps': glyph.rail.length - 1,
                            }}
                          >
                            {glyph.rail.map((character, index) => (
                              <span key={`${glyph.index}-${index}`}>{character}</span>
                            ))}
                          </span>
                        </span>
                      )}
                    </span>
                  );
                })}
              </span>
            ),
          )}
        </span>
      ) : (
        children
      )}
    </Component>
  );
});
