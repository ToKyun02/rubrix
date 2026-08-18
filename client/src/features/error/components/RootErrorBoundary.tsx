import { isHttpNotFound } from '@/utils/networkHelper';
import { isNotFound, type ErrorComponentProps } from '@tanstack/react-router';
import { ErrorFallback } from './ErrorFallback';
import NotFound from './NotFound';

export function RootErrorBoundary({ error, reset }: ErrorComponentProps) {
  if (isNotFound(error) || isHttpNotFound(error)) return <NotFound />;
  return <ErrorFallback error={error} reset={reset} />;
}
