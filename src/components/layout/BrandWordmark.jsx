import { cn } from '../../lib/cn';

/**
 * Typografisk JUIT netsec-logga (ChainGPT Labs-inspirerad).
 * Allt är em-baserat så att den skalar rent från stort hero-läge
 * till litet header-läge utan att proportionerna ändras.
 * "JUIT" dominant + grön accentkvadrat + tunnare spärrat "netsec".
 */
export function BrandWordmark({ className = '' }) {
  return (
    <span className={cn('inline-flex items-center font-display leading-none', className)}>
      <span className="font-bold tracking-[-0.02em] text-brand-white">JUIT</span>
      <span
        aria-hidden="true"
        className="mx-[0.32em] inline-block h-[0.3em] w-[0.3em] rounded-[1px] bg-brand-green shadow-[0_0_0.5em_rgba(0,200,83,0.65)]"
      />
      <span className="text-[0.6em] font-medium lowercase tracking-[0.24em] text-brand-mist">netsec</span>
    </span>
  );
}
