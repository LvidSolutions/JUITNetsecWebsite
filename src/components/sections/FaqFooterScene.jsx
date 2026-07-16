import { useRef } from 'react';
import { Footer } from '../layout/Footer.jsx';
import { FaqSection } from './FaqSection.jsx';
import './FaqFooterScene.css';

// FAQ and the home-page footer deliberately share this one scene.  The video
// remains a sticky, viewport-sized layer for the scene's entire lifetime; only
// the four edge panels change during the footer reveal.
export function FaqFooterScene() {
  const sceneRef = useRef(null);

  return (
    <section ref={sceneRef} className="faq-footer-scene">
      <div aria-hidden="true" className="faq-footer-scene__background">
        <video
          className="faq-footer-scene__video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
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
