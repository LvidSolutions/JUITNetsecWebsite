import { useEffect, useRef } from 'react';
import './StatsSection.css';

const story = [
  'Cyber', 'risk', 'is', 'no', 'longer', 'a', 'future', 'problem.',
  { text: '59%', emphasis: 'stat' }, 'of', 'SME', 'respondents', 'reported', 'a', 'cyberattack', 'in', 'the', 'past', 'year.',
  { text: '88%', emphasis: 'stat' }, 'of', 'ransomware-related', 'breaches', 'affected', 'small', 'and', 'medium-sized', 'businesses', 'in', 'the', 'Verizon', 'DBIR', '2025', 'SMB', 'snapshot.',
  { text: '43%', emphasis: 'stat' }, 'of', 'organisations', 'reported', 'a', 'breach', 'or', 'attack', 'during', 'the', 'last', 'twelve', 'months.',
  'The', 'median', 'amount', 'paid', 'to', 'ransomware', 'groups', 'was', { text: '$115,000', emphasis: 'stat' },
  'For', 'many', 'organisations,', 'security', 'is', 'no', 'longer', 'about', 'a', 'single', 'product.', 'It', 'is', 'about', 'visibility,', 'control', 'and', 'the', 'ability', 'to', 'act', 'before', 'disruption', 'becomes', 'an', 'outage.',
];

const sources = [
  'Hiscox Cyber Readiness Report 2025',
  'Verizon 2025 DBIR SMB Snapshot',
  'UK Government Cyber Security Breaches Survey 2025/26',
  'Verizon 2025 DBIR Executive Summary',
];

export function StatsSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let maxProgress = 0;

    function updateProgress() {
      frame = 0;

      if (motionQuery.matches) {
        maxProgress = 1;
        section.style.setProperty('--risk-progress', '1');
        return;
      }

      const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1);
      const travelled = -section.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, travelled / scrollRange));

      maxProgress = Math.max(maxProgress, progress);
      section.style.setProperty('--risk-progress', maxProgress.toFixed(5));
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="risklandskapet"
      aria-labelledby="risk-landscape-heading"
      className="risk-progress"
      style={{ '--risk-progress': 0 }}
    >
      <div className="risk-progress__sticky">
        <div className="risk-progress__content">
          <p className="risk-progress__eyebrow">01 / The risk landscape</p>
          <h2 id="risk-landscape-heading" className="sr-only">The risk landscape</h2>
          <p className="risk-progress__text">
            {story.map((token, index) => {
              const { text, emphasis } = typeof token === 'string' ? { text: token } : token;
              const isLast = index === story.length - 1;

              return (
                <span
                  key={`${text}-${index}`}
                  className={`risk-progress__word${emphasis ? ` risk-progress__word--${emphasis}` : ''}`}
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
