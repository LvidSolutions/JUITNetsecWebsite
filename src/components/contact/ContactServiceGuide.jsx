import { Container } from '../ui';

const areas = [
  { id: '01', title: 'IT infrastructure', text: 'A stable foundation: servers, storage, virtualization and day-to-day operations.' },
  { id: '02', title: 'Networking & communication', text: 'Wired and wireless, segmentation and secure connectivity between sites.' },
  { id: '03', title: 'Cybersecurity', text: 'Hardening, access control and routines that raise your resilience.' },
  { id: '04', title: 'Computer operations', text: 'Clients, updates and support that keep everyday work running.' },
  { id: '05', title: 'IT advisory', text: 'A sounding board for choices, priorities and technical direction.' },
  { id: '06', title: 'Technical project management', text: 'Structure and pace from idea to deployed solution.' },
];

export function ContactServiceGuide() {
  return (
    <section id="service-guide" aria-label="Areas we work in" className="relative py-20 lg:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.32em] text-brand-green sm:text-sm">
              What's it about?
            </p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.04] tracking-tight text-brand-white sm:text-5xl">
              Find your area
            </h2>
          </div>
          <p className="text-base leading-relaxed text-brand-mist/65 sm:text-lg sm:leading-8">
            We work broadly across the core of the IT environment. Recognize yourself in an area below —
            it's a good starting point for the conversation, and we'll help you sort out the rest.
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
