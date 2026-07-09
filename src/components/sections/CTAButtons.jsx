import { Button } from '../ui';

export function CTAButtons() {
  return (
    <div className="mt-10 flex justify-center">
      <Button
        href="/kontakt"
        className="min-h-[3.25rem] w-full max-w-[25rem] whitespace-nowrap rounded-[0.45rem] border border-brand-green/60 px-6 font-display text-[0.68rem] uppercase tracking-[0.16em] text-brand-black shadow-[0_0_0_1px_rgba(96,255,132,0.24),0_0_24px_rgba(0,200,83,0.55),0_14px_42px_rgba(0,200,83,0.25)] [background:linear-gradient(180deg,#70EF7F_0%,#3FDB58_55%,#28C946_100%)] [font-weight:700] hover:text-brand-black hover:shadow-[0_0_0_1px_rgba(118,255,151,0.34),0_0_34px_rgba(0,200,83,0.68),0_18px_48px_rgba(0,200,83,0.3)] sm:w-auto sm:min-w-[25rem] sm:px-8 sm:text-[0.78rem] sm:tracking-[0.22em]"
      >
        Start a technical discussion
      </Button>
    </div>
  );
}
