import { useEffect, useState } from 'react';
import { BrandWordmark } from './BrandWordmark.jsx';
import { ScrambleNavLink } from './ScrambleNavLink.jsx';
import { cn } from '../../lib/cn';

// Exakt fyra länkar enligt referensen. Engelska etiketter mappas mot de
// befintliga svenska routsen så att navigationen fortsatt fungerar.
const navigation = [
  { label: 'Home', href: '/', delay: 0 },
  { label: 'Services', href: '/tjanster', delay: 70 },
  { label: 'About', href: '/om-oss', delay: 140 },
  { label: 'Contact', href: '/kontakt', delay: 210 },
];

export function Header({ currentPath = '/', logoSlotRef, hideStaticLogo = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Som på HackFirst är headern alltid helt transparent – ingen svart navbar-box.
  // Navlänkarna hålls läsbara mot innehållet under via mix-blend-mode: difference
  // (vit text inverteras till svart över ljusa partier, se referensen), så ingen
  // bakgrundston eller backdrop-blur behövs.
  return (
    <header className={cn('sticky top-0', isMenuOpen ? 'z-[70]' : 'z-50')}>
      {/* Full-bleed rad (ingen centrerad max-width-container): loggan hamnar
          längst ut i vänster hörn och hamburgaren längst ut till höger,
          precis som HackFirst. */}
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Som på HackFirst: logotyp till vänster, navlänkarna utspridda
            (space-between) i ett centrerat band, hamburgaren längst till höger. */}
        <div className="relative flex h-20 items-center">
          <a
            href="/"
            aria-label="JUIT NetSec AB, go to home page"
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
            aria-label="Main navigation"
            // Centreras med auto-marginaler (inte translate): en transform skapar
            // en isolerad blend-grupp, vilket skulle hindra länkarnas
            // mix-blend-difference från att blanda mot sidan bakom headern.
            className="absolute inset-x-0 z-30 mx-auto hidden w-[clamp(520px,54vw,1000px)] items-center justify-between lg:flex"
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

          <div className="relative z-30 ml-auto flex items-center lg:hidden">
            {/* Minimalistisk hamburger – två tunna vita linjer, ingen knappruta.
                Visas bara på mobil/tablet; på desktop används den vanliga navbaren. */}
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-brand-white/85 transition-colors duration-200 hover:text-brand-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
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
        </div>

        <div
          id="huvudmeny"
          aria-hidden={!isMenuOpen}
          className={cn(
            'grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-smooth lg:hidden',
            isMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className={cn('min-h-0', isMenuOpen && 'bg-brand-black/95')}>
            <nav
              aria-label="Menu navigation"
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
      </div>
    </header>
  );
}
