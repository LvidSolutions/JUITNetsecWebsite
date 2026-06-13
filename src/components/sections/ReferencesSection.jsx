import { Card, Container, Section, SectionHeading } from '../ui';

// Ersätt dessa platshållare med riktiga kundcase och godkända citat när de finns.
const testimonials = [
  {
    quote: 'JUIT NetSec hjälpte oss att skapa en tydligare och säkrare nätverksstruktur.',
    name: 'IT-chef, medelstort bolag',
  },
  {
    quote: 'Professionellt, kunnigt och tryggt genom hela projektet.',
    name: 'Operations Manager, techbolag',
  },
  {
    quote: 'En teknisk partner som förstår både säkerhet och affärsbehov.',
    name: 'VD, konsultverksamhet',
  },
];

export function ReferencesSection() {
  return (
    <Section id="referenser" tone="light" className="bg-brand-white">
      <Container>
        <SectionHeading
          eyebrow="Referenser"
          title="Trygg teknisk partner för säkerhetskritiska miljöer"
          text="Korta exempel på den trygghet och tydlighet som JUIT NetSec ska skapa i kundernas tekniska miljöer."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              variant="light"
              className="group min-h-72 border-black/10 hover:border-brand-green/45 hover:shadow-glow"
            >
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-card bg-brand-green/10 text-3xl font-semibold leading-none text-brand-green transition-colors duration-200 group-hover:bg-brand-green group-hover:text-brand-black">
                "
              </div>
              <blockquote className="text-xl font-semibold leading-8 text-brand-ink">
                {testimonial.quote}
              </blockquote>
              <p className="mt-8 border-t border-black/10 pt-5 text-sm font-semibold text-brand-graphite">
                {testimonial.name}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
