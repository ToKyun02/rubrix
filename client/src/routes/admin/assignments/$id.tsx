import { AssignmentEditForm } from '@/features/assignment/admin/components/AssignmentEditForm';
import { useAssignment } from '@/features/assignment/hooks/queries';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/assignments/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data, isSuccess } = useAssignment(id);

  if (!isSuccess) return <div className="text-muted text-sm">로딩 중...</div>;

  return <AssignmentEditForm assignment={data} />;
}
