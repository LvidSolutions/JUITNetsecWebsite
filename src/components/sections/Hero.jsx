import { useState } from 'react';
import { motion, useTransform, useReducedMotion, useMotionValueEvent } from 'framer-motion';
import { Container } from '../ui';
import { HeroVideoBackground } from './HeroVideoBackground.jsx';
import { CTAButtons } from './CTAButtons.jsx';

const BLACK_FADE_END = 0.4;
const LOGO_LANDED_AT = 0.65;

export function Hero({ heroRef, introProgress }) {
  const prefersReducedMotion = useReducedMotion();
  const [logoLanded, setLogoLanded] = useState(false);
  const blackOverlayOpacity = useTransform(introProgress, [0, BLACK_FADE_END], [1, 0]);

  useMotionValueEvent(introProgress, 'change', (latest) => {
    if (!logoLanded && latest >= LOGO_LANDED_AT) {
      setLogoLanded(true);
    }
  });

  const copyVisible = prefersReducedMotion || logoLanded;

  return (
    <section
      id="hem"
      ref={heroRef}
      className="relative -mt-20 h-[320vh] sm:h-[340vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-brand-black">
        <HeroVideoBackground />

        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-brand-black"
          style={prefersReducedMotion ? { opacity: 0 } : { opacity: blackOverlayOpacity }}
        />

        <Container className="relative z-20 flex h-full flex-col justify-end pb-24 sm:pb-28 lg:pb-32">
          <motion.div
            className="max-w-4xl"
            initial={false}
            animate={{ opacity: copyVisible ? 1 : 0, y: copyVisible ? 0 : 24 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-5 inline-flex rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-sm font-medium text-brand-green shadow-glow backdrop-blur-sm">
              Cybersäkerhet • Nätverk • Infrastruktur
            </p>
            <h1 className="max-w-5xl text-3xl font-semibold leading-[1.08] text-brand-white sm:text-5xl lg:text-6xl">
              Bygg en säkrare IT-miljö innan nästa incident testar den
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-brand-mist sm:text-xl sm:leading-9">
              JUIT NetSec hjälper företag att stärka nätverk, brandväggar, identitet, moln och kritisk
              infrastruktur med senior teknisk expertis.
            </p>

            <CTAButtons />
          </motion.div>
        </Container>
      </div>
    </section>
  );
}
