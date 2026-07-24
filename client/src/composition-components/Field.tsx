import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, error, className, children }: FieldProps) {
  return (
    <div className={className}>
      <div className="text-muted mb-1.5 text-[11px] font-bold">{label}</div>
      {children}
      {error && (
        <div className="text-red mt-1 text-[11px] font-semibold">{error}</div>
      )}
    </div>
  );
}
