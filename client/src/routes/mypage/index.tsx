import { Card } from '@/composition-components/Card';
import { TIER_COLOR_CLASS, TIER_LABEL } from '@/features/assignment/constants';
import { meQueryOptions, useMe } from '@/features/auth/hooks/queries';
import {
  SUBMISSION_STATUS_COLOR,
  SUBMISSION_STATUS_LABEL,
} from '@/features/submission/constants';
import {
  useSubmissionStats,
  useSubmissionSummary,
} from '@/features/submission/hooks/queries';
import { cn } from '@/utils/cn';
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
          <div className="flex items-center gap-2">
            <span className="text-heading text-lg font-extrabold">
              {me.username}
            </span>
            {stats && (
              <span
                className={cn(
                  'rounded px-2 py-0.5 text-[10.5px] font-extrabold',
                  stats.tier
                    ? TIER_COLOR_CLASS[stats.tier]
                    : 'bg-subtle text-muted',
                )}
              >
                {stats.tier ? TIER_LABEL[stats.tier] : '등급 없음'}
              </span>
            )}
          </div>
          <div className="text-muted text-xs">@{me.username}</div>
          {stats?.nextTier && (
            <div className="text-muted mt-1 text-[11px]">
              <span className={`font-bold ${TIER_COLOR_CLASS[stats.nextTier]}`}>
                {TIER_LABEL[stats.nextTier]}
              </span>{' '}
              난이도 과제를 {85}점 이상으로 통과하면 승급해요
            </div>
          )}
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
