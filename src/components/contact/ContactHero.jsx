import { Container } from '../ui';
import { ContactVideoObject } from './ContactVideoObject.jsx';

// Verifierad positionering – endast tjänsteområden JUIT NetSec faktiskt erbjuder.
const positioning = [
  'IT-infrastruktur',
  'Nätverk & kommunikation',
  'Cybersäkerhet',
  'Datordrift',
  'IT-rådgivning',
  'Teknisk projektledning',
];

/**
 * Hero med samma kompositionsprincip som referensen: en mycket stor rubrik och
 * ett svävande objekt som överlappar typografin. Datorn ligger ovanpå (z) och
 * "flyter" framför CONTACT-texten – den svarta videobakgrunden faller bort via
 * mix-blend (se contact.css) så bara själva enheten syns.
 */
export function ContactHero() {
  return (
    <section
      aria-labelledby="contact-hero-title"
      className="relative isolate flex min-h-[92vh] items-center pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-40"
    >
      <Container className="relative z-10">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.34em] text-brand-green sm:text-sm">
          Kontakt / Dialog / Teknisk kontroll
        </p>

        {/* Rubriken är ankaret för det svävande objektet: datorn placeras absolut
            mot rubrikens högra del och svävar framför typografin – precis som
            referensens objekt överlappar ordet, men med kroppstexten fri nedanför. */}
        <div className="relative mt-6">
          <h1
            id="contact-hero-title"
            className="font-display text-[19vw] font-semibold leading-[0.86] tracking-tight text-brand-white sm:text-[15vw] lg:text-[12.5vw] xl:text-[180px]"
          >
            CONTACT
          </h1>

          <div className="pointer-events-none absolute right-0 top-1/2 z-20 hidden w-[44%] max-w-[560px] -translate-y-1/2 translate-x-[8%] lg:block">
            <ContactVideoObject />
          </div>
        </div>

        {/* Video som flödande block på mobil/surfplatta (förenklad, fortfarande
            synlig). Döljs på desktop där den absolut placerade versionen syns. */}
        <div className="mt-8 lg:hidden">
          <ContactVideoObject className="mx-auto w-[88%] max-w-[460px]" />
        </div>

        <div className="mt-10 max-w-2xl lg:mt-12">
          <p className="font-display text-2xl font-medium leading-tight text-brand-white sm:text-3xl">
            Starta en dialog om er IT-miljö.
          </p>
          <p className="mt-5 text-base leading-relaxed text-brand-mist/70 sm:text-lg sm:leading-8">
            JUIT NetSec hjälper företag att skapa stabilare infrastruktur, säkrare kommunikation och
            bättre teknisk kontroll.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#kontaktformular"
              className="inline-flex min-h-12 items-center justify-center rounded-card bg-brand-green px-7 text-base font-semibold text-brand-black transition-all duration-200 ease-smooth hover:bg-brand-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              Diskutera ert behov
            </a>
            <a
              href="#kontaktkort"
              className="inline-flex min-h-12 items-center justify-center rounded-card border border-brand-line bg-transparent px-7 text-base font-semibold text-brand-white transition-all duration-200 ease-smooth hover:border-brand-green hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              Boka ett första samtal
            </a>
          </div>
        </div>

        {/* Positioneringsrad – tunn, cyber-inspirerad detalj. */}
        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.22em] text-brand-mist/45 sm:text-xs">
          {positioning.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span aria-hidden="true" className="h-1 w-1 rounded-[1px] bg-brand-green/80" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
