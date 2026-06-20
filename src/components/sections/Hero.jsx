import { motion, useTransform } from 'framer-motion';
import { Container } from '../ui';
import { HeroVideoBackground } from './HeroVideoBackground.jsx';
import { CTAButtons } from './CTAButtons.jsx';

const COPY_REVEAL_START = 0.18;
const COPY_REVEAL_END = 0.55;

export function Hero({ heroRef, introProgress }) {
  const copyOpacity = useTransform(introProgress, [COPY_REVEAL_START, COPY_REVEAL_END], [0.18, 1]);
  const copyY = useTransform(introProgress, [COPY_REVEAL_START, COPY_REVEAL_END], [24, 0]);

  return (
    <section
      id="hem"
      ref={heroRef}
      className="relative -mt-20 h-[180vh] sm:h-[200vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-brand-black">
        <HeroVideoBackground />

        <Container className="relative flex h-full flex-col justify-end pb-24 sm:pb-28 lg:pb-32">
          <motion.div className="max-w-4xl" style={{ opacity: copyOpacity, y: copyY }}>
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
