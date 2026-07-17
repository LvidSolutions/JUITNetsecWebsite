import { useEffect, useRef } from 'react';
import './AboutRevealGallery.css';

// Keep image content separate from the composition so completed project imagery
// can be introduced without changing the gallery layout or interaction.
const aboutGalleryItems = [
  { id: '01', column: '2 / 7', row: '2', aspectRatio: '1.684', align: 'start' },
  { id: '02', column: '10 / 13', row: '2', aspectRatio: '0.633', align: 'start' },
  { id: '03', column: '4 / 8', row: '3', aspectRatio: '1.133', align: 'stretch' },
  { id: '04', column: '10 / 14', row: '4', aspectRatio: '1.133', align: 'stretch' },
  { id: '05', column: '2 / 5', row: '6', aspectRatio: '0.633', align: 'start' },
  { id: '06', column: '7 / 11', row: '6', aspectRatio: '1.684', align: 'end' },
];

function AboutGalleryMedia({ item }) {
  // A supplied source is only exposed when it also has useful alternative
  // text; incomplete future content remains an intentional empty frame.
  if (!item.src || !item.alt?.trim()) return null;

  return <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />;
}

export function AboutRevealGallery() {
  const gridRef = useRef(null);

  useEffect(() => {
    const items = gridRef.current?.querySelectorAll('[data-about-gallery-item]');
    if (!items?.length) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      items.forEach((item) => item.dataset.inView = 'true');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.dataset.inView = entry.isIntersecting ? 'true' : 'false';
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-reveal-gallery" aria-label="Selected perspectives">
      <div ref={gridRef} className="about-reveal-gallery__grid">
        <div className="about-reveal-gallery__intro">
          <p className="about-reveal-gallery__label">
            <span aria-hidden="true" />
            Selected perspectives
          </p>
        </div>
        {aboutGalleryItems.map((item) => {
          const hasMedia = Boolean(item.src && item.alt?.trim());

          return (
            <figure
            key={item.id}
            className="about-reveal-gallery__item"
            data-about-gallery-item={item.id}
            data-in-view="false"
            aria-hidden={hasMedia ? undefined : 'true'}
            style={{
              '--about-gallery-column': item.column,
              '--about-gallery-row': item.row,
              '--about-gallery-aspect-ratio': item.aspectRatio,
              '--about-gallery-align': item.align,
            }}
            >
              <div className="about-reveal-gallery__media">
                <AboutGalleryMedia item={item} />
              </div>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
