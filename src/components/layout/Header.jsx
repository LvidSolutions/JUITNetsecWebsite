import { Suspense, lazy, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Container } from '../ui';
import { BrandWordmark } from './BrandWordmark.jsx';
import { ScrambleNavLink } from './ScrambleNavLink.jsx';
import { cn } from '../../lib/cn';

// Tung 3D-bricka (three/rapier/drei). Lazy-laddas i en egen chunk och bara på
// /about + desktop, så startsidans och mobilens bundle aldrig påverkas.
const CompanyBadgeNavbar = lazy(() => import('../Navbar/CompanyBadgeNavbar.jsx'));

const HEADER_LANDED_AT = 0.45;

// Exakt fyra länkar enligt referensen. Engelska etiketter mappas mot de
// befintliga svenska routsen så att navigationen fortsatt fungerar.
const navigation = [
  { label: 'Home', href: '/', delay: 0 },
  { label: 'Services', href: '/tjanster', delay: 70 },
  { label: 'About', href: '/om-oss', delay: 140 },
  { label: 'Contact', href: '/kontakt', delay: 210 },
];

export function Header({ currentPath = '/', logoSlotRef, hideStaticLogo = false, introProgress }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fallbackProgress = useMotionValue(0);
  const activeProgress = introProgress || fallbackProgress;

  // Företagsbrickan visas bara på /about och på desktop (≥901px, fine pointer).
  const [badgeAllowed, setBadgeAllowed] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px) and (pointer: fine)');
    const sync = () => setBadgeAllowed(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const isAbout = currentPath === '/om-oss' || currentPath === '/about';
  const showBadge = isAbout && badgeAllowed;

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (introProgress) {
      return undefined;
    }

    function handleScroll() {
      fallbackProgress.set(window.scrollY > 24 ? 1 : 0);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [introProgress, fallbackProgress]);

  // Backdropen är helt transparent högst upp över hero (ingen svart navbar-box)
  // och tonas bara in mjukt när man scrollar ned för läsbarhet.
  // Solid, halvtransparent bakgrund i stället för animerad backdrop-blur.
  // backdrop-filter på en sticky header samplar om bakgrunden varje frame när
  // innehåll scrollar under den – mycket dyrare än att tona en bakgrundsfärg.
  const backdropInputRange = introProgress ? [0, HEADER_LANDED_AT] : [0, 1];
  const backdropOpacity = useTransform(activeProgress, backdropInputRange, [0, 1]);
  const backgroundColor = useTransform(backdropOpacity, (value) => `rgba(5, 5, 5, ${value * 0.88})`);
  const borderBottomColor = useTransform(backdropOpacity, (value) => `rgba(255, 255, 255, ${value * 0.1})`);

  return (
    <motion.header
      className={cn('sticky top-0 border-b border-transparent', isMenuOpen ? 'z-[70]' : 'z-50')}
      style={{ backgroundColor, borderBottomColor }}
    >
      <Container>
        {/* Som på HackFirst: logotyp till vänster, navlänkarna utspridda
            (space-between) i ett centrerat band, hamburgaren längst till höger. */}
        <div className="relative flex h-20 items-center">
          <a
            href="/"
            aria-label="JUIT NetSec AB, gå till startsidan"
            ref={logoSlotRef}
            className={cn(
              'shrink-0 text-[20px] transition-opacity duration-200 hover:opacity-80',
              hideStaticLogo && 'invisible',
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <BrandWordmark />
          </a>

          <nav
            aria-label="Huvudnavigering"
            className="absolute left-1/2 z-30 hidden w-[clamp(360px,34vw,520px)] -translate-x-1/2 items-center justify-between lg:flex"
          >
            {navigation.map((item) => (
              <ScrambleNavLink
                key={item.href}
                label={item.label}
                href={item.href}
                delay={item.delay}
                isActive={currentPath === item.href}
              />
            ))}
          </nav>

          <div className="relative z-30 ml-auto flex items-center">
            {/* Minimalistisk hamburger – två tunna vita linjer, ingen knappruta. */}
            <button
              type="button"
              className="inline-flex h-10 w-8 items-center justify-center text-brand-white/85 transition-colors duration-200 hover:text-brand-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
              aria-label={isMenuOpen ? 'Stäng meny' : 'Öppna meny'}
              aria-expanded={isMenuOpen}
              aria-controls="huvudmeny"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span className="relative h-3 w-6" aria-hidden="true">
                <span
                  className={cn(
                    'absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-200 ease-smooth',
                    isMenuOpen && 'translate-y-[5.5px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-200 ease-smooth',
                    isMenuOpen && '-translate-y-[5.5px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>

          {/* Hängande företagsbricka (endast /about + desktop). Absolut
              positionerad → påverkar inte navbarens layout. */}
          {showBadge && (
            <Suspense fallback={null}>
              <CompanyBadgeNavbar />
            </Suspense>
          )}
        </div>

        <div
          id="huvudmeny"
          aria-hidden={!isMenuOpen}
          className={cn(
            'grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-smooth',
            isMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className={cn('min-h-0', isMenuOpen && 'bg-brand-black/95')}>
            <nav
              aria-label="Menynavigering"
              className="flex flex-col gap-1 border-t border-brand-line px-1 py-4"
            >
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={currentPath === item.href ? 'page' : undefined}
                  tabIndex={isMenuOpen ? 0 : -1}
                  className={cn(
                    'rounded-card px-1 py-3 font-display text-base font-light uppercase tracking-[0.18em] transition-colors duration-200 ease-smooth hover:text-brand-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                    currentPath === item.href ? 'text-brand-green' : 'text-brand-white/85',
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
