import { useEffect, useRef, useState } from 'react';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { AnimatedLogo } from './components/layout/AnimatedLogo.jsx';
import { AboutSection } from './components/sections/AboutSection.jsx';
import { ContactSection } from './components/sections/ContactSection.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { ReferencesSection } from './components/sections/ReferencesSection.jsx';
import { ServicesSection } from './components/sections/ServicesSection.jsx';

const titles = {
  '/': 'JUIT NetSec AB – IT-säkerhet, nätverk och infrastruktur',
  '/tjanster': 'Tjänster – JUIT NetSec AB',
  '/om-oss': 'Om oss – JUIT NetSec AB',
  '/referenser': 'Referenser – JUIT NetSec AB',
  '/kontakt': 'Kontakt – JUIT NetSec AB',
};

function getCurrentPath() {
  return window.location.pathname === '' ? '/' : window.location.pathname;
}

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);
  const isHome = currentPath === '/';
  const heroRef = useRef(null);
  const logoSlotRef = useRef(null);
  const title = titles[currentPath] || titles['/'];

  useEffect(() => {
    function navigate(path) {
      const nextPath = titles[path] ? path : '/';
      window.history.pushState({}, '', nextPath);
      setCurrentPath(nextPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

    document.addEventListener('click', handleClick);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <a
        href="#huvudinnehall"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-card focus:bg-brand-green focus:px-4 focus:py-3 focus:font-semibold focus:text-brand-black"
      >
        Hoppa till huvudinnehåll
      </a>
      <Header currentPath={currentPath} logoSlotRef={logoSlotRef} hideStaticLogo={isHome} />
      {isHome && <AnimatedLogo heroRef={heroRef} targetRef={logoSlotRef} />}
      <main id="huvudinnehall" className="min-h-screen bg-brand-black text-brand-white" tabIndex="-1">
        {isHome && <Hero heroRef={heroRef} />}
        {currentPath === '/tjanster' && <ServicesSection />}
        {currentPath === '/om-oss' && <AboutSection />}
        {currentPath === '/referenser' && <ReferencesSection />}
        {currentPath === '/kontakt' && <ContactSection />}
      </main>
      <Footer />
    </>
  );
}

export default App;
