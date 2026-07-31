import { Button } from '@/atom-components/Button';
import { Card } from '@/composition-components/Card';
import { X } from 'lucide-react';
import type { PolicySection } from './policyContent';

interface PolicyModalProps {
  isOpen: boolean;
  title: string;
  sections: PolicySection[];
  onClose: () => void;
}

export default function PolicyModal({
  isOpen,
  title,
  sections,
  onClose,
}: PolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-6"
      onClick={onClose}
    >
      <Card
        className="flex max-h-[80vh] w-full max-w-140 flex-col p-0 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-subtle flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-heading text-lg font-extrabold">{title}</h2>
          <Button
            variant="icon"
            size="icon"
            onClick={onClose}
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-5">
            {sections.map((section) => (
              <div key={section.heading}>
                <h3 className="text-heading mb-1.5 text-sm font-bold">
                  {section.heading}
                </h3>
                <p className="text-muted text-[13px] leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-subtle flex justify-end border-t px-6 py-4">
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </div>
      </Card>
    </div>
  );
}
