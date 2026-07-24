import { AdminSidebar } from '@/features/assignment-admin/components/AdminSidebar';
import { meQueryOptions } from '@/features/auth/hooks/queries';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient
      .ensureQueryData(meQueryOptions)
      .catch(() => null);
    if (me?.role !== 'ADMIN') throw redirect({ to: '/' });
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="bg-bg flex min-h-screen">
      <AdminSidebar />
      <main className="max-w-250 min-w-0 flex-1 px-9 py-8 pb-20">
        <Outlet />
      </main>
    </div>
  );
}
