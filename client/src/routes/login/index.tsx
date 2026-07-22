import { Button } from '@/atom-components/Button';
import Github from '@/atom-components/icons/Github';
import LogoText from '@/atom-components/LogoText';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/composition-components/Card';
import ThemeToggleButton from '@/features/theme/components/ThemeToggleButton';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/login/')({
  component: LoginPage,
});

function LoginPage() {
  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
      scope: 'read:user user:email',
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };

  return (
    <div className="bg-bg flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center gap-5 text-center">
            <Github className="text-heading h-10 w-10" />
            <div className="space-y-1.5">
              <CardTitle className="text-lg">Rubrix에 로그인</CardTitle>
              <CardDescription>
                GitHub 계정으로 로그인하고 과제 채점을 시작하세요
              </CardDescription>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2.5"
              onClick={handleLogin}
            >
              <Github className="h-4.5 w-4.5" />
              GitHub로 계속하기
            </Button>
          </CardContent>
        </Card>

        <p className="text-muted-2 mt-5 max-w-sm text-[12.5px] leading-relaxed">
          로그인 시 Rubrix의{' '}
          <a
            href="#"
            className="hover:text-heading underline underline-offset-2"
          >
            이용약관
          </a>{' '}
          및{' '}
          <a
            href="#"
            className="hover:text-heading underline underline-offset-2"
          >
            개인정보처리방침
          </a>
          에 동의하는 것으로 간주됩니다.
        </p>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 md:px-10">
      <Link to="/">
        <LogoText />
      </Link>
      <ThemeToggleButton />
    </header>
  );
}
