import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
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
  addressLines: ['Fatburs kvarngata 26', '118 64 Stockholm', 'Sweden'],
};

export function Footer() {
  const footerRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });
  const revealProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.45,
  });

  const footerY = useTransform(revealProgress, [0, 1], [132, 0]);
  const footerOpacity = useTransform(revealProgress, [0, 0.42, 1], [0.9, 0.975, 1]);
  const backgroundY = useTransform(revealProgress, [0, 1], [18, 0]);
  const noiseY = useTransform(revealProgress, [0, 1], [10, 0]);
  const radarY = useTransform(revealProgress, [0, 1], [58, 0]);
  const statsY = useTransform(revealProgress, [0, 1], [50, 0]);
  const logoY = useTransform(revealProgress, [0, 1], [22, 0]);
  const navY = useTransform(revealProgress, [0, 1], [24, 0]);
  const graphicsOpacity = useTransform(revealProgress, [0, 0.38, 1], [0.74, 0.96, 1]);
  const contentOpacity = useTransform(revealProgress, [0, 0.42, 1], [0.8, 0.97, 1]);

  const footerStyle = reduceMotion ? undefined : { y: footerY, opacity: footerOpacity };
  const backgroundStyle = reduceMotion ? undefined : { y: backgroundY };
  const noiseStyle = reduceMotion ? undefined : { y: noiseY };
  const radarStyle = reduceMotion ? undefined : { y: radarY, opacity: graphicsOpacity };
  const statsStyle = reduceMotion ? undefined : { y: statsY, opacity: graphicsOpacity };
  const logoStyle = reduceMotion ? undefined : { y: logoY, opacity: contentOpacity };
  const navStyle = reduceMotion ? undefined : { y: navY, opacity: contentOpacity };

  return (
    <motion.div ref={footerRef} style={footerStyle} className="footer-reveal-layer relative">
      <div aria-hidden="true" className="footer-upstream-glow pointer-events-none relative z-10" />
      <footer className="relative isolate overflow-hidden bg-brand-black">
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

      {/* Full-bleed grön glow + animerat filmkorn – kant-till-kant, ingen ram. */}
      <motion.div
        aria-hidden="true"
        style={backgroundStyle}
        className="footer-glow footer-reveal-layer pointer-events-none absolute inset-0 -z-10"
      />
      <motion.div
        aria-hidden="true"
        style={noiseStyle}
        className="footer-noise footer-noise--animated footer-reveal-layer pointer-events-none absolute inset-[-25%] -z-10"
      />

      {/* Desktop följer referensens scen: övre datafält, stor tom mitt,
          varumärke och kontakt lågt placerade. Mobil/tablet staplar tryggt. */}
      <div className="relative mx-auto flex w-full max-w-[1380px] flex-col px-6 py-12 sm:px-10 sm:py-14 lg:min-h-[716px] lg:px-0 lg:py-0">
        {/* ÖVRE band: radar-grafik (vänster) + skarp statistikpanel (höger). */}
        <motion.div
          style={radarStyle}
          className="footer-reveal-layer flex flex-col items-center gap-12 lg:absolute lg:left-4 lg:top-7 lg:items-start lg:gap-0"
        >
          <div className="flex shrink-0 flex-col items-center lg:items-start">
            <img
              src="/assets/footer-radar.png"
              alt=""
              aria-hidden="true"
              className="footer-cutout footer-radar-graphic w-[clamp(220px,24vw,300px)] select-none lg:w-[286px]"
              loading="lazy"
              decoding="async"
            />
            <p className="mt-3 w-[clamp(220px,24vw,300px)] text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.24em] text-brand-mist/75 lg:w-[286px]">
              You cannot defend
              <br />
              what you cannot map.
            </p>
          </div>
        </motion.div>

        <motion.div
          style={statsStyle}
          className="footer-reveal-layer mt-12 w-full max-w-[820px] self-center lg:absolute lg:right-0 lg:top-6 lg:mt-0 lg:w-[600px] lg:max-w-none"
        >
          <FooterStatsPanel className="w-full" />
        </motion.div>

        {/* NEDRE band: stor logotyp till vänster, navigation + kontakt till höger. */}
        <div className="mt-14 flex flex-col gap-10 lg:absolute lg:bottom-[58px] lg:left-0 lg:right-0 lg:mt-0 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <motion.div style={logoStyle} className="footer-reveal-layer">
            <BrandWordmark className="text-[clamp(2.25rem,4vw,3.8rem)]" />
          </motion.div>

          <motion.div
            style={navStyle}
            className="footer-reveal-layer grid grid-cols-1 gap-y-8 sm:grid-cols-[82px_210px] sm:gap-x-[46px] sm:gap-y-0"
          >
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
          </motion.div>
        </div>
      </div>
      </footer>
    </motion.div>
  );
}
