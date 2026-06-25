import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';

const services = [
  {
    number: '01',
    title: 'IT Infrastructure',
    text: 'Architecture, improvement and implementation of stable infrastructure for environments that need control, resilience and long-term maintainability.',
    symbol: 'INF',
    line: 'Foundation layer',
    focus: ['Architecture', 'Segmentation', 'Resilience', 'Lifecycle'],
  },
  {
    number: '02',
    title: 'Network & Secure Communication',
    text: 'Secure communication paths for users, offices, systems and external connections, designed around visibility and operational reliability.',
    symbol: 'NET',
    line: 'Communication layer',
    focus: ['Routing', 'Access', 'Connectivity', 'Control'],
  },
  {
    number: '03',
    title: 'Cybersecurity',
    text: 'Practical security guidance and technical implementation that reduce risk across infrastructure, identities, endpoints and connected systems.',
    symbol: 'SEC',
    line: 'Protection layer',
    focus: ['Risk', 'Hardening', 'Identity', 'Visibility'],
  },
  {
    number: '04',
    title: 'IT Operations',
    text: 'Reliable operations support for companies that need secure systems to remain understandable, documented and stable over time.',
    symbol: 'OPS',
    line: 'Operations layer',
    focus: ['Operations', 'Support', 'Documentation', 'Continuity'],
  },
  {
    number: '05',
    title: 'Technical Advisory',
    text: 'Senior advisory for technical decisions, requirements, project direction and implementation choices across IT and security environments.',
    symbol: 'ADV',
    line: 'Decision layer',
    focus: ['Strategy', 'Requirements', 'Procurement', 'Direction'],
  },
  {
    number: '06',
    title: 'IT Management',
    text: 'Structured management of technical environments with focus on maintainability, communication, governance and practical execution.',
    symbol: 'MGT',
    line: 'Management layer',
    focus: ['Governance', 'Planning', 'Execution', 'Maintainability'],
  },
];

const vendorCategories = [
  {
    name: 'New',
    description: 'Products, platforms and vendors that can be part of modern infrastructure, cloud and security environments.',
    vendors: [
      { name: 'VMware', url: 'https://www.vmware.com/', symbol: 'VM' },
      { name: 'Veeam', symbol: 'VE' },
      {
        name: 'Dell',
        url: 'https://www.dell.com/sv-se/shop/scc/sc/private-cloud-solutions',
        symbol: 'DE',
      },
      {
        name: 'Trend Micro',
        url: 'https://www.trendmicro.com/en_us/business.html',
        symbol: 'TM',
      },
      { name: 'Microsoft', url: 'https://www.microsoft.com', symbol: 'MS' },
      { name: 'Smart Cloud Solutions', symbol: 'SC' },
      { name: 'Microsoft Azure', symbol: 'AZ' },
      { name: 'AWS', symbol: 'AW' },
    ],
  },
];

function MonoLabel({ children, className = '' }) {
  return (
    <p className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-green ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[1px] bg-brand-green shadow-glow" />
      {children}
    </p>
  );
}

function FocusList({ items, className = '' }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className="border border-brand-line bg-black/25 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-mist/70 transition-colors duration-300 group-hover:border-brand-green/40 group-hover:text-brand-white/85"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function PrimaryCapability({ service, prefersReducedMotion }) {
  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="group relative min-h-[34rem] overflow-hidden border-y border-brand-line bg-white/[0.018] p-6 transition-colors duration-300 hover:bg-brand-green/[0.025] sm:p-8 lg:border lg:p-10"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,83,0.04)_1px,transparent_1px)] bg-[size:42px_42px] opacity-45" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-green/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-green/80 to-transparent" />
        <div className="absolute left-8 top-8 h-24 w-px bg-gradient-to-b from-brand-green/70 to-transparent" />
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand-green">
              {service.number} / Primary capability
            </p>
            <p className="mt-4 max-w-xs font-mono text-xs uppercase leading-6 tracking-[0.22em] text-brand-mist/45">
              {service.line} / secure technical baseline
            </p>
          </div>
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center border border-brand-green/40 bg-brand-green/10 font-mono text-xs font-semibold tracking-[0.18em] text-brand-green transition-colors duration-300 group-hover:bg-brand-green group-hover:text-brand-black">
            {service.symbol}
            <span aria-hidden="true" className="absolute -bottom-1 -right-1 h-3 w-3 bg-brand-green" />
          </div>
        </div>

        <div className="mt-16">
          <span aria-hidden="true" className="font-display text-[clamp(5rem,14vw,10rem)] font-semibold leading-none tracking-tight text-brand-white/[0.055]">
            {service.number}
          </span>
          <h3 className="-mt-8 max-w-xl font-display text-4xl font-semibold leading-[1.02] tracking-tight text-brand-white sm:text-5xl">
            {service.title}
          </h3>
          <p className="mt-7 max-w-lg text-base leading-8 text-brand-mist/76 sm:text-lg">
            {service.text}
          </p>
        </div>

        <div className="mt-auto pt-10">
          <FocusList items={service.focus} />
          <div className="mt-8 flex items-center justify-between border-t border-brand-line pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-brand-mist/45">
            <span>Technical focus</span>
            <span className="text-brand-green">active baseline</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function CapabilityRow({ service, index, prefersReducedMotion }) {
  return (
    <motion.li
      initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden border-b border-brand-line last:border-b-0"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-y-0 left-0 w-px bg-brand-green" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,200,83,0.075),transparent_42%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand-green/70 via-transparent to-transparent" />
      </div>

      <div className="relative grid gap-6 py-7 sm:grid-cols-[5rem_minmax(0,1fr)] sm:px-2 lg:grid-cols-[5rem_minmax(0,0.82fr)_minmax(14rem,0.7fr)] lg:items-start lg:gap-8">
        <div className="flex items-center justify-between gap-4 sm:block">
          <span className="font-display text-4xl font-semibold leading-none tracking-tight text-brand-white/18 transition-colors duration-300 group-hover:text-brand-green/35">
            {service.number}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-green sm:mt-3 sm:block">
            {service.symbol}
          </span>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-mist/45">
              {service.line}
            </p>
            <span aria-hidden="true" className="h-px w-10 bg-brand-green/50" />
          </div>
          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-brand-white transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">
            {service.title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-mist/70 sm:text-base">
            {service.text}
          </p>
        </div>

        <div className="lg:justify-self-end">
          <FocusList items={service.focus} />
          <div className="mt-5 flex items-center justify-between border-t border-brand-line pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-brand-mist/45">
            <span>Explore capability</span>
            <span className="text-brand-green transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

function VendorCard({ vendor }) {
  const content = (
    <div className="group relative flex min-h-36 flex-col justify-between overflow-hidden border border-brand-line bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-green/45 hover:bg-brand-green/[0.04]">
      <div className="absolute inset-x-0 top-0 h-px scale-x-0 bg-brand-green transition-transform duration-300 group-hover:scale-x-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center border border-brand-green/30 bg-brand-green/10 font-mono text-xs font-semibold text-brand-green transition-colors duration-300 group-hover:bg-brand-green group-hover:text-brand-black">
          {vendor.symbol}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-mist/35">
          {vendor.url ? 'link' : 'node'}
        </span>
      </div>
      <div className="mt-8">
        <h4 className="text-lg font-semibold leading-7 text-brand-white">{vendor.name}</h4>
        <p className="mt-2 text-sm leading-6 text-brand-mist/55">
          {vendor.url ? 'Open vendor' : 'Shown without external link'}
        </p>
      </div>
    </div>
  );

  if (!vendor.url) {
    return content;
  }

  return (
    <a
      href={vendor.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${vendor.name} in a new tab`}
      className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-4 focus-visible:ring-offset-brand-black"
    >
      {content}
    </a>
  );
}

export function ServicesSection() {
  const prefersReducedMotion = useReducedMotion();
  const [primaryService, ...secondaryServices] = services;

  return (
    <div id="tjanster" className="overflow-hidden bg-brand-black text-brand-white">
      <section className="relative border-b border-brand-line pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(0,200,83,0.18),transparent_34%),radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.07),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div className="space-y-7">
              <MonoLabel>Services / capability map</MonoLabel>
              <div className="max-w-sm border-l border-brand-line pl-5 font-mono text-xs uppercase leading-6 tracking-[0.22em] text-brand-mist/55">
                <p>Infrastructure</p>
                <p>Security architecture</p>
                <p>Cloud operations</p>
                <p>Senior advisory</p>
              </div>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-brand-mist/45">JUIT NetSec AB</p>
              <h1 className="mt-5 max-w-5xl font-display text-[clamp(3.4rem,10vw,8.4rem)] font-semibold uppercase leading-[0.84] tracking-[-0.05em] text-brand-white">
                Secure<br />systems. <span className="text-brand-green">Real</span><br />operations.
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-brand-mist/78 sm:text-xl sm:leading-9">
                We build, secure and manage IT environments with the same practical focus attackers
                exploit: infrastructure, access, segmentation, cloud and operability have to work together.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative border-b border-brand-line py-24 sm:py-28 lg:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,200,83,0.08),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0,transparent_calc(100%-1px),rgba(255,255,255,0.04)_calc(100%-1px)),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:96px_96px] opacity-25" />
        <Container className="relative">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="border-y border-brand-line py-10"
          >
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <MonoLabel>Core services</MonoLabel>
                <div className="mt-7 max-w-md border-l border-brand-line pl-5 font-mono text-xs uppercase leading-6 tracking-[0.22em] text-brand-mist/55">
                  <p>06 service domains</p>
                  <p>senior technical delivery</p>
                  <p className="text-brand-green/80">secure infrastructure / reliable operations</p>
                </div>
              </div>
              <div>
                <h2 className="max-w-4xl font-display text-4xl font-semibold leading-[0.98] tracking-tight text-brand-white sm:text-5xl lg:text-6xl">
                  Core services for secure, reliable IT environments.
                </h2>
                <p className="mt-7 max-w-3xl text-base leading-7 text-brand-mist/72 sm:text-lg sm:leading-8">
                  JUIT NetSec AB supports organizations across infrastructure, secure communication,
                  cybersecurity, operations and technical advisory - with a focus on practical
                  implementation, control and long-term reliability.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
            <PrimaryCapability service={primaryService} prefersReducedMotion={prefersReducedMotion} />
            <ol className="border-y border-brand-line lg:border-t">
              {secondaryServices.map((service, index) => (
                <CapabilityRow
                  key={service.title}
                  service={service}
                  index={index}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {vendorCategories.map((category) => (
        <section key={category.name} className="relative border-b border-brand-line py-20 sm:py-24 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(0,200,83,0.1),transparent_34%)]" />
          <Container className="relative">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <MonoLabel>Partner / vendor layer</MonoLabel>
                <h2 className="mt-6 font-display text-[clamp(3rem,8vw,7rem)] font-semibold uppercase leading-[0.84] tracking-[-0.05em] text-brand-white">
                  {category.name}
                </h2>
              </div>
              <p className="max-w-3xl text-lg leading-8 text-brand-mist/72 lg:justify-self-end lg:text-right">
                {category.description}
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {category.vendors.map((vendor) => (
                <VendorCard key={vendor.name} vendor={vendor} />
              ))}
            </div>
          </Container>
        </section>
      ))}
    </div>
  );
}
