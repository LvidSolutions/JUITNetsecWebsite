import { useEffect, useRef, useState } from 'react';
import { BrandWordmark } from './BrandWordmark.jsx';
import { FooterStatsPanel } from './FooterStatsPanel.jsx';

// Navigation – samma fyra destinationer som i headern. Engelska etiketter mot
// de befintliga routsen så att appens klient-navigation (a[href^="/"]) fungerar.
const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/tjanster' },
  { label: 'About', href: '/om-oss' },
  { label: 'Contact', href: '/kontakt' },
];

// Verifierad kontaktinformation från projektet (Stockholm-adress från About-
// sidan, e-post från tidigare footer). Inga påhittade uppgifter.
const company = {
  email: 'contact@juit.se',
  addressLines: ['Stockholm, Sweden'],
};

export function Footer() {
  const footerRef = useRef(null);
  const frameRef = useRef(null);

  // Flyward-beteende: footern är "connected" (kant-till-kant) under hela scrollen
  // och ramas in mot vita marginaler i EN enda rörelse på sista scroll-ticket –
  // dvs när footerns underkant når viewportens underkant. En boolean (framed)
  // driver --ff (0/1); själva rörelsen görs av en padding-transition i CSS, så
  // det blir en mjuk rörelse i stället för en scroll-länkad sex-stegs-reveal.
  const [framed, setFramed] = useState(false);

  useEffect(() => {
    const update = () => {
      const el = footerRef.current;
      if (!el) return;
      // "Sista ticket": användaren har scrollat ned till botten. Hysteres så att
      // frame-out:ens egen höjdökning (padding) inte av-triggar och skapar flimmer:
      // rama in inom 64px från botten, rama ur först bortom 180px.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const dist = max - window.scrollY;
      setFramed((prev) => (dist <= 64 ? true : dist > 180 ? false : prev));

      // Navbaren inverteras till mörkt om den vita topp-marginalen råkar ligga bakom den.
      const frame = frameRef.current;
      if (frame) {
        const fr = frame.getBoundingClientRect();
        const pad = parseFloat(getComputedStyle(frame).paddingTop) || 0;
        const navMid = 40;
        const over = pad > 8 && fr.top <= navMid && navMid <= fr.top + pad;
        document.body.classList.toggle('nav-over-light', over);
      }
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    // Kör en extra mätning efter att padding-transitionen landat (nav-invertering).
    const settle = window.setTimeout(update, 700);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.clearTimeout(settle);
      document.body.classList.remove('nav-over-light');
    };
  }, []);

  return (
    <div ref={footerRef} className="relative">
      <div
        ref={frameRef}
        className="footer-frame"
        data-framed={framed ? 'true' : 'false'}
        style={{ '--ff': framed ? 1 : 0 }}
      >
        <footer className="footer-frame__card relative isolate overflow-hidden bg-brand-black">
          <svg
            aria-hidden="true"
            focusable="false"
            width="0"
            height="0"
            style={{ position: 'absolute', width: 0, height: 0 }}
          >
            <filter id="footerCutout" colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0.33 0.5 0.16 0 0"
              />
              <feComponentTransfer>
                <feFuncA type="table" tableValues="0 0 0.72 1 1 1" />
              </feComponentTransfer>
            </filter>
          </svg>

          {/* Full-bleed bakgrund + animerat filmkorn – kant-till-kant, ingen ram. */}
          <div
            aria-hidden="true"
            className="footer-glow pointer-events-none absolute inset-0 -z-10"
          />
          <div
            aria-hidden="true"
            className="footer-noise footer-noise--animated pointer-events-none absolute inset-[-25%] -z-10"
          />

          {/* Desktop följer referensens scen: övre datafält, stor tom mitt,
              varumärke och kontakt lågt placerade. Mobil/tablet staplar tryggt. */}
          <div className="footer-stage relative mx-auto flex w-full max-w-[1380px] flex-col px-6 pt-12 pb-[clamp(104px,26vw,150px)] sm:px-10 sm:pt-14 lg:max-w-none lg:px-0 lg:pt-0 lg:pb-0">
            {/* GOLV-LOGGA: överdimensionerad wordmark förankrad i underkanten,
                beskuren av footer-gränsen så den smälter in i den vita ramen. */}
            <div
              aria-hidden="true"
              className="footer-floor-logo pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center overflow-hidden"
            >
              <BrandWordmark className="footer-floor-wordmark" />
            </div>

            {/* ÖVRE band: maze-grafik (vänster) + skarp dashboard-panel (höger). */}
            <div className="footer-pos-maze z-10 flex flex-col items-center gap-12 lg:items-start lg:gap-0">
              <div className="flex shrink-0 flex-col items-center lg:items-start">
                <img
                  src="/assets/footer-radar.png"
                  alt=""
                  aria-hidden="true"
                  className="footer-cutout footer-maze-graphic w-[clamp(220px,24vw,300px)] select-none lg:w-[var(--maze-w)]"
                  loading="lazy"
                  decoding="async"
                />
                <p className="mt-3 w-[clamp(220px,24vw,300px)] text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.24em] text-brand-mist/75 lg:w-[var(--maze-w)]">
                  You cannot defend
                  <br />
                  what you cannot map.
                </p>
              </div>
            </div>

            <div className="footer-pos-dashboard z-10 mt-12 w-full max-w-[820px] self-center lg:mt-0 lg:w-[var(--dash-w)] lg:max-w-none">
              <FooterStatsPanel className="w-full" />
            </div>

            {/* NEDRE band: navigation + kontakt (höger). Lyft över golv-loggan. */}
            <div className="footer-pos-nav z-10 mt-14 flex flex-col gap-10 lg:mt-0 lg:flex-row lg:items-end lg:justify-end lg:gap-16">
              <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-[82px_210px] sm:gap-x-[46px] sm:gap-y-0">
                <nav aria-label="Footer navigation" className="flex flex-col">
                  {navigation.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex h-9 items-center font-display text-[13px] uppercase tracking-[0.22em] text-brand-white/85 transition-colors duration-200 hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                <address className="flex flex-col not-italic">
                  {company.addressLines.map((line) => (
                    <span
                      key={line}
                      className="flex h-9 items-center font-mono text-[12px] uppercase tracking-[0.16em] text-brand-mist/55"
                    >
                      {line}
                    </span>
                  ))}
                  <a
                    href={`mailto:${company.email}`}
                    className="flex h-9 items-center font-mono text-[12px] uppercase tracking-[0.16em] text-brand-white underline decoration-brand-green/50 underline-offset-4 transition-colors duration-200 hover:text-brand-green hover:decoration-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
                  >
                    {company.email}
                  </a>
                </address>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
