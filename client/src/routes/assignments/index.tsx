import { Card } from '@/composition-components/Card';
import { Pagination } from '@/composition-components/Pagination';
import { TIER_COLOR_CLASS, TIER_LABEL } from '@/features/assignment/constants';
import { useAssignments } from '@/features/assignment/hooks/queries';
import { createFileRoute, Link } from '@tanstack/react-router';
import { z } from 'zod';

const PAGE_SIZE = 12;

export const Route = createFileRoute('/assignments/')({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).optional().catch(undefined),
  }),
});

function RouteComponent() {
  const { page = 1 } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isPending, isError } = useAssignments({
    page,
    pageSize: PAGE_SIZE,
  });

  if (isPending) return <div className="text-muted text-sm">로딩 중...</div>;
  if (isError) return <div className="text-red text-sm">불러오기 실패</div>;

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-270 px-6 py-9">
      <h1 className="text-heading mb-6 text-2xl font-extrabold">과제 탐색</h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {data.items.map((assignment) => (
          <Link
            key={assignment.id}
            to="/assignments/$id"
            params={{ id: assignment.id }}
          >
            <Card
              variant="interactive"
              className="flex h-full flex-col gap-2.5 p-5"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10.5px] font-bold ${TIER_COLOR_CLASS[assignment.tier]}`}
                >
                  {TIER_LABEL[assignment.tier]}
                </span>
                <span className="bg-subtle text-muted rounded px-2 py-0.5 text-[10.5px] font-semibold">
                  {assignment.track}
                </span>
              </div>
              <div className="text-heading text-[15px] leading-snug font-bold">
                {assignment.title}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {assignment.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-muted border-border rounded border px-2 py-0.5 text-[10.5px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-muted border-subtle mt-auto border-t pt-2.5 text-[11.5px]">
                ~{assignment.hoursEstimate}h
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(p) => navigate({ search: { page: p } })}
        className="mt-8"
      />
    </div>
  );
}
