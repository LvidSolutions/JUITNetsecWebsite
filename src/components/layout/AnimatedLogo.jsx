import { useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useTransform, useReducedMotion } from 'framer-motion';
import { BrandWordmark } from './BrandWordmark.jsx';

function measure(targetRef) {
  if (!targetRef.current) {
    return null;
  }

  const targetRect = targetRef.current.getBoundingClientRect();
  const isMobile = window.innerWidth < 640;

  return {
    // startläge: stor, nästan heltäckande "JUIT NETSEC" högt upp i hero (HackFirst-likt)
    startX: window.innerWidth / 2,
    startY: window.innerHeight * (isMobile ? 0.22 : 0.24),
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

  // Använd scroll-progress direkt så hero-loggan kan expandera tillbaka när man
  // scrollar upp till toppen igen. Tidigare låstes progressen efter första
  // landningen i headern, vilket gjorde att startanimationen bara syntes en gång.
  useMotionValueEvent(progress, 'change', () => {
    // Håller komponenten prenumererad på progress utan att införa ett engångslås.
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

  const x = useTransform(progress, inputRange, geometry ? [geometry.startX, geometry.endX] : [0, 0], {
    clamp: true,
  });
  const y = useTransform(progress, inputRange, geometry ? [geometry.startY, geometry.endY] : [0, 0], {
    clamp: true,
  });
  const fontSize = useTransform(
    progress,
    inputRange,
    geometry ? [geometry.startSize, geometry.endSize] : [20, 20],
    { clamp: true },
  );
  const glow = useTransform(progress, [0, SHRINK_END * 0.7, SHRINK_END], [0.85, 0.4, 0], {
    clamp: true,
  });
  const textShadow = useTransform(glow, (value) => `0 0 ${value * 48}px rgba(0,200,83,${value})`);

  // stor startlogga ("JUIT NETSEC", HackFirst-likt) tonas ut tidigt i scrollresan,
  // medan den vanliga wordmarken tonas in. Eftersom progress inte längre låses
  // spelas övergången tillbaka när användaren scrollar upp igen.
  const largeTextOpacity = useTransform(progress, [0, LARGE_TEXT_FADE_END], [1, 0], {
    clamp: true,
  });
  const wordmarkOpacity = useTransform(progress, [0, LARGE_TEXT_FADE_END], [0, 1], {
    clamp: true,
  });

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
      {/* Den stora "JUIT NETSEC"-texten ligger absolut centrerad och utanför
          ankarets flöde + pointer-events-none. Annars håller den ankaret ~hela
          skärmbredden brett (även när det krympt, eftersom bara opaciteten
          tonas – inte bredden) och blockerar klick på Home/Services i navet. */}
      <motion.span
        aria-hidden="true"
        style={{ opacity: largeTextOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(2.75rem,15.2vw,17rem)] font-display font-light uppercase leading-[0.9] tracking-[-0.03em] text-brand-white"
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
