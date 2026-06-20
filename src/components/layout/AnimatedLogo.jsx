import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useTransform, useReducedMotion } from 'framer-motion';
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
// hur stor del av krymp-resan som går åt till att tona ut den stora startloggan
const LARGE_TEXT_FADE_END = SHRINK_END * 0.3;

export function AnimatedLogo({ targetRef, progress }) {
  const prefersReducedMotion = useReducedMotion();
  const [geometry, setGeometry] = useState(null);

  // engångslås: när loggan en gång landat i header-slotten ska den inte
  // kunna expandera tillbaka till startläget om man scrollar upp igen.
  const hasCollapsedRef = useRef(false);
  const clampedProgress = useMotionValue(0);

  useMotionValueEvent(progress, 'change', (latest) => {
    if (latest >= SHRINK_END) {
      hasCollapsedRef.current = true;
    }
    clampedProgress.set(hasCollapsedRef.current ? SHRINK_END : latest);
  });

  useEffect(() => {
    function recalc() {
      setGeometry(measure(targetRef));
    }

    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [targetRef]);

  const inputRange = [0, SHRINK_END];

  const x = useTransform(clampedProgress, inputRange, geometry ? [geometry.startX, geometry.endX] : [0, 0]);
  const y = useTransform(clampedProgress, inputRange, geometry ? [geometry.startY, geometry.endY] : [0, 0]);
  const fontSize = useTransform(
    clampedProgress,
    inputRange,
    geometry ? [geometry.startSize, geometry.endSize] : [20, 20],
  );
  const glow = useTransform(clampedProgress, [0, SHRINK_END * 0.7, SHRINK_END], [0.85, 0.4, 0]);
  const textShadow = useTransform(glow, (value) => `0 0 ${value * 48}px rgba(0,200,83,${value})`);

  // stor startlogga ("JUIT NETSEC", HackFirst-likt) tonas ut tidigt i scrollresan,
  // medan den vanliga wordmarken (oförändrad krymp-animation) tonas in.
  const largeTextOpacity = useTransform(clampedProgress, [0, LARGE_TEXT_FADE_END], [1, 0]);
  const wordmarkOpacity = useTransform(clampedProgress, [0, LARGE_TEXT_FADE_END], [0, 1]);

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
      className="pointer-events-auto fixed left-0 top-0 z-[60] grid place-items-center"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.span
        aria-hidden="true"
        style={{ opacity: largeTextOpacity }}
        className="col-start-1 row-start-1 whitespace-nowrap text-[clamp(2.75rem,13vw,8.5rem)] font-display font-light uppercase tracking-[-0.01em] text-brand-white"
      >
        JUIT NETSEC
      </motion.span>
      <motion.span
        className="col-start-1 row-start-1 inline-block"
        style={{ opacity: wordmarkOpacity, fontSize, textShadow }}
      >
        <BrandWordmark />
      </motion.span>
    </motion.a>
  );
}
