import { useLogout } from '@/features/auth/hooks/queries';
import type { User } from '@/features/auth/hooks/types';
import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

interface ProfileProps {
  user: User;
}

export function Profile({ user }: ProfileProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const logout = useLogout();

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div ref={ref} className="relative flex items-center justify-center">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="border-border h-8 w-8 cursor-pointer overflow-hidden rounded-full border"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="bg-subtle text-muted flex h-full w-full items-center justify-center text-xs font-bold">
            {user.username.slice(0, 1).toUpperCase()}
          </div>
        )}
      </button>
      {open && (
        <div className="bg-card border-border absolute top-full right-0 z-10 mt-1.5 w-44 overflow-hidden rounded-md border shadow-lg">
          <div className="border-subtle text-heading border-b px-3.5 py-2.5 text-[13px] font-bold">
            {user.username}
          </div>
          <Link
            to="/mypage"
            onClick={() => setOpen(false)}
            className="text-text hover:bg-subtle block px-3.5 py-2 text-[13px] font-semibold"
          >
            마이페이지
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="text-red hover:bg-subtle w-full cursor-pointer px-3.5 py-2 text-left text-[13px] font-semibold disabled:opacity-50"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
