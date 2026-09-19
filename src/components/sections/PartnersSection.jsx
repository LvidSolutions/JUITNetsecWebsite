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
      style={{ backgroundImage: "url('/assets/partners/partner-technology-background.png')" }}
    >
      <div aria-hidden="true" className="partners-reveal-scene__shade" />

      <div className="partners-showcase relative z-10 overflow-hidden border-y border-brand-line/60">
        <Container className="relative z-10 flex flex-col items-center px-5 pb-3 pt-6 text-center sm:pb-4 sm:pt-7 lg:pb-4 lg:pt-8 xl:pb-4 xl:pt-7">
          <h2
            id="technology-showcase-heading"
            className="max-w-4xl text-balance text-2xl font-semibold leading-[0.98] tracking-[-0.04em] text-brand-white sm:text-3xl lg:text-4xl xl:text-5xl"
          >
            Trusted Partners
          </h2>
        </Container>

        <div className="relative z-10 pb-6 sm:pb-7 lg:pb-8 xl:pb-7">
          <LogoLoop
            logos={partnerLogos}
            className="partners-strip partners-showcase__marquee"
            speed={34}
            direction="left"
            logoHeight="clamp(38px, 3.6vw, 54px)"
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
