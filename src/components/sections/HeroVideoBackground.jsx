import { useEffect, useRef } from 'react';

export function HeroVideoBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src="/assets/tree-branch.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-brand-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,200,83,0.28),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/40 via-brand-black/60 to-brand-black" />
      <div className="hero-grid absolute inset-0 opacity-30" />
    </div>
  );
}
