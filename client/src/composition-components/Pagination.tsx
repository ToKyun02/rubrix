import { cn } from '@/utils/cn';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

const WINDOW_SIZE = 5;

export function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: PaginationProps) {
  const windowStart = Math.floor((page - 1) / WINDOW_SIZE) * WINDOW_SIZE + 1;
  const windowEnd = Math.min(windowStart + WINDOW_SIZE - 1, totalPages);
  const pages = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, i) => windowStart + i,
  );

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="text-muted hover:text-heading disabled:text-muted-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-sm disabled:cursor-not-allowed"
      >
        <ArrowLeft size="16" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={cn(
            'h-8 w-8 cursor-pointer rounded-md text-sm font-semibold',
            p === page ? 'bg-subtle text-heading' : 'text-muted hover:bg-hover',
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="text-muted hover:text-heading disabled:text-muted-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-sm disabled:cursor-not-allowed"
      >
        <ArrowRight size="16" />
      </button>
    </div>
  );
}
