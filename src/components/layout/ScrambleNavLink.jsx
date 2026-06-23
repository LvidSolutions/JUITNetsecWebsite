import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/cn';

// Tecken som flimrar förbi innan länknamnet "decodas" fram. Exakt samma
// uppsättning som HackFirst använder: gemener a–z plus en rad symboler
// (inga siffror).
const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*-_+=;:<>,';
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
  const [hovered, setHovered] = useState(false);

  // Det vita blocket visas så länge pekaren är kvar (HackFirst håller --anim=1
  // under hela hover) eller medan mount-decoden spelar upp.
  const blockVisible = hovered || scrambling;

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
      onMouseEnter={() => {
        setHovered(true);
        runScramble();
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        setHovered(true);
        runScramble();
      }}
      onBlur={() => setHovered(false)}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group relative inline-flex items-center px-1 font-display text-sm font-light uppercase tracking-[0.18em] transition-colors duration-200 ease-smooth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green',
        isActive ? 'text-brand-green' : 'text-brand-white/85',
        className,
      )}
      {...props}
    >
      {/* Osynlig reservbredd = slutlabel, så layouten aldrig hoppar. */}
      <span aria-hidden="true" className="invisible">
        {label}
      </span>
      {/* Vilolägets text – ärver länkens färg (grön på aktiv sida, annars vit).
          Detta är vad som syns där det vita blocket INTE täcker, så när blocket
          sveper ut avtäcks rätt navigationsfärg direkt – inget färgbyte på slutet. */}
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center whitespace-nowrap">
        {display}
      </span>
      {/* Vitt block runt texten. Som på HackFirst sveper det in från vänster
          (scaleX 0→1) när pekaren kommer, ligger kvar under hela hovern och
          sveper ut igen när man lämnar. Sharpa hörn. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-y-0 -inset-x-0.5 origin-left rounded-[1px] bg-brand-white transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          blockVisible ? 'scale-x-100' : 'scale-x-0',
        )}
      />
      {/* Mörk text ovanpå blocket. clip-path följer blockets kant med exakt
          samma längd/easing som blockets scaleX, så den mörka texten avtäcks/
          döljs i takt med blocket – aldrig svart text kvar utanför blocket och
          inget hopp i färg när svepet är klart. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center whitespace-nowrap font-normal text-brand-black"
        style={{
          clipPath: blockVisible ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
          transition: 'clip-path 600ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {display}
      </span>
    </a>
  );
}
