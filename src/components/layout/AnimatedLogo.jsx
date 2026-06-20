import { useEffect, useState } from 'react';
import { motion, useTransform, useReducedMotion } from 'framer-motion';

function measure(targetRef) {
  if (!targetRef.current) {
    return null;
  }

  const targetRect = targetRef.current.getBoundingClientRect();
  const isMobile = window.innerWidth < 640;

  return {
    startX: window.innerWidth / 2,
    startY: window.innerHeight * (isMobile ? 0.3 : 0.46),
    startSize: isMobile ? 44 : 96,
    endX: targetRect.left + targetRect.width / 2,
    endY: targetRect.top + targetRect.height / 2,
    endSize: 17,
  };
}

const SHRINK_END = 0.65;

export function AnimatedLogo({ targetRef, progress }) {
  const prefersReducedMotion = useReducedMotion();
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    function recalc() {
      setGeometry(measure(targetRef));
    }

    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [targetRef]);

  const inputRange = [0, SHRINK_END];

  const x = useTransform(progress, inputRange, geometry ? [geometry.startX, geometry.endX] : [0, 0]);
  const y = useTransform(progress, inputRange, geometry ? [geometry.startY, geometry.endY] : [0, 0]);
  const fontSize = useTransform(
    progress,
    inputRange,
    geometry ? [geometry.startSize, geometry.endSize] : [16, 16],
  );
  const letterSpacing = useTransform(progress, inputRange, [6, 1.5]);
  const glow = useTransform(progress, [0, SHRINK_END * 0.7, SHRINK_END], [0.9, 0.45, 0]);
  const textShadow = useTransform(glow, (value) => `0 0 ${value * 56}px rgba(0,200,83,${value})`);

  if (!geometry) {
    return null;
  }

  if (prefersReducedMotion) {
    return (
      <a
        href="/"
        aria-label="JUIT NetSec AB, gå till startsidan"
        className="pointer-events-auto fixed left-0 top-0 z-[60] whitespace-nowrap font-semibold text-brand-white"
        style={{
          left: geometry.endX,
          top: geometry.endY,
          transform: 'translate(-50%, -50%)',
          fontSize: geometry.endSize,
          letterSpacing: 1.5,
        }}
      >
        JUIT NETSEC
      </a>
    );
  }

  return (
    <motion.a
      href="/"
      aria-label="JUIT NetSec AB, gå till startsidan"
      className="pointer-events-auto fixed left-0 top-0 z-[60] whitespace-nowrap font-semibold text-brand-white"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        fontSize,
        letterSpacing,
      }}
    >
      <motion.span style={{ textShadow }}>JUIT NETSEC</motion.span>
    </motion.a>
  );
}
