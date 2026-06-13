import { Header } from './components/layout/Header.jsx';
import { AboutSection } from './components/sections/AboutSection.jsx';
import { ContactSection } from './components/sections/ContactSection.jsx';
import { CtaSection } from './components/sections/CtaSection.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { ReferencesSection } from './components/sections/ReferencesSection.jsx';
import { ServicesSection } from './components/sections/ServicesSection.jsx';
import { TrustSection } from './components/sections/TrustSection.jsx';

function App() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      <Header />
      <Hero />
      <TrustSection />
      <ServicesSection />
      <AboutSection />
      <ReferencesSection />
      <CtaSection />
      <ContactSection />
    </main>
  );
}

export default App;
