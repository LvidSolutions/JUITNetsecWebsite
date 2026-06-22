import { ContactHero } from './ContactHero.jsx';
import { ContactCards } from './ContactCards.jsx';
import { ContactServiceGuide } from './ContactServiceGuide.jsx';
import { ContactForm } from './ContactForm.jsx';
import { ContactCTA } from './ContactCTA.jsx';
import './contact.css';

/**
 * Contact-sidan från Claude-branchen. Behåller mörk premium cyber/IT-profil,
 * tunna gridlinjer och ett svävande video-objekt som visuell mittpunkt.
 */
export function ContactPage() {
  return (
    <div className="contact-page text-brand-white">
      <div aria-hidden="true" className="contact-grid pointer-events-none absolute inset-0 -z-10" />
      <ContactHero />
      <ContactCards />
      <ContactServiceGuide />
      <ContactForm />
      <ContactCTA />
    </div>
  );
}
