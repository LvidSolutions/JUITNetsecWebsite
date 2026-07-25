import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion } from 'framer-motion';
import './HeroTransitionScene.css';

const clamp = (value) => Math.min(Math.max(value, 0), 1);
const range = (value, start, end) => clamp((value - start) / (end - start));
const ease = (value) => value * value * (3 - 2 * value);
const LOGO_DOCK_PROGRESS = 0.45;
const PLAYBACK_DELAY_DISTANCE = 900; // Five standard 180 px mouse-wheel ticks after logo docking.
const PLAYBACK_START_TIMEOUT_MS = 15000;
// This is deliberately a physical distance, not a small slice of the hero's
// overall progress. It gives the monitor takeover roughly sixteen wheel ticks
// on a standard mouse and keeps every expansion frame in the same sticky viewport.
const EXPANSION_SCROLL_DISTANCE = 2800;
const HANDOFF_START = 0.94;
const VIDEO_REVEAL_DELAY_MS = 650;

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
  const expansionStartScrollYRef = useRef(null);
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
    // A failed decode must leave the real Contact Us screen in place. Entering
    // the black phase without a painted media frame was the source of the
    // full-viewport flash seen on first loads.
    if (!mediaStartedRef.current) {
      playbackRequestedRef.current = false;
      setPhaseSafe('IDLE');
      return;
    }
    mediaStartedRef.current = false;
    // The blinking C and the scroll-led expansion begin in the same frame.
    // There is deliberately no timed black holding state between them.
    expansionStartScrollYRef.current = window.scrollY;
    setPhaseSafe('READY');
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

  const write = useCallback(() => {
    const root = rootRef.current;
    const g = geometryRef.current;
    if (!root || !g) return;
    const isPlaying = phaseRef.current === 'PLAYING';
    const holdLastVideoFrame = phaseRef.current === 'BLACKOUT' && mediaStartedRef.current;
    const mediaIsVisible = (isPlaying || holdLastVideoFrame) && mediaStartedRef.current;
    const ready = phaseRef.current === 'READY' || phaseRef.current === 'EXPANDING' || phaseRef.current === 'HANDED_OFF';
    const blackout = phaseRef.current === 'BLACKOUT' || ready;
    const expansionStart = expansionStartScrollYRef.current ?? window.scrollY;
    const raw = reducedMotion
      ? (ready ? 1 : 0)
      : ready && fontReadyRef.current
        ? clamp((window.scrollY - expansionStart) / EXPANSION_SCROLL_DISTANCE)
        : 0;
    const expansion = ease(raw);
    const handoff = ease(range(raw, HANDOFF_START, 1));
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
    // Do not paint a black layer before the video has produced a visible frame.
    // The Contact Us panel remains beneath the transparent video until then.
    root.style.setProperty('--screen-takeover-opacity', blackout ? '1' : '0');
    root.style.setProperty('--monitor-video-opacity', mediaIsVisible ? '1' : '0');
    root.style.setProperty('--hero-copy-opacity', (1 - expansion).toFixed(5));
    root.style.setProperty('--first-character-current-x', `${cX + (g.targetX - cX) * expansion}px`);
    root.style.setProperty('--first-character-current-y', `${cY + (g.targetY - cY) * expansion}px`);
    root.style.setProperty('--first-character-scale', (g.sourceScale + (1 - g.sourceScale) * expansion).toFixed(5));
    root.style.setProperty('--first-character-opacity', blackout ? (1 - handoff).toFixed(5) : '0');
    root.style.setProperty('--risk-layer-opacity', handoff.toFixed(5));
    root.style.setProperty('--risk-progress', '0');
    root.dataset.cMode = blackout && raw < HANDOFF_START ? 'blinking' : 'static';
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
    }, VIDEO_REVEAL_DELAY_MS);
  }, [progress, write]);

  useMotionValueEvent(progress, 'change', (latest) => {
    if (latest >= LOGO_DOCK_PROGRESS && logoDockScrollYRef.current === null) {
      logoDockScrollYRef.current = window.scrollY;
    }
    if (latest < 0.42) {
      playbackRequestedRef.current = false;
      logoDockScrollYRef.current = null;
      mediaStartedRef.current = false;
      expansionStartScrollYRef.current = null;
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

  // While the clip is running, pin the document at its current real scroll
  // position. This avoids the previous scrollTo() snap (and its visible upward
  // movement) while ensuring the later expansion always has its full distance.
  useEffect(() => {
    if (!['PREPARING', 'PLAYING'].includes(phase)) return undefined;
    const preventScroll = (event) => event.preventDefault();
    const preventKeys = (event) => {
      if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) event.preventDefault();
    };
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeys);
    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeys);
    };
  }, [phase]);

  useEffect(() => () => {
    if (playbackFallbackRef.current) window.clearTimeout(playbackFallbackRef.current);
    if (mediaRevealRef.current) window.clearTimeout(mediaRevealRef.current);
  }, []);

  // The root includes room for the five-tick video delay plus the deliberately
  // long, continuous monitor takeover; the viewport itself remains sticky.
  return <section id="hem" ref={setRoot} className="hero-transition-scene relative -mt-20 h-[900svh]" data-phase={phase}>
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
