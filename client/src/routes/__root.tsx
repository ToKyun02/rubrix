import Link from '@/atom-components/Link';
import LogoText from '@/atom-components/LogoText';
import ThemeToggleButton from '@/features/theme/components/ThemeToggleButton';
import { createRootRoute, Outlet, useMatchRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export default function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

function Header() {
  const matchRoute = useMatchRoute();
  const isLoginPage = matchRoute({ to: '/login' });

  if (isLoginPage) return null;

  return (
    <header className="text-heading bg-bg sticky top-0 right-0 left-0 z-10 flex items-center px-10 pt-2">
      <LogoText className="flex-1" />
      <div className="flex items-center gap-2">
        <ThemeToggleButton />
        <Link to="/login">Github로 로그인</Link>
      </div>
    </header>
  );
}

export const Route = createRootRoute({ component: RootLayout });
