import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Container } from '../ui';
import './TerminalSignalSection.css';

// Keep OGL in a separate chunk, but fetch it well before the section becomes
// visible so shader compilation is not competing with the scroll transition.
const loadFaultyTerminal = () => import('../FaultyTerminal/FaultyTerminal.jsx');
const FaultyTerminal = lazy(loadFaultyTerminal);
const desktopGrid = [2, 1];
const compactGrid = [1.55, 0.82];

// Liten felgräns: om WebGL/ogl kastar vid runtime faller vi tillbaka till en
// statisk grön gradient + grid i stället för att krascha hela startsidan.
class TerminalBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Statisk fallback (svart/grön gradient + subtil grid) om WebGL saknas.
function TerminalFallback() {
  return (
    <div className="absolute inset-0">
      <div className="hero-grid absolute inset-0 opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,200,83,0.22),transparent_60%)]" />
    </div>
  );
}

function supportsWebGL() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export function TerminalSignalSection() {
  const [env, setEnv] = useState({
    ready: false,
    desktop: false,
    reducedMotion: false,
    webgl: true,
    quality: 'low',
  });
  const sectionRef = useRef(null);
  const ctaBoundsRef = useRef({ left: 0, top: 0, width: 1, height: 1 });
  const [nearby, setNearby] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const desktopMq = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      const desktop = desktopMq.matches;
      const pixelRatio = window.devicePixelRatio || 1;
      const quality = !desktop
        ? 'low'
        : window.innerWidth < 1180 || pixelRatio > 1.5
          ? 'medium'
          : 'high';

      setEnv((previous) => {
        const next = {
          ready: true,
          desktop,
          reducedMotion: reducedMq.matches,
          webgl: previous.ready ? previous.webgl : supportsWebGL(),
          quality,
        };
        return previous.ready &&
          previous.desktop === next.desktop &&
          previous.reducedMotion === next.reducedMotion &&
          previous.quality === next.quality
          ? previous
          : next;
      });
    };

    sync();
    desktopMq.addEventListener('change', sync);
    reducedMq.addEventListener('change', sync);
    window.addEventListener('resize', sync, { passive: true });
    return () => {
      desktopMq.removeEventListener('change', sync);
      reducedMq.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setNearby(true);
      setActive(true);
      return undefined;
    }

    // The module and context are prepared a viewport ahead of the section. The
    // scene remains mounted after first use, but its animation loop is stopped
    // whenever the visual is outside its small active margin.
    const preparationObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearby(true);
        loadFaultyTerminal().catch(() => {});
        preparationObserver.disconnect();
      },
      { rootMargin: '1000px 0px' },
    );
    const activityObserver = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '700px 0px' },
    );

    preparationObserver.observe(node);
    activityObserver.observe(node);
    return () => {
      preparationObserver.disconnect();
      activityObserver.disconnect();
    };
  }, []);

  const { ready, desktop, reducedMotion, webgl, quality } = env;
  const mouseReact = ready && desktop && !reducedMotion;
  const showTerminal = ready && webgl && nearby;
  const dpr = quality === 'high' ? 1.35 : quality === 'medium' ? 1.2 : 1;

  const updateCtaBounds = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    ctaBoundsRef.current = {
      left: bounds.left,
      top: bounds.top,
      width: Math.max(bounds.width, 1),
      height: Math.max(bounds.height, 1),
    };
  };

  const moveCtaSignal = (event) => {
    const bounds = ctaBoundsRef.current;
    const button = event.currentTarget;
    button.style.setProperty('--signal-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    button.style.setProperty('--signal-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  const resetCtaSignal = (event) => {
    event.currentTarget.style.setProperty('--signal-x', '50%');
    event.currentTarget.style.setProperty('--signal-y', '50%');
  };

  return (
    <section
      ref={sectionRef}
      id="signal"
      aria-labelledby="signal-title"
      className="relative isolate flex min-h-[600px] items-center overflow-hidden bg-brand-black py-24 sm:py-28 lg:min-h-[85vh] lg:py-32"
    >
      {/* WebGL-bakgrund (eller fallback). Ligger absolut bakom innehållet. */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        {/* Statisk fallback ligger alltid kvar och syns tills WebGL ritats,
            samt när effekten är avmonterad utanför viewporten. */}
        <TerminalFallback />
        {showTerminal && (
          <TerminalBoundary fallback={null}>
            <Suspense fallback={null}>
              <FaultyTerminal
                className="absolute inset-0 h-full w-full"
                scale={1.5}
                gridMul={quality === 'low' ? compactGrid : desktopGrid}
                digitSize={quality === 'low' ? 1.05 : 1.2}
                timeScale={reducedMotion ? 0 : quality === 'low' ? 0.2 : 0.3}
                pause={reducedMotion}
                active={active && !reducedMotion}
                scanlineIntensity={0.4}
                glitchAmount={1}
                flickerAmount={reducedMotion ? 0 : 0.6}
                noiseAmp={1}
                chromaticAberration={0}
                curvature={0.1}
                tint="#00C853"
                mouseReact={mouseReact}
                mouseStrength={0.35}
                dpr={dpr}
                pageLoadAnimation={!reducedMotion}
                brightness={desktop ? 1.05 : 0.9}
              />
            </Suspense>
          </TerminalBoundary>
        )}
      </div>

      {/* Läsbarhetslager: lättare vinjett så effekten syns tydligt men texten
          fortfarande är läsbar (vänsterscrim bakom rubriken). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,5,5,0.72)_0%,rgba(5,5,5,0.4)_45%,rgba(5,5,5,0)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(5,5,5,0.55)_0%,transparent_24%,transparent_78%,rgba(5,5,5,0.7)_100%)]"
      />

      {/* Content stays above the canvas; only intended interactive elements opt in. */}
      <Container className="pointer-events-none relative z-10">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.32em] text-brand-green sm:text-sm">
          Signal / Infrastructure / Control
        </p>
        <h2
          id="signal-title"
          className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-white sm:text-5xl lg:text-6xl"
        >
          Behind every stable IT environment is technical control.
        </h2>
        <a
          href="/tjanster"
          aria-label="Explore JUIT NetSec services"
          className="signal-cta group pointer-events-auto mt-10 inline-flex min-h-[68px] items-center gap-5 px-9 text-lg font-medium text-brand-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
          onPointerEnter={updateCtaBounds}
          onPointerMove={moveCtaSignal}
          onPointerLeave={resetCtaSignal}
        >
          <span aria-hidden="true" className="signal-cta__field" />
          <span className="signal-cta__label">Explore our services</span>
          <span aria-hidden="true" className="signal-cta__arrow">
            ↗
          </span>
        </a>
        <p className="mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-mist/50 sm:text-xs">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[1px] bg-brand-green" />
          Reactive visualization: networks, signals and operations layers.
        </p>
      </Container>
    </section>
  );
}
