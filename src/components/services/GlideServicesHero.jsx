import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const PANELS = [
  { id: 'outer-left', glide: 1 },
  { id: 'inner-left', glide: 0.5 },
  { id: 'centre', glide: 0 },
  { id: 'inner-right', glide: 0.5 },
  { id: 'outer-right', glide: 1 },
];

const VIDEO_SOURCE = '/assets/cosmos-services-columns.mp4';

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function useDesktopGlide() {
  const [enabled, setEnabled] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return enabled;
}

/**
 * Five crop windows use the same source and are kept in lockstep.  A single
 * moving media element cannot be clipped into independently gliding windows,
 * so each window gets a native decoder while this controller corrects drift.
 */
export function GlideServicesHero() {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const panelRefs = useRef([]);
  const reduceMotion = useReducedMotion();
  const desktopGlide = useDesktopGlide();

  useEffect(() => {
    const hero = heroRef.current;
    const grid = gridRef.current;
    const panels = panelRefs.current.filter(Boolean);
    if (!desktopGlide || !hero || !grid || !panels.length) return undefined;

    const videos = panels
      .map((panel) => panel.querySelector('video'))
      .filter(Boolean);
    let frameId = 0;
    let lastScrollY = window.scrollY;
    let velocity = 0;

    function alignVideoWindows() {
      const gridBounds = grid.getBoundingClientRect();

      panels.forEach((panel) => {
        const bounds = panel.getBoundingClientRect();
        panel.style.setProperty('--glide-media-width', `${gridBounds.width}px`);
        panel.style.setProperty('--glide-media-x', `${gridBounds.left - bounds.left}px`);
      });
    }

    function renderGlide() {
      frameId = 0;
      const displacement = reduceMotion ? 0 : velocity;

      panels.forEach((panel, index) => {
        const glide = PANELS[index].glide;
        const amount = -displacement * window.innerHeight * 0.1 * glide;
        panel.style.setProperty('--glide-y', `${amount.toFixed(2)}px`);
      });

      velocity *= 0.82;
      if (Math.abs(velocity) > 0.003) frameId = window.requestAnimationFrame(renderGlide);
    }

    function queueGlide() {
      if (!frameId) frameId = window.requestAnimationFrame(renderGlide);
    }

    function onScroll() {
      const nextScrollY = window.scrollY;
      const delta = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;
      velocity = clamp(velocity * 0.56 + delta / 52, -1, 1);
      queueGlide();
    }

    function playAll() {
      videos.forEach((video) => {
        video.play().catch(() => {});
      });
    }

    function correctVideoDrift() {
      const source = videos[0];
      if (!source || source.paused || source.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

      videos.slice(1).forEach((video) => {
        if (Math.abs(video.currentTime - source.currentTime) > 0.04) {
          video.currentTime = source.currentTime;
        }
      });
    }

    function syncLateVideo(event) {
      const video = event.currentTarget;
      const source = videos[0];
      if (!source || video === source || source.readyState < HTMLMediaElement.HAVE_METADATA) return;
      if (Math.abs(video.currentTime - source.currentTime) > 0.01) video.currentTime = source.currentTime;
      if (!source.paused) video.play().catch(() => {});
    }

    const resizeObserver = new ResizeObserver(alignVideoWindows);
    resizeObserver.observe(grid);
    alignVideoWindows();
    playAll();
    videos.forEach((video) => video.addEventListener('canplay', syncLateVideo));
    videos[0]?.addEventListener('timeupdate', correctVideoDrift);
    const driftTimer = window.setInterval(correctVideoDrift, 250);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearInterval(driftTimer);
      videos.forEach((video) => video.removeEventListener('canplay', syncLateVideo));
      videos[0]?.removeEventListener('timeupdate', correctVideoDrift);
      resizeObserver.disconnect();
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [desktopGlide, reduceMotion]);

  return (
    <section ref={heroRef} className="glide-services-hero" aria-labelledby="services-hero-title">
      <h1 id="services-hero-title" className="sr-only">Netsec services</h1>
      <div className="glide-services-hero__composition">
        <p className="glide-services-hero__label">Services</p>
        {desktopGlide ? (
          <div ref={gridRef} className="glide-services-hero__grid" aria-hidden="true">
            {PANELS.map((panel, index) => (
              <figure
                key={panel.id}
                ref={(element) => {
                  panelRefs.current[index] = element;
                }}
                className="glide-services-hero__panel"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  src={VIDEO_SOURCE}
                  tabIndex="-1"
                />
              </figure>
            ))}
          </div>
        ) : (
          <div className="glide-services-hero__mobile-media" aria-hidden="true">
            <video autoPlay loop muted playsInline preload="metadata" src={VIDEO_SOURCE} />
          </div>
        )}
      </div>
    </section>
  );
}
