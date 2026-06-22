import { Container } from '../ui';

const fields = [
  { id: 'name', label: 'Namn', type: 'text', autoComplete: 'name', placeholder: 'För- och efternamn' },
  { id: 'company', label: 'Företag', type: 'text', autoComplete: 'organization', placeholder: 'Organisation' },
  { id: 'email', label: 'E-post', type: 'email', autoComplete: 'email', placeholder: 'namn@foretag.se' },
  { id: 'phone', label: 'Telefon', type: 'tel', autoComplete: 'tel', placeholder: '+46 ...' },
];

const needs = [
  'IT-infrastruktur',
  'Nätverk & kommunikation',
  'Cybersäkerhet',
  'Datordrift',
  'IT-rådgivning',
  'Teknisk projektledning',
  'Annat',
];

const inputClass =
  'mt-2 h-12 w-full rounded-card border border-brand-line bg-white/[0.02] px-4 text-base text-brand-white outline-none transition-colors duration-200 placeholder:text-brand-mist/35 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20';

function Field({ id, label, type, autoComplete, placeholder }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-medium text-brand-mist/80">{label}</span>
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
              Skriv till oss
            </p>
            <h2
              id="contact-form-title"
              className="mt-5 font-display text-3xl font-semibold leading-tight text-brand-white sm:text-4xl"
            >
              Berätta kort om ert behov
            </h2>
            <p className="mt-5 text-base leading-relaxed text-brand-mist/65 sm:text-lg sm:leading-8">
              Beskriv nuläge, behov eller projekt så återkommer vi för en första dialog. Ju mer
              sammanhang, desto bättre kan vi förbereda samtalet.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-green/80">E-post</p>
                <a
                  href="mailto:ulf.wernersson@juit.se"
                  className="mt-2 inline-block font-display text-lg font-medium text-brand-white transition-colors hover:text-brand-green"
                >
                  ulf.wernersson@juit.se
                </a>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-green/80">Telefon</p>
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
                <span className="text-sm font-medium text-brand-mist/80">Typ av behov</span>
                <select id="need" name="need" defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Välj område …
                  </option>
                  {needs.map((option) => (
                    <option key={option} value={option} className="bg-brand-black text-brand-white">
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block" htmlFor="message">
                <span className="text-sm font-medium text-brand-mist/80">Meddelande</span>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Beskriv nuläge, behov eller projekt …"
                  className="mt-2 w-full resize-y rounded-card border border-brand-line bg-white/[0.02] px-4 py-3 text-base text-brand-white outline-none transition-colors duration-200 placeholder:text-brand-mist/35 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                />
              </label>

              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-card bg-brand-green px-7 text-base font-semibold text-brand-black transition-all duration-200 ease-smooth hover:bg-brand-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green sm:w-auto sm:justify-self-start"
              >
                Skicka förfrågan
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
