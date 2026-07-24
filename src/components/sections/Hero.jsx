import { useState } from 'react';
import { motion, useReducedMotion, useMotionValueEvent } from 'framer-motion';
import { Container } from '../ui';
import { HeroVideoBackground } from './HeroVideoBackground.jsx';
import { ContactMonitorCTA } from './ContactMonitorCTA.jsx';
import { DistortedText } from '../ui/DistortedText.jsx';

const LOGO_LANDED_AT = 0.45;

export function Hero({ introProgress, transitionState, monitorMedia }) {
  const prefersReducedMotion = useReducedMotion();
  const [logoLanded, setLogoLanded] = useState(() => introProgress.get() >= LOGO_LANDED_AT);

  useMotionValueEvent(introProgress, 'change', (latest) => {
    setLogoLanded(latest >= LOGO_LANDED_AT);
  });

  const copyVisible = prefersReducedMotion || logoLanded;

  return (
    <section className="hero-transition__hero relative h-full w-full overflow-hidden bg-brand-black">
      <HeroVideoBackground />

      <Container className="relative z-20 flex h-full flex-col items-center justify-center pb-10 pt-24 text-center sm:pb-12 sm:pt-28 lg:pb-14 lg:pt-32">
        <div className="hero-transition__copy w-full">
          <motion.div
            className="mx-auto w-full max-w-[96rem]"
            initial={false}
            animate={{ opacity: copyVisible ? 1 : 0, y: copyVisible ? 20 : 44 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-mist/60">
              Secure IT environments
            </p>
            <h1 className="mx-auto mt-12 flex w-full flex-col items-center font-['Elounda'] uppercase leading-[0.95] [font-weight:400] [text-rendering:geometricPrecision]">
              <DistortedText
                selective
                className="block text-[clamp(1.45rem,4.05vw,4.4rem)] tracking-[0.12em] text-brand-green sm:whitespace-nowrap sm:tracking-[0.34em] lg:tracking-[0.44em]"
              >
                Ready to secure
              </DistortedText>
              <DistortedText
                selective
                className="mt-8 block text-[clamp(1.45rem,4.08vw,4.45rem)] tracking-[0.1em] text-brand-white sm:whitespace-nowrap sm:tracking-[0.3em] lg:tracking-[0.38em]"
              >
                your IT environment?
              </DistortedText>
            </h1>
            <p className="mx-auto mt-9 max-w-3xl text-base leading-8 tracking-[0.12em] text-brand-mist sm:text-lg sm:leading-9">
              Infrastructure, secure communication and cybersecurity advisory for organizations that
              depend on control, uptime and trust.
            </p>
          </motion.div>
        </div>
        <motion.div
          className="w-full"
          aria-hidden={!copyVisible}
          initial={false}
          animate={{ opacity: copyVisible ? 1 : 0, y: copyVisible ? 0 : 28 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: copyVisible ? 'auto' : 'none' }}
        >
          <ContactMonitorCTA
            transitionState={transitionState}
            monitorMedia={monitorMedia}
          />
        </motion.div>
      </Container>
    </section>
  );
}
