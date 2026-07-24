import LogoText from '@/atom-components/LogoText';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { ClipboardList } from 'lucide-react';

const NAV_ITEMS = [
  { icon: ClipboardList, label: '과제 관리', to: '/admin/assignments' },
];

export function AdminSidebar() {
  const matchRoute = useMatchRoute();

  return (
    <aside className="bg-card border-border flex w-57.5 flex-none flex-col gap-1 border-r p-3">
      <div className="flex items-center gap-2 px-2.5 pt-1 pb-4">
        <LogoText />
        <span className="text-yellow bg-yellow/15 rounded px-1.5 py-0.5 text-[9.5px] font-extrabold tracking-wide">
          ADMIN
        </span>
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive = matchRoute({ to: item.to, fuzzy: true });
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={
              isActive
                ? 'bg-subtle text-heading flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold'
                : 'text-muted hover:bg-hover flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold'
            }
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}

      <div className="text-muted-2 border-subtle mt-auto border-t p-3 text-[11px] leading-relaxed">
        운영팀 전용 · 일반 유저 접근 차단
        <br />
        <span>RBX-201</span>
      </div>
    </aside>
  );
}
