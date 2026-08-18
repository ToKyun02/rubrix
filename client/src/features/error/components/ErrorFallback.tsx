import { Button } from '@/atom-components/Button';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import type { ErrorComponentProps } from '@tanstack/react-router';

export function ErrorFallback({ error, reset }: ErrorComponentProps) {
  const { reset: resetQuery } = useQueryErrorResetBoundary();

  return (
    <div className="bg-bg flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-heading text-xl font-extrabold">
        일시적인 오류가 발생했어요
      </h1>
      <p className="text-muted max-w-100 text-[13px]">
        잠시 후 다시 시도해 주세요. 문제가 계속되면 새로고침해 주세요.
      </p>

      {import.meta.env.DEV && (
        <pre className="border-border text-red mt-2 max-w-150 overflow-auto rounded-md border p-3 text-left text-xs">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      )}

      <Button
        className="mt-2"
        onClick={() => {
          resetQuery();
          reset();
        }}
      >
        다시 시도
      </Button>
    </div>
  );
}
