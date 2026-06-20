import { useEffect, useRef, useState } from 'react';

// hur lång tid innan klippets slut crossfaden till nästa varv börjar
const CROSSFADE_S = 0.9;
const PLAYBACK_RATE = 1;

export function HeroVideoBackground() {
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const [activeIsA, setActiveIsA] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const videoA = videoARef.current;
    const videoB = videoBRef.current;

    if (!videoA || !videoB) {
      return undefined;
    }

    if (prefersReducedMotion) {
      videoA.pause();
      videoB.pause();
      return undefined;
    }

    videoA.playbackRate = PLAYBACK_RATE;
    videoB.playbackRate = PLAYBACK_RATE;

    let isCrossfading = false;
    let activeRef = videoA;
    let inactiveRef = videoB;

    // Ingen loop-attribut: vi triggar crossfaden själva strax innan klippet
    // tar slut, så omstarten döljs som en mjuk tonövergång i stället för ett hopp.
    function handleTimeUpdate() {
      const active = activeRef;
      const inactive = inactiveRef;

      if (
        !isCrossfading &&
        active.duration &&
        active.duration - active.currentTime <= CROSSFADE_S
      ) {
        isCrossfading = true;
        inactive.currentTime = 0;
        inactive.play()?.catch(() => {});
        setActiveIsA(inactive === videoA);

        window.setTimeout(() => {
          active.pause();
          activeRef = inactive;
          inactiveRef = active;
          isCrossfading = false;
        }, CROSSFADE_S * 1000);
      }
    }

    videoA.addEventListener('timeupdate', handleTimeUpdate);
    videoB.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoA.removeEventListener('timeupdate', handleTimeUpdate);
      videoB.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      <video
        ref={videoARef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover [filter:brightness(1.05)_contrast(1.08)] transition-opacity duration-[900ms] ease-linear ${
          activeIsA ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <source src="/assets/go-to.mp4" type="video/mp4" />
      </video>

      <video
        ref={videoBRef}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover [filter:brightness(1.05)_contrast(1.08)] transition-opacity duration-[900ms] ease-linear ${
          activeIsA ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      >
        <source src="/assets/go-to.mp4" type="video/mp4" />
      </video>

      {/* Lätt enhetlig dämpning så videon behåller liv men inte bländar */}
      <div className="absolute inset-0 bg-brand-black/20" />
      {/* Subtil grön identitetsglow upptill */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(0,200,83,0.22),transparent_50%)]" />
      {/* Lokal gradient endast bakom textområdet (nederst) för läsbarhet */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-brand-black via-brand-black/55 to-transparent" />
      {/* Mjuka kanter upptill för att rama in hero */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-black/55 to-transparent" />
      <div className="hero-grid absolute inset-0 opacity-15" />
    </div>
  );
}
