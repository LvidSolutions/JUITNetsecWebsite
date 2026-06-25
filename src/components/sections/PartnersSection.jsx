import { Container } from '../ui';
import { LogoLoop } from '../ui/LogoLoop.jsx';

// Riktiga leverantörs-/teknologilogotyper (SVG) i public/assets/partners.
// De renderas i vit monokrom via CSS-filter (.partners-strip) så att de matchar
// JUIT:s mörka identitet utan att tappa igenkänning. "Smart Cloud Solutions" är
// en dokumenterad text-fallback eftersom ingen verifierbar officiell logotyp hittades.
const partnerLogos = [
  { src: '/assets/partners/vmware.svg', alt: 'VMware', title: 'VMware', href: 'https://www.vmware.com/' },
  { src: '/assets/partners/veeam.svg', alt: 'Veeam', title: 'Veeam', href: 'https://www.veeam.com/' },
  {
    src: '/assets/partners/dell-technologies.svg',
    alt: 'Dell Technologies',
    title: 'Dell Technologies',
    href: 'https://www.dell.com/',
  },
  { src: '/assets/partners/trend-micro.svg', alt: 'Trend Micro', title: 'Trend Micro', href: 'https://www.trendmicro.com/' },
  { src: '/assets/partners/microsoft.svg', alt: 'Microsoft', title: 'Microsoft', href: 'https://www.microsoft.com/' },
  {
    src: '/assets/partners/smart-cloud-solutions.svg',
    alt: 'Smart Cloud Solutions',
    title: 'Smart Cloud Solutions',
    href: '#',
  },
  {
    src: '/assets/partners/microsoft-azure.svg',
    alt: 'Microsoft Azure',
    title: 'Microsoft Azure',
    href: 'https://azure.microsoft.com/',
  },
  {
    src: '/assets/partners/aws.svg',
    alt: 'Amazon Web Services',
    title: 'Amazon Web Services',
    href: 'https://aws.amazon.com/',
  },
];

/**
 * Premium teknologi-/partnerremsa direkt under hjälten. En lugn, kant-till-kant
 * logotyp-loop med mjuka fade-kanter mot den svarta bakgrunden – en ekosystem-rad,
 * inte en generisk SaaS-logvägg.
 */
export function PartnersSection() {
  return (
    <section aria-label="Technology partners" className="relative border-y border-brand-line/60 bg-brand-black py-12 sm:py-14 lg:py-16">
      <Container>
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.32em] text-brand-mist/45 sm:text-xs">
          Built on a trusted technology ecosystem
        </p>
      </Container>

      <div className="relative mt-8 sm:mt-10">
        <LogoLoop
          logos={partnerLogos}
          className="partners-strip"
          speed={55}
          direction="left"
          logoHeight={30}
          gap={72}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="#050505"
          ariaLabel="Technology partners and platforms"
        />
      </div>
    </section>
  );
}
