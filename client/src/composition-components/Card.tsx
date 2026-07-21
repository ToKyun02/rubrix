import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';

export const cardVariants = cva('bg-card border-border rounded-[10px] border', {
  variants: {
    variant: {
      default: '',
      interactive: 'hover:border-muted cursor-pointer transition-colors',
      active: 'border-blue-btn',
      dashed: 'border-dashed',
    },
  },
  defaultVariants: { variant: 'default' },
});

type DivProps = HTMLAttributes<HTMLDivElement>;

export function Card({
  className,
  variant,
  ...props
}: DivProps & VariantProps<typeof cardVariants>) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props} />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        'border-subtle flex items-center gap-2 border-b px-5 py-3.5',
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-heading text-[15px] font-bold', className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-muted text-[12.5px] leading-relaxed', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn('p-5', className)} {...props} />;
}

export function CardFooter({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        'border-subtle flex items-center gap-2.5 border-t px-5 py-3.5',
        className,
      )}
      {...props}
    />
  );
}
