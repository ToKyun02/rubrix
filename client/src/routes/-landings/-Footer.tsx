import LogoText from '@/atom-components/LogoText';
import Container from './-Container';

const LINKS = ['이용약관', '개인정보처리방침', 'GitHub'];

export default function Footer() {
  return (
    <footer className="py-8">
      <Container className="text-muted flex flex-wrap items-center gap-x-5 gap-y-3 text-[12.5px]">
        <LogoText className="text-sm" />
        <span>© 2026 Rubrix</span>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {LINKS.map((label) => (
            <a key={label} href="#" className="hover:text-heading">
              {label}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
