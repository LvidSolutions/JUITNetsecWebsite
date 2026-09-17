import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import './HeroTransitionScene.css';

const clamp = (value) => Math.min(Math.max(value, 0), 1);
const LOGO_DOCK_PROGRESS = 0.45;
const PLAYBACK_DELAY_DISTANCE = 900;
const PLAYBACK_START_TIMEOUT_MS = 15000;
const EXPANSION_DURATION_MS = 850;
const VIDEO_REVEAL_DELAY_MS = 650;
const VIDEO_PLAYBACK_RATE = 1.2;

export function HeroTransitionScene({ sceneRef, progress, introReady, renderHero }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const geometryRef = useRef(null);
  const phaseRef = useRef('IDLE');
  const playbackRequestedRef = useRef(false);
  const logoDockScrollYRef = useRef(null);
  const playbackFallbackRef = useRef(null);
  const mediaRevealRef = useRef(null);
  const mediaStartedRef = useRef(false);
  const expansionFrameRef = useRef(0);
  const [phase, setPhase] = useState('IDLE');
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const setPhaseSafe = useCallback((next) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const measure = useCallback(() => {
    const root = rootRef.current;
    const screen = root?.querySelector('.contact-monitor-cta__transition-screen');
    const monitor = root?.querySelector('.contact-monitor-cta__expansion-root');
    const sticky = root?.querySelector('.hero-transition-scene__sticky');
    if (!screen || !monitor || !sticky) return;

    const previousTransform = monitor.style.transform;
    monitor.style.transform = 'none';
    const screenRect = screen.getBoundingClientRect();
    const monitorRect = monitor.getBoundingClientRect();
    monitor.style.transform = previousTransform;
    const stickyRect = sticky.getBoundingClientRect();

    geometryRef.current = {
      screenLeft: screenRect.left - stickyRect.left,
      screenTop: screenRect.top - stickyRect.top,
      screenWidth: screenRect.width,
      screenHeight: screenRect.height,
      monitorLeft: monitorRect.left - stickyRect.left,
      monitorTop: monitorRect.top - stickyRect.top,
      screenLeftWithinMonitor: screenRect.left - monitorRect.left,
      screenTopWithinMonitor: screenRect.top - monitorRect.top,
      width: stickyRect.width,
      height: stickyRect.height,
    };
  }, []);

  const write = useCallback((expansion = 0) => {
    const root = rootRef.current;
    const geometry = geometryRef.current;
    if (!root || !geometry) return;

    const playing = phaseRef.current === 'PLAYING' && mediaStartedRef.current;
    const blackScreen = ['READY', 'EXPANDING', 'HANDED_OFF'].includes(phaseRef.current);
    const monitorScaleX = 1 + (geometry.width / geometry.screenWidth - 1) * expansion;
    const monitorScaleY = 1 + (geometry.height / geometry.screenHeight - 1) * expansion;
    const monitorEndX = -geometry.monitorLeft - geometry.screenLeftWithinMonitor * (geometry.width / geometry.screenWidth);
    const monitorEndY = -geometry.monitorTop - geometry.screenTopWithinMonitor * (geometry.height / geometry.screenHeight);

    root.style.setProperty('--monitor-video-opacity', playing ? '1' : '0');
    root.style.setProperty('--screen-takeover-opacity', blackScreen ? '1' : '0');
    root.style.setProperty('--monitor-expansion-x', `${monitorEndX * expansion}px`);
    root.style.setProperty('--monitor-expansion-y', `${monitorEndY * expansion}px`);
    root.style.setProperty('--monitor-expansion-scale-x', monitorScaleX.toFixed(5));
    root.style.setProperty('--monitor-expansion-scale-y', monitorScaleY.toFixed(5));
    root.style.setProperty('--hero-copy-opacity', (1 - expansion).toFixed(5));
  }, []);

  const finishPlayback = useCallback(() => {
    window.clearTimeout(playbackFallbackRef.current);
    window.clearTimeout(mediaRevealRef.current);
    playbackFallbackRef.current = null;
    mediaRevealRef.current = null;
    if (!['PREPARING', 'PLAYING'].includes(phaseRef.current)) return;
    if (!mediaStartedRef.current) {
      playbackRequestedRef.current = false;
      setPhaseSafe('IDLE');
      return;
    }
    mediaStartedRef.current = false;
    setPhaseSafe('READY');
    write();
  }, [setPhaseSafe, write]);

  const startExpansion = useCallback(() => {
    if (phaseRef.current !== 'READY') return;
    const target = document.querySelector('.reveal-gallery--after-hero');
    if (!target) return;

    if (reducedMotion) {
      target.dataset.overlayActive = 'true';
      target.scrollIntoView();
      setPhaseSafe('HANDED_OFF');
      return;
    }

    measure();
    setPhaseSafe('EXPANDING');
    const startedAt = performance.now();
    const tick = (now) => {
      if (phaseRef.current !== 'EXPANDING') return;
      const progressValue = clamp((now - startedAt) / EXPANSION_DURATION_MS);
      write(progressValue);
      if (progressValue < 1) {
        expansionFrameRef.current = requestAnimationFrame(tick);
        return;
      }
      target.dataset.overlayActive = 'true';
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
      setPhaseSafe('HANDED_OFF');
      write(1);
    };
    expansionFrameRef.current = requestAnimationFrame(tick);
  }, [measure, reducedMotion, setPhaseSafe, write]);

  const startPlayback = useCallback(() => {
    if (!introReady || !playbackRequestedRef.current || !['IDLE', 'PREPARING'].includes(phaseRef.current) || reducedMotion) return;
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    setPhaseSafe('PREPARING');
    mediaStartedRef.current = false;
    video.currentTime = 0;
    video.playbackRate = VIDEO_PLAYBACK_RATE;
    window.clearTimeout(playbackFallbackRef.current);
    playbackFallbackRef.current = window.setTimeout(finishPlayback, PLAYBACK_START_TIMEOUT_MS);
    video.play().catch(finishPlayback);
  }, [finishPlayback, introReady, reducedMotion, setPhaseSafe]);

  const confirmPlayback = useCallback(() => {
    if (!['PREPARING', 'PLAYING'].includes(phaseRef.current)) return;
    window.clearTimeout(playbackFallbackRef.current);
    playbackFallbackRef.current = null;
    setPhaseSafe('PLAYING');
    window.clearTimeout(mediaRevealRef.current);
    mediaRevealRef.current = window.setTimeout(() => {
      if (phaseRef.current !== 'PLAYING') return;
      mediaStartedRef.current = true;
      measure();
      write();
    }, VIDEO_REVEAL_DELAY_MS);
  }, [measure, setPhaseSafe, write]);

  useMotionValueEvent(progress, 'change', (latest) => {
    if (latest >= LOGO_DOCK_PROGRESS && logoDockScrollYRef.current === null) logoDockScrollYRef.current = window.scrollY;
    if (latest < 0.42) {
      playbackRequestedRef.current = false;
      logoDockScrollYRef.current = null;
      mediaStartedRef.current = false;
      cancelAnimationFrame(expansionFrameRef.current);
      if (phaseRef.current !== 'IDLE') {
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
        setPhaseSafe('IDLE');
      }
    }
    if (phaseRef.current === 'IDLE' && introReady && logoDockScrollYRef.current !== null && window.scrollY - logoDockScrollYRef.current >= PLAYBACK_DELAY_DISTANCE) {
      playbackRequestedRef.current = true;
      startPlayback();
    }
    write();
  });

  const setRoot = useCallback((node) => {
    rootRef.current = node;
    sceneRef(node);
    if (node) requestAnimationFrame(() => { measure(); write(); });
  }, [measure, sceneRef, write]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const update = () => { measure(); write(); };
    const observer = new ResizeObserver(update);
    observer.observe(root);
    window.addEventListener('resize', update);
    document.fonts?.ready.then(update);
    return () => { observer.disconnect(); window.removeEventListener('resize', update); };
  }, [measure, write]);

  useEffect(() => { write(); }, [phase, write]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const resume = () => {
      if (playbackRequestedRef.current && ['IDLE', 'PREPARING'].includes(phaseRef.current)) startPlayback();
    };
    video.addEventListener('canplay', resume);
    video.load();
    return () => video.removeEventListener('canplay', resume);
  }, [startPlayback]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!['PLAYING', 'READY', 'EXPANDING'].includes(phase) || reducedMotion) return undefined;
    let touchY = null;
    const handle = (event, forward) => {
      if (event.ctrlKey) return;
      if (phaseRef.current === 'READY' && forward) {
        event.preventDefault();
        startExpansion();
      } else if (['PLAYING', 'EXPANDING'].includes(phaseRef.current)) event.preventDefault();
    };
    const wheel = (event) => { if (event.deltaY) handle(event, event.deltaY > 0); };
    const touchStart = (event) => { touchY = event.touches.length === 1 ? event.touches[0].clientY : null; };
    const touchMove = (event) => {
      if (touchY === null || event.touches.length !== 1) return;
      const delta = touchY - event.touches[0].clientY;
      if (Math.abs(delta) > 4) handle(event, delta > 0);
    };
    const key = (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
      if ([' ', 'ArrowDown', 'PageDown', 'End'].includes(event.key)) handle(event, true);
    };
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('touchstart', touchStart, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: false });
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('keydown', key);
    };
  }, [phase, reducedMotion, startExpansion]);

  useEffect(() => () => {
    cancelAnimationFrame(expansionFrameRef.current);
    window.clearTimeout(playbackFallbackRef.current);
    window.clearTimeout(mediaRevealRef.current);
  }, []);

  return (
    <section id="hem" ref={setRoot} className="hero-transition-scene relative -mt-20 h-[600svh]" data-phase={phase}>
      <div className="hero-transition-scene__sticky">
        {renderHero({
          transitionState: phase,
          monitorMedia: (
            <video ref={videoRef} muted playsInline preload="auto" className="hero-transition-scene__media" onPlaying={confirmPlayback} onEnded={finishPlayback} onError={finishPlayback}>
              <source src="/videos/monitor-virus-shutdown-v2.webm" type="video/webm" />
              <source src="/videos/monitor-virus-shutdown-v2.mp4" type="video/mp4" />
            </video>
          ),
        })}
      </div>
    </section>
  );
}
