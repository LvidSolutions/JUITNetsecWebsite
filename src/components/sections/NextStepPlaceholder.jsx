import { Container } from '../ui';

export function NextStepPlaceholder() {
  return (
    <section className="border-t border-brand-line bg-brand-black py-20 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-brand-white sm:text-3xl">
            Nästa steg: exponering, identitet och nätverk
          </h2>
          <p className="mt-4 text-base leading-7 text-brand-mist">
            Placeholder för kommande scrollsektioner om attackyta, MFA, segmentering, brandväggar, moln
            och robust drift.
          </p>
        </div>
      </Container>
    </section>
  );
}
