import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export function StatCard({ prefix = '', value, suffix = '', heading, caption, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const prefersReducedMotion = useReducedMotion();
  const [count, setCount] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      return;
    }

    const duration = 1100;
    const start = performance.now();
    let frame;

    function tick(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setCount(Math.round(eased * value));

      if (elapsed < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, prefersReducedMotion, value]);

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-card border border-brand-line bg-white/[0.03] p-6 transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-green/70 to-transparent" />
      <p className="text-4xl font-semibold tracking-tight text-brand-white sm:text-5xl">
        {prefix}
        {count}
        {suffix}
      </p>
      <p className="mt-3 text-sm font-medium leading-6 text-brand-mist">{heading}</p>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.1em] text-brand-green/70">{caption}</p>
    </motion.div>
  );
}
