import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ListboxOption<T extends string> {
  value: T;
  label: string;
}

interface ListboxProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: ListboxOption<T>[];
  className?: string;
}

export function Listbox<T extends string>({
  value,
  onChange,
  options,
  className,
}: ListboxProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="bg-card border-border text-text flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm"
      >
        {selected?.label}
        <ChevronDown
          className={cn(
            'text-muted h-4 w-4 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="bg-card border-border absolute z-10 mt-1.5 w-full overflow-hidden rounded-md border py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                'hover:bg-subtle flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm',
                opt.value === value ? 'text-heading font-bold' : 'text-text',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
