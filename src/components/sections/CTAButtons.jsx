import { Button } from '../ui';

export function CTAButtons() {
  return (
    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
      <Button
        href="/kontakt"
        className="shadow-[0_0_0_1px_rgba(0,200,83,0.4),0_0_24px_rgba(0,200,83,0.35)] hover:shadow-[0_0_0_1px_rgba(0,200,83,0.6),0_0_36px_rgba(0,200,83,0.55)]"
      >
        Boka konsultation
      </Button>
      <Button href="#risklandskapet" variant="secondary" className="hover:shadow-[0_0_24px_rgba(0,200,83,0.25)]">
        Utforska riskerna
      </Button>
    </div>
  );
}
