import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const TICKS = Array.from({ length: 40 });

export function IntroLoader({ onComplete }) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const duration = prefersReducedMotion ? 500 : 2400;
    const start = performance.now();
    let frame;
    let finished = false;

    function tick(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      // ease-out so the counter feels deliberate and decelerates toward 100
      const eased = 1 - Math.pow(1 - elapsed, 2.2);
      setProgress(Math.round(eased * 100));

      if (elapsed < 1) {
        frame = requestAnimationFrame(tick);
      } else if (!finished) {
        finished = true;
        // brief beat at 100% before handing over to the hero
        window.setTimeout(() => onCompleteRef.current?.(), prefersReducedMotion ? 120 : 420);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion]);

  const padded = String(progress).padStart(3, '0');

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-brand-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.25 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Laddar"
      role="status"
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src="/assets/brus.mp4" type="video/mp4" />
      </video>

      {/* tonande lager */}
      <div className="absolute inset-0 bg-brand-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,200,83,0.16),transparent_55%)]" />
      <div className="intro-scanlines absolute inset-0 opacity-60" />

      {/* scanning beam */}
      <div className="pointer-events-none absolute inset-0">
        <div className="intro-scanbeam absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_bottom,transparent,rgba(0,200,83,0.10),transparent)]" />
      </div>

      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full max-w-xl flex-col items-center"
        >
          <p className="mb-6 font-mono text-[0.7rem] uppercase tracking-[0.45em] text-brand-green/80">
            JUIT NETSEC
          </p>

          <div className="flex items-end gap-2 font-mono tabular-nums">
            <span className="text-6xl font-semibold leading-none text-brand-white sm:text-7xl">
              {padded}
            </span>
            <span className="mb-1 text-2xl font-semibold text-brand-green sm:text-3xl">%</span>
          </div>

          <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.35em] text-brand-mist/55">
            Initierar säker miljö
          </p>

          {/* tick-rad / progress */}
          <div className="mt-8 w-full">
            <div className="flex h-6 items-end justify-between">
              {TICKS.map((_, i) => {
                const active = (i / (TICKS.length - 1)) * 100 <= progress;
                const tall = i % 5 === 0;
                return (
                  <span
                    key={i}
                    className={`w-px transition-colors duration-150 ${tall ? 'h-5' : 'h-2.5'} ${
                      active ? 'bg-brand-green' : 'bg-white/15'
                    }`}
                  />
                );
              })}
            </div>
            <div className="mt-3 h-px w-full bg-white/10">
              <div
                className="h-px bg-brand-green shadow-[0_0_12px_rgba(0,200,83,0.7)] transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
