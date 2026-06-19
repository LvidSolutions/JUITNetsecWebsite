import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

function measure(heroRef, targetRef) {
  if (!heroRef.current || !targetRef.current) {
    return null;
  }

  const targetRect = targetRef.current.getBoundingClientRect();
  const isMobile = window.innerWidth < 640;

  return {
    startX: window.innerWidth / 2,
    startY: window.innerHeight * (isMobile ? 0.22 : 0.26),
    startSize: isMobile ? 34 : 64,
    endX: targetRect.left + targetRect.width / 2,
    endY: targetRect.top + targetRect.height / 2,
    endSize: 17,
  };
}

export function AnimatedLogo({ heroRef, targetRef }) {
  const prefersReducedMotion = useReducedMotion();
  const [geometry, setGeometry] = useState(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    function recalc() {
      setGeometry(measure(heroRef, targetRef));
    }

    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [heroRef, targetRef]);

  const inputRange = [0, 0.62, 1];

  const x = useTransform(
    scrollYProgress,
    inputRange,
    geometry ? [geometry.startX, geometry.startX, geometry.endX] : [0, 0, 0],
  );
  const y = useTransform(
    scrollYProgress,
    inputRange,
    geometry ? [geometry.startY, geometry.startY, geometry.endY] : [0, 0, 0],
  );
  const fontSize = useTransform(
    scrollYProgress,
    inputRange,
    geometry ? [geometry.startSize, geometry.startSize, geometry.endSize] : [16, 16, 16],
  );
  const letterSpacing = useTransform(scrollYProgress, [0, 1], [4, 1.5]);
  const glow = useTransform(scrollYProgress, [0, 0.7, 1], [0.85, 0.35, 0]);
  const textShadow = useTransform(glow, (value) => `0 0 ${value * 48}px rgba(0,200,83,${value})`);

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
