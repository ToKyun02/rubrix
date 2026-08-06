import Link from '@/atom-components/Link';
import LogoText from '@/atom-components/LogoText';
import { Profile } from '@/features/auth/components/Profile';
import { useMe } from '@/features/auth/hooks/queries';
import ThemeToggleButton from '@/features/theme/components/ThemeToggleButton';
import { ThemeProvider } from '@/features/theme/providers/ThemeProvider';

import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  Outlet,
  Link as RouterLink,
  useMatchRoute,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}

function Header() {
  const matchRoute = useMatchRoute();
  const isLoginPage = matchRoute({ to: '/login' });
  const isAdminPage = matchRoute({ to: '/admin', fuzzy: true });
  const { data: me } = useMe();

  if (isLoginPage || isAdminPage) return null;

  return (
    <header className="text-heading bg-bg sticky top-0 right-0 left-0 z-10 flex items-center px-10 pt-2">
      <RouterLink to="/" className="flex-1">
        <LogoText />
      </RouterLink>
      <div className="flex items-center gap-2">
        <ThemeToggleButton />
        {me ? <Profile user={me} /> : <Link to="/login">Github로 로그인</Link>}
      </div>
    </header>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootLayout,
});
