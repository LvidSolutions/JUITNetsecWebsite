import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { AboutSection } from './components/sections/AboutSection.jsx';
import { ContactSection } from './components/sections/ContactSection.jsx';
import { CtaSection } from './components/sections/CtaSection.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { ReferencesSection } from './components/sections/ReferencesSection.jsx';
import { ServicesSection } from './components/sections/ServicesSection.jsx';
import { TrustSection } from './components/sections/TrustSection.jsx';

function App() {
  return (
    <>
      <a
        href="#hem"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-card focus:bg-brand-green focus:px-4 focus:py-3 focus:font-semibold focus:text-brand-black"
      >
        Hoppa till huvudinnehåll
      </a>
      <Header />
      <main className="min-h-screen bg-brand-black text-brand-white">
        <Hero />
        <TrustSection />
        <ServicesSection />
        <AboutSection />
        <ReferencesSection />
        <CtaSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

export default App;
