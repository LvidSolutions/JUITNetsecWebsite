import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// IntroSequence: en gammaldags CRT-/TV-påslagning. Skärmen är svart (TV av), en
// ljus horisontell stråle slår till, och "ridån" rullas upp vertikalt med en
// blixt som avslöjar hela hero-sektionen – JUIT NETSEC-loggan OCH hero-bilden
// samtidigt, i en enda rörelse.
//
// Tekniken: två svarta fält (övre/nedre) täcker hela skärmen och dras isär från
// mitten så att den RIKTIGA heron + AnimatedLogo bakom avtäcks – därför avslöjas
// logga och hero garanterat exakt samtidigt, utan fördröjning eller cut.
const DURATION = { normal: 0.95, reduced: 0.5 };
const EASE = [0.22, 1, 0.36, 1];

export function IntroSequence({ onComplete }) {
  const prefersReducedMotion = useReducedMotion();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [reduce] = useState(() => prefersReducedMotion);
  const total = reduce ? DURATION.reduced : DURATION.normal;

  // Lämna över till heron när sekvensen är klar.
  useEffect(() => {
    const timer = window.setTimeout(() => onCompleteRef.current?.(), total * 1000);
    return () => window.clearTimeout(timer);
  }, [total]);

  // Lugn, blixtfri variant för prefers-reduced-motion: svart tonas bort.
  if (reduce) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] bg-brand-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: total, ease: EASE }}
        role="status"
        aria-label="Loading"
      />
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: 'linear' }}
      role="status"
      aria-label="Loading"
    >
      {/* Övre svart fält – dras uppåt och avtäcker heron underifrån. */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[51%] origin-top bg-brand-black"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: [1, 1, 0, 0] }}
        transition={{ duration: total, times: [0, 0.2, 0.6, 1], ease: EASE }}
      />
      {/* Nedre svart fält – dras nedåt. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[51%] origin-bottom bg-brand-black"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: [1, 1, 0, 0] }}
        transition={{ duration: total, times: [0, 0.2, 0.6, 1], ease: EASE }}
      />

      {/* CRT-stråle: en tunn ljuslinje tvärs över mitten som slår till och tonar
          ut medan ridån öppnas. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-white shadow-[0_0_24px_7px_rgba(255,255,255,0.5)]"
        style={{ transformOrigin: 'center' }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 1, 0, 0] }}
        transition={{
          scaleX: { duration: total, times: [0, 0.14, 1], ease: 'linear' },
          opacity: { duration: total, times: [0, 0.12, 0.5, 0.66, 1], ease: 'linear' },
        }}
      />

      {/* Blixt: ett par snabba flimmer och en kraftig vit "bloom" precis när
          bilden rullas upp. Få och korta (ingen strobe). */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.1, 0.03, 0.5, 0, 0] }}
        transition={{ duration: total, times: [0, 0.16, 0.22, 0.28, 0.36, 0.62, 1], ease: 'linear' }}
      />
    </motion.div>
  );
}
