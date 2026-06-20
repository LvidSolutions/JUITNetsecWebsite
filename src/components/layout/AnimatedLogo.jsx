import { useEffect, useState } from 'react';
import { motion, useTransform, useReducedMotion } from 'framer-motion';
import { BrandWordmark } from './BrandWordmark.jsx';

function measure(targetRef) {
  if (!targetRef.current) {
    return null;
  }

  const targetRect = targetRef.current.getBoundingClientRect();
  const isMobile = window.innerWidth < 640;

  return {
    // startläge: stor wordmark centrerad i övre delen av hero (HackFirst-likt, bild 2)
    startX: window.innerWidth / 2,
    startY: window.innerHeight * (isMobile ? 0.28 : 0.32),
    startSize: isMobile ? 30 : 78,
    // slutläge: liten logga som landar i header-slotten uppe till vänster (bild 3)
    endX: targetRect.left + targetRect.width / 2,
    endY: targetRect.top + targetRect.height / 2,
    endSize: isMobile ? 18 : 20,
  };
}

const SHRINK_END = 0.45;

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
    geometry ? [geometry.startSize, geometry.endSize] : [20, 20],
  );
  const glow = useTransform(progress, [0, SHRINK_END * 0.7, SHRINK_END], [0.85, 0.4, 0]);
  const textShadow = useTransform(glow, (value) => `0 0 ${value * 48}px rgba(0,200,83,${value})`);

  if (!geometry) {
    return null;
  }

  if (prefersReducedMotion) {
    return (
      <a
        href="/"
        aria-label="JUIT NetSec AB, gå till startsidan"
        className="pointer-events-auto fixed left-0 top-0 z-[60]"
        style={{
          left: geometry.endX,
          top: geometry.endY,
          transform: 'translate(-50%, -50%)',
          fontSize: geometry.endSize,
        }}
      >
        <BrandWordmark />
      </a>
    );
  }

  return (
    <motion.a
      href="/"
      aria-label="JUIT NetSec AB, gå till startsidan"
      className="pointer-events-auto fixed left-0 top-0 z-[60]"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        fontSize,
      }}
    >
      <motion.span className="inline-block" style={{ textShadow }}>
        <BrandWordmark />
      </motion.span>
    </motion.a>
  );
}
