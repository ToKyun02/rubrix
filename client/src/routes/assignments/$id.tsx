import { Card } from '@/composition-components/Card';
import { TIER_COLOR_CLASS, TIER_LABEL } from '@/features/assignment/constants';
import { useAssignment } from '@/features/assignment/hooks/queries';
import { RepoConnectWidget } from '@/features/repo/components/RepoConnectWidget';
import { PullRequestPicker } from '@/features/submission/components/PullRequestPicker';
import { useTheme } from '@/features/theme/providers/ThemeProvider';
import { downloadTextFile } from '@/utils/download';
import { createFileRoute, Link } from '@tanstack/react-router';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Download, StarCheck } from 'lucide-react';

export const Route = createFileRoute('/assignments/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: assignment, isSuccess } = useAssignment(id);
  const { isDark } = useTheme();

  if (!isSuccess) return <div className="text-muted text-sm">로딩 중...</div>;

  return (
    <div className="mx-auto max-w-270 px-6 py-7">
      <Link
        to="/assignments"
        className="text-muted hover:text-text mb-5 inline-block text-[13px]"
      >
        ← 과제 탐색
      </Link>
      <div className="mb-2.5 flex gap-2">
        <span
          className={`rounded px-2.5 py-1 text-[11px] font-extrabold ${TIER_COLOR_CLASS[assignment.tier]}`}
        >
          {TIER_LABEL[assignment.tier]}
        </span>
        <span className="bg-subtle text-muted rounded px-2.5 py-1 text-[11px] font-semibold">
          {assignment.track}
        </span>
      </div>
      <h1 className="text-heading mb-8 text-[26px] font-extrabold">
        {assignment.title}
      </h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-9">
        <aside className="flex flex-col gap-4">
          <Card className="flex flex-col gap-2.5 p-4.5 text-[13px]">
            <div className="flex justify-between">
              <span className="text-muted">예상 소요</span>
              <span className="text-muted">~{assignment.hoursEstimate}h</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted flex-none">스택</span>
              <span className="text-muted text-right">
                {assignment.tags.join(' · ')}
              </span>
            </div>
          </Card>
          <RepoConnectWidget assignmentId={assignment.id} />
          <PullRequestPicker assignmentId={assignment.id} />
        </aside>

        <article className="min-w-0">
          <h2 className="text-heading mb-3.5 flex items-center gap-2 text-lg font-extrabold">
            <StarCheck color="yellow" />
            <span className="flex-1">요구사항서</span>
            <button
              onClick={() =>
                downloadTextFile(
                  `${assignment.title}.md`,
                  assignment.requirementsMd,
                )
              }
              className="cursor-pointer"
            >
              <Download />
            </button>
          </h2>
          <div
            data-color-mode={isDark ? 'dark' : 'light'}
            className="border-subtle rounded-2xl border px-2 py-4"
          >
            <MarkdownPreview source={assignment.requirementsMd} />
          </div>

          <h2 className="text-heading mb-1.5 text-lg font-extrabold">
            평가 기준
          </h2>
          <p className="text-muted mb-4 text-xs">
            상세 채점 기준은 제출 후 리포트에서 공개됩니다.
          </p>
          <div className="flex flex-col gap-2">
            {assignment.rubricItems.map((item) => (
              <Card
                key={item.id}
                className="flex items-center gap-3.5 px-4.5 py-3.5"
              >
                <span className="text-heading w-9 text-[15px] font-bold">
                  {item.points}
                </span>
                <span className="text-muted flex-1 text-[13.5px] font-bold">
                  {item.name}
                </span>
                <span className="text-muted-2 text-[11px]">
                  🔒 제출 후 공개
                </span>
              </Card>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
