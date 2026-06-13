import { cn } from '../../lib/cn';

const variants = {
  primary: 'bg-brand-green text-brand-black hover:bg-brand-white focus-visible:outline-brand-green',
  secondary:
    'border border-brand-line bg-transparent text-brand-white hover:border-brand-green hover:text-brand-green focus-visible:outline-brand-green',
  ghost: 'text-brand-white hover:text-brand-green focus-visible:outline-brand-green',
};

const sizes = {
  sm: 'min-h-10 px-4 text-sm',
  md: 'min-h-12 px-6 text-base',
};

export function Button({ as, href, variant = 'primary', size = 'md', className = '', children, ...props }) {
  const Component = as || (href ? 'a' : 'button');

  return (
    <Component
      href={href}
      className={cn(
        'inline-flex items-center justify-center rounded-card font-semibold transition-all duration-200 ease-smooth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
