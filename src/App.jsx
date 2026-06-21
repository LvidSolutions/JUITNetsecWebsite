import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { AnimatedLogo } from './components/layout/AnimatedLogo.jsx';
import { AboutSection } from './components/sections/AboutSection.jsx';
import { ContactSection } from './components/sections/ContactSection.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { IntroLoader } from './components/sections/IntroLoader.jsx';
import { StatsSection } from './components/sections/StatsSection.jsx';
import { TerminalSignalSection } from './components/sections/TerminalSignalSection.jsx';
import { NextStepPlaceholder } from './components/sections/NextStepPlaceholder.jsx';
import { ServicesSection } from './components/sections/ServicesSection.jsx';
import { TeamSection } from './components/sections/TeamSection.jsx';
import { useHeroIntroProgress } from './lib/useHeroIntroProgress.js';

const titles = {
  '/': 'JUIT NetSec AB – IT-säkerhet, nätverk och infrastruktur',
  '/tjanster': 'Tjänster – JUIT NetSec AB',
  '/om-oss': 'Om oss – JUIT NetSec AB',
  '/about': 'Om oss – JUIT NetSec AB',
  '/team': 'Team – JUIT NetSec AB',
  '/kontakt': 'Kontakt – JUIT NetSec AB',
};

function getCurrentPath() {
  return window.location.pathname === '' ? '/' : window.location.pathname;
}

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);
  const isHome = currentPath === '/';
  const logoSlotRef = useRef(null);
  const title = titles[currentPath] || titles['/'];
  const { scrollYProgress: introProgress, heroRef } = useHeroIntroProgress();
  const [introDone, setIntroDone] = useState(() => getCurrentPath() !== '/');

  // Lås scroll medan intro-loadern visas så hero inte kan scrollas bakom den.
  useEffect(() => {
    const locked = isHome && !introDone;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isHome, introDone]);

  useEffect(() => {
    function navigate(path) {
      const nextPath = titles[path] ? path : '/';
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
      setCurrentPath(nextPath);
      // Direkt hopp till toppen vid sidbyte: smooth scroll genom en hel,
      // tung sida kan kännas hackig och triggar onödig animation under vägen.
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    function handleClick(event) {
      const link = event.target.closest('a[href^="/"]');

      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target) {
        return;
      }

      const url = new URL(link.href);

      if (url.origin !== window.location.origin) {
        return;
      }

      event.preventDefault();
      navigate(url.pathname);
    }

    function handlePopState() {
      setCurrentPath(getCurrentPath());
    }

    function handleAppNavigate(event) {
      const path = event.detail?.path;
      if (typeof path === 'string') {
        navigate(path);
      }
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

  return (
    <>
      <AnimatePresence>
        {isHome && !introDone && (
          <IntroLoader key="intro" onComplete={() => setIntroDone(true)} />
        )}
      </AnimatePresence>
      <a
        href="#huvudinnehall"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-card focus:bg-brand-green focus:px-4 focus:py-3 focus:font-semibold focus:text-brand-black"
      >
        Hoppa till huvudinnehåll
      </a>
      <Header
        currentPath={currentPath}
        logoSlotRef={logoSlotRef}
        hideStaticLogo={isHome}
        introProgress={isHome ? introProgress : undefined}
      />
      {isHome && <AnimatedLogo targetRef={logoSlotRef} progress={introProgress} />}
      <main id="huvudinnehall" className="min-h-screen bg-brand-black text-brand-white" tabIndex="-1">
        {isHome && (
          <>
            <Hero heroRef={heroRef} introProgress={introProgress} />
            <StatsSection />
            <TerminalSignalSection />
            <NextStepPlaceholder />
          </>
        )}
        {currentPath === '/tjanster' && <ServicesSection />}
        {(currentPath === '/om-oss' || currentPath === '/about') && <AboutSection />}
        {currentPath === '/team' && <TeamSection />}
        {currentPath === '/kontakt' && <ContactSection />}
      </main>
      <Footer />
    </>
  );
}

export default App;
