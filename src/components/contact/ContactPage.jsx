import { ContactHero } from './ContactHero.jsx';
import { ContactForm } from './ContactForm.jsx';
import './contact.css';

/**
 * Contact-sidan: mörk premium cyber/IT-profil med tunna gridlinjer. Sidan är
 * avskalad till hjälten följt av kontaktformuläret – övriga sektioner (kort,
 * service-guide, CTA) är borttagna ur flödet för ett fokuserat, enspaltigt
 * formulär i Sohub-anda. Komponentfilerna finns kvar om de behövs igen.
 */
export function ContactPage() {
  return (
    <div className="contact-page text-brand-white">
      <div aria-hidden="true" className="contact-grid pointer-events-none absolute inset-0 -z-10" />
      <ContactHero />
      <ContactForm />
    </div>
  );
}
