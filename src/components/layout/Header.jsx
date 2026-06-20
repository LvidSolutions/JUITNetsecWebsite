import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Button, Container } from '../ui';
import { cn } from '../../lib/cn';

const HEADER_LANDED_AT = 0.45;

const navigation = [
  { label: 'Hem', href: '/' },
  { label: 'Tjänster', href: '/tjanster' },
  { label: 'Om oss', href: '/om-oss' },
  { label: 'Referenser', href: '/referenser' },
  { label: 'Kontakt', href: '/kontakt' },
];

function NavLink({ href, children, onClick, className = '', isActive = false, ...props }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'text-sm font-medium text-brand-mist transition-colors duration-200 ease-smooth hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green',
        isActive && 'text-brand-green',
        className,
      )}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

export function Header({ currentPath = '/', logoSlotRef, hideStaticLogo = false, introProgress }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fallbackProgress = useMotionValue(0);
  const activeProgress = introProgress || fallbackProgress;

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

  const backdropInputRange = introProgress ? [0, HEADER_LANDED_AT] : [0, 1];
  const backdropOpacity = useTransform(activeProgress, backdropInputRange, [0, 1]);
  const backgroundColor = useTransform(backdropOpacity, (value) => `rgba(5, 5, 5, ${value * 0.85})`);
  const borderColor = useTransform(backdropOpacity, (value) => `rgba(255, 255, 255, ${value * 0.12})`);
  const backdropFilter = useTransform(backdropOpacity, (value) => `blur(${value * 12}px)`);

  return (
    <motion.header
      className="sticky top-0 z-50 border-b transition-[background-color,border-color] duration-200 ease-smooth"
      style={{ backgroundColor, borderColor, backdropFilter, WebkitBackdropFilter: backdropFilter }}
    >
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <a
            href="/"
            aria-label="JUIT NetSec AB, gå till startsidan"
            ref={logoSlotRef}
            className={cn(
              'shrink-0 text-base font-semibold tracking-wide text-brand-white transition-colors duration-200 hover:text-brand-green',
              hideStaticLogo && 'invisible',
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            JUIT NETSEC
          </a>

          <nav aria-label="Huvudnavigering" className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <NavLink key={item.href} href={item.href} isActive={currentPath === item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href="/kontakt" size="sm">
              Boka konsultation
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-card border border-brand-line bg-white/[0.03] text-brand-white transition-colors duration-200 hover:border-brand-green hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green lg:hidden"
            aria-label={isMenuOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={isMenuOpen}
            aria-controls="mobilmeny"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="relative h-4 w-5" aria-hidden="true">
              <span
                className={cn(
                  'absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform duration-200',
                  isMenuOpen && 'translate-y-[7px] rotate-45',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity duration-200',
                  isMenuOpen && 'opacity-0',
                )}
              />
              <span
                className={cn(
                  'absolute bottom-0 left-0 h-0.5 w-5 bg-current transition-transform duration-200',
                  isMenuOpen && '-translate-y-[7px] -rotate-45',
                )}
              />
            </span>
          </button>
        </div>

        <div
          id="mobilmeny"
          aria-hidden={!isMenuOpen}
          className={cn(
            'grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-smooth lg:hidden',
            isMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="min-h-0">
            <nav aria-label="Mobilnavigering" className="flex flex-col gap-1 border-t border-brand-line py-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-card px-1 py-3 text-base"
                  isActive={currentPath === item.href}
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  {item.label}
                </NavLink>
              ))}
              <Button
                href="/kontakt"
                className="mt-3 w-full"
                onClick={() => setIsMenuOpen(false)}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                Boka konsultation
              </Button>
            </nav>
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
