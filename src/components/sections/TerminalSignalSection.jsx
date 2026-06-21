import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Container } from '../ui';

// ogl (WebGL) ligger i sin egen chunk och laddas först när sektionen behövs,
// så att startsidans initiala JS-bundle hålls liten.
const FaultyTerminal = lazy(() => import('../FaultyTerminal/FaultyTerminal.jsx'));

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
  // Klient-detektering: pekare av "fine"-typ + tillräcklig bredd = desktop,
  // där musreaktionen aktiveras. På touch/mobil hålls effekten passiv och
  // lugnare. prefers-reduced-motion pausar animationen helt.
  const [env, setEnv] = useState({ ready: false, desktop: false, reducedMotion: false, webgl: true });
  const sectionRef = useRef(null);
  // Rendera/montera bara WebGL när sektionen är (nära) i viewporten. När man
  // är i hero, footern eller på en annan sida rivs GL-kontexten och rAF-loopen
  // stoppas helt – ingen GPU/CPU-kostnad när effekten inte syns.
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const desktopMq = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () =>
      setEnv({
        ready: true,
        desktop: desktopMq.matches,
        reducedMotion: reducedMq.matches,
        webgl: supportsWebGL(),
      });

    sync();
    desktopMq.addEventListener('change', sync);
    reducedMq.addEventListener('change', sync);
    return () => {
      desktopMq.removeEventListener('change', sync);
      reducedMq.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { ready, desktop, reducedMotion, webgl } = env;
  const mouseReact = ready && desktop && !reducedMotion;
  const showTerminal = ready && webgl && inView;

  return (
    <section
      ref={sectionRef}
      id="signal"
      aria-label="Reaktiv signalvisualisering"
      className="relative isolate flex min-h-[600px] items-center overflow-hidden bg-brand-black py-24 sm:py-28 lg:min-h-[85vh] lg:py-32"
    >
      {/* WebGL-bakgrund (eller fallback). Ligger absolut bakom innehållet. */}
      <div className="absolute inset-0 z-0">
        {/* Statisk fallback ligger alltid kvar och syns tills WebGL ritats,
            samt när effekten är avmonterad utanför viewporten. */}
        <TerminalFallback />
        {showTerminal && (
          <TerminalBoundary fallback={null}>
            <Suspense fallback={null}>
              <FaultyTerminal
                className="absolute inset-0 h-full w-full"
                scale={1.5}
                gridMul={[2, 1]}
                digitSize={1.2}
                timeScale={reducedMotion ? 0 : 0.3}
                pause={reducedMotion}
                scanlineIntensity={0.4}
                glitchAmount={1}
                flickerAmount={reducedMotion ? 0 : 0.6}
                noiseAmp={1}
                chromaticAberration={0}
                curvature={0.1}
                tint="#00C853"
                mouseReact={mouseReact}
                mouseStrength={0.35}
                dpr={desktop ? 1.5 : 1}
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

      {/* Innehåll ovanpå effekten. pointer-events-none gör att musrörelser når
          canvasen bakom (det finns inga klickbara element här att blockera). */}
      <Container className="pointer-events-none relative z-10">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.32em] text-brand-green sm:text-sm">
          Signal / Infrastruktur / Kontroll
        </p>
        <h2 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-white sm:text-5xl lg:text-6xl">
          Bakom varje stabil IT-miljö finns teknisk kontroll.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-mist/80 sm:text-lg sm:leading-8">
          JUIT NetSec hjälper organisationer att skapa ordning i komplexa miljöer — från nätverk och
          säker kommunikation till drift, dokumentation och långsiktig förvaltning.
        </p>
        <p className="mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-mist/50 sm:text-xs">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[1px] bg-brand-green" />
          Reaktiv visualisering: nätverk, signaler och driftlager.
        </p>
      </Container>
    </section>
  );
}
