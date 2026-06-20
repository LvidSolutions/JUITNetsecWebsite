import { useRef, useState } from 'react';
import { motion, useReducedMotion, useMotionValueEvent } from 'framer-motion';
import { Container } from '../ui';
import { HeroVideoBackground } from './HeroVideoBackground.jsx';
import { PixelCursorField } from './PixelCursorField.jsx';
import { CTAButtons } from './CTAButtons.jsx';

const LOGO_LANDED_AT = 0.45;

export function Hero({ heroRef, introProgress }) {
  const prefersReducedMotion = useReducedMotion();
  const stickyRef = useRef(null);
  const [logoLanded, setLogoLanded] = useState(false);

  useMotionValueEvent(introProgress, 'change', (latest) => {
    if (!logoLanded && latest >= LOGO_LANDED_AT) {
      setLogoLanded(true);
    }
  });

  const copyVisible = prefersReducedMotion || logoLanded;

  return (
    <section id="hem" ref={heroRef} className="relative -mt-20 h-[220vh] sm:h-[240vh]">
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden bg-brand-black">
        <HeroVideoBackground />

        {/* ChainGPT Labs-inspirerat pixelfält runt musen (av på touch / reduced-motion) */}
        <PixelCursorField containerRef={stickyRef} />

        <Container className="relative z-20 flex h-full flex-col justify-end pb-24 sm:pb-28 lg:pb-32">
          <motion.div
            className="max-w-4xl"
            initial={false}
            animate={{ opacity: copyVisible ? 1 : 0, y: copyVisible ? 0 : 24 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-6 inline-flex items-center rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.28em] text-brand-green shadow-glow backdrop-blur-sm">
              Cybersäkerhet • Nätverk • Infrastruktur
            </p>
            <h1 className="max-w-5xl font-display text-4xl font-bold uppercase leading-[0.98] tracking-[-0.02em] text-brand-white sm:text-6xl lg:text-7xl">
              Bygg en säkrare IT-miljö innan nästa incident testar den
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-brand-mist sm:text-xl sm:leading-9">
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
