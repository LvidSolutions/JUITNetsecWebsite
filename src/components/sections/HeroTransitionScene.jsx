import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import './HeroTransitionScene.css';

const clamp = (value) => Math.min(Math.max(value, 0), 1);
const range = (value, start, end) => clamp((value - start) / (end - start));
const ease = (value) => value * value * (3 - 2 * value);
const LOGO_DOCK_PROGRESS = 0.45;
const PLAYBACK_DELAY_DISTANCE = 900; // Five standard 180 px mouse-wheel ticks after logo docking.
const PLAYBACK_START_TIMEOUT_MS = 15000;
const EXPANSION_DURATION_MS = 850;
const VIDEO_REVEAL_DELAY_MS = 650;
const VIDEO_PLAYBACK_RATE = 1.2;

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
  const expansionProgressRef = useRef(0);
  const expansionFrameRef = useRef(0);
  const riskRevealCompleteRef = useRef(false);
  const [phase, setPhase] = useState('IDLE');
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    update();
    return () => query.removeEventListener('change', update);
  }, []);

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
    // Hold the C until the next deliberate forward gesture starts the zoom.
    expansionStartScrollYRef.current = window.scrollY;
    setPhaseSafe('READY');
  }, [reducedMotion, setPhaseSafe]);

  const measure = useCallback(() => {
    const root = rootRef.current;
    const source = root?.querySelector('.contact-monitor-cta__transition-screen');
    const monitor = root?.querySelector('.contact-monitor-cta__expansion-root');
    const sticky = root?.querySelector('.hero-transition-scene__sticky');
    const target = document.querySelector('.risk-progress--after-hero .risk-progress__initial-c');
    const riskContent = root?.querySelector('.risk-progress--embedded .risk-progress__content');
    const riskHandoff = document.querySelector('.risk-progress--after-hero');
    if (!source || !monitor || !sticky || !target || !riskContent) return;
    // Measure the untransformed screen even during resize or font loading.
    const previousTransform = monitor.style.transform;
    monitor.style.transform = 'none';
    const sourceRect = source.getBoundingClientRect();
    const monitorRect = monitor.getBoundingClientRect();
    monitor.style.transform = previousTransform;
    const stickyRect = sticky.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetViewport = target.closest('.risk-progress__sticky').getBoundingClientRect();
    const targetStyle = getComputedStyle(target);
    const targetFontSize = Number.parseFloat(targetStyle.fontSize) || 16;
    const riskContentWidth = Math.max(riskContent.offsetWidth, 1);
    const riskContentHeight = Math.max(riskContent.offsetHeight, 1);
    const riskScreenScale = Math.min(
      (sourceRect.width * 0.86) / riskContentWidth,
      (sourceRect.height * 0.78) / riskContentHeight,
    );
    const riskScreenLeft = sourceRect.left - stickyRect.left
      + (sourceRect.width - riskContentWidth * riskScreenScale) / 2;
    const riskScreenTop = sourceRect.top - stickyRect.top
      + (sourceRect.height - riskContentHeight * riskScreenScale) / 2;
    const riskHandoffScrollY = riskHandoff
      ? riskHandoff.getBoundingClientRect().top + window.scrollY
      : null;
    geometryRef.current = {
      left: sourceRect.left - stickyRect.left, top: sourceRect.top - stickyRect.top,
      width: sourceRect.width, height: sourceRect.height,
      monitorLeft: monitorRect.left - stickyRect.left,
      monitorTop: monitorRect.top - stickyRect.top,
      screenLeftWithinMonitor: sourceRect.left - monitorRect.left,
      screenTopWithinMonitor: sourceRect.top - monitorRect.top,
      radius: Number.parseFloat(getComputedStyle(source).borderTopLeftRadius) || 0,
      targetX: targetRect.left - targetViewport.left + targetRect.width / 2,
      targetY: targetRect.top - targetViewport.top + targetRect.height / 2,
      targetWidth: targetRect.width, targetHeight: targetRect.height,
      destinationWidth: stickyRect.width, destinationHeight: stickyRect.height,
      fontFamily: targetStyle.fontFamily,
      fontSize: targetStyle.fontSize,
      fontWeight: targetStyle.fontWeight,
      fontTracking: targetStyle.letterSpacing,
      fontLineHeight: targetStyle.lineHeight,
      fontColor: targetStyle.color,
      sourceScale: Math.min(0.56, Math.max(sourceRect.width / stickyRect.width, 12 / targetFontSize)),
      riskScreenScale,
      riskStartTranslateX: riskScreenLeft - riskContent.offsetLeft,
      riskStartTranslateY: riskScreenTop - riskContent.offsetTop,
      riskHandoffScrollY,
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
    const riskCopyVisible = ready && riskRevealCompleteRef.current;
    const riskRaw = reducedMotion ? (ready ? 1 : 0)
      : phaseRef.current === 'HANDED_OFF'
        ? clamp((window.scrollY - expansionStart) / Math.max((g.riskHandoffScrollY ?? expansionStart + 1) - expansionStart, 1))
        : expansionProgressRef.current;
    const riskExpansion = ease(riskRaw);
    const riskContentScale = g.riskScreenScale + (1 - g.riskScreenScale) * riskExpansion;
    // The screen and its text share one curve ending at the actual handoff.
    const screenExpansion = riskExpansion;
    const sourceCRelX = (g.targetX / g.destinationWidth);
    const sourceCRelY = (g.targetY / g.destinationHeight);
    const cX = g.left + g.width * sourceCRelX;
    const cY = g.top + g.height * sourceCRelY;
    root.style.setProperty('--screen-source-left', `${g.left}px`);
    root.style.setProperty('--screen-source-top', `${g.top}px`);
    root.style.setProperty('--screen-source-width', `${g.width}px`);
    root.style.setProperty('--screen-source-height', `${g.height}px`);
    root.style.setProperty('--screen-translate-x', `${-g.left * screenExpansion}px`);
    root.style.setProperty('--screen-translate-y', `${-g.top * screenExpansion}px`);
    root.style.setProperty('--screen-scale-x', (1 + (g.destinationWidth / g.width - 1) * screenExpansion).toFixed(5));
    root.style.setProperty('--screen-scale-y', (1 + (g.destinationHeight / g.height - 1) * screenExpansion).toFixed(5));
    root.style.setProperty('--screen-radius', `${g.radius * (1 - screenExpansion)}px`);
    const monitorScaleX = 1 + (g.destinationWidth / g.width - 1) * screenExpansion;
    const monitorScaleY = 1 + (g.destinationHeight / g.height - 1) * screenExpansion;
    const monitorEndX = -g.monitorLeft - g.screenLeftWithinMonitor * (g.destinationWidth / g.width);
    const monitorEndY = -g.monitorTop - g.screenTopWithinMonitor * (g.destinationHeight / g.height);
    root.style.setProperty('--monitor-expansion-x', `${monitorEndX * screenExpansion}px`);
    root.style.setProperty('--monitor-expansion-y', `${monitorEndY * screenExpansion}px`);
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
    root.style.setProperty('--hero-copy-opacity', (1 - ease(range(screenExpansion, 0, 0.55))).toFixed(5));
    root.style.setProperty('--first-character-current-x', `${cX + (g.targetX - cX) * screenExpansion}px`);
    root.style.setProperty('--first-character-current-y', `${cY + (g.targetY - cY) * screenExpansion}px`);
    root.style.setProperty('--first-character-scale', (g.sourceScale + (1 - g.sourceScale) * screenExpansion).toFixed(5));
    root.style.setProperty('--first-character-opacity', ready && !riskCopyVisible && (riskRaw < 1 || phaseRef.current === 'EXPANDING') ? '1' : '0');
    root.style.setProperty('--risk-content-translate-x', `${g.riskStartTranslateX * (1 - riskExpansion)}px`);
    root.style.setProperty('--risk-content-translate-y', `${g.riskStartTranslateY * (1 - riskExpansion)}px`);
    root.style.setProperty('--risk-content-scale', riskContentScale.toFixed(5));
    root.style.setProperty('--risk-layer-opacity', riskCopyVisible ? '1' : '0');
    root.style.setProperty('--risk-progress', riskCopyVisible ? '1' : '0');
    root.dataset.cMode = phaseRef.current === 'READY' ? 'blinking' : 'static';
  }, [reducedMotion]);

  const startExpansion = useCallback(() => {
    if (phaseRef.current !== 'READY' || !fontReadyRef.current || reducedMotion) return;
    measure();
    expansionStartScrollYRef.current = window.scrollY;
    expansionProgressRef.current = 0;
    setPhaseSafe('EXPANDING');
    const started = performance.now();
    const tick = (now) => {
      if (phaseRef.current !== 'EXPANDING') return;
      expansionProgressRef.current = clamp((now - started) / EXPANSION_DURATION_MS);
      write();
      if (expansionProgressRef.current < 1) {
        expansionFrameRef.current = requestAnimationFrame(tick);
      } else {
        expansionFrameRef.current = 0;
        const target = document.querySelector('.risk-progress--after-hero');
        if (target) {
          // Move through the unused scroll distance under the finished black
          // viewport. The destination uses the same measured C geometry.
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
          target.dataset.overlayActive = 'true';
        }
        setPhaseSafe('HANDED_OFF');
        write();
      }
    };
    expansionFrameRef.current = requestAnimationFrame(tick);
  }, [measure, reducedMotion, setPhaseSafe, write]);

  const startPlayback = useCallback(() => {
    if (!introReady || !playbackRequestedRef.current || !['IDLE', 'PREPARING'].includes(phaseRef.current)) return;
    if (reducedMotion) {
      playbackRequestedRef.current = false;
      return;
    }
    if (phaseRef.current === 'IDLE') setPhaseSafe('PREPARING');
    if (!playbackFallbackRef.current) {
      playbackFallbackRef.current = window.setTimeout(finishPlayback, PLAYBACK_START_TIMEOUT_MS);
    }
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    setPhaseSafe('PREPARING');
    mediaStartedRef.current = false;
    video.currentTime = 0;
    video.playbackRate = VIDEO_PLAYBACK_RATE;
    if (playbackFallbackRef.current) window.clearTimeout(playbackFallbackRef.current);
    // This only protects against a video which never starts. Once onPlaying
    // fires, the full clip runs to its natural ended event.
    playbackFallbackRef.current = window.setTimeout(finishPlayback, PLAYBACK_START_TIMEOUT_MS);
    video.play().catch(() => finishPlayback());
  }, [finishPlayback, introReady, reducedMotion, setPhaseSafe]);

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
      measure();
      write(progress.get());
    }, VIDEO_REVEAL_DELAY_MS);
  }, [measure, progress, write]);

  useMotionValueEvent(progress, 'change', (latest) => {
    if (latest >= LOGO_DOCK_PROGRESS && logoDockScrollYRef.current === null) {
      logoDockScrollYRef.current = window.scrollY;
    }
    if (latest < 0.42) {
      playbackRequestedRef.current = false;
      logoDockScrollYRef.current = null;
      mediaStartedRef.current = false;
      expansionStartScrollYRef.current = null;
      expansionProgressRef.current = 0;
      cancelAnimationFrame(expansionFrameRef.current);
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
    if (!reducedMotion) return;
    cancelAnimationFrame(expansionFrameRef.current);
    clearTimeout(playbackFallbackRef.current);
    clearTimeout(mediaRevealRef.current);
    playbackFallbackRef.current = null;
    mediaRevealRef.current = null;
    videoRef.current?.pause();
    mediaStartedRef.current = false;
    playbackRequestedRef.current = false;
    expansionProgressRef.current = 0;
    setPhaseSafe('IDLE');
    write();
  }, [reducedMotion, setPhaseSafe, write]);

  useEffect(() => {
    const completeRiskReveal = () => {
      riskRevealCompleteRef.current = true;
      write(progress.get());
    };
    window.addEventListener('juit:risk-reveal-complete', completeRiskReveal);
    return () => window.removeEventListener('juit:risk-reveal-complete', completeRiskReveal);
  }, [progress, write]);

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

  // READY consumes one forward gesture. Only the timed phases hold input;
  // backward navigation stays available while waiting for that gesture.
  useEffect(() => {
    if (!['PLAYING', 'READY', 'EXPANDING'].includes(phase) || reducedMotion) return undefined;
    let touchY = null;
    const handleDirection = (event, forward) => {
      if (event.ctrlKey) return;
      if (phaseRef.current === 'READY') {
        if (!forward) return;
        event.preventDefault();
        startExpansion();
      } else if (['PLAYING', 'EXPANDING'].includes(phaseRef.current)) event.preventDefault();
    };
    const wheel = (event) => { if (event.deltaY) handleDirection(event, event.deltaY > 0); };
    const touchStart = (event) => { touchY = event.touches.length === 1 ? event.touches[0].clientY : null; };
    const touchMove = (event) => {
      if (touchY === null || event.touches.length !== 1) return;
      const delta = touchY - event.touches[0].clientY;
      if (Math.abs(delta) > 4) handleDirection(event, delta > 0);
    };
    const key = (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
      if ([' ', 'ArrowDown', 'PageDown', 'End', 'ArrowUp', 'PageUp', 'Home'].includes(event.key)) {
        handleDirection(event, ['ArrowDown', 'PageDown', 'End'].includes(event.key) || (event.key === ' ' && !event.shiftKey));
      }
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
    if (playbackFallbackRef.current) window.clearTimeout(playbackFallbackRef.current);
    if (mediaRevealRef.current) window.clearTimeout(mediaRevealRef.current);
  }, []);

  // Keep room for logo docking and video initiation; the zoom itself is timed.
  return <section id="hem" ref={setRoot} className="hero-transition-scene relative -mt-20 h-[600svh]" data-phase={phase}>
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
      <span className="hero-transition-scene__character" aria-hidden="true">C</span>
      {risk}
    </div>
  </section>;
}

