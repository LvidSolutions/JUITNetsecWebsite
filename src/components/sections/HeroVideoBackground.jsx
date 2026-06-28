import { useEffect, useRef, useState } from 'react';

// Bakgrundsvideon är tung. För att hålla startsidan lätt och stabil:
//  - laddas den bara på desktop (pekare av fine-typ + bredd >= 768px),
//  - aldrig vid prefers-reduced-motion,
//  - ett enda <video> med native loop,
//  - preload="metadata" så hela filen inte hämtas innan den behövs,
//  - inga CSS-filter på videon (filter på fullskärmsvideo tvingar fram ett
//    dyrt kompositlager som ritas om varje frame).
//
// Ping-pong (fram → bak → fram) utan synligt hopp: källklippet (go-to.mp4) är
// 60 fps men har bara ~5 keyframes, så reverse via negativ playbackRate (stöds
// inte i Chromium) eller currentTime-scrubbing blir hackigt. Lösningen är en
// förrenderad "boomerang"-fil (go-to-loop.mp4 = klippet följt av sin exakta
// reverse) som spelas med native `loop`. Vändpunkterna och loop-skarven landar
// på identiska frames -> sömlös fram/bak-loop, äkta 60 fps åt båda håll, noll
// seek/scrubbing. Originalet go-to.mp4 är behållet som källa.
// På mobil/reduced-motion visas en statisk men premiumkänslig grön gradient.
export function HeroVideoBackground() {
  const videoRef = useRef(null);
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setUseVideo(mq.matches && !reduced.matches);

    sync();
    mq.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (useVideo && video) {
      video.play()?.catch(() => {});
    }
  }, [useVideo]);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden bg-brand-black">
      {useVideo && (
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
          <source src="/assets/go-to-loop.mp4" type="video/mp4" />
        </video>
      )}

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
