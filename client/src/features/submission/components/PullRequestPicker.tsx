import { Button } from '@/atom-components/Button';
import { Card } from '@/composition-components/Card';
import {
  useAssignmentRepo,
  usePullRequests,
} from '@/features/repo/hooks/queries';
import { useCreateSubmission } from '@/features/submission/hooks/queries';

interface PullRequestPickerProps {
  assignmentId: string;
}

export function PullRequestPicker({ assignmentId }: PullRequestPickerProps) {
  const { data: repo } = useAssignmentRepo(assignmentId);
  const { data: prs } = usePullRequests(assignmentId, !!repo);
  const createSubmission = useCreateSubmission(assignmentId);

  if (!repo) return null;

  return (
    <Card className="flex flex-col gap-3 p-4.5 text-[13px]">
      <span className="text-muted">제출할 PR을 선택하세요</span>
      {prs?.length === 0 && (
        <p className="text-muted-2 text-xs">
          아직 감지된 PR이 없어요. 레포에 PR을 올려보세요.
        </p>
      )}
      <div className="flex flex-col gap-2">
        {prs?.map((pr) => (
          <div
            key={pr.id}
            className="border-border flex items-center justify-between gap-3 rounded-md border px-3 py-2.5"
          >
            <div>
              <div className="text-heading font-bold">
                #{pr.number} {pr.branch}
              </div>
              <div className="flex items-center text-xs">
                <span className="text-green">+{pr.additions} line</span>
                &nbsp; &nbsp;
                <span className="text-red">−{pr.deletions} line</span>
              </div>
            </div>
            <Button
              size="sm"
              disabled={pr.submitted || createSubmission.isPending}
              onClick={() => createSubmission.mutate(pr.id)}
            >
              {pr.submitted ? '제출됨' : '이 버전으로 제출'}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
