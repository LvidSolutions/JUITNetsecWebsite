import { useState } from 'react';
import { motion, useReducedMotion, useMotionValueEvent } from 'framer-motion';
import { Container } from '../ui';
import { HeroVideoBackground } from './HeroVideoBackground.jsx';
import { CTAButtons } from './CTAButtons.jsx';

const LOGO_LANDED_AT = 0.45;

export function Hero({ heroRef, introProgress }) {
  const prefersReducedMotion = useReducedMotion();
  const [logoLanded, setLogoLanded] = useState(() => introProgress.get() >= LOGO_LANDED_AT);

  useMotionValueEvent(introProgress, 'change', (latest) => {
    setLogoLanded(latest >= LOGO_LANDED_AT);
  });

  const copyVisible = prefersReducedMotion || logoLanded;

  return (
    <section id="hem" ref={heroRef} className="relative -mt-20 h-[220vh] sm:h-[240vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-brand-black">
        <HeroVideoBackground />

        <Container className="relative z-20 flex h-full flex-col items-center justify-center pb-10 pt-24 text-center sm:pb-12 sm:pt-28 lg:pb-14 lg:pt-32">
          <motion.div
            className="mx-auto max-w-5xl"
            initial={false}
            animate={{ opacity: copyVisible ? 1 : 0, y: copyVisible ? 0 : 24 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-mist/60">
              Secure IT environments
            </p>
            <h1 className="mt-6 font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.03em] sm:text-7xl lg:text-8xl">
              <span className="block text-brand-green">Ready to secure</span>
              <span className="block text-brand-white">your IT environment?</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-brand-mist sm:text-lg sm:leading-8">
              Infrastructure, secure communication and cybersecurity advisory for organizations that
              depend on control, uptime and trust.
            </p>

            <CTAButtons />
          </motion.div>
        </Container>
      </div>
    </section>
  );
}
