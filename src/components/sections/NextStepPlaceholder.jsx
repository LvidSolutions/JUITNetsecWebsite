import { Container } from '../ui';
import { DistortedText } from '../ui/DistortedText.jsx';

export function NextStepPlaceholder() {
  return (
    <section className="border-t border-brand-line bg-brand-black py-20 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-brand-white sm:text-3xl">
            <DistortedText selective>Next step: exposure, identity and networking</DistortedText>
          </h2>
          <p className="mt-4 text-base leading-7 text-brand-mist">
            Placeholder for upcoming scroll sections on attack surface, MFA, segmentation, firewalls,
            cloud and resilient operations.
          </p>
        </div>
      </Container>
    </section>
  );
}
