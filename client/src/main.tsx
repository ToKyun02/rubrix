import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { OverlayProvider } from 'overlay-kit';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Spinner } from './atom-components/Spinner';
import { ThemeProvider } from './features/theme/providers/ThemeProvider';
import './index.css';
import { routeTree } from './routeTree.gen';
import { isClientError } from './utils/networkHelper';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      retry: (failCnt, error) => !isClientError(error) && failCnt < 1,
    },
  },
});

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPendingComponent: () => (
    <Spinner className="fixed top-1/2 left-1/2 size-10" />
  ),
  defaultPendingMinMs: 500,
  notFoundMode: 'root',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <OverlayProvider>
          <RouterProvider router={router} />
        </OverlayProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
