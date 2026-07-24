import { TIER_COLOR_CLASS } from '@/features/assignment-admin/constants';
import {
  usePublishAssignment,
  useUnpublishAssignment,
} from '@/features/assignment-admin/hooks/queries';
import type { Assignment } from '@/features/assignment-admin/hooks/types';
import { Link } from '@tanstack/react-router';

interface AssignmentRowProps {
  assignment: Assignment;
}

export function AssignmentRow({ assignment }: AssignmentRowProps) {
  const isPublished = assignment.publishedAt !== null;
  const publish = usePublishAssignment();
  const unpublish = useUnpublishAssignment();

  const handleToggle = () => {
    if (isPublished) unpublish.mutate(assignment.id);
    else publish.mutate(assignment.id);
  };

  return (
    <div className="border-subtle hover:bg-hover grid grid-cols-[1fr_90px_70px_110px] items-center gap-2 border-b px-4.5 py-3">
      <Link
        to="/admin/assignments/$id"
        params={{ id: assignment.id }}
        className="text-heading hover:text-blue truncate text-[13.5px] font-semibold"
      >
        {assignment.title}
      </Link>
      <span
        className={`flex items-center gap-1.5 text-[11px] font-extrabold ${TIER_COLOR_CLASS[assignment.tier]}`}
      >
        <span className="h-1.5 w-1.5 flex-none rotate-45 rounded-[1px] bg-current" />
        {assignment.tier}
      </span>
      <span className="text-muted text-xs">{assignment.track}</span>

      <button
        onClick={handleToggle}
        disabled={publish.isPending || unpublish.isPending}
        className="flex cursor-pointer items-center gap-2"
      >
        <span
          className={`relative h-4.5 w-8 flex-none rounded-full transition-colors ${
            isPublished ? 'bg-green-btn' : 'bg-subtle'
          }`}
        >
          <span
            className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-all ${
              isPublished ? 'left-4' : 'left-0.5'
            }`}
          />
        </span>
        <span
          className={`text-[11.5px] font-bold ${isPublished ? 'text-green' : 'text-muted'}`}
        >
          {isPublished ? '게시' : '비공개'}
        </span>
      </button>
    </div>
  );
}
