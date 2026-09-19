const stats = [
  { label: 'AVG. COST OF A DATA BREACH:', value: '$4.99M' },
  { label: 'AVG. RANSOMWARE PAYMENT:', value: '$1.0M' },
  { label: 'SMB BREACHES WITH RANSOMWARE:', value: '88%' },
  { label: 'AI-AUTOMATED PHISHING CLICK RATE:', value: '54%' },
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

export function FooterStatsPanel({ navigation, email, className = '' }) {
  return (
    <section
      aria-label="Footer navigation and cyber threat statistics"
      className={`footer-stats-panel relative overflow-hidden rounded-[18px] px-6 py-6 sm:rounded-[22px] sm:px-8 sm:py-7 lg:rounded-[8px] lg:px-4 lg:py-3.5 ${className}`}
    >
      <div className="relative z-10">
        <div className="footer-stats-panel__topline">
          <p className="footer-stats-panel__green">
            Stockholm, Sweden
            <LocationCaret />
          </p>
          <p className="footer-stats-panel__green footer-stats-panel__region">
            Northern Europe
            <CloseMark />
          </p>
        </div>

        <div className="footer-stats-panel__content">
          <div className="footer-stats-panel__links">
            <nav aria-label="Footer navigation" className="footer-stats-panel__nav">
              {navigation.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
            <a className="footer-stats-panel__email" href={`mailto:${email}`}>
              {email}
            </a>
          </div>

          <div className="footer-stats-panel__stats">
            {stats.map((stat) => (
              <div key={stat.label} className="footer-stats-panel__stat">
                <p className="footer-stats-panel__stat-label">{stat.label}</p>
                <p className="footer-stats-panel__value">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-stats-panel__rule" />
        <p className="footer-stats-panel__green footer-stats-panel__warning">
          The question isn't if you'll be attacked. It's when.
        </p>
      </div>
    </section>
  );
}
