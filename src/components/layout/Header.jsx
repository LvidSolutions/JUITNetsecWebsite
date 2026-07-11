import { useEffect, useRef, useState } from 'react';
import { BrandWordmark } from './BrandWordmark.jsx';
import { ScrambleNavLink } from './ScrambleNavLink.jsx';
import { cn } from '../../lib/cn';

const navigation = [
  { label: 'Home', href: '/', delay: 0 },
  { label: 'Services', href: '/tjanster', delay: 70 },
  { label: 'About', href: '/om-oss', delay: 140 },
  { label: 'Contact', href: '/kontakt', delay: 210 },
];

const leftNavigation = navigation.slice(0, 2);
const rightNavigation = navigation.slice(2);

export function Header({ currentPath = '/', logoSlotRef, hideStaticLogo = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const frame = window.requestAnimationFrame(() => {
      mobileMenuRef.current?.querySelector('a[href]')?.focus();
    });

    function handleEscape(event) {
      if (event.key !== 'Escape') return;
      setIsMenuOpen(false);
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  return (
    <header className={cn('sticky top-0', isMenuOpen ? 'z-[70]' : 'z-50')}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center">
          <a
            href="/"
            aria-label="JUIT NetSec AB, go to home page"
            ref={logoSlotRef}
            className={cn(
              'header-logo absolute left-1/2 z-40 -translate-x-1/2 text-[20px] transition-opacity duration-200 hover:opacity-80',
              hideStaticLogo && 'invisible',
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <BrandWordmark />
          </a>

          <nav
            aria-label="Main navigation"
            className="absolute inset-x-0 z-30 hidden grid-cols-[1fr_auto_1fr] items-center lg:grid"
          >
            <div className="flex items-center justify-start gap-[clamp(2rem,5vw,6.5rem)]">
              {leftNavigation.map((item) => (
                <ScrambleNavLink key={item.href} {...item} isActive={currentPath === item.href} />
              ))}
            </div>
            <span aria-hidden="true" className="w-[clamp(9rem,16vw,16rem)]" />
            <div className="flex items-center justify-end gap-[clamp(2rem,5vw,6.5rem)]">
              {rightNavigation.map((item) => (
                <ScrambleNavLink key={item.href} {...item} isActive={currentPath === item.href} />
              ))}
            </div>
          </nav>

          <div className="relative z-30 ml-auto flex items-center lg:hidden">
            <button
              ref={menuButtonRef}
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
              ref={mobileMenuRef}
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
