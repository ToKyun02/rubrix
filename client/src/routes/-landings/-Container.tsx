import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {}

export default function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto max-w-360 px-6 md:px-10', className)}
      {...props}
    />
  );
}
