import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { AboutSection } from './components/sections/AboutSection.jsx';
import { ContactSection } from './components/sections/ContactSection.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { ReferencesSection } from './components/sections/ReferencesSection.jsx';
import { ServicesSection } from './components/sections/ServicesSection.jsx';

const pages = {
  '/': {
    title: 'JUIT NetSec AB – IT-säkerhet, nätverk och infrastruktur',
    content: <Hero />,
  },
  '/tjanster': {
    title: 'Tjänster – JUIT NetSec AB',
    content: <ServicesSection />,
  },
  '/om-oss': {
    title: 'Om oss – JUIT NetSec AB',
    content: <AboutSection />,
  },
  '/referenser': {
    title: 'Referenser – JUIT NetSec AB',
    content: <ReferencesSection />,
  },
  '/kontakt': {
    title: 'Kontakt – JUIT NetSec AB',
    content: <ContactSection />,
  },
};

function getCurrentPath() {
  return window.location.pathname === '' ? '/' : window.location.pathname;
}

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);
  const page = useMemo(() => pages[currentPath] || pages['/'], [currentPath]);

  useEffect(() => {
    function navigate(path) {
      const nextPath = pages[path] ? path : '/';
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
    document.title = page.title;
  }, [page.title]);

  return (
    <>
      <a
        href="#huvudinnehall"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-card focus:bg-brand-green focus:px-4 focus:py-3 focus:font-semibold focus:text-brand-black"
      >
        Hoppa till huvudinnehåll
      </a>
      <Header currentPath={currentPath} />
      <main id="huvudinnehall" className="min-h-screen bg-brand-black text-brand-white" tabIndex="-1">
        {page.content}
      </main>
      <Footer />
    </>
  );
}

export default App;
