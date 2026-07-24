import { AssignmentEditForm } from '@/features/assignment-admin/components/AssignmentEditForm';
import { useAssignment } from '@/features/assignment-admin/hooks/queries';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/assignments/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data, isPending, isError } = useAssignment(id);

  if (isPending) return <div className="text-muted text-sm">로딩 중...</div>;
  if (isError) return <div className="text-red text-sm">불러오기 실패</div>;

  return <AssignmentEditForm assignment={data} />;
}
