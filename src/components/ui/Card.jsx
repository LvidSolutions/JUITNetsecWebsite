import { cn } from '../../lib/cn';

const variants = {
  dark: 'border border-brand-line bg-white/[0.03] text-brand-white shadow-glow',
  light: 'border border-black/10 bg-brand-white text-brand-ink shadow-sm',
};

export function Card({ as: Component = 'article', variant = 'dark', className = '', children, ...props }) {
  return (
    <Component className={cn('rounded-card p-6 transition-colors duration-200 sm:p-8', variants[variant], className)} {...props}>
      {children}
    </Component>
  );
}
