import { Container } from '../ui';

const cards = [
  {
    index: '01',
    title: 'Diskutera ett behov',
    text: 'Ett första samtal om nuläge, utmaningar och vart ni vill. Vi lyssnar in miljön innan vi föreslår något.',
    action: 'Starta dialogen',
  },
  {
    index: '02',
    title: 'Boka analys',
    text: 'En strukturerad genomgång av infrastruktur, nätverk och drift för att hitta risker och förbättringar.',
    action: 'Boka en tid',
  },
  {
    index: '03',
    title: 'Projekt eller specialistinsats',
    text: 'Behöver ni teknisk projektledning eller punktinsats? Vi går in där kompetensen behövs.',
    action: 'Beskriv projektet',
  },
];

/**
 * Tre ingångar till en dialog. Behåller JUIT-strukturen men i mörk, premium-stil
 * som matchar resten av sidan.
 */
export function ContactCards() {
  return (
    <section id="kontaktkort" aria-label="Sätt att starta en dialog" className="relative py-20 lg:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.32em] text-brand-green sm:text-sm">
            Tre vägar in
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-brand-white sm:text-4xl">
            Välj det som passar er situation
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <a
              key={card.index}
              href="#kontaktformular"
              className="group relative flex flex-col rounded-card border border-brand-line bg-white/[0.02] p-7 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-brand-green/50 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green sm:p-8"
            >
              <span className="font-mono text-xs tracking-[0.3em] text-brand-mist/40">{card.index}</span>
              <h3 className="mt-6 font-display text-xl font-semibold text-brand-white">{card.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-brand-mist/65">{card.text}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-green">
                {card.action}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-smooth group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
