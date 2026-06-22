import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/cn';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Det svävande video-objektet – sidans visuella mittpunkt och motsvarigheten till
 * referensens 3D-skärm. Det bryter layouten, överlappar CONTACT-typografin och
 * känns som ett fysiskt objekt i scenen.
 *
 * Rörelsen är lagrad så transformerna inte krockar:
 *  1. Reveal (mount): fade + scale + lyft, ease-out-expo (som referensens intro).
 *  2. Scroll-parallax: mjuk vertikal förflyttning + lätt scale medan man scrollar.
 *  3. Mus-parallax: subtil 3D-tilt som följer pekaren (desktop) → "objekt i rummet".
 *  4. Bas-tilt: statisk rotate(-6deg)/rotateY(-10deg) som referensens vinkel.
 *  5. Idle-float: kontinuerlig mjuk svävning (CSS, se contact.css).
 *
 * Videon är keyad till äkta alpha (transparent bakgrund) så bara enheten syns.
 */
export function ContactVideoObject({ className = '', reveal = false }) {
  const wrapRef = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.6 });
  const parallaxY = useTransform(smooth, [0, 1], [70, -70]);
  const parallaxScale = useTransform(smooth, [0, 0.5, 1], [0.96, 1, 0.96]);

  // Mus-parallax: kring bas-vinkeln rotateY≈-10, rotateX≈-3.
  const mx = useSpring(0, { stiffness: 90, damping: 18, mass: 0.5 });
  const my = useSpring(0, { stiffness: 90, damping: 18, mass: 0.5 });
  const rotateY = useTransform(mx, [-1, 1], [-17, -3]);
  const rotateX = useTransform(my, [-1, 1], [3, -9]);

  useEffect(() => {
    if (reduce) return undefined;
    const fine = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    if (!fine.matches) return undefined;
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my, reduce]);

  const scrollStyle = reduce ? undefined : { y: parallaxY, scale: parallaxScale };
  const tiltStyle = reduce ? undefined : { rotateX, rotateY };

  return (
    <div ref={wrapRef} className={cn('relative', className)} style={{ perspective: '1500px' }} aria-hidden="true">
      {/* Lager 1: reveal vid mount. */}
      <motion.div
        initial={reveal && !reduce ? { opacity: 0, y: 56, scale: 0.9 } : false}
        animate={reveal && !reduce ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
      >
        {/* Lager 2: scroll-parallax. */}
        <motion.div style={scrollStyle} className="will-change-transform">
          {/* Lager 3: mus-parallax (3D-tilt). */}
          <motion.div style={tiltStyle} className="will-change-transform">
            {/* Lager 4: statisk bas-tilt. Lager 5: idle-float (CSS). */}
            <div className="contact-tilt">
              <div className={cn('relative', !reduce && 'contact-float')}>
                <div className="contact-video-glow pointer-events-none absolute inset-[-14%] -z-10" />
                <PremiumVideo />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* Videon laddas/spelas först när den är nära viewporten. */
function PremiumVideo() {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: '300px 0px',
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (active) {
      const p = node.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
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
