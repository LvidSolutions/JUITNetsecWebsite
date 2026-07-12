import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './DistortedText.css';
import { createReloadSequence, reloadConfig } from './textReload.js';

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
    intensity = 'medium',
    colorSeparation: _colorSeparation = false,
    duration,
    onPointerEnter,
    onPointerLeave,
    style,
    ...props
  },
  forwardedRef,
) {
  const animationFrameRef = useRef(0);
  const timeoutRef = useRef(0);
  const hoverStartedRef = useRef(false);
  const proximityActiveRef = useRef(false);
  const elementRef = useRef(null);
  const [active, setActive] = useState(false);
  const [sequence, setSequence] = useState(1);
  const baseConfig = useMemo(() => reloadConfig(intensity), [intensity]);
  const config = useMemo(
    () => ({ ...baseConfig, duration: duration || baseConfig.duration }),
    [baseConfig, duration],
  );
  const textValue = getTextValue(children);
  const reloadSequence = useMemo(
    () => createReloadSequence(textValue, sequence * 7919, config),
    [
      config.anchorCount,
      config.delayJitter,
      config.duration,
      config.maxIntermediates,
      config.minIntermediates,
      config.waveStep,
      sequence,
      textValue,
    ],
  );

  useEffect(
    () => () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const finishReload = useCallback(() => {
    window.cancelAnimationFrame(animationFrameRef.current);
    window.clearTimeout(timeoutRef.current);
    setActive(false);
  }, []);

  const startReload = useCallback(() => {
    if (hoverStartedRef.current || !textValue) return;
    hoverStartedRef.current = true;

    window.cancelAnimationFrame(animationFrameRef.current);
    window.clearTimeout(timeoutRef.current);
    setActive(false);
    animationFrameRef.current = window.requestAnimationFrame(() => {
      setSequence((value) => value + 1);
      setActive(true);
      timeoutRef.current = window.setTimeout(
        () => setActive(false),
        reloadSequence.duration + config.settleDelay,
      );
    });
  }, [config.settleDelay, reloadSequence.duration, textValue]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const onProximityEnter = () => {
      proximityActiveRef.current = true;
      startReload();
    };
    const onProximityLeave = () => {
      proximityActiveRef.current = false;
      hoverStartedRef.current = false;
      finishReload();
    };

    element.addEventListener('homecursorenter', onProximityEnter);
    element.addEventListener('homecursorleave', onProximityLeave);
    return () => {
      element.removeEventListener('homecursorenter', onProximityEnter);
      element.removeEventListener('homecursorleave', onProximityLeave);
    };
  }, [finishReload, startReload]);

  const handlePointerEnter = (event) => {
    onPointerEnter?.(event);
    if (!event.defaultPrevented) startReload();
  };

  const handlePointerLeave = (event) => {
    if (!proximityActiveRef.current) {
      hoverStartedRef.current = false;
      finishReload();
    }
    onPointerLeave?.(event);
  };

  const setElementRef = (node) => {
    elementRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  return (
    <Component
      {...props}
      ref={setElementRef}
      className={`distorted-text ${className}`.trim()}
      data-cursor={props['data-cursor'] || 'text'}
      data-hover-radius={props['data-hover-radius'] || '30'}
      data-distortion-active={active ? 'true' : undefined}
      data-distortion-text={textValue || undefined}
      data-reload-active={active ? 'true' : undefined}
      data-reload-proximity="true"
      style={{
        '--reload-duration': `${config.duration}ms`,
        ...style,
      }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={startReload}
    >
      <span className="text-reload-source">{children}</span>
      {active && (
        <span className="text-reload-layer" aria-hidden="true">
          {reloadSequence.words.map((word) =>
            word.type === 'space' ? (
              word.value
            ) : word.type === 'break' ? (
              <br key={word.key} />
            ) : (
              <span className="text-reload-word" key={word.key}>
                {word.glyphs.map((glyph) => (
                  <span className="text-reload-glyph" key={glyph.key}>
                    <span className="text-reload-glyph__measure">{glyph.character}</span>
                    <span
                      className="text-reload-glyph__track"
                      style={{
                        '--glyph-delay': `${glyph.delay}ms`,
                        '--glyph-travel': `-${glyph.rail.length - 1}em`,
                        '--glyph-steps': glyph.rail.length - 1,
                      }}
                    >
                      {glyph.rail.map((character, index) => (
                        <span key={`${glyph.key}-${index}`}>{character}</span>
                      ))}
                    </span>
                  </span>
                ))}
              </span>
            ),
          )}
        </span>
      )}
    </Component>
  );
});
