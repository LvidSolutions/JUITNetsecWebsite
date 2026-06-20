import { useRef, useState } from 'react';
import { motion, useReducedMotion, useMotionValueEvent } from 'framer-motion';
import { Container } from '../ui';
import { HeroVideoBackground } from './HeroVideoBackground.jsx';
import { HeroLens } from './HeroLens.jsx';
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

        {/* frostad konvex lins som följer musen (av på touch / reduced-motion) */}
        <HeroLens containerRef={stickyRef} />

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
