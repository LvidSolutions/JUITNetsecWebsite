const stats = [
  {
    label: 'ORGANIZATIONS BREACHED:',
    value: '90%',
    body: ['of organizations experienced a cyber', 'attack in the last year'],
  },
  {
    label: 'DATA BREACH INCREASE YOY:',
    value: '72%',
    body: ['increase in data breaches', 'year over year'],
  },
  {
    label: 'ATTACKS BLOCKED DAILY:',
    value: '2.4 BILLION+',
    body: ['malicious attacks blocked', 'worldwide every single day'],
  },
  {
    label: 'RANSOMWARE PAID OUT IN 2024:',
    value: '$1.1 BILLION+',
    body: ['paid to ransomware actors', 'in 2024 alone'],
  },
  {
    label: 'AVG. COST OF BREACH:',
    value: '$4.88 MILLION',
    body: ['global average cost', 'of a data breach'],
  },
  {
    label: 'TIME TO BREACH:',
    value: '27 MINUTES',
    body: ['average time attackers', 'gain initial access'],
  },
];

function LocationCaret() {
  return (
    <span
      aria-hidden="true"
      className="ml-2 inline-block h-0 w-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-brand-green align-middle"
    />
  );
}

function CloseMark() {
  return (
    <span aria-hidden="true" className="relative inline-flex h-4 w-4">
      <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 rotate-45 bg-brand-green" />
      <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 -rotate-45 bg-brand-green" />
    </span>
  );
}

function StatBlock({ label, value, body }) {
  return (
    <div>
      <p className="font-mono text-[11px] font-semibold uppercase leading-none tracking-[0.26em] text-brand-mist/70 sm:text-[12px] lg:text-[8px]">
        {label}
      </p>
      <p className="footer-stats-panel__value mt-4 font-mono text-[26px] font-extrabold uppercase leading-none tracking-[0.02em] text-brand-white sm:text-[30px] lg:mt-1.5 lg:text-[16px]">
        {value}
      </p>
      <p className="mt-3 font-mono text-[12px] leading-relaxed tracking-[0.06em] text-brand-mist/78 sm:text-[14px] lg:mt-1.5 lg:text-[8px] lg:leading-[1.35]">
        {body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}

export function FooterStatsPanel({ className = '' }) {
  return (
    <section
      aria-label="Cyber threat landscape statistics"
      className={`footer-stats-panel relative overflow-hidden rounded-[18px] px-6 py-6 sm:rounded-[22px] sm:px-8 sm:py-7 lg:rounded-[8px] lg:px-4 lg:py-3.5 ${className}`}
    >
      <div className="relative z-10">
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <p className="footer-stats-panel__green font-mono text-[12px] font-semibold uppercase leading-none tracking-[0.24em] text-brand-green sm:text-[14px] lg:text-[9px]">
            Stockholm, SE
            <LocationCaret />
          </p>
          <p className="justify-self-end font-mono text-[13px] font-semibold uppercase leading-none tracking-[0.18em] text-brand-white sm:justify-self-center sm:text-[15px] lg:text-[10px]">
            3:01 PM
          </p>
          <p className="footer-stats-panel__green col-span-2 flex items-center justify-between gap-4 font-mono text-[12px] font-semibold uppercase leading-none tracking-[0.24em] text-brand-green sm:col-span-1 sm:justify-self-end sm:text-[14px] lg:text-[9px]">
            Northern Europe
            <CloseMark />
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 sm:mt-10 sm:grid-cols-2 sm:gap-y-10 lg:mt-5 lg:gap-x-16 lg:gap-y-4">
          {stats.map((stat) => (
            <StatBlock key={stat.label} {...stat} />
          ))}
        </div>

        <div className="footer-stats-panel__rule mt-8 h-px w-full sm:mt-9 lg:mt-5" />
        <p className="footer-stats-panel__green mt-4 font-mono text-[12px] font-bold uppercase leading-relaxed tracking-[0.22em] text-brand-green sm:text-[14px] lg:mt-2.5 lg:text-[9px]">
          The question isn't if you'll be attacked. It's when.
        </p>
      </div>
    </section>
  );
}
