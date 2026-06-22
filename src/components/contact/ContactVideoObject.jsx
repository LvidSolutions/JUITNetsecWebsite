import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/cn';

/**
 * Det svävande video-objektet – sidans visuella mittpunkt. Ersätter referensens
 * 3D-datorskärm med den medskickade videon och får den att kännas som ett
 * exklusivt, tredimensionellt objekt i scenen snarare än en vanlig videobanner.
 *
 * Rörelse i två lager som komponeras utan att kollidera:
 *  - Yttre lager (framer-motion): scroll-driven parallax + subtil rotation/scale.
 *  - Inre lager (.contact-float, CSS): kontinuerlig, mjuk svävning.
 *
 * Videon spelas autoplay/muted/loop/playsInline. Källan har ren svart bakgrund
 * som smälter mot sidan via mix-blend-mode (se contact.css).
 */
export function ContactVideoObject({ className = '' }) {
  const wrapRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Scrollförlopp för objektet medan det passerar genom viewporten.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end start'],
  });

  // Mjuka av scroll-värdet så parallaxen aldrig känns hackig.
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.6 });

  // Mycket subtila transformer – premium, inte iögonfallande.
  const y = useTransform(smooth, [0, 1], [60, -60]);
  const rotateY = useTransform(smooth, [0, 1], [10, -10]);
  const rotateX = useTransform(smooth, [0, 1], [-6, 6]);
  const scale = useTransform(smooth, [0, 0.5, 1], [0.94, 1, 0.94]);

  const motionStyle = reduceMotion ? undefined : { y, rotateX, rotateY, scale };

  return (
    <div
      ref={wrapRef}
      className={cn('relative', className)}
      style={{ perspective: '1400px' }}
      aria-hidden="true"
    >
      <motion.div style={motionStyle} className="relative will-change-transform">
        <div className={cn('relative', !reduceMotion && 'contact-float')}>
          {/* Premium-glöd bakom objektet. */}
          <div className="contact-video-glow pointer-events-none absolute inset-[-12%] -z-10" />
          <PremiumVideo />
        </div>
      </motion.div>
    </div>
  );
}

/* Videon laddas först när den närmar sig viewporten och pausas när den lämnar
   den – ingen onödig avkodning när objektet inte syns. */
function PremiumVideo() {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '300px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (active) {
      const play = node.play();
      if (play && typeof play.catch === 'function') play.catch(() => {});
    } else {
      node.pause();
    }
  }, [active]);

  return (
    <video
      ref={videoRef}
      className="contact-video block h-auto w-full select-none"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/videos/contact-hero-poster.png"
    >
      {/* Alpha-VP9 (transparent) för Chrome/Firefox/Edge; mp4 som fallback. */}
      <source src="/videos/contact-hero.webm" type="video/webm" />
      <source src="/videos/contact-hero.mp4" type="video/mp4" />
    </video>
  );
}
