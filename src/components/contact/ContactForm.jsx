import { Container } from '../ui';

const fields = [
  { id: 'name', label: 'Name', type: 'text', autoComplete: 'name', placeholder: 'First and last name' },
  { id: 'company', label: 'Company', type: 'text', autoComplete: 'organization', placeholder: 'Organization' },
  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'Your email address' },
  { id: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', placeholder: '+46 ...' },
];

const needs = [
  'IT infrastructure',
  'Networking & communication',
  'Cybersecurity',
  'Computer operations',
  'IT advisory',
  'Technical project management',
  'Other',
];

const labelClass = 'text-xs font-medium uppercase tracking-[0.16em] text-brand-mist/70';

const inputClass =
  'mt-2 h-12 w-full rounded-card border border-brand-line bg-white/[0.02] px-4 text-base text-brand-white outline-none transition-colors duration-200 placeholder:text-brand-mist/35 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20';

function Field({ id, label, type, autoComplete, placeholder }) {
  return (
    <label className="block" htmlFor={id}>
      <span className={labelClass}>{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

/**
 * Kontaktformulär i Sohub-anda: ett sammanhållet, enspaltigt block – centrerad
 * texthierarki överst (etikett, rubrik, paragraf, e-post + telefon) och därunder
 * ett mörkt, kantat formulärkort. Ingen vänster/höger-kolumnsdelning. Fältnamn,
 * select, textarea och submit-handler är oförändrade så funktionalitet/validering
 * och en framtida EmailJS/API-koppling fungerar precis som innan.
 */
export function ContactForm() {
  return (
    <section id="kontaktformular" aria-labelledby="contact-form-title" className="relative py-24 lg:py-32">
      <div aria-hidden="true" className="contact-form-glow pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2" />

      <Container>
        <div className="mx-auto w-full max-w-2xl">
          {/* Texthierarki – centrerad överst. */}
          <div className="text-center">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.32em] text-brand-green sm:text-sm">
              Write to us
            </p>
            <h2
              id="contact-form-title"
              className="mt-5 font-display text-3xl font-semibold leading-tight text-brand-white sm:text-4xl"
            >
              Tell us briefly about your needs
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-brand-mist/65 sm:text-lg sm:leading-8">
              Describe your current situation, needs or project and we'll get back to you for a first
              conversation. The more context, the better we can prepare.
            </p>
          </div>

          {/* E-post + telefon – centrerad rad under paragrafen. */}
          <div className="mt-10 flex flex-col items-center gap-8 border-y border-brand-line/70 py-7 sm:flex-row sm:justify-center sm:gap-16">
            <div className="text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-green/80">Email</p>
              <a
                href="mailto:contact@juit.se"
                className="mt-2 inline-block font-display text-lg font-medium text-brand-white transition-colors hover:text-brand-green"
              >
                contact@juit.se
              </a>
            </div>
            <div aria-hidden="true" className="hidden h-10 w-px bg-brand-line/70 sm:block" />
            <div className="text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-green/80">Phone</p>
              <a
                href="tel:+46708256393"
                className="mt-2 inline-block font-display text-lg font-medium text-brand-white transition-colors hover:text-brand-green"
              >
                +46 708-25 63 93
              </a>
            </div>
          </div>

          {/* Formulärkort – samma vertikala flöde, mörkt med subtil grön glow. */}
          <div className="mt-10 rounded-card border border-brand-line bg-white/[0.02] p-6 shadow-glow sm:mt-12 sm:p-9">
            {/* Koppla senare till Formspree, API, CMS eller annan vald lösning. */}
            <form className="grid gap-5 text-left" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <Field key={field.id} {...field} />
                ))}
              </div>

              <label className="block" htmlFor="need">
                <span className={labelClass}>Type of need</span>
                <select id="need" name="need" defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Choose an area …
                  </option>
                  {needs.map((option) => (
                    <option key={option} value={option} className="bg-brand-black text-brand-white">
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block" htmlFor="message">
                <span className={labelClass}>Message</span>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Describe your current situation, needs or project …"
                  className="mt-2 w-full resize-y rounded-card border border-brand-line bg-white/[0.02] px-4 py-3 text-base text-brand-white outline-none transition-colors duration-200 placeholder:text-brand-mist/35 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                />
              </label>

              <button
                type="submit"
                className="mt-1 inline-flex min-h-12 w-full items-center justify-center rounded-card bg-brand-green px-7 text-sm font-semibold uppercase tracking-[0.14em] text-brand-black transition-all duration-200 ease-smooth hover:bg-brand-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                Send request
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
