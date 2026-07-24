import {
  AssignmentForm,
  type AssignmentFormValues,
} from '@/features/assignment-admin/components/AssignmentForm';
import { useCreateAssignment } from '@/features/assignment-admin/hooks/queries';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/assignments/new')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const createAssignment = useCreateAssignment();

  const handleSubmit = (values: AssignmentFormValues) => {
    createAssignment.mutate(
      {
        ...values,
        tags: values.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      },
      { onSuccess: () => navigate({ to: '/admin/assignments' }) },
    );
  };

  return (
    <AssignmentForm
      heading="새 과제 만들기"
      submitLabel="생성"
      isSubmitting={createAssignment.isPending}
      defaultValues={{
        title: '',
        tier: 'BRONZE',
        track: 'FRONTEND',
        tags: '',
        hoursEstimate: 1,
        requirementsMd: '',
        rubricItems: [{ name: '', points: 0, aiGuide: '' }],
      }}
      onSubmit={handleSubmit}
      secondaryButton={{
        label: '취소',
        onClick: () => navigate({ to: '/admin/assignments' }),
      }}
    />
  );
}
