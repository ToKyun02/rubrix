import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'react';

interface LogoTextProps extends HTMLAttributes<HTMLSpanElement> {}

export default function LogoText({ className, ...props }: LogoTextProps) {
  return (
    <span
      className={cn('text-heading text-lg font-extrabold', className)}
      {...props}
    >
      <span>rubrix</span>
      <span className="text-blue">_</span>
    </span>
  );
}
