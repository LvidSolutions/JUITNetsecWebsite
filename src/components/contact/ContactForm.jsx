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

const inputClass =
  'mt-2 h-12 w-full rounded-card border border-brand-line bg-white/[0.02] px-4 text-base text-brand-white outline-none transition-colors duration-200 placeholder:text-brand-mist/35 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20';

function Field({ id, label, type, autoComplete, placeholder }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand-mist/70">{label}</span>
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

export function ContactForm() {
  return (
    <section id="kontaktformular" aria-labelledby="contact-form-title" className="relative py-20 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.32em] text-brand-green sm:text-sm">
              Write to us
            </p>
            <h2
              id="contact-form-title"
              className="mt-5 font-display text-3xl font-semibold leading-tight text-brand-white sm:text-4xl"
            >
              Tell us briefly about your needs
            </h2>
            <p className="mt-5 text-base leading-relaxed text-brand-mist/65 sm:text-lg sm:leading-8">
              Describe your current situation, needs or project and we'll get back to you for a first
              conversation. The more context, the better we can prepare.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-green/80">Email</p>
                <a
                  href="mailto:contact@juit.se"
                  className="mt-2 inline-block font-display text-lg font-medium text-brand-white transition-colors hover:text-brand-green"
                >
                  contact@juit.se
                </a>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-green/80">Phone</p>
                <a
                  href="tel:+46708256393"
                  className="mt-2 inline-block font-display text-lg font-medium text-brand-white transition-colors hover:text-brand-green"
                >
                  +46 708-25 63 93
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-brand-line bg-white/[0.02] p-6 shadow-glow sm:p-9">
            {/* Koppla senare till Formspree, API, CMS eller annan vald lösning. */}
            <form className="grid gap-5" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <Field key={field.id} {...field} />
                ))}
              </div>

              <label className="block" htmlFor="need">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand-mist/70">Type of need</span>
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
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand-mist/70">Message</span>
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
                className="inline-flex min-h-12 items-center justify-center rounded-card bg-brand-green px-7 text-sm font-semibold uppercase tracking-[0.14em] text-brand-black transition-all duration-200 ease-smooth hover:bg-brand-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green sm:w-auto sm:justify-self-start"
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
