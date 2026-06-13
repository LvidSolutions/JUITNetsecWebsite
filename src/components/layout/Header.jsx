import { useEffect, useState } from 'react';
import { Button, Container } from '../ui';
import { cn } from '../../lib/cn';

const navigation = [
  { label: 'Hem', href: '#hem' },
  { label: 'Tjänster', href: '#tjanster' },
  { label: 'Om oss', href: '#om-oss' },
  { label: 'Referenser', href: '#referenser' },
  { label: 'Kontakt', href: '#kontakt' },
];

function NavLink({ href, children, onClick, className = '', ...props }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'text-sm font-medium text-brand-mist transition-colors duration-200 ease-smooth hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function Header() {
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

  return (
    <header className="z-50 border-b border-brand-line bg-brand-black/92 backdrop-blur md:sticky md:top-0">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <a
            href="#hem"
            aria-label="JUIT NetSec AB, gå till startsidan"
            className="shrink-0 text-base font-semibold tracking-wide text-brand-white transition-colors duration-200 hover:text-brand-green"
            onClick={() => setIsMenuOpen(false)}
          >
            JUIT NetSec AB
          </a>

          <nav aria-label="Huvudnavigering" className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href="#kontakt" size="sm">
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
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  {item.label}
                </NavLink>
              ))}
              <Button
                href="#kontakt"
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
    </header>
  );
}
