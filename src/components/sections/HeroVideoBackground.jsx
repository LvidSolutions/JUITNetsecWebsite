import { useEffect, useRef, useState } from 'react';

// hur länge brus-snutten flashas över när huvudvideon loopar om
const GLITCH_MS = 360;

export function HeroVideoBackground() {
  const videoRef = useRef(null);
  const brusRef = useRef(null);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const video = videoRef.current;

    if (!video) {
      return undefined;
    }

    if (prefersReducedMotion) {
      video.pause();
      brusRef.current?.pause();
      return undefined;
    }

    let timeout;

    // Styr loopen själva (ingen loop-attribut) så vi kan lägga in en brus-glitch
    // varje gång videon når slutet och startar om – då ser omstarten ut som en glitch.
    function handleEnded() {
      setGlitching(true);

      const brus = brusRef.current;
      if (brus) {
        brus.currentTime = 0;
        brus.play()?.catch(() => {});
      }

      video.currentTime = 0;
      video.play()?.catch(() => {});

      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setGlitching(false), GLITCH_MS);
    }

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="metadata"
        className={`absolute inset-0 h-full w-full object-cover [filter:brightness(1.05)_contrast(1.08)] ${
          glitching ? 'hero-glitch-active' : ''
        }`}
        aria-hidden="true"
      >
        <source src="/assets/go-to.mp4" type="video/mp4" />
      </video>

      {/* Brus-snutt som flashas över i omstartsögonblicket för en glitch-känsla */}
      <video
        ref={brusRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen transition-opacity duration-100 ease-out ${
          glitching ? 'opacity-80' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <source src="/assets/brus.mp4" type="video/mp4" />
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
