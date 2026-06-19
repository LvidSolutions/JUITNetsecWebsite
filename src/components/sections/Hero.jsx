import { Container } from '../ui';
import { HeroVideoBackground } from './HeroVideoBackground.jsx';
import { CTAButtons } from './CTAButtons.jsx';

export function Hero({ heroRef }) {
  return (
    <section
      id="hem"
      ref={heroRef}
      className="relative isolate -mt-20 min-h-[120vh] overflow-hidden bg-brand-black pb-20 pt-20 sm:min-h-[130vh] sm:pb-24 lg:pb-32"
    >
      <HeroVideoBackground />

      <Container className="relative flex min-h-[calc(100vh-5rem)] flex-col justify-center">
        <div className="max-w-4xl animate-hero-reveal pt-24 sm:pt-16">
          <p className="mb-5 inline-flex rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-sm font-medium text-brand-green shadow-glow backdrop-blur-sm">
            Cybersäkerhet, nätverk och robust infrastruktur
          </p>
          <h1 className="max-w-5xl text-4xl font-semibold leading-[1.04] text-brand-white sm:text-5xl lg:text-7xl">
            Trygg IT-säkerhet och robusta nätverk för moderna företag
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-brand-mist sm:text-xl sm:leading-9">
            JUIT NetSec hjälper företag att bygga säkra, stabila och skalbara IT-miljöer genom expertis
            inom nätverk, cybersäkerhet, moln och infrastruktur.
          </p>

          <CTAButtons />
        </div>
      </Container>
    </section>
  );
}
