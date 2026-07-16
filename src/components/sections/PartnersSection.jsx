import { Container } from '../ui';
import { LogoLoop } from '../ui/LogoLoop.jsx';

// Riktiga leverantörs-/teknologilogotyper (SVG) i public/assets/partners.
// De renderas i vit monokrom via CSS-filter (.partners-strip) så att de matchar
// JUIT:s mörka identitet utan att tappa igenkänning. "Smart Cloud Solutions" är
// en dokumenterad text-fallback eftersom ingen verifierbar officiell logotyp hittades.
const partnerLogos = [
  { src: '/assets/partners/vmware.svg', colorSrc: '/assets/partners/vmware-color.svg', alt: 'VMware', title: 'VMware', href: 'https://www.vmware.com/' },
  { src: '/assets/partners/veeam.svg', colorSrc: '/assets/partners/veeam-color.svg', alt: 'Veeam', title: 'Veeam', href: 'https://www.veeam.com/' },
  {
    src: '/assets/partners/dell-technologies.svg',
    colorSrc: '/assets/partners/dell-technologies-color.svg',
    alt: 'Dell Technologies',
    title: 'Dell Technologies',
    href: 'https://www.dell.com/',
  },
  { src: '/assets/partners/trend-micro.svg', colorSrc: '/assets/partners/trend-micro-color.svg', alt: 'Trend Micro', title: 'Trend Micro', href: 'https://www.trendmicro.com/' },
  { src: '/assets/partners/microsoft.svg', colorSrc: '/assets/partners/microsoft.svg', alt: 'Microsoft', title: 'Microsoft', href: 'https://www.microsoft.com/' },
  {
    src: '/assets/partners/smart-cloud-solutions.svg',
    colorSrc: '/assets/partners/smart-cloud-solutions-color.svg',
    alt: 'Smart Cloud Solutions',
    title: 'Smart Cloud Solutions',
    href: 'https://smartcloudsolutions.se/',
  },
  {
    src: '/assets/partners/microsoft-azure.svg',
    colorSrc: '/assets/partners/microsoft-azure.svg',
    alt: 'Microsoft Azure',
    title: 'Microsoft Azure',
    href: 'https://azure.microsoft.com/',
  },
  {
    src: '/assets/partners/aws.svg',
    colorSrc: '/assets/partners/aws-color.svg',
    alt: 'Amazon Web Services',
    title: 'Amazon Web Services',
    href: 'https://aws.amazon.com/',
  },
];

/**
 * Credibility-focused technology showcase directly beneath the hero. The existing
 * verified technology data and destinations remain the single source of truth.
 */
export function PartnersSection() {
  return (
    <section
      id="technology-showcase"
      aria-labelledby="technology-showcase-heading"
      className="partners-reveal-scene"
    >
      <div
        aria-hidden="true"
        className="partners-reveal-scene__background"
        style={{ backgroundImage: "url('/assets/partners/partner-technology-background.png')" }}
      />
      <div aria-hidden="true" className="partners-reveal-scene__shade" />

      <div className="partners-showcase relative z-10 overflow-hidden border-y border-brand-line/60">
        <Container className="relative z-10 flex flex-col items-center px-5 pb-10 pt-20 text-center sm:pb-12 sm:pt-24 lg:pb-14 lg:pt-24 xl:pb-12 xl:pt-20">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-brand-mist/70 sm:text-[11px] sm:tracking-[0.34em]">
            Trusted technology ecosystem
          </p>
          <h2
            id="technology-showcase-heading"
            className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-brand-white sm:text-5xl lg:mt-6 lg:text-6xl xl:text-7xl"
          >
            Technology your infrastructure can depend on.
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-brand-mist/80 sm:text-lg sm:leading-8">
            JUIT NetSec works across established technology ecosystems to build, secure and support resilient IT environments.
          </p>
        </Container>

        <div className="relative z-10 pb-20 sm:pb-24 lg:pb-24 xl:pb-20">
          <LogoLoop
            logos={partnerLogos}
            className="partners-strip partners-showcase__marquee"
            speed={34}
            direction="left"
            logoHeight="clamp(46px, 4.75vw, 68px)"
            gap="clamp(42px, 5vw, 104px)"
            hoverSpeed={10}
            imageLoading="eager"
            ariaLabel="Technology partners and platforms"
          />
        </div>
      </div>
    </section>
  );
}
