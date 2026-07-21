import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ButtonHTMLAttributes } from 'react';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[6px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue cursor-pointer disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-green-btn text-white font-bold enabled:hover:opacity-90',
        secondary:
          'bg-blue-btn text-white font-bold border-0 enabled:hover:opacity-90',
        tertiary:
          'bg-subtle text-heading border border-border font-bold enabled:hover:bg-hover',
        ghost:
          'bg-transparent text-text border border-border font-semibold enabled:hover:bg-hover',
        icon: 'bg-transparent text-muted border border-border hover:bg-hover hover:text-heading disabled:text-muted-2',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-[42px] px-5 text-sm',
        lg: 'h-11 px-6 text-base',
        icon: 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
