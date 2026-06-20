import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';
import { StatCard } from './StatCard.jsx';

const stats = [
  {
    value: 59,
    suffix: '%',
    heading: 'av SME-respondenter rapporterade cyberattack senaste året',
    caption: 'Källa: Hiscox Cyber Readiness Report 2025',
  },
  {
    value: 88,
    suffix: '%',
    heading: 'ransomware-relaterade breaches hos SMBs i Verizon DBIR 2025',
    caption: 'Källa: Verizon 2025 DBIR SMB Snapshot',
  },
  {
    value: 43,
    suffix: '%',
    heading: 'av företag rapporterade breach eller attack senaste 12 månaderna',
    caption: 'Källa: UK Government Cyber Security Breaches Survey 2025/26',
  },
  {
    prefix: '$',
    value: 115,
    suffix: 'k',
    heading: 'medianbelopp betalt till ransomware-grupper enligt Verizon DBIR',
    caption: 'Källa: Verizon 2025 DBIR Executive Summary',
  },
];

export function StatsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="risklandskapet"
      className="relative overflow-hidden bg-brand-black py-24 sm:py-28 lg:py-32"
    >
      <div className="hero-grid absolute inset-0 opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(0,200,83,0.14),transparent_45%)]" />

      <Container className="relative">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
            01 / Risklandskapet
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-brand-white sm:text-4xl lg:text-5xl">
            Cyberrisk är inte längre ett framtidsproblem
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-mist">
            För många företag handlar säkerhet inte om en enskild produkt, utan om synlighet, kontroll
            och förmågan att agera innan ett intrång blir en driftstörning.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.heading} index={index} {...stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}
