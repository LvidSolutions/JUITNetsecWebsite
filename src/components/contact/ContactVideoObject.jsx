import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/cn';

const EASE = [0.16, 1, 0.3, 1];

export function ContactVideoObject({ className = '', reveal = false }) {
  const wrapRef = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.6 });
  const parallaxY = useTransform(smooth, [0, 1], [70, -70]);
  const parallaxScale = useTransform(smooth, [0, 0.5, 1], [0.96, 1, 0.96]);

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
      <motion.div
        initial={reveal && !reduce ? { opacity: 0, y: 56, scale: 0.9 } : false}
        animate={reveal && !reduce ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
      >
        <motion.div style={scrollStyle} className="will-change-transform">
          <motion.div style={tiltStyle} className="will-change-transform">
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
    >
      <source src="/assets/go-to.mp4" type="video/mp4" />
      <source src="/assets/brus.mp4" type="video/mp4" />
    </video>
  );
}
