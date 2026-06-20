import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/cn';

// Teckenuppsättningar – slumptecknet matchar måltecknets klass (versal/gemen/
// siffra) så att decoden ser ut som i referensen (gustaffurusten.se/about):
// bokstäver churnar som bokstäver, siffror som siffror, mellanslag/"/"/"-"/"."
// står still.
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ';
const LOWER = 'abcdefghijklmnopqrstuvwxyzåäö';
const DIGITS = '0123456789';

function randomFor(ch) {
  if (UPPER.includes(ch)) return UPPER[Math.floor(Math.random() * UPPER.length)];
  if (LOWER.includes(ch)) return LOWER[Math.floor(Math.random() * LOWER.length)];
  if (DIGITS.includes(ch)) return DIGITS[Math.floor(Math.random() * DIGITS.length)];
  return ch;
}

function scrambleAll(text) {
  let out = '';
  for (let i = 0; i < text.length; i += 1) out += randomFor(text[i]);
  return out;
}

/**
 * Text som "decodas" fram från vänster till höger – identiskt med referensens
 * scramble-reveal. Triggas en gång när elementet kommer in i vyn (eller direkt
 * vid mount för hero), respekterar prefers-reduced-motion. Vid reserveWidth
 * reserveras slutbredden så att intilliggande layout (t.ex. justify-between i
 * hero) inte hoppar medan tecknen churnar.
 */
export function ScrambleText({
  text,
  as: Tag = 'span',
  className = '',
  durationMs = 1000,
  tickMs = 42,
  startDelay = 0,
  trigger = 'view',
  reserveWidth = false,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const startedRef = useRef(false);
  const rafRef = useRef(0);
  const [display, setDisplay] = useState(() =>
    prefersReducedMotion ? text : scrambleAll(text),
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(text);
      return undefined;
    }

    const shouldStart = trigger === 'mount' || inView;
    if (!shouldStart || startedRef.current) {
      return undefined;
    }
    startedRef.current = true;

    const begin = performance.now() + startDelay;
    let startTime;
    let lastTick = 0;

    const frame = (now) => {
      if (now < begin) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }
      if (startTime === undefined) startTime = now;

      const progress = Math.min((now - startTime) / durationMs, 1);
      const locked = Math.floor(progress * text.length);

      if (now - lastTick >= tickMs || progress === 1) {
        lastTick = now;
        let next = '';
        for (let i = 0; i < text.length; i += 1) {
          next += i < locked ? text[i] : randomFor(text[i]);
        }
        setDisplay(next);
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setDisplay(text);
      }
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, prefersReducedMotion, text, trigger, durationMs, tickMs, startDelay]);

  if (reserveWidth) {
    return (
      <Tag ref={ref} aria-label={text} className={cn('relative inline-block', className)} {...props}>
        {/* osynlig slutlabel reserverar bredden */}
        <span aria-hidden="true" className="invisible">
          {text}
        </span>
        <span aria-hidden="true" className="absolute inset-0 whitespace-nowrap">
          {display}
        </span>
      </Tag>
    );
  }

  return (
    <Tag ref={ref} aria-label={text} className={className} {...props}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
