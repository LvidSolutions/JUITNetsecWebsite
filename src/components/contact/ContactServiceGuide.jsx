import { Container } from '../ui';

// Verifierad/försiktig positionering – endast områden JUIT NetSec faktiskt arbetar inom.
const areas = [
  { id: '01', title: 'IT-infrastruktur', text: 'Stabil grund: servrar, lagring, virtualisering och daglig drift.' },
  { id: '02', title: 'Nätverk & kommunikation', text: 'Trådbundet och trådlöst, segmentering och säker uppkoppling mellan platser.' },
  { id: '03', title: 'Cybersäkerhet', text: 'Härdning, åtkomstkontroll och rutiner som höjer er motståndskraft.' },
  { id: '04', title: 'Datordrift', text: 'Klienter, uppdateringar och support som håller vardagen i gång.' },
  { id: '05', title: 'IT-rådgivning', text: 'Ett bollplank för vägval, prioriteringar och teknisk riktning.' },
  { id: '06', title: 'Teknisk projektledning', text: 'Struktur och tempo från idé till driftsatt lösning.' },
];

/**
 * Service-guide: hjälper besökaren att placera sitt behov inom JUIT NetSecs
 * områden innan de fyller i formuläret. Editorial, lugn och luftig.
 */
export function ContactServiceGuide() {
  return (
    <section id="service-guide" aria-label="Områden vi arbetar inom" className="relative py-20 lg:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.32em] text-brand-green sm:text-sm">
              Vad gäller det?
            </p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.04] tracking-tight text-brand-white sm:text-5xl">
              Hitta ert område
            </h2>
          </div>
          <p className="text-base leading-relaxed text-brand-mist/65 sm:text-lg sm:leading-8">
            Vi arbetar brett inom IT-miljöns kärna. Känn igen er i ett område nedan så är det en bra
            startpunkt för dialogen – vi hjälper er att reda ut resten.
          </p>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-brand-line bg-brand-line sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <li
              key={area.id}
              className="group bg-brand-black p-7 transition-colors duration-300 hover:bg-white/[0.03] sm:p-8"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs tracking-[0.3em] text-brand-mist/40">{area.id}</span>
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[1px] bg-brand-green/70 transition-transform duration-300 group-hover:scale-150" />
              </div>
              <h3 className="mt-8 font-display text-xl font-semibold text-brand-white">{area.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-mist/60">{area.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
