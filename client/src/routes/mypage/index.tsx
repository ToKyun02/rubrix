import { Card } from '@/composition-components/Card';
import { meQueryOptions, useMe } from '@/features/auth/hooks/queries';
import {
  SUBMISSION_STATUS_COLOR,
  SUBMISSION_STATUS_LABEL,
} from '@/features/submission/constants';
import {
  useSubmissionStats,
  useSubmissionSummary,
} from '@/features/submission/hooks/queries';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/mypage/')({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient
      .ensureQueryData(meQueryOptions)
      .catch(() => null);
    if (me == null) throw redirect({ to: '/login' });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: me } = useMe();
  const { data: stats } = useSubmissionStats();
  const { data: rows } = useSubmissionSummary();

  if (!me) return null;

  return (
    <div className="mx-auto max-w-270 px-6 py-7">
      <h1 className="text-heading mb-6 text-2xl font-extrabold">마이페이지</h1>

      <Card className="mb-7 flex flex-wrap items-center gap-5 p-6">
        <div className="border-border h-16 w-16 flex-none overflow-hidden rounded-full border">
          {me.avatarUrl ? (
            <img
              src={me.avatarUrl}
              alt={me.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="bg-subtle text-muted flex h-full w-full items-center justify-center text-xl font-bold">
              {me.username.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-55 flex-1">
          <div className="text-heading text-lg font-extrabold">
            {me.username}
          </div>
          <div className="text-muted text-xs">@{me.username}</div>
        </div>
        <div className="flex gap-7">
          <div className="text-center">
            <div className="text-heading font-mono text-xl font-extrabold">
              {stats?.completedAssignments ?? '-'}
            </div>
            <div className="text-muted text-[11px]">완료 과제</div>
          </div>
          <div className="text-center">
            <div className="text-heading font-mono text-xl font-extrabold">
              {stats?.averageScore ?? '-'}
            </div>
            <div className="text-muted text-[11px]">평균 점수</div>
          </div>
        </div>
      </Card>

      <h2 className="text-heading mb-4 text-lg font-extrabold">제출 현황</h2>

      {rows?.length === 0 ? (
        <div className="border-border rounded-xl border border-dashed px-10 py-20 text-center">
          <div className="text-heading mb-1.5 text-[17px] font-bold">
            아직 제출이 없습니다
          </div>
          <div className="text-muted mb-6 text-[13.5px]">
            과제를 골라 레포를 연결하고, 첫 PR을 제출해보세요.
          </div>
          <Link
            to="/assignments"
            className="bg-blue-btn inline-block rounded-md px-5 py-2.5 text-sm font-bold text-white"
          >
            과제 둘러보기
          </Link>
        </div>
      ) : (
        <Card className="overflow-x-auto">
          <div className="border-subtle text-muted grid min-w-130 grid-cols-[2fr_80px_90px_100px] gap-2 border-b px-5 py-2.5 text-[11px] font-bold">
            <span>과제</span>
            <span>최고 점수</span>
            <span>상태</span>
            <span className="text-right">마지막 활동</span>
          </div>
          {rows?.map((r) => (
            <Link
              key={r.assignmentId}
              to="/submissions/$id"
              params={{ id: r.latestSubmissionId }}
              className="border-subtle hover:bg-hover grid min-w-130 grid-cols-[2fr_80px_90px_100px] items-center gap-2 border-b px-5 py-3.5 text-[13px] last:border-b-0"
            >
              <span className="text-heading font-semibold">
                {r.assignmentTitle}
              </span>
              <span className="text-heading font-mono font-bold">
                {r.bestScore ?? '-'}
              </span>
              <span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${SUBMISSION_STATUS_COLOR[r.latestStatus]}`}
                >
                  {SUBMISSION_STATUS_LABEL[r.latestStatus]}
                </span>
              </span>
              <span className="text-muted text-right text-xs">
                {new Date(r.lastActivityAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
