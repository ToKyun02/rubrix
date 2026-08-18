import { Spinner } from '@/atom-components/Spinner';
import { Card } from '@/composition-components/Card';
import { meQueryOptions } from '@/features/auth/hooks/queries';
import {
  useSubmission,
  useSubmissionList,
} from '@/features/submission/hooks/queries';
import type { Severity } from '@/features/submission/hooks/types';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/submissions/$id')({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient
      .ensureQueryData(meQueryOptions)
      .catch(() => null);
    console.log(me);
    if (me == null) throw redirect({ to: '/login' });
  },
  component: RouteComponent,
});

const SEVERITY_LABEL: Record<Severity, string> = {
  CRITICAL: '치명적',
  WARNING: '개선 필요',
  INFO: '참고',
};

const SEVERITY_COLOR: Record<Severity, string> = {
  CRITICAL: 'text-red',
  WARNING: 'text-yellow',
  INFO: 'text-muted',
};

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: submission, isSuccess } = useSubmission(id);
  const { data: rounds } = useSubmissionList(
    submission?.assignmentId ?? '',
    !!submission,
  );

  if (!isSuccess)
    return <div className="text-muted p-7 text-sm">로딩 중...</div>;

  return (
    <div className="mx-auto max-w-200 px-6 py-7">
      <Link
        to="/assignments/$id"
        params={{ id: submission.assignmentId }}
        className="text-muted hover:text-text mb-5 inline-block text-[13px]"
      >
        ← {submission.assignment.title}
        &nbsp;
      </Link>

      {rounds && rounds.length > 1 && (
        <div className="border-border mb-6 inline-flex overflow-hidden rounded-md border">
          {rounds
            .slice()
            .sort((a, b) => a.roundNumber - b.roundNumber)
            .map((r) => (
              <Link
                key={r.id}
                to="/submissions/$id"
                params={{ id: r.id }}
                className={`px-2.5 py-1 text-[11px] font-bold ${
                  r.id === submission.id
                    ? 'bg-blue-btn text-white'
                    : 'text-muted hover:bg-hover'
                }`}
              >
                제출 #{r.roundNumber}
              </Link>
            ))}
        </div>
      )}

      {(submission.status === 'PENDING' || submission.status === 'GRADING') && (
        <Card className="flex items-center gap-3 p-6">
          <Spinner />
          <span className="text-muted text-sm">
            채점 중입니다. 완료되면 자동으로 업데이트돼요.
          </span>
        </Card>
      )}

      {submission.status === 'FAILED' && (
        <Card className="border-red/35 bg-red/8 p-6">
          <span className="text-red text-sm font-bold">
            채점에 실패했습니다.
          </span>
        </Card>
      )}

      {submission.status === 'GRADED' && (
        <>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-heading text-5xl font-extrabold">
              {submission.totalScore}
            </span>
            <span className="text-muted text-lg">/100</span>
          </div>

          <div className="mb-8 flex flex-col gap-2">
            {submission.scores.map((s) => (
              <Card key={s.id} className="p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-heading text-[13.5px] font-bold">
                    {s.rubricItem.name}
                  </span>
                  <span className="text-heading text-[13px] font-bold">
                    {s.score}
                    <span className="text-muted font-normal">
                      /{s.rubricItem.points}
                    </span>
                  </span>
                </div>
                <p className="text-muted text-xs leading-relaxed">
                  {s.summary}
                </p>
              </Card>
            ))}
          </div>

          <h2 className="text-heading mb-3 text-lg font-extrabold">
            코드 리뷰
          </h2>
          {submission.comments.length === 0 ? (
            <p className="text-muted text-xs">별도 코멘트가 없어요.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {submission.comments.map((c) => (
                <Card key={c.id} className="p-4">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span
                      className={`text-[10.5px] font-extrabold ${SEVERITY_COLOR[c.severity]}`}
                    >
                      {SEVERITY_LABEL[c.severity]}
                    </span>
                    <span className="text-muted-2 text-[11px]">
                      {c.filePath}:{c.lineNumber}
                    </span>
                  </div>
                  <p className="text-text text-[12.5px] leading-relaxed">
                    {c.body}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
