import { cva, type VariantProps } from 'class-variance-authority';
import { useEffect } from 'react';

export const toastVariants = cva(
  'fixed z-50 rounded-md border px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-200',
  {
    variants: {
      variant: {
        error: 'bg-red/10 border-red/35 text-red',
        success: 'bg-green/10 border-green/35 text-green',
      },
      position: {
        'top-right': 'top-5 right-5',
        'top-left': 'top-5 left-5',
        'bottom-right': 'bottom-5 right-5',
        'bottom-left': 'bottom-5 left-5',
      },
      isOpen: {
        true: 'translate-y-0 opacity-100',
        false: 'pointer-events-none opacity-0',
      },
    },
    compoundVariants: [
      {
        position: ['top-right', 'top-left'],
        isOpen: false,
        className: '-translate-y-2',
      },
      {
        position: ['bottom-right', 'bottom-left'],
        isOpen: false,
        className: 'translate-y-2',
      },
    ],
    defaultVariants: {
      variant: 'success',
      position: 'bottom-right',
      isOpen: true,
    },
  },
);

export interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string;
  close: () => void;
  onExit: () => void;
}

export function Toast({
  message,
  variant,
  position,
  isOpen,
  close,
  onExit,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(close, 2500);
    return () => clearTimeout(timer);
  }, [close]);

  return (
    <div
      className={toastVariants({ variant, position, isOpen })}
      onTransitionEnd={() => {
        if (!isOpen) onExit();
      }}
    >
      {message}
    </div>
  );
}
