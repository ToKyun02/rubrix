import { cn } from '@/utils/cn';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  variant: 'error' | 'success';
  isOpen: boolean;
  close: () => void;
  onExit: () => void;
}

export function Toast({ message, variant, isOpen, close, onExit }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(close, 2500);
    return () => clearTimeout(timer);
  }, [close]);

  return (
    <div
      className={cn(
        'fixed right-5 bottom-5 z-50 rounded-md border px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-200',
        variant === 'error'
          ? 'bg-red/10 border-red/35 text-red'
          : 'bg-green/10 border-green/35 text-green',
        isOpen
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0',
      )}
      onTransitionEnd={() => {
        if (!isOpen) onExit();
      }}
    >
      {message}
    </div>
  );
}
