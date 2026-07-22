import { Button } from '@/atom-components/Button';
import { Card } from '@/composition-components/Card';
import { Check } from 'lucide-react';

const PERMISSIONS = [
  { scope: 'Pull requests · read', reason: '제출 PR 감지' },
  { scope: 'Webhooks · read', reason: 'PR 이벤트 수신' },
];

interface GithubAppOnboardingModalProps {
  isOpen: boolean;
  onInstall: () => void;
  onClose: () => void;
}

export default function GithubAppOnboardingModal({
  isOpen,
  onInstall,
  onClose,
}: GithubAppOnboardingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-6">
      <Card className="w-full max-w-110 p-7 shadow-2xl">
        <h2 className="text-heading mb-2 text-lg font-extrabold">
          GitHub App 설치가 필요합니다
        </h2>
        <p className="text-muted mb-5 text-[13.5px] leading-relaxed">
          PR 읽기와 웹훅 수신 권한만 필요합니다. 레포 생성이나 코드 수정 권한은
          요청하지 않습니다. <br />
          최소 권한이 Rubrix의 원칙입니다.
        </p>
        <div className="bg-green/10 border-green/30 text-green mb-3.5 rounded-md border px-3 py-2.5 text-xs leading-relaxed">
          레포 권한은 Read만 사용합니다.
        </div>
        <div className="mb-6 flex flex-col gap-2">
          {PERMISSIONS.map((p) => (
            <div
              key={p.scope}
              className="bg-bg border-subtle flex items-center gap-2.5 rounded-md border px-3.5 py-2.5 text-[13px]"
            >
              <Check className="text-green h-3.5 w-3.5 flex-none" />
              <span className="font-semibold">{p.scope}</span>
              <span className="text-muted ml-auto text-xs">{p.reason}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2.5">
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => {
              onInstall();
              onClose();
            }}
          >
            설치하고 계속
          </Button>
          <Button variant="ghost" onClick={onClose}>
            나중에
          </Button>
        </div>
      </Card>
    </div>
  );
}
