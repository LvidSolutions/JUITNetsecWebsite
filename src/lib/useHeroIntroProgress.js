import { useScroll } from 'framer-motion';

export function useHeroIntroProgress(heroRef) {
  return useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
}
