import { Header } from './components/layout/Header.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { ServicesSection } from './components/sections/ServicesSection.jsx';
import { TrustSection } from './components/sections/TrustSection.jsx';

function App() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      <Header />
      <Hero />
      <TrustSection />
      <ServicesSection />
    </main>
  );
}

export default App;
