import { Container } from '../ui';

const cards = [
  {
    index: '01',
    title: 'Discuss a need',
    text: 'A first conversation about where you are, your challenges and where you want to go. We listen to the environment before suggesting anything.',
    action: 'Start the conversation',
  },
  {
    index: '02',
    title: 'Book an assessment',
    text: 'A structured review of infrastructure, networking and operations to find risks and improvements.',
    action: 'Book a time',
  },
  {
    index: '03',
    title: 'Project or specialist support',
    text: 'Need technical project management or a focused effort? We step in where the expertise is needed.',
    action: 'Describe the project',
  },
];

export function ContactCards() {
  return (
    <section id="kontaktkort" aria-label="Ways to start a conversation" className="relative py-20 lg:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.32em] text-brand-green sm:text-sm">
            Three ways in
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-brand-white sm:text-4xl">
            Choose what fits your situation
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
