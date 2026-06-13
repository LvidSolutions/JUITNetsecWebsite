import { cn } from '../../lib/cn';

const tones = {
  dark: 'bg-brand-black text-brand-white',
  light: 'bg-brand-white text-brand-ink',
};

export function Section({ as: Component = 'section', tone = 'dark', className = '', children, ...props }) {
  return (
    <Component className={cn('py-20 sm:py-24 lg:py-28', tones[tone], className)} {...props}>
      {children}
    </Component>
  );
}
