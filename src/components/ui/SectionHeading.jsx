import { cn } from '../../lib/cn';

const alignment = {
  center: 'mx-auto text-center',
  left: 'text-left',
};

export function SectionHeading({ eyebrow, title, text, align = 'center', className = '' }) {
  return (
    <div className={cn('max-w-3xl', alignment[align], className)}>
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">{eyebrow}</p> : null}
      <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
      {text ? <p className="mt-5 text-lg leading-8 text-current/75">{text}</p> : null}
    </div>
  );
}
