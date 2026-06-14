import { Container } from '../ui';

const quickLinks = [
  { label: 'Hem', href: '/' },
  { label: 'Tjänster', href: '/tjanster' },
  { label: 'Om oss', href: '/om-oss' },
  { label: 'Referenser', href: '/referenser' },
  { label: 'Kontakt', href: '/kontakt' },
];

const services = [
  'Nätverk & infrastruktur',
  'Cybersäkerhet',
  'Brandväggar',
  'Moln & datacenter',
  'IT-konsulting',
];

function FooterLink({ href, children, ...props }) {
  return (
    <a
      href={href}
      className="inline-flex text-sm text-brand-mist transition-colors duration-200 hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
      {...props}
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-brand-line bg-brand-black text-brand-white">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.9fr_0.8fr]">
          <div>
            <p className="text-lg font-semibold">JUIT NetSec AB</p>
            <p className="mt-4 max-w-sm leading-7 text-brand-mist">
              Säker IT-infrastruktur, nätverk och cybersäkerhet för moderna företag.
            </p>
            <a
              href="https://www.linkedin.com/"
              className="mt-6 inline-flex rounded-card border border-brand-line px-4 py-2 text-sm font-semibold text-brand-mist transition-colors duration-200 hover:border-brand-green hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
              aria-label="JUIT NetSec AB på LinkedIn, placeholder-länk"
              rel="noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
          </div>

          <nav aria-label="Snabblänkar">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-green">Snabblänkar</p>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-green">Tjänster</p>
            <ul className="mt-5 space-y-3 text-sm text-brand-mist">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <address className="not-italic">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-green">Kontakt</p>
            <div className="mt-5 space-y-3">
              <FooterLink href="mailto:info@juitnetsec.se">info@juitnetsec.se</FooterLink>
              <p className="text-sm text-brand-mist">Sverige</p>
            </div>
          </address>
        </div>

        <div className="mt-12 border-t border-brand-line pt-6 text-sm text-brand-mist">
          <p>© {new Date().getFullYear()} JUIT NetSec AB. Alla rättigheter förbehållna.</p>
        </div>
      </Container>
    </footer>
  );
}
