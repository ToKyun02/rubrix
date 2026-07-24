import { cn } from '@/utils/cn';

const blockNonPositiveIntegerKeys = (
  e: React.KeyboardEvent<HTMLInputElement>,
) => {
  if (['-', '+', 'e', 'E', '.', ','].includes(e.key)) {
    e.preventDefault();
  }
};

interface NumberStepperProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  step?: number;
  className?: string;
}

export function NumberStepper({
  value,
  onChange,
  min = 0,
  step = 1,
  className,
}: NumberStepperProps) {
  const safeValue = Number.isNaN(value) ? min : value;

  return (
    <div
      className={cn(
        'border-border bg-card flex items-center overflow-hidden rounded-md border',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, safeValue - step))}
        className="text-text hover:bg-subtle h-8 w-8 flex-none cursor-pointer font-bold transition-colors"
      >
        −
      </button>
      <input
        type="number"
        value={safeValue}
        onKeyDown={blockNonPositiveIntegerKeys}
        onChange={(e) =>
          onChange(Math.max(min, Math.floor(Number(e.target.value) || min)))
        }
        className="text-heading w-full appearance-none bg-transparent px-1 text-center text-sm font-bold outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(safeValue + step)}
        className="text-text hover:bg-subtle h-8 w-8 flex-none cursor-pointer font-bold transition-colors"
      >
        +
      </button>
    </div>
  );
}
