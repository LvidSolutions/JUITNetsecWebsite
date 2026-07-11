import { Component } from 'react';

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // Keep the browser log deliberately generic so unexpected component errors
    // cannot copy form values or other runtime data into shared logs.
    console.error('An unexpected interface error occurred.');
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-black px-6 text-brand-white">
        <div className="max-w-xl text-center" role="alert">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-brand-green">
            Interface recovery
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Something went wrong
          </h1>
          <p className="mt-5 text-base leading-7 text-brand-mist/75">
            The page could not be displayed correctly. Reload to restore the latest stable version.
          </p>
          <button
            type="button"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-7 text-sm font-semibold uppercase tracking-[0.16em] text-brand-black transition-colors hover:bg-brand-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      </main>
    );
  }
}
