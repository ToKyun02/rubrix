import LogoText from '@/atom-components/LogoText';
import PolicyModal from '@/composition-components/policy/PolicyModal';
import {
  PRIVACY_SECTIONS,
  TERMS_SECTIONS,
  type PolicySection,
} from '@/composition-components/policy/policyContent';
import { Link } from '@tanstack/react-router';
import { overlay } from 'overlay-kit';
import Container from './-Container';

function openPolicyModal(title: string, sections: PolicySection[]) {
  overlay.open(({ isOpen, close, unmount }) => (
    <PolicyModal
      isOpen={isOpen}
      title={title}
      sections={sections}
      onClose={() => {
        close();
        unmount();
      }}
    />
  ));
}

const LINKS = [
  {
    label: '이용약관',
    onClick: () => openPolicyModal('이용약관', TERMS_SECTIONS),
  },
  {
    label: '개인정보처리방침',
    onClick: () => openPolicyModal('개인정보처리방침', PRIVACY_SECTIONS),
  },
  { label: 'GitHub', href: 'https://github.com/ToKyun02/rubrix' },
];

export default function Footer() {
  return (
    <footer className="py-8">
      <Container className="text-muted flex flex-wrap items-center gap-x-5 gap-y-3 text-[12.5px]">
        <Link to="/">
          <LogoText className="text-sm" />
        </Link>
        <span>© 2026 Rubrix</span>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {LINKS.map((link) =>
            'href' in link ? (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-heading"
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.label}
                type="button"
                onClick={link.onClick}
                className="hover:text-heading cursor-pointer"
              >
                {link.label}
              </button>
            ),
          )}
        </div>
      </Container>
    </footer>
  );
}
