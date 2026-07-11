import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import './DistortedText.css';
import { createReloadWords, reloadConfig } from './textReload.js';

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
  const [active, setActive] = useState(false);
  const [sequence, setSequence] = useState(1);
  const config = reloadConfig(intensity);
  const textValue = getTextValue(children);
  const words = useMemo(
    () => createReloadWords(textValue, sequence * 7919, config.maxIntermediates),
    [config.maxIntermediates, sequence, textValue],
  );

  useEffect(
    () => () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const startReload = () => {
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
        (duration || config.duration) + config.settleDelay,
      );
    });
  };

  const handlePointerEnter = (event) => {
    onPointerEnter?.(event);
    if (!event.defaultPrevented) startReload();
  };

  const handlePointerLeave = (event) => {
    window.cancelAnimationFrame(animationFrameRef.current);
    window.clearTimeout(timeoutRef.current);
    hoverStartedRef.current = false;
    setActive(false);
    onPointerLeave?.(event);
  };

  return (
    <Component
      {...props}
      ref={forwardedRef}
      className={`distorted-text ${className}`.trim()}
      data-cursor={props['data-cursor'] || 'text'}
      data-distortion-active={active ? 'true' : undefined}
      data-distortion-text={textValue || undefined}
      data-reload-active={active ? 'true' : undefined}
      style={{
        '--reload-duration': `${duration || config.duration}ms`,
        ...style,
      }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={startReload}
    >
      <span className="text-reload-source">{children}</span>
      {active && (
        <span className="text-reload-layer" aria-hidden="true">
          {words.map((word) =>
            word.type === 'space' ? (
              word.value
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
