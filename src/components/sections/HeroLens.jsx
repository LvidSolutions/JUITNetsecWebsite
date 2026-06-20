import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const SIZE_DESKTOP = 220;
const SIZE_TABLET = 160;

/**
 * Frostad konvex "lins" som följer musen över hero-bakgrunden.
 * Använder backdrop-filter (blur + lätt magnifiering via scale-känsla i skuggor)
 * och en radial highlight för att ge ett glasartat, insugande intryck.
 * Avstängd på touch/pekskärm och vid prefers-reduced-motion.
 */
export function HeroLens({ containerRef }) {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState(SIZE_DESKTOP);

  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const springX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 });

  const rafRef = useRef(0);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setEnabled(finePointer && !prefersReducedMotion);

    function syncSize() {
      setSize(window.innerWidth < 1024 ? SIZE_TABLET : SIZE_DESKTOP);
    }
    syncSize();
    window.addEventListener('resize', syncSize);
    return () => window.removeEventListener('resize', syncSize);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const el = containerRef.current;
    if (!enabled || !el) {
      return undefined;
    }

    function handleMove(event) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
      });
    }
    function handleEnter(event) {
      const rect = el.getBoundingClientRect();
      x.jump?.(event.clientX - rect.left);
      y.jump?.(event.clientY - rect.top);
      setVisible(true);
    }
    function handleLeave() {
      setVisible(false);
    }

    el.addEventListener('pointermove', handleMove);
    el.addEventListener('pointerenter', handleEnter);
    el.addEventListener('pointerleave', handleLeave);
    return () => {
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerenter', handleEnter);
      el.removeEventListener('pointerleave', handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, containerRef, x, y]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-10 rounded-full"
      style={{
        width: size,
        height: size,
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        backdropFilter: 'blur(5px) saturate(1.25) brightness(1.06)',
        WebkitBackdropFilter: 'blur(5px) saturate(1.25) brightness(1.06)',
        // konvex glas-känsla: ljus i mitten, mörkare/refrakterad kant + grön rim
        background:
          'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.14), rgba(255,255,255,0.02) 42%, transparent 62%)',
        boxShadow:
          'inset 0 0 28px rgba(255,255,255,0.10), inset 0 0 1px rgba(255,255,255,0.5), 0 0 0 1px rgba(0,200,83,0.22), 0 0 40px rgba(0,200,83,0.16)',
      }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.7 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
