import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import './CinematicFooterScene.css';

/**
 * Shared media treatment for page endings. The services version keeps the
 * homepage's sticky footer relationship; the contact version is a contained
 * transition that resolves to black before the existing form starts.
 */
export function CinematicFooterScene({ variant, source, children }) {
  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [entered, setEntered] = useState(reduceMotion);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    const video = videoRef.current;
    if (!scene || reduceMotion) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntered(entry.isIntersecting);
        if (entry.isIntersecting) {
          video?.play().catch(() => {});
        } else {
          video?.pause();
        }
      },
      { rootMargin: '20% 0px' },
    );

    observer.observe(scene);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const className = [
    'cinematic-footer-scene',
    `cinematic-footer-scene--${variant}`,
    entered && 'is-entered',
    ready && 'is-ready',
    reduceMotion && 'is-reduced-motion',
  ].filter(Boolean).join(' ');

  return (
    <section ref={sceneRef} className={className}>
      <div aria-hidden="true" className="cinematic-footer-scene__background">
        {!reduceMotion && (
          <video
            ref={videoRef}
            className="cinematic-footer-scene__video"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            tabIndex="-1"
            onCanPlay={() => setReady(true)}
          >
            <source src={source} type="video/mp4" />
          </video>
        )}
        <div className="cinematic-footer-scene__grade" />
        <div className="cinematic-footer-scene__edge-fade" />
        <div className="cinematic-footer-scene__frame-edge cinematic-footer-scene__frame-edge--top" />
        <div className="cinematic-footer-scene__frame-edge cinematic-footer-scene__frame-edge--right" />
        <div className="cinematic-footer-scene__frame-edge cinematic-footer-scene__frame-edge--bottom" />
        <div className="cinematic-footer-scene__frame-edge cinematic-footer-scene__frame-edge--left" />
      </div>
      <div className="cinematic-footer-scene__content">
        {typeof children === 'function' ? children(sceneRef) : children}
      </div>
    </section>
  );
}
