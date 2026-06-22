import { Button, Card, Container, Section, SectionHeading } from '../ui';

const fields = [
  { id: 'name', label: 'Namn', type: 'text', autoComplete: 'name' },
  { id: 'company', label: 'Företag', type: 'text', autoComplete: 'organization' },
  { id: 'email', label: 'E-post', type: 'email', autoComplete: 'email' },
  { id: 'phone', label: 'Telefonnummer', type: 'tel', autoComplete: 'tel' },
];

function Field({ id, label, type, autoComplete }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-medium text-brand-graphite">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        className="mt-2 h-12 w-full rounded-card border border-black/10 bg-brand-white px-4 text-base text-brand-ink outline-none placeholder:text-brand-graphite/45 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
      />
    </label>
  );
}

export function ContactSection() {
  return (
    <Section id="kontakt" tone="light" className="bg-brand-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Kontakt"
              title="Starta en trygg dialog om din IT-miljö"
              text="Berätta kort om nuläge, behov eller projekt så återkommer vi för en första dialog."
              align="left"
            />

            <div className="mt-10 space-y-5 text-brand-graphite">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-green">E-post</p>
                <a className="mt-1 inline-block font-semibold hover:text-brand-green" href="mailto:info@juitnetsec.se">
                  info@juitnetsec.se
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-green">Telefon</p>
                <p className="mt-1 font-semibold">+46 70 000 00 00</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-green">Plats</p>
                <p className="mt-1 font-semibold">Sverige</p>
              </div>
            </div>
          </div>

          <Card variant="light" className="border-black/10">
            {/* Koppla senare till Formspree, API, CMS eller annan vald formulärlösning. */}
            <form className="grid gap-5" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <Field key={field.id} {...field} />
                ))}
              </div>

              <label className="block" htmlFor="message">
                <span className="text-sm font-medium text-brand-graphite">Meddelande</span>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  className="mt-2 w-full resize-y rounded-card border border-black/10 bg-brand-white px-4 py-3 text-base text-brand-ink outline-none placeholder:text-brand-graphite/45 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                />
              </label>

              <Button as="button" type="submit" className="w-full sm:w-auto sm:justify-self-start">
                Skicka
              </Button>
            </form>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
