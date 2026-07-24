import {
  AssignmentForm,
  type AssignmentFormValues,
} from '@/features/assignment-admin/components/AssignmentForm';
import {
  usePublishAssignment,
  useUnpublishAssignment,
  useUpdateAssignment,
} from '@/features/assignment-admin/hooks/queries';
import type { Assignment } from '@/features/assignment-admin/hooks/types';
import { cn } from '@/utils/cn';
import { useNavigate } from '@tanstack/react-router';

export function AssignmentEditForm({ assignment }: { assignment: Assignment }) {
  const navigate = useNavigate();
  const updateAssignment = useUpdateAssignment();
  const publish = usePublishAssignment();
  const unpublish = useUnpublishAssignment();
  const isPublished = assignment.publishedAt !== null;

  const handleSubmit = (values: AssignmentFormValues) => {
    updateAssignment.mutate(
      {
        id: assignment.id,
        data: {
          ...values,
          tags: values.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        },
      },
      { onSuccess: () => navigate({ to: '/admin/assignments' }) },
    );
  };

  return (
    <AssignmentForm
      heading="과제 편집"
      statusBadge={
        <span
          className={cn(
            'text-xs font-bold',
            isPublished ? 'text-green' : 'text-muted',
          )}
        >
          {isPublished ? '게시 중' : '비공개'}
        </span>
      }
      submitLabel="저장"
      isSubmitting={updateAssignment.isPending}
      defaultValues={{
        title: assignment.title,
        tier: assignment.tier,
        track: assignment.track,
        tags: assignment.tags.join(', '),
        hoursEstimate: assignment.hoursEstimate,
        requirementsMd: assignment.requirementsMd,
        rubricItems: assignment.rubricItems.map(({ name, points, aiGuide }) => ({
          name,
          points,
          aiGuide,
        })),
      }}
      onSubmit={handleSubmit}
      secondaryButton={{
        label: isPublished ? '비공개로 전환' : '게시로 전환',
        disabled: publish.isPending || unpublish.isPending,
        onClick: () =>
          isPublished
            ? unpublish.mutate(assignment.id)
            : publish.mutate(assignment.id),
      }}
    />
  );
}
