import { Button } from '../ui';

export function CTAButtons() {
  return (
    <div className="mt-10 flex justify-center">
      <Button
        href="/kontakt"
        className="font-display text-xs uppercase tracking-[0.14em] shadow-[0_0_0_1px_rgba(0,200,83,0.4),0_0_24px_rgba(0,200,83,0.35)] hover:shadow-[0_0_0_1px_rgba(0,200,83,0.6),0_0_36px_rgba(0,200,83,0.55)] sm:text-sm"
      >
        Start a technical discussion
      </Button>
    </div>
  );
}
