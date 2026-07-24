import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2Icon } from 'lucide-react';
import type { SVGProps } from 'react';

export const spinnerVariants = cva('', {
  variants: {
    variant: {
      primary: 'text-blue',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

interface SpinnerProps
  extends SVGProps<SVGSVGElement>, VariantProps<typeof spinnerVariants> {}

export function Spinner({ className, variant, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(
        'size-4 animate-spin',
        spinnerVariants({ variant, className }),
      )}
      {...props}
    />
  );
}
