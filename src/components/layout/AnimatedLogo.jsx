import { useEffect, useRef, useState } from 'react';
import { motion, useTransform, useReducedMotion } from 'framer-motion';
import { BrandWordmark } from './BrandWordmark.jsx';

// Andel av viewportbredden som den full-bleed-stora startloggan ska spänna över.
// Strax under 1 så texten inte klipps eller skapar horisontell scroll.
const FULL_BLEED_FILL = 0.98;
// Känd font-size som den dolda referens-wordmarken mäts vid. Wordmarkens bredd
// skalar linjärt med font-size, så bredd/font-size ger ett storleksoberoende
// förhållande vi kan räkna full-bleed-storleken från.
const REFERENCE_FONT_SIZE = 100;

function measure(targetRef, ratio) {
  if (!targetRef.current || !ratio) {
    return null;
  }

  const targetRect = targetRef.current.getBoundingClientRect();
  const isMobile = window.innerWidth < 640;

  // Full-bleed startstorlek: font-size som gör att wordmarken spänner i stort
  // sett hela viewportbredden. ratio = wordmarkbredd / font-size (px per em).
  const startSize = (window.innerWidth * FULL_BLEED_FILL) / ratio;

  return {
    // startläge: full-bleed wordmark centrerad över hero-videon
    startX: window.innerWidth / 2,
    startY: window.innerHeight * (isMobile ? 0.44 : 0.46),
    startSize,
    // slutläge: liten logga som landar i header-slotten uppe till vänster
    endX: targetRect.left + targetRect.width / 2,
    endY: targetRect.top + targetRect.height / 2,
    endSize: isMobile ? 18 : 20,
  };
}

const SHRINK_END = 0.45;

export function AnimatedLogo({ targetRef, progress }) {
  const prefersReducedMotion = useReducedMotion();
  const measureRef = useRef(null);
  const [ratio, setRatio] = useState(null);
  const [geometry, setGeometry] = useState(null);

  // Mät wordmarkens bredd/font-size-förhållande från en dold referenskopia.
  // Görs om när webbfonten laddats klart (då bredden ändras) och vid resize.
  useEffect(() => {
    function measureRatio() {
      if (!measureRef.current) {
        return;
      }
      const width = measureRef.current.getBoundingClientRect().width;
      if (width > 0) {
        setRatio(width / REFERENCE_FONT_SIZE);
      }
    }

    measureRatio();
    if (document.fonts?.ready) {
      document.fonts.ready.then(measureRatio).catch(() => {});
    }
    window.addEventListener('resize', measureRatio);
    return () => window.removeEventListener('resize', measureRatio);
  }, []);

  useEffect(() => {
    function recalc() {
      setGeometry(measure(targetRef, ratio));
    }

    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [targetRef, ratio]);

  const inputRange = [0, SHRINK_END];

  const x = useTransform(progress, inputRange, geometry ? [geometry.startX, geometry.endX] : [0, 0], {
    clamp: true,
  });
  const y = useTransform(progress, inputRange, geometry ? [geometry.startY, geometry.endY] : [0, 0], {
    clamp: true,
  });
  // Linjär interpolation: font-size minskar lika mycket per scroll-tick hela
  // vägen från full-bleed-storleken ner till header-storleken.
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

  // Dold referens-wordmark som alltid renderas så bredden kan mätas.
  const measureProbe = (
    <span
      ref={measureRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 -z-10 opacity-0"
      style={{ fontSize: REFERENCE_FONT_SIZE, whiteSpace: 'nowrap' }}
    >
      <BrandWordmark />
    </span>
  );

  if (!geometry) {
    return measureProbe;
  }

  if (prefersReducedMotion) {
    return (
      <>
        {measureProbe}
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
      </>
    );
  }

  return (
    <>
      {measureProbe}
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
          className="inline-block whitespace-nowrap"
          style={{ fontSize, textShadow }}
        >
          <BrandWordmark />
        </motion.span>
      </motion.a>
    </>
  );
}
