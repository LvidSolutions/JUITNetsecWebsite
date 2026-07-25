import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion } from 'framer-motion';
import './HeroTransitionScene.css';

const clamp = (value) => Math.min(Math.max(value, 0), 1);
const range = (value, start, end) => clamp((value - start) / (end - start));
const ease = (value) => value * value * (3 - 2 * value);
const LOGO_DOCK_PROGRESS = 0.45;
const PLAYBACK_DELAY_DISTANCE = 900; // Five standard 180 px mouse-wheel ticks after logo docking.
const PLAYBACK_VISUAL_PROGRESS = 0.5;
const PLAYBACK_HOLD_END = 0.68;
const PLAYBACK_START_TIMEOUT_MS = 15000;
const BLACKOUT_SETTLE_MS = 1250;
const EXPANSION_START = 0.69;
const EXPANSION_END = 0.985;
const HANDOFF_END = 0.998;

export function HeroTransitionScene({ sceneRef, progress, introReady, renderHero, risk }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const geometryRef = useRef(null);
  const fontReadyRef = useRef(false);
  const phaseRef = useRef('IDLE');
  const playbackRequestedRef = useRef(false);
  const logoDockScrollYRef = useRef(null);
  const playbackFallbackRef = useRef(null);
  const mediaRevealRef = useRef(null);
  const mediaStartedRef = useRef(false);
  const [phase, setPhase] = useState('IDLE');
  const reducedMotion = useReducedMotion();

  const setPhaseSafe = useCallback((next) => { phaseRef.current = next; setPhase(next); }, []);

  const finishPlayback = useCallback(() => {
    if (playbackFallbackRef.current) {
      window.clearTimeout(playbackFallbackRef.current);
      playbackFallbackRef.current = null;
    }
    if (mediaRevealRef.current) {
      window.clearTimeout(mediaRevealRef.current);
      mediaRevealRef.current = null;
    }
    if (!['PREPARING', 'PLAYING'].includes(phaseRef.current)) return;
    setPhaseSafe('BLACKOUT');
    window.setTimeout(() => {
      mediaStartedRef.current = false;
      setPhaseSafe('READY');
    }, reducedMotion ? 0 : BLACKOUT_SETTLE_MS);
  }, [reducedMotion, setPhaseSafe]);

  const measure = useCallback(() => {
    const root = rootRef.current;
    const source = root?.querySelector('.contact-monitor-cta__transition-screen');
    const monitor = root?.querySelector('.contact-monitor-cta__expansion-root');
    const sticky = root?.querySelector('.hero-transition-scene__sticky');
    const target = root?.querySelector('.risk-progress__initial-c');
    if (!source || !monitor || !sticky || !target) return;
    const sourceRect = source.getBoundingClientRect();
    const monitorRect = monitor.getBoundingClientRect();
    const stickyRect = sticky.getBoundingClientRect();
    const targetRange = document.createRange();
    targetRange.selectNodeContents(target);
    const targetRect = targetRange.getBoundingClientRect();
    const targetStyle = getComputedStyle(target);
    const targetFontSize = Number.parseFloat(targetStyle.fontSize) || 16;
    geometryRef.current = {
      left: sourceRect.left - stickyRect.left, top: sourceRect.top - stickyRect.top,
      width: sourceRect.width, height: sourceRect.height,
      monitorLeft: monitorRect.left - stickyRect.left,
      monitorTop: monitorRect.top - stickyRect.top,
      screenLeftWithinMonitor: sourceRect.left - monitorRect.left,
      screenTopWithinMonitor: sourceRect.top - monitorRect.top,
      radius: Number.parseFloat(getComputedStyle(source).borderTopLeftRadius) || 0,
      targetX: targetRect.left - stickyRect.left + targetRect.width / 2,
      targetY: targetRect.top - stickyRect.top + targetRect.height / 2,
      targetWidth: targetRect.width, targetHeight: targetRect.height,
      destinationWidth: stickyRect.width, destinationHeight: stickyRect.height,
      fontFamily: targetStyle.fontFamily,
      fontSize: targetStyle.fontSize,
      fontWeight: targetStyle.fontWeight,
      fontTracking: targetStyle.letterSpacing,
      fontLineHeight: targetStyle.lineHeight,
      fontColor: targetStyle.color,
      sourceScale: Math.min(0.56, Math.max(sourceRect.width / stickyRect.width, 12 / targetFontSize)),
    };
  }, []);

  const write = useCallback((physical) => {
    const root = rootRef.current;
    const g = geometryRef.current;
    if (!root || !g) return;
    const isPlaying = phaseRef.current === 'PLAYING';
    const holdLastVideoFrame = phaseRef.current === 'BLACKOUT' && mediaStartedRef.current;
    const mediaIsVisible = (isPlaying || holdLastVideoFrame) && mediaStartedRef.current;
    const ready = phaseRef.current === 'READY' || phaseRef.current === 'EXPANDING' || phaseRef.current === 'HANDED_OFF';
    const blackout = ready;
    const visual = isPlaying ? PLAYBACK_VISUAL_PROGRESS : physical;
    const raw = reducedMotion ? (ready ? 1 : 0) : fontReadyRef.current ? range(visual, EXPANSION_START, EXPANSION_END) : 0;
    const expansion = ease(raw);
    const handoff = ease(range(visual, EXPANSION_END, HANDOFF_END));
    const sourceCRelX = (g.targetX / g.destinationWidth);
    const sourceCRelY = (g.targetY / g.destinationHeight);
    const cX = g.left + g.width * sourceCRelX;
    const cY = g.top + g.height * sourceCRelY;
    root.style.setProperty('--screen-source-left', `${g.left}px`);
    root.style.setProperty('--screen-source-top', `${g.top}px`);
    root.style.setProperty('--screen-source-width', `${g.width}px`);
    root.style.setProperty('--screen-source-height', `${g.height}px`);
    root.style.setProperty('--screen-translate-x', `${-g.left * expansion}px`);
    root.style.setProperty('--screen-translate-y', `${-g.top * expansion}px`);
    root.style.setProperty('--screen-scale-x', (1 + (g.destinationWidth / g.width - 1) * expansion).toFixed(5));
    root.style.setProperty('--screen-scale-y', (1 + (g.destinationHeight / g.height - 1) * expansion).toFixed(5));
    root.style.setProperty('--screen-radius', `${g.radius * (1 - expansion)}px`);
    const monitorScaleX = 1 + (g.destinationWidth / g.width - 1) * expansion;
    const monitorScaleY = 1 + (g.destinationHeight / g.height - 1) * expansion;
    const monitorEndX = -g.monitorLeft - g.screenLeftWithinMonitor * (g.destinationWidth / g.width);
    const monitorEndY = -g.monitorTop - g.screenTopWithinMonitor * (g.destinationHeight / g.height);
    root.style.setProperty('--monitor-expansion-x', `${monitorEndX * expansion}px`);
    root.style.setProperty('--monitor-expansion-y', `${monitorEndY * expansion}px`);
    root.style.setProperty('--monitor-expansion-scale-x', monitorScaleX.toFixed(5));
    root.style.setProperty('--monitor-expansion-scale-y', monitorScaleY.toFixed(5));
    root.style.setProperty('--transition-c-font', g.fontFamily);
    root.style.setProperty('--transition-c-size', g.fontSize);
    root.style.setProperty('--transition-c-weight', g.fontWeight);
    root.style.setProperty('--transition-c-tracking', g.fontTracking);
    root.style.setProperty('--transition-c-line-height', g.fontLineHeight);
    root.style.setProperty('--transition-c-color', g.fontColor);
    // The monitor keeps its Contact Us panel until the browser confirms that
    // the media is actually playing. This prevents a full-screen black flash
    // on slower connections or first-time decodes.
    root.style.setProperty('--screen-takeover-opacity', mediaIsVisible || blackout ? '1' : '0');
    root.style.setProperty('--monitor-video-opacity', mediaIsVisible ? '1' : '0');
    root.style.setProperty('--hero-copy-opacity', (1 - expansion).toFixed(5));
    root.style.setProperty('--first-character-current-x', `${cX + (g.targetX - cX) * expansion}px`);
    root.style.setProperty('--first-character-current-y', `${cY + (g.targetY - cY) * expansion}px`);
    root.style.setProperty('--first-character-scale', (g.sourceScale + (1 - g.sourceScale) * expansion).toFixed(5));
    root.style.setProperty('--first-character-opacity', blackout ? (1 - handoff).toFixed(5) : '0');
    root.style.setProperty('--risk-layer-opacity', handoff.toFixed(5));
    root.style.setProperty('--risk-progress', '0');
    root.dataset.cMode = blackout && visual < EXPANSION_END ? 'blinking' : 'static';
  }, [reducedMotion]);

  const startPlayback = useCallback(() => {
    if (!introReady || !playbackRequestedRef.current || !['IDLE', 'PREPARING'].includes(phaseRef.current)) return;
    if (phaseRef.current === 'IDLE') setPhaseSafe('PREPARING');
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    setPhaseSafe('PREPARING');
    mediaStartedRef.current = false;
    video.currentTime = 0;
    if (playbackFallbackRef.current) window.clearTimeout(playbackFallbackRef.current);
    // This only protects against a video which never starts. Once onPlaying
    // fires, the full clip runs to its natural ended event.
    playbackFallbackRef.current = window.setTimeout(finishPlayback, PLAYBACK_START_TIMEOUT_MS);
    video.play().catch(() => finishPlayback());
  }, [finishPlayback, introReady, setPhaseSafe]);

  const confirmPlayback = useCallback(() => {
    if (!['PREPARING', 'PLAYING'].includes(phaseRef.current)) return;
    if (playbackFallbackRef.current) {
      window.clearTimeout(playbackFallbackRef.current);
      playbackFallbackRef.current = null;
    }
    setPhaseSafe('PLAYING');
    // `playing` can precede the first painted video frame. Keep the Contact Us
    // panel in place for one short paint window so a black decoder frame cannot
    // flash across the transition.
    if (mediaRevealRef.current) window.clearTimeout(mediaRevealRef.current);
    mediaRevealRef.current = window.setTimeout(() => {
      mediaRevealRef.current = null;
      if (phaseRef.current !== 'PLAYING') return;
      mediaStartedRef.current = true;
      write(progress.get());
    }, 180);
  }, [progress, write]);

  useMotionValueEvent(progress, 'change', (latest) => {
    if (latest >= LOGO_DOCK_PROGRESS && logoDockScrollYRef.current === null) {
      logoDockScrollYRef.current = window.scrollY;
    }
    if (latest < 0.42) {
      playbackRequestedRef.current = false;
      logoDockScrollYRef.current = null;
      mediaStartedRef.current = false;
      if (mediaRevealRef.current) {
        window.clearTimeout(mediaRevealRef.current);
        mediaRevealRef.current = null;
      }
      if (playbackFallbackRef.current) {
        window.clearTimeout(playbackFallbackRef.current);
        playbackFallbackRef.current = null;
      }
      if (phaseRef.current !== 'IDLE') {
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
        setPhaseSafe('IDLE');
      }
    }
    if (
      phaseRef.current === 'IDLE'
      && introReady
      && logoDockScrollYRef.current !== null
      && window.scrollY - logoDockScrollYRef.current >= PLAYBACK_DELAY_DISTANCE
    ) {
      playbackRequestedRef.current = true;
      startPlayback();
    }
    if (['PREPARING', 'PLAYING'].includes(phaseRef.current) && latest > PLAYBACK_HOLD_END) {
      const root = rootRef.current;
      const start = window.scrollY + root.getBoundingClientRect().top;
      const distance = root.offsetHeight - window.innerHeight;
      window.scrollTo({ top: start + distance * PLAYBACK_HOLD_END, behavior: 'auto' });
    }
    write(latest);
  });

  const setRoot = useCallback((node) => {
    rootRef.current = node; sceneRef(node);
    if (node) requestAnimationFrame(() => { measure(); write(progress.get()); });
  }, [measure, progress, sceneRef, write]);

  useEffect(() => {
    const root = rootRef.current; if (!root) return undefined;
    const update = () => { measure(); write(progress.get()); };
    const observer = new ResizeObserver(update); observer.observe(root);
    const markFontsReady = () => {
      fontReadyRef.current = true;
      update();
    };
    window.addEventListener('resize', update);
    if (document.fonts?.ready) document.fonts.ready.then(markFontsReady);
    else markFontsReady();
    return () => { observer.disconnect(); window.removeEventListener('resize', update); };
  }, [measure, progress, write]);

  useEffect(() => {
    write(progress.get());
  }, [phase, progress, write]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const resume = () => {
      if (phaseRef.current === 'PLAYING') video.play().catch(() => finishPlayback());
      else if (playbackRequestedRef.current && ['IDLE', 'PREPARING'].includes(phaseRef.current)) startPlayback();
    };
    video.addEventListener('canplay', resume);
    video.load();
    return () => video.removeEventListener('canplay', resume);
  }, [finishPlayback, progress, startPlayback]);

  useEffect(() => () => {
    if (playbackFallbackRef.current) window.clearTimeout(playbackFallbackRef.current);
    if (mediaRevealRef.current) window.clearTimeout(mediaRevealRef.current);
  }, []);

  // Keep the new sequence scroll-led, without leaving the rest of the home page
  // nine viewports away. This gives the five-tick playback delay room to happen
  // while returning the normal sections to their original reachable flow.
  return <section id="hem" ref={setRoot} className="hero-transition-scene relative -mt-20 h-[500svh] sm:h-[420svh] lg:h-[340svh]" data-phase={phase}>
    <div className="hero-transition-scene__sticky">
      {renderHero({
        transitionState: phase,
        monitorMedia: (
          <video ref={videoRef} muted playsInline preload="auto" className="hero-transition-scene__media" onPlaying={confirmPlayback} onEnded={finishPlayback} onError={finishPlayback}>
            <source src="/videos/monitor-media-sequence.webm" type="video/webm" />
            <source src="/videos/monitor-media-sequence.mp4" type="video/mp4" />
          </video>
        ),
      })}
      <span className="hero-transition-scene__character" aria-hidden="true">C</span>
      {risk}
    </div>
  </section>;
}
