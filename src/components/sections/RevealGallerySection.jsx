import { useEffect, useRef } from 'react';
import './RevealGallerySection.css';

const cards = [
  { statistic: '$4.99M', detail: 'average cost of a data breach.', shape: 'image-1' },
  { statistic: '$1.0M', detail: 'average ransomware payment.', shape: 'image-2' },
  { statistic: '88%', detail: 'of SMB breaches involved ransomware.', shape: 'image-3' },
  { statistic: '54%', detail: 'click rate for AI-automated phishing.', shape: 'image-4' },
  { shape: 'image-5' },
  { shape: 'image-6' },
];

export function RevealGallerySection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cardsToObserve = sectionRef.current?.querySelectorAll('.reveal-gallery__card');
    if (!cardsToObserve?.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.dataset.inview = 'true';
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.16 },
    );

    cardsToObserve.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="risklandskapet"
      aria-labelledby="reveal-gallery-heading"
      className="reveal-gallery reveal-gallery--after-hero"
      data-overlay-active="false"
    >
      <h2 id="reveal-gallery-heading" className="sr-only">Cybersecurity risk statistics</h2>
      <div className="reveal-gallery__grid">
        <div className="reveal-gallery__prompt">
          <span>Scroll to reveal</span>
        </div>

        {cards.map((card, index) => (
          <figure key={card.shape} className={`reveal-gallery__card ${card.shape}`} data-inview="false">
            <div className="reveal-gallery__placeholder" aria-label={`Image placeholder ${index + 1}`}>
              <span>Image placeholder</span>
            </div>
            {card.statistic && (
              <figcaption>
                <strong>{card.statistic}</strong> {card.detail}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
