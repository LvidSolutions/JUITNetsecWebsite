import { Container } from '../ui';

const services = [
  {
    title: 'Networking & infrastructure',
    text: 'Design, implementation and optimization of stable, secure network environments for organizations where availability and control are critical.',
    symbol: 'NI',
    tag: 'Infrastructure',
  },
  {
    title: 'Cybersecurity',
    text: 'Protecting systems, users and data through modern security solutions, risk reduction and clear technical processes.',
    symbol: 'CS',
    tag: 'Security',
  },
  {
    title: 'Firewalls & security architecture',
    text: 'Advisory, implementation and management of firewalls, segmentation and zero-trust principles.',
    symbol: 'SA',
    tag: 'Architecture',
  },
  {
    title: 'Cloud & data centers',
    text: 'Secure and scalable solutions for cloud, hybrid environments and data centers with a focus on long-term operability.',
    symbol: 'MD',
    tag: 'Cloud',
  },
  {
    title: 'Automation',
    text: 'Streamline operations, documentation and configuration with smart workflows that reduce manual risk.',
    symbol: 'AU',
    tag: 'Ops',
  },
  {
    title: 'IT consulting',
    text: 'Senior technical expertise for projects, procurement, implementations and strategic decisions across IT and security.',
    symbol: 'IT',
    tag: 'Advisory',
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

function ServiceCard({ service, index }) {
  return (
    <article className="group relative min-h-[22rem] overflow-hidden border border-brand-line bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/50 hover:bg-brand-green/[0.045] hover:shadow-glow sm:p-7">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-green to-transparent" />
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-green/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,83,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,83,0.055)_1px,transparent_1px)] bg-[size:34px_34px]" />
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-5">
          <div className="relative flex h-14 w-14 items-center justify-center border border-brand-green/35 bg-brand-green/10 font-mono text-sm font-semibold text-brand-green transition-colors duration-300 group-hover:bg-brand-green group-hover:text-brand-black">
            {service.symbol}
            <span aria-hidden="true" className="absolute -right-1 -top-1 h-2.5 w-2.5 bg-brand-green" />
          </div>
          <span className="font-mono text-xs tracking-[0.24em] text-brand-mist/35">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-green/80">{service.tag}</p>
          <h3 className="mt-4 max-w-sm font-display text-2xl font-semibold leading-tight tracking-tight text-brand-white sm:text-3xl">
            {service.title}
          </h3>
          <p className="mt-5 text-sm leading-7 text-brand-mist/68 sm:text-base">{service.text}</p>
        </div>

        <div className="mt-auto pt-8">
          <div className="flex items-center justify-between border-t border-brand-line pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-brand-mist/45">
            <span>JUIT service node</span>
            <span className="text-brand-green">active</span>
          </div>
        </div>
      </div>
    </article>
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

      <section className="relative border-b border-brand-line py-20 sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <MonoLabel>Core services</MonoLabel>
              <h2 className="mt-6 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight text-brand-white sm:text-5xl">
                From technical risk to working protection in production.
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-brand-mist/68">
                The services page is built like an operational system: each block represents a part of
                the environment that has to be analyzed, hardened and work over the long term.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {services.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
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

      <section className="relative py-20 sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-10 border-y border-brand-line py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <MonoLabel>Execution model</MonoLabel>
              <h2 className="mt-6 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-brand-white sm:text-5xl">
                Analyze. Design. Implement. Manage.
              </h2>
            </div>
            <div className="grid gap-0 border-t border-brand-line font-mono text-sm text-brand-mist/70 sm:grid-cols-2 lg:border-t-0">
              {['01 / Current state and risk', '02 / Architecture and direction', '03 / Implementation', '04 / Documented management'].map((step, index) => (
                <div
                  key={step}
                  className={`border-b border-brand-line py-5 sm:px-5 ${index % 2 === 0 ? 'sm:border-r' : ''}`}
                >
                  <span className="text-brand-green">{step.split(' / ')[0]}</span> / {step.split(' / ')[1]}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
