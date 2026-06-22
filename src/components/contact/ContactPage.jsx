import { ContactHero } from './ContactHero.jsx';
import { ContactCards } from './ContactCards.jsx';
import { ContactForm } from './ContactForm.jsx';
import { ContactCTA } from './ContactCTA.jsx';
import './contact.css';

/**
 * Contact-sidan. Stark inspiration från referensens layout/komposition/rörelse,
 * men i JUIT NetSecs premium cyber/IT-profil: mörk botten, tunna gridlinjer och
 * ett svävande video-objekt som visuell mittpunkt i stället för en 3D-skärm.
 */
export function ContactPage() {
  return (
    <div className="contact-page text-brand-white">
      {/* Tunn, cyber-inspirerad grid över hela sidan – ligger bakom allt. */}
      <div aria-hidden="true" className="contact-grid pointer-events-none absolute inset-0 -z-10" />
      <ContactHero />
      <ContactCards />
      <ContactForm />
      <ContactCTA />
    </div>
  );
}
