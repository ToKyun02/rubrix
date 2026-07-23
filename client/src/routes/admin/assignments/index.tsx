import { AssignmentRow } from '@/features/assignment-admin/components/AssignmentRow';
import { useAssignments } from '@/features/assignment-admin/hooks/queries';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/assignments/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isPending, isError } = useAssignments();

  if (isPending) return <div className="text-muted text-sm">로딩 중...</div>;
  if (isError) return <div className="text-red text-sm">불러오기 실패</div>;

  return (
    <div>
      <div className="mb-5 flex items-center gap-3.5">
        <h1 className="text-heading text-xl font-extrabold">과제 관리</h1>
        <button className="bg-green-btn ml-auto cursor-pointer rounded-md px-4 py-2.5 text-[13px] font-bold text-white">
          + 새 과제
        </button>
      </div>
      <div className="bg-card border-border overflow-hidden rounded-[10px] border">
        <div className="text-muted border-subtle grid grid-cols-[1fr_90px_70px_110px] gap-2 border-b px-4.5 py-2.5 font-mono text-[10.5px] font-bold">
          <span>TITLE</span>
          <span>TIER</span>
          <span>TRACK</span>
          <span>게시 상태</span>
        </div>
        {data.map((assignment) => (
          <AssignmentRow key={assignment.id} assignment={assignment} />
        ))}
      </div>
    </div>
  );
}
