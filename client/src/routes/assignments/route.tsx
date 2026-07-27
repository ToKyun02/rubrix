import { meQueryOptions } from '@/features/auth/hooks/queries';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/assignments')({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient
      .ensureQueryData(meQueryOptions)
      .catch(() => null);
    if (me == null) throw redirect({ to: '/login' });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
