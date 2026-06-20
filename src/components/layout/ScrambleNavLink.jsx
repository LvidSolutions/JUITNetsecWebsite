import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/cn';

// Tecken som flimrar förbi innan länknamnet "decodas" fram.
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%&_|?/';
// Hur länge hela decode-resan tar och hur ofta slumptecknen byts.
const REVEAL_MS = 620;
const TICK_MS = 45;

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

/**
 * Minimalistisk nav-länk med HackFirst-likt "white block scramble".
 * Viloläge: tunn vit text. Under reveal/hover visas ett litet vitt block
 * runt texten medan slumptecken snabbt decodas fram till rätt label,
 * varefter blocket försvinner och vanlig vit text återstår.
 */
export function ScrambleNavLink({
  label,
  href,
  delay = 0,
  isActive = false,
  className = '',
  onClick,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(label);
  const [scrambling, setScrambling] = useState(false);

  const rafRef = useRef(0);
  const timersRef = useRef([]);
  const runningRef = useRef(false);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    runningRef.current = false;
  }, []);

  const runScramble = useCallback(() => {
    if (prefersReducedMotion || runningRef.current) {
      return;
    }

    runningRef.current = true;
    setScrambling(true);

    const start = performance.now();
    let lastTick = 0;

    const frame = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / REVEAL_MS, 1);
      // Antal tecken som låsts till rätt bokstav (vänster till höger).
      const locked = Math.floor(progress * label.length);

      if (now - lastTick >= TICK_MS || progress === 1) {
        lastTick = now;
        let next = '';
        for (let i = 0; i < label.length; i += 1) {
          next += i < locked ? label[i] : randomChar();
        }
        setDisplay(next);
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setDisplay(label);
        setScrambling(false);
        runningRef.current = false;
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  }, [label, prefersReducedMotion]);

  // Kort reveal vid mount (med ev. stagger via delay).
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(label);
      return undefined;
    }

    const timer = setTimeout(runScramble, delay);
    timersRef.current.push(timer);

    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={runScramble}
      onFocus={runScramble}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group relative inline-flex items-center px-1 font-display text-sm font-light uppercase tracking-[0.18em] transition-colors duration-200 ease-smooth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green',
        scrambling ? 'text-brand-black' : isActive ? 'text-brand-green' : 'text-brand-white/85 hover:text-brand-white',
        className,
      )}
      {...props}
    >
      {/* Litet vitt block runt texten, syns bara under scramble. Sharpa hörn. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-y-0 -inset-x-0.5 rounded-[1px] bg-brand-white transition-opacity duration-100',
          scrambling ? 'opacity-100' : 'opacity-0',
        )}
      />
      {/* Osynlig reservbredd = slutlabel, så layouten aldrig hoppar. */}
      <span aria-hidden="true" className="invisible">
        {label}
      </span>
      {/* Synlig text (scramblad eller stabil) centrerad ovanpå reservbredden. */}
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center whitespace-nowrap">
        {display}
      </span>
    </a>
  );
}
