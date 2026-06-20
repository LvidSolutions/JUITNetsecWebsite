import { useCallback, useEffect, useRef } from 'react';
import { useMotionValue } from 'framer-motion';

// Mäter hero-sektionens scrollframsteg manuellt (0 = hero i topp, 1 = hero helt
// utscrollad) i stället för framer-motions useScroll. Den manuella varianten
// läser elementet på nytt vid varje scroll och kopplas via en callback-ref, så
// progressen återkopplas korrekt när hero avmonteras och återmonteras – t.ex.
// när man lämnar startsidan och kommer tillbaka (annars fastnar den på 0 och
// den stora "JUIT NETSEC"-loggan krymper aldrig in i hörnet).
export function useHeroIntroProgress() {
  const scrollYProgress = useMotionValue(0);
  const elementRef = useRef(null);

  const update = useCallback(() => {
    const el = elementRef.current;
    if (!el) {
      return;
    }

    const rect = el.getBoundingClientRect();
    // Motsvarar offset ['start start', 'end start']: 0 när hero-toppen är i
    // viewporttoppen, 1 när hero-botten passerat viewporttoppen.
    const progress = rect.height > 0 ? -rect.top / rect.height : 0;
    scrollYProgress.set(Math.min(Math.max(progress, 0), 1));
  }, [scrollYProgress]);

  // Callback-ref som körs när hero-elementet monteras/avmonteras.
  const heroRef = useCallback(
    (node) => {
      elementRef.current = node;
      if (node) {
        update();
      } else {
        scrollYProgress.set(0);
      }
    },
    [update, scrollYProgress],
  );

  useEffect(() => {
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  return { scrollYProgress, heroRef };
}
