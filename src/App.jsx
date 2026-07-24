import { useEffect, useRef, useState } from 'react';
import { Header } from './components/layout/Header.jsx';
import { AnimatedLogo } from './components/layout/AnimatedLogo.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { CinematicFooterScene } from './components/layout/CinematicFooterScene.jsx';
import { AboutSection } from './components/sections/AboutSection.jsx';
import { ContactPage } from './components/contact/ContactPage.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { HeroTransitionScene } from './components/sections/HeroTransitionScene.jsx';
import { IntroLoader } from './components/sections/IntroLoader.jsx';
import { IntroSequence } from './components/intro/IntroSequence.jsx';
import { PartnersSection } from './components/sections/PartnersSection.jsx';
import { StatsSection } from './components/sections/StatsSection.jsx';
import { TerminalSignalSection } from './components/sections/TerminalSignalSection.jsx';
import { FaqFooterScene } from './components/sections/FaqFooterScene.jsx';
import { ServicesSection } from './components/sections/ServicesSection.jsx';
import { useHeroIntroProgress } from './lib/useHeroIntroProgress.js';

const titles = {
  '/': 'JUIT NetSec AB – IT security, networking and infrastructure',
  '/tjanster': 'Cybersecurity, networking & secure IT services | JUIT NetSec',
  '/om-oss': 'About – JUIT NetSec AB',
  '/about': 'About – JUIT NetSec AB',
  '/kontakt': 'Contact – JUIT NetSec AB',
  '/contact': 'Contact – JUIT NetSec AB',
};

const descriptions = {
  '/': 'JUIT NetSec AB helps companies with cybersecurity, networking, cloud, data centers and secure IT infrastructure.',
  '/tjanster': 'Cybersecurity, networking and secure IT services from JUIT NetSec: practical support for resilient infrastructure, secure operations and technical decision-making.',
  '/om-oss': 'Learn about JUIT NetSec AB and our practical approach to cybersecurity, networking and resilient IT infrastructure.',
  '/about': 'Learn about JUIT NetSec AB and our practical approach to cybersecurity, networking and resilient IT infrastructure.',
  '/kontakt': 'Contact JUIT NetSec AB for cybersecurity, networking and secure IT infrastructure support.',
  '/contact': 'Contact JUIT NetSec AB for cybersecurity, networking and secure IT infrastructure support.',
};

const INTRO_SEEN_KEY = 'juit:introSeen';

function getCurrentPath() {
  return window.location.pathname === '' ? '/' : window.location.pathname;
}

// Intro-loadern visas bara första gången webbplatsen öppnas under en session –
// inte varje gång man kommer tillbaka till startsidan.
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
    /* sessionStorage otillgängligt (privat läge e.d.) – strunta i det */
  }
}

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);
  const isHome = currentPath === '/';
  const logoSlotRef = useRef(null);
  const title = titles[currentPath] || titles['/'];
  const { scrollYProgress: heroProgress, heroRef } = useHeroIntroProgress();
  // Intro i två steg: 'loader' (0–100%-uppstart) → 'reveal' (CRT-curtain) → 'done'.
  const [introPhase, setIntroPhase] = useState(() =>
    getCurrentPath() !== '/' || hasSeenIntro() ? 'done' : 'loader',
  );
  const introDone = introPhase === 'done';

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
    const description = descriptions[currentPath] || descriptions['/'];
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.setAttribute('content', description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.append(canonical);
    }
    canonical.setAttribute('href', new URL(currentPath, window.location.origin).href);
  }, [currentPath, title]);

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
        hideStaticLogo
      />
      <AnimatedLogo compact={!isHome} targetRef={logoSlotRef} progress={heroProgress} />
      <main
        id="huvudinnehall"
        className="min-h-screen bg-brand-black text-brand-white"
        tabIndex="-1"
      >
        {isHome && (
          <>
            <HeroTransitionScene
              sceneRef={heroRef}
              progress={heroProgress}
              introReady={introDone}
              renderHero={(transitionProps) => (
                <Hero introProgress={heroProgress} {...transitionProps} />
              )}
              risk={<StatsSection embedded />}
            />
            <StatsSection afterHero />
            <PartnersSection />
            <TerminalSignalSection />
            <FaqFooterScene />
          </>
        )}
        {currentPath === '/tjanster' && (
          <ServicesSection
            renderClosingScene={(operatingModel) => (
              <CinematicFooterScene variant="services" source="/videos/services-footer.mp4">
                {(sceneRef) => (
                  <>
                    {operatingModel}
                    <Footer homeEffects videoScene revealTargetRef={sceneRef} />
                  </>
                )}
              </CinematicFooterScene>
            )}
          />
        )}
        {(currentPath === '/om-oss' || currentPath === '/about') && <AboutSection />}
        {(currentPath === '/kontakt' || currentPath === '/contact') && (
          <ContactPage
            renderClosingScene={(formSection) => (
              <CinematicFooterScene variant="contact" source="/videos/contact-footer.mp4">
                {(sceneRef) => (
                  <>
                    {formSection}
                    <Footer videoScene revealTargetRef={sceneRef} />
                  </>
                )}
              </CinematicFooterScene>
            )}
          />
        )}
      </main>
      {!isHome && currentPath !== '/tjanster' && currentPath !== '/kontakt' && currentPath !== '/contact' && <Footer />}
    </>
  );
}

export default App;
