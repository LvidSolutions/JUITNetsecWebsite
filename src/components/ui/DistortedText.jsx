import { forwardRef, useEffect, useRef, useState } from 'react';
import './DistortedText.css';

const intensityConfig = {
  subtle: { shift: 2, duration: 360 },
  medium: { shift: 4, duration: 440 },
  strong: { shift: 7, duration: 520 },
};

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
    colorSeparation = true,
    duration,
    onPointerEnter,
    onPointerLeave,
    style,
    ...props
  },
  forwardedRef,
) {
  const animationFrameRef = useRef(0);
  const [active, setActive] = useState(false);
  const [sequence, setSequence] = useState(0);
  const config = intensityConfig[intensity] || intensityConfig.medium;
  const textValue = getTextValue(children);

  useEffect(
    () => () => {
      window.cancelAnimationFrame(animationFrameRef.current);
    },
    [],
  );

  const handlePointerEnter = (event) => {
    onPointerEnter?.(event);
    if (event.defaultPrevented || !textValue) return;

    window.cancelAnimationFrame(animationFrameRef.current);
    setActive(false);
    animationFrameRef.current = window.requestAnimationFrame(() => {
      setSequence((value) => value + 1);
      setActive(true);
    });
  };

  const handlePointerLeave = (event) => {
    window.cancelAnimationFrame(animationFrameRef.current);
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
      data-distortion-sequence={sequence || undefined}
      data-distortion-rgb={colorSeparation ? 'true' : 'false'}
      style={{
        '--distortion-shift': `${config.shift}px`,
        '--distortion-duration': `${duration || config.duration}ms`,
        ...style,
      }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </Component>
  );
});
