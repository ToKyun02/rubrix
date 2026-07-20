import { cn } from '@/utils/cn';
import type { LinkComponentProps } from '@tanstack/react-router';
import { Link as TanstackRouterLink } from '@tanstack/react-router';
import { cva, type VariantProps } from 'class-variance-authority';

export const linkVariants = cva(
  'flex items-center justify-center rounded-[6px] font-semibold',
  {
    variants: {
      variant: {
        primary: 'bg-green-btn text-white font-bold',
        outline:
          'bg-transparent text-muted border border-border hover:bg-hover hover:text-heading',
      },
      size: {
        md: 'p-1 text-sm',
        lg: 'p-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  },
);

interface LinkProps
  extends LinkComponentProps, VariantProps<typeof linkVariants> {}

export default function Link({
  variant,
  size,
  className,
  ...props
}: LinkProps) {
  return (
    <TanstackRouterLink
      className={cn(linkVariants({ variant, size, className }))}
      {...props}
    ></TanstackRouterLink>
  );
}
