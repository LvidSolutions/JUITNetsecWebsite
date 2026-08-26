import { useEffect, useRef } from 'react';
import './StatsSection.css';

const story = [
  'yber', 'risk', 'is', 'a', 'business', 'problem.',
  { text: '59%', emphasis: 'stat' }, 'of', 'SMEs', 'reported', 'a', 'cyberattack', 'last', 'year,', 'while',
  { text: '88%', emphasis: 'stat' }, 'of', 'ransomware', 'breaches', 'affected', 'SMBs.',
  'Visibility', 'and', 'control', 'help', 'prevent', 'disruption.',
];

const sources = [
  'Hiscox Cyber Readiness Report 2025',
  'Verizon 2025 DBIR SMB Snapshot',
  'UK Government Cyber Security Breaches Survey 2025/26',
  'Verizon 2025 DBIR Executive Summary',
];

export function StatsSection({ embedded = false, afterHero = false }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (embedded) return undefined;
    const section = sectionRef.current;
    if (!section) return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    function updateProgress() {
      frame = 0;

      if (motionQuery.matches) {
        section.style.setProperty('--risk-progress', '1');
        return;
      }

      const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1);
      const travelled = -section.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, travelled / scrollRange));
      section.style.setProperty('--risk-progress', progress.toFixed(5));
      if (afterHero) section.dataset.overlayActive = travelled >= -1 ? 'true' : 'false';
    }

    function requestUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    }

    function handleMotionChange() {
      requestUpdate();
    }

    const resizeObserver = new ResizeObserver(requestUpdate);
    resizeObserver.observe(section);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    motionQuery.addEventListener('change', handleMotionChange);
    requestUpdate();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [afterHero, embedded]);

  return (
    <section
      ref={sectionRef}
      id={embedded ? undefined : 'risklandskapet'}
      aria-hidden={embedded || undefined}
      aria-labelledby={embedded ? undefined : 'risk-landscape-heading'}
      className={`risk-progress${embedded ? ' risk-progress--embedded' : ''}${afterHero ? ' risk-progress--after-hero' : ''}`}
      data-overlay-active={afterHero ? 'false' : undefined}
      style={embedded ? undefined : { '--risk-progress': 0 }}
    >
      <div className="risk-progress__sticky">
        <div className="risk-progress__content">
          <p className="risk-progress__eyebrow">01 / The risk landscape</p>
          <h2 id={embedded ? undefined : 'risk-landscape-heading'} className="sr-only">The risk landscape</h2>
          <p className="risk-progress__text">
            <span className="risk-progress__initial-c">C</span>
            {story.map((token, index) => {
              const { text, emphasis } = typeof token === 'string' ? { text: token } : token;
              const isLast = index === story.length - 1;

              return (
                <span
                  key={`${text}-${index}`}
                  className={`risk-progress__word${index === 0 ? ' risk-progress__word--after-c' : ''}${emphasis ? ` risk-progress__word--${emphasis}` : ''}`}
                  style={{ '--risk-word-index': index + 1, '--risk-word-total': story.length + 1 }}
                >
                  {text}{!isLast && '\u00A0'}
                </span>
              );
            })}
          </p>
        </div>
      </div>

      <p className="risk-progress__sources">
        <span>Sources:</span>{' '}
        {sources.join(' · ')}
      </p>
    </section>
  );
}
