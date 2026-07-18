import { ContactForm } from './ContactForm.jsx';
import { ContactHero } from './ContactHero.jsx';
import './contact.css';

export function ContactPage() {
  return (
    <div className="contact-page text-brand-white">
      <div aria-hidden="true" className="contact-grid" />
      <ContactHero />
      <div className="contact-form-section">
        <ContactForm />
      </div>
    </div>
  );
}
