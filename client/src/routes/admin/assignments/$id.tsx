import {
  useAssignment,
  useUnpublishAssignment,
  useUpdateRubricItems,
} from '@/features/assignment-admin/hooks/queries';
import type { Assignment } from '@/features/assignment-admin/hooks/types';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/admin/assignments/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data, isPending, isError } = useAssignment(id);

  if (isPending) return <div className="text-muted text-sm">로딩 중...</div>;
  if (isError) return <div className="text-red text-sm">불러오기 실패</div>;

  return <RubricEditor assignment={data} />;
}

const TIER_LABEL: Record<Assignment['tier'], string> = {
  BRONZE: '브론즈',
  SILVER: '실버',
  GOLD: '골드',
  PLATINUM: '플래티넘',
  DIAMOND: '다이아',
};

function RubricEditor({ assignment }: { assignment: Assignment }) {
  const [points, setPoints] = useState(() =>
    assignment.rubricItems.map((r) => r.points),
  );
  const updateRubricItems = useUpdateRubricItems();
  const unpublish = useUnpublishAssignment();

  const sum = points.reduce((a, b) => a + b, 0);
  const sumBad = sum !== 100;

  const adjust = (index: number, delta: number) =>
    setPoints((prev) =>
      prev.map((p, i) => (i === index ? Math.max(0, p + delta) : p)),
    );

  const handleSave = () => {
    updateRubricItems.mutate({
      id: assignment.id,
      rubricItems: assignment.rubricItems.map((item, i) => ({
        name: item.name,
        points: points[i],
        aiGuide: item.aiGuide,
      })),
    });
  };

  return (
    <div>
      <h1 className="text-heading mb-5 text-xl font-extrabold">
        {assignment.title}{' '}
        <span
          className={`ml-1.5 text-xs font-bold ${assignment.publishedAt ? 'text-green' : 'text-muted'}`}
        >
          {assignment.publishedAt ? '게시 중' : '비공개'}
        </span>
      </h1>

      <div className="grid grid-cols-[280px_1fr] items-start gap-5">
        <div className="bg-card border-border flex flex-col gap-3.5 rounded-[10px] border p-4.5">
          <div>
            <div className="text-muted mb-1.5 text-[11px] font-bold">
              티어 / 트랙
            </div>
            <div className="flex gap-2">
              <span className="bg-subtle text-heading rounded-full px-3 py-1 text-xs font-extrabold">
                {TIER_LABEL[assignment.tier]}
              </span>
              <span className="border-border text-muted rounded-full border px-3 py-1 text-xs font-bold">
                {assignment.track}
              </span>
            </div>
          </div>
          <div>
            <div className="text-muted mb-1.5 text-[11px] font-bold">
              예상 소요
            </div>
            <div className="text-text text-[12.5px]">
              {assignment.hoursEstimate}시간
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2.5 flex items-baseline gap-2.5">
            <div className="text-heading text-sm font-extrabold">
              루브릭 항목
            </div>
            <div
              className={`ml-auto font-mono text-xs font-extrabold ${sumBad ? 'text-red' : 'text-green'}`}
            >
              합계 {sum}/100
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {assignment.rubricItems.map((item, i) => (
              <div
                key={item.id}
                className="bg-card border-border flex items-start gap-3.5 rounded-lg border px-3.5 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-heading mb-1 text-[13px] font-bold">
                    {item.name}
                  </div>
                  <div className="text-muted text-[11.5px]">
                    AI 지침: {item.aiGuide}
                  </div>
                </div>
                <div className="flex flex-none items-center gap-1.5">
                  <button
                    onClick={() => adjust(i, -5)}
                    className="bg-subtle border-border text-text h-6.5 w-6.5 rounded-md border font-bold"
                  >
                    −
                  </button>
                  <span className="text-heading w-8.5 text-center font-mono text-sm font-extrabold">
                    {points[i]}
                  </span>
                  <button
                    onClick={() => adjust(i, 5)}
                    className="bg-subtle border-border text-text h-6.5 w-6.5 rounded-md border font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sumBad && (
            <div className="bg-red/8 border-red/35 text-red mt-3 rounded-lg border px-3.5 py-2.5 text-[12.5px] font-semibold">
              배점 합계가 100이 아니면 저장할 수 없습니다
            </div>
          )}

          <div className="mt-4 flex gap-2.5">
            <button
              disabled={sumBad || updateRubricItems.isPending}
              onClick={handleSave}
              className="bg-green-btn disabled:bg-subtle disabled:text-muted-2 rounded-md px-5 py-2.5 text-[13.5px] font-bold text-white"
            >
              저장
            </button>
            <button
              onClick={() => unpublish.mutate(assignment.id)}
              className="border-border text-text rounded-md border px-5 py-2.5 text-[13.5px] font-semibold"
            >
              비공개로 전환
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
