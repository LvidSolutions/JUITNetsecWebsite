import { useEffect, useRef, useState } from 'react';
import { Footer } from '../layout/Footer.jsx';
import { FaqSection } from './FaqSection.jsx';
import './FaqFooterScene.css';

// FAQ and the home-page footer deliberately share this one scene.  The video
// remains a sticky, viewport-sized layer for the scene's entire lifetime; only
// the four edge panels change during the footer reveal.
export function FaqFooterScene() {
  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || typeof IntersectionObserver === 'undefined') {
      setMediaReady(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setMediaReady(true);
        observer.disconnect();
      },
      { rootMargin: '1400px 0px' },
    );
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mediaReady) return;
    const video = videoRef.current;
    video?.load();
    video?.play().catch(() => {});
  }, [mediaReady]);

  return (
    <section ref={sceneRef} className="faq-footer-scene">
      <div aria-hidden="true" className="faq-footer-scene__background">
        <video
          ref={videoRef}
          className="faq-footer-scene__video"
          autoPlay={mediaReady}
          loop
          muted
          playsInline
          preload={mediaReady ? 'metadata' : 'none'}
          poster="/videos/circuit-board-poster.jpg"
          tabIndex="-1"
        >
          <source src="/videos/circuit-board.mp4" type="video/mp4" />
        </video>
        <div className="faq-footer-scene__readability" />
        <div className="faq-footer-scene__edge faq-footer-scene__edge--top" />
        <div className="faq-footer-scene__edge faq-footer-scene__edge--right" />
        <div className="faq-footer-scene__edge faq-footer-scene__edge--bottom" />
        <div className="faq-footer-scene__edge faq-footer-scene__edge--left" />
      </div>

      <div className="faq-footer-scene__content">
        <FaqSection />
        <Footer homeEffects videoScene revealTargetRef={sceneRef} />
      </div>
    </section>
  );
}
