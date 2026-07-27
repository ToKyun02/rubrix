import Link from '@/atom-components/Link';
import { Card } from '@/composition-components/Card';
import { Pagination } from '@/composition-components/Pagination';
import { AssignmentRow } from '@/features/assignment/admin/components/AssignmentRow';
import { useAdminAssignments } from '@/features/assignment/admin/hooks/queries';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { z } from 'zod';

const PAGE_SIZE = 10;

export const Route = createFileRoute('/admin/assignments/')({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).optional().catch(undefined),
  }),
});

function RouteComponent() {
  const { page = 1 } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isPending, isError } = useAdminAssignments({
    page,
    pageSize: PAGE_SIZE,
  });

  if (isPending) return <div className="text-muted text-sm">로딩 중...</div>;
  if (isError) return <div className="text-red text-sm">불러오기 실패</div>;

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex items-center gap-3.5">
        <h1 className="text-heading flex-1 text-xl font-extrabold">
          과제 관리
        </h1>
        <Link
          variant="primary"
          size="md"
          className="px-4 py-2"
          to="/admin/assignments/new"
        >
          <Plus size="16" />
          <span>과제</span>
        </Link>
      </div>
      <Card className="overflow-hidden">
        <div className="text-muted border-subtle grid grid-cols-[1fr_90px_70px_110px] gap-2 border-b px-4.5 py-2.5 text-[10.5px] font-bold">
          <span>TITLE</span>
          <span>TIER</span>
          <span>TRACK</span>
          <span>게시 상태</span>
        </div>
        {data.items.map((assignment) => (
          <AssignmentRow key={assignment.id} assignment={assignment} />
        ))}
      </Card>
      <div className="flex-1" />
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(p) => navigate({ search: { page: p } })}
        className="mt-4"
      />
    </div>
  );
}
