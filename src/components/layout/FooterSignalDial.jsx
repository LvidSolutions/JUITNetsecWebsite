const ticks = Array.from({ length: 60 }, (_, index) => index);

/**
 * Static, resolution-independent footer instrument. It replaces the former
 * raster radar while preserving Footer's layout and scroll treatment.
 */
export function FooterSignalDial({ className = '' }) {
  return (
    <div className={`footer-signal-dial ${className}`} aria-hidden="true">
      <svg viewBox="0 0 320 320" focusable="false" className="footer-signal-dial__svg">
        <defs>
          <linearGradient id="footerSignalArc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#00c853" />
          </linearGradient>
        </defs>
        <circle cx="160" cy="160" r="119" className="footer-signal-dial__outer" />
        <circle cx="160" cy="160" r="102" className="footer-signal-dial__inner" />
        <circle cx="160" cy="160" r="61" className="footer-signal-dial__core" />
        {ticks.map((tick) => {
          const major = tick % 5 === 0;
          const angle = tick * 6;
          return (
            <line
              key={tick}
              x1="160"
              y1={major ? 43 : 47}
              x2="160"
              y2={major ? 54 : 51}
              transform={`rotate(${angle} 160 160)`}
              className={major ? 'footer-signal-dial__tick footer-signal-dial__tick--major' : 'footer-signal-dial__tick'}
            />
          );
        })}
        <path d="M160 160 L213 87" className="footer-signal-dial__needle" />
        <path d="M160 160 L110 208" className="footer-signal-dial__needle footer-signal-dial__needle--tail" />
        <path d="M160 91 L169 160 L160 229 L151 160 Z" className="footer-signal-dial__needle-mark" />
        <path d="M69 219 A108 108 0 0 0 241 219" className="footer-signal-dial__arc" />
        <circle cx="160" cy="160" r="4.5" className="footer-signal-dial__pivot" />
        <text x="160" y="145" textAnchor="middle" className="footer-signal-dial__label">THREAT VECTOR</text>
        <text x="160" y="180" textAnchor="middle" className="footer-signal-dial__value">047° NE</text>
        <text x="160" y="204" textAnchor="middle" className="footer-signal-dial__sub">LIVE SIGNAL</text>
        <text x="160" y="31" textAnchor="middle" className="footer-signal-dial__cardinal">N</text>
        <text x="289" y="163" textAnchor="middle" className="footer-signal-dial__cardinal">E</text>
        <text x="160" y="300" textAnchor="middle" className="footer-signal-dial__cardinal">S</text>
        <text x="30" y="163" textAnchor="middle" className="footer-signal-dial__cardinal">W</text>
        <text x="68" y="46" className="footer-signal-dial__index">01</text>
        <text x="232" y="46" textAnchor="end" className="footer-signal-dial__index">/ 05</text>
      </svg>
    </div>
  );
}
