import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from 'framer-motion';
import { BrandCube, BrandJuit, BrandNetsec, BrandWordmark } from './BrandWordmark.jsx';

const FULL_BLEED_FILL = 0.98;
const REFERENCE_FONT_SIZE = 100;
const FALLBACK_WORDMARK_RATIO = 117 / 20;
const INTRO_COMPLETE_AT = 0.45;
const INTRO_RESTORE_BELOW = 0.4;
const LOGO_EASE = [0.22, 1, 0.36, 1];
const START_CUBE_OFFSET_EM = 0.4;

function measure(targetRef, ratio) {
  if (!targetRef.current || !ratio) {
    return null;
  }

  const targetRect = targetRef.current.getBoundingClientRect();
  const isMobile = window.innerWidth < 640;
  const startSize = (window.innerWidth * FULL_BLEED_FILL) / ratio;

  return {
    startX: window.innerWidth / 2 - startSize * START_CUBE_OFFSET_EM,
    startY: window.innerHeight * (isMobile ? 0.44 : 0.46) - startSize / 2,
    startSize,
    endX: targetRect.left + targetRect.width / 2,
    endY: targetRect.top + targetRect.height / 2,
    endSize: isMobile ? 18 : 20,
  };
}

function getFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function useFinePointer() {
  const [isFinePointer, setIsFinePointer] = useState(getFinePointer);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setIsFinePointer(media.matches);

    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  return isFinePointer;
}

function SplitWordmark({ collapsed, cubeAlignmentOffset, cubeVerticalOffset, fontSize, isLanded, prefersReducedMotion }) {
  const transition = {
    duration: prefersReducedMotion ? 0.12 : collapsed ? 0.48 : 0.42,
    ease: LOGO_EASE,
  };
  const textOffset = prefersReducedMotion ? 0 : 7;

  return (
    <motion.span
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 font-display leading-none whitespace-nowrap"
      style={{ fontSize }}
    >
      <motion.span
        className="absolute whitespace-nowrap"
        style={{ right: '0.47em' }}
        animate={{
          clipPath: collapsed ? 'inset(0 0 0 100%)' : 'inset(0 0 0 0)',
          x: collapsed ? textOffset : 0,
        }}
        transition={transition}
      >
        <BrandJuit />
      </motion.span>

      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <motion.span
          className="inline-flex"
          style={isLanded ? undefined : { y: cubeVerticalOffset }}
          animate={isLanded ? { y: collapsed ? 0 : cubeAlignmentOffset } : undefined}
          transition={transition}
        >
          <motion.span
            className="inline-flex items-center justify-center"
            animate={{
              rotate: prefersReducedMotion ? 0 : collapsed ? 0 : 135,
              scale: collapsed ? 1 : 0.46,
            }}
            transition={transition}
          >
            <BrandCube className="h-[0.65em] w-[0.65em] shadow-none" />
          </motion.span>
        </motion.span>
      </span>

      <motion.span
        className="absolute whitespace-nowrap"
        style={{ left: '0.47em' }}
        animate={{
          clipPath: collapsed ? 'inset(0 100% 0 0)' : 'inset(0 0 0 0)',
          x: collapsed ? -textOffset : 0,
        }}
        transition={transition}
      >
        <BrandNetsec />
      </motion.span>
    </motion.span>
  );
}

export function AnimatedLogo({ compact = false, targetRef, progress }) {
  const prefersReducedMotion = useReducedMotion();
  const isFinePointer = useFinePointer();
  const measureRef = useRef(null);
  const [ratio, setRatio] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [introComplete, setIntroComplete] = useState(() => compact || progress.get() >= INTRO_COMPLETE_AT);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    function measureRatio() {
      if (!measureRef.current) return;

      const width = measureRef.current.getBoundingClientRect().width;
      if (width > 0) setRatio(width / REFERENCE_FONT_SIZE);
    }

    measureRatio();
    if (document.fonts?.ready) document.fonts.ready.then(measureRatio).catch(() => {});
    window.addEventListener('resize', measureRatio);
    return () => window.removeEventListener('resize', measureRatio);
  }, []);

  useEffect(() => {
    function recalc() {
      setGeometry(measure(targetRef, ratio || FALLBACK_WORDMARK_RATIO));
    }

    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [targetRef, ratio]);

  useEffect(() => {
    if (compact) setIntroComplete(true);
  }, [compact]);

  useMotionValueEvent(progress, 'change', (latest) => {
    if (compact) return;

    setIntroComplete((complete) => (complete ? latest >= INTRO_RESTORE_BELOW : latest >= INTRO_COMPLETE_AT));
  });

  const x = useTransform(progress, [0, INTRO_COMPLETE_AT], geometry ? [geometry.startX, geometry.endX] : [0, 0], { clamp: true });
  const y = useTransform(progress, [0, INTRO_COMPLETE_AT], geometry ? [geometry.startY, geometry.endY] : [0, 0], { clamp: true });
  const fontSize = useTransform(progress, [0, INTRO_COMPLETE_AT], geometry ? [geometry.startSize, geometry.endSize] : [20, 20], { clamp: true });
  const cubeVerticalOffset = useTransform(progress, [0, INTRO_COMPLETE_AT], geometry ? [geometry.startSize / 2, 0] : [0, 0], { clamp: true });

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

  if (!geometry) return measureProbe;

  const isLanded = compact || introComplete;
  const collapsed = isFinePointer && isLanded && !isHovered && !isFocused;
  const interactionProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };
  const wordmark = (
    <SplitWordmark
      collapsed={collapsed}
      cubeAlignmentOffset={geometry.endSize / 2}
      cubeVerticalOffset={prefersReducedMotion ? 0 : cubeVerticalOffset}
      fontSize={compact || prefersReducedMotion ? geometry.endSize : fontSize}
      isLanded={isLanded}
      prefersReducedMotion={prefersReducedMotion}
    />
  );

  if (compact) {
    return (
      <>
        {measureProbe}
        <a
          href="/"
          aria-label="JUIT NetSec — Home"
          data-testid="interactive-logo"
          data-state={collapsed ? 'cube' : 'wordmark'}
          className="header-logo pointer-events-auto fixed z-[60] grid h-11 w-40 place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          style={{ left: geometry.endX, top: geometry.endY, transform: 'translate(-50%, -50%)' }}
          {...interactionProps}
        >
          {wordmark}
        </a>
      </>
    );
  }

  const positionStyle = prefersReducedMotion
    ? { left: geometry.endX, top: geometry.endY, transform: 'translate(-50%, -50%)' }
    : { x, y, translateX: '-50%', translateY: '-50%' };

  return (
    <>
      {measureProbe}
      <motion.a
        href="/"
        aria-label="JUIT NetSec — Home"
        data-testid="interactive-logo"
        data-state={collapsed ? 'cube' : 'wordmark'}
        className="header-logo pointer-events-auto fixed left-0 top-0 z-[60] grid h-11 w-40 place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        style={positionStyle}
        initial={false}
        {...interactionProps}
      >
        {wordmark}
      </motion.a>
    </>
  );
}
