import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { AnimatedLogo } from './components/layout/AnimatedLogo.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { IntroLoader } from './components/sections/IntroLoader.jsx';
import { IntroSequence } from './components/intro/IntroSequence.jsx';
import { PartnersSection } from './components/sections/PartnersSection.jsx';
import { StatsSection } from './components/sections/StatsSection.jsx';
import { TerminalSignalSection } from './components/sections/TerminalSignalSection.jsx';
import { NextStepPlaceholder } from './components/sections/NextStepPlaceholder.jsx';
import { useHeroIntroProgress } from './lib/useHeroIntroProgress.js';

const AboutSection = lazy(() =>
  import('./components/sections/AboutSection.jsx').then((module) => ({
    default: module.AboutSection,
  })),
);
const ContactPage = lazy(() =>
  import('./components/contact/ContactPage.jsx').then((module) => ({
    default: module.ContactPage,
  })),
);
const ServicesSection = lazy(() =>
  import('./components/sections/ServicesSection.jsx').then((module) => ({
    default: module.ServicesSection,
  })),
);

const titles = {
  '/': 'JUIT NetSec AB – IT security, networking and infrastructure',
  '/tjanster': 'Services – JUIT NetSec AB',
  '/om-oss': 'About – JUIT NetSec AB',
  '/about': 'About – JUIT NetSec AB',
  '/kontakt': 'Contact – JUIT NetSec AB',
  '/contact': 'Contact – JUIT NetSec AB',
};

const INTRO_SEEN_KEY = 'juit:introSeen';

function normalizePath(path) {
  if (!path || path === '/') return '/';
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

function getCurrentPath() {
  return normalizePath(window.location.pathname);
}

function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
  } catch {
    // sessionStorage may be unavailable in hardened or private browsing modes.
  }
}

function RouteFallback() {
  return (
    <div className="flex min-h-[45vh] items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border border-brand-green/25 border-t-brand-green motion-reduce:animate-none"
      />
    </div>
  );
}

function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center px-6 py-24">
      <div className="mx-auto w-full max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-green">404 / Not found</p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-none tracking-tight sm:text-7xl">
          The requested page does not exist.
        </h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-brand-mist/75 sm:text-lg">
          Check the address or return to the start page.
        </p>
        <a
          href="/"
          className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-7 text-sm font-semibold uppercase tracking-[0.16em] text-brand-black transition-colors hover:bg-brand-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
        >
          Go to home page
        </a>
      </div>
    </section>
  );
}

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);
  const isHome = currentPath === '/';
  const isKnownPath = Boolean(titles[currentPath]);
  const logoSlotRef = useRef(null);
  const navigationPendingRef = useRef(false);
  const title = titles[currentPath] || 'Page not found – JUIT NetSec AB';
  const { scrollYProgress: introProgress, heroRef } = useHeroIntroProgress();
  const [introPhase, setIntroPhase] = useState(() =>
    getCurrentPath() !== '/' || hasSeenIntro() ? 'done' : 'loader',
  );
  const introDone = introPhase === 'done';

  useEffect(() => {
    const locked = isHome && !introDone;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isHome, introDone]);

  useEffect(() => {
    function navigate(path) {
      const nextPath = normalizePath(path);
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
      navigationPendingRef.current = true;
      setCurrentPath(nextPath);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    function handleClick(event) {
      const link = event.target.closest('a[href^="/"]');

      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target) {
        return;
      }

      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      navigate(url.pathname);
    }

    function handlePopState() {
      navigationPendingRef.current = true;
      setCurrentPath(getCurrentPath());
    }

    function handleAppNavigate(event) {
      const path = event.detail?.path;
      if (typeof path === 'string') navigate(path);
    }

    document.addEventListener('click', handleClick);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('juit:navigate', handleAppNavigate);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('juit:navigate', handleAppNavigate);
    };
  }, []);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (!navigationPendingRef.current) return undefined;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById('huvudinnehall')?.focus({ preventScroll: true });
      navigationPendingRef.current = false;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [currentPath]);

  return (
    <>
      {isHome && introPhase === 'loader' && (
        <IntroLoader key="loader" onComplete={() => setIntroPhase('reveal')} />
      )}
      {isHome && introPhase === 'reveal' && (
        <IntroSequence
          key="reveal"
          onComplete={() => {
            markIntroSeen();
            setIntroPhase('done');
          }}
        />
      )}
      <a
        href="#huvudinnehall"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-card focus:bg-brand-green focus:px-4 focus:py-3 focus:font-semibold focus:text-brand-black"
      >
        Skip to main content
      </a>
      <Header
        currentPath={currentPath}
        logoSlotRef={logoSlotRef}
        hideStaticLogo={isHome}
      />
      {isHome && <AnimatedLogo targetRef={logoSlotRef} progress={introProgress} />}
      <main id="huvudinnehall" className="min-h-screen bg-brand-black text-brand-white" tabIndex="-1">
        {isHome && (
          <>
            <Hero heroRef={heroRef} introProgress={introProgress} />
            <PartnersSection />
            <StatsSection />
            <TerminalSignalSection />
            <NextStepPlaceholder />
          </>
        )}
        {!isHome && isKnownPath && (
          <Suspense fallback={<RouteFallback />}>
            {currentPath === '/tjanster' && <ServicesSection />}
            {(currentPath === '/om-oss' || currentPath === '/about') && <AboutSection />}
            {(currentPath === '/kontakt' || currentPath === '/contact') && <ContactPage />}
          </Suspense>
        )}
        {!isKnownPath && <NotFoundPage />}
      </main>
      <Footer />
    </>
  );
}

export default App;
