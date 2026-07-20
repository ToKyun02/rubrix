import { Card, CardContent } from '@/composition-components/Card';
import { cn } from '@/utils/cn';
import Container from './-Container';

export default function Result() {
  return (
    <section>
      <Container>
        <h2 className="text-heading mb-2 text-[26px] font-extrabold tracking-tight">
          코드는 GitHub에서, 리뷰는 Rubrix에서
        </h2>
        <p className="text-muted mb-9 text-[14.5px] leading-relaxed">
          Rubrix는 PR을 읽기 전용으로만 가져옵니다. 라인별 코멘트는 해당 diff
          스니펫과 함께 Rubrix 리포트에 달리고, 루브릭 점수·항목별 피드백·회차
          비교까지 한 화면에서 보여줍니다.
        </p>
        <div className="grid items-stretch gap-5 md:grid-cols-2">
          <ScoreReportCard />
          <LineReviewCard />
        </div>
      </Container>
    </section>
  );
}

function ScoreReportCard() {
  return (
    <Card>
      <CardContent className="p-5.5">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-heading text-[13px] font-extrabold">
            rubrix_
          </span>
          <span className="text-muted text-[11px]">점수 리포트</span>
          <span className="text-heading ml-auto text-[22px] font-extrabold">
            87<span className="text-muted text-[11px] font-normal">/100</span>
          </span>
        </div>
        <RadarChart />
      </CardContent>
    </Card>
  );
}

function RadarChart() {
  return (
    <svg
      viewBox="0 0 280 150"
      className="h-37.5 w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <polygon
        points="140,17 187.6,44.5 187.6,99.5 140,127 92.4,99.5 92.4,44.5"
        className="stroke-subtle fill-none"
      />
      <polygon
        points="140,44 164,58 164,86 140,100 116,86 116,58"
        className="stroke-subtle fill-none"
      />
      <polygon
        points="140,26 180,49 178,95 140,120 98,95 100,52"
        className="fill-blue/20 stroke-blue stroke-[1.5]"
      />
    </svg>
  );
}

function LineReviewCard() {
  return (
    <Card>
      <CardContent className="p-5.5">
        <div className="mb-3 flex items-center gap-2">
          <BotAvatar className="size-5.5 text-[9px]" />
          <span className="text-heading text-[13px] font-bold">
            라인별 AI 리뷰
          </span>
          <span className="text-muted ml-auto text-[11px]">#4 · 3f2a9c1</span>
        </div>
        <div className="bg-bg border-subtle overflow-hidden rounded-lg border">
          <div className="bg-green/10 flex text-[11px] leading-[1.9]">
            <span className="text-muted-2 w-8.5 flex-none pr-2 text-right">
              21
            </span>
            <span className="text-green w-3.5 flex-none">+</span>
            <pre className="text-text m-0 font-[inherit] whitespace-pre">
              new IntersectionObserver(cb)
            </pre>
          </div>
          <div className="border-subtle border-t px-3.5 py-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <BotAvatar className="size-4.5 text-[8px]" />
              <span className="text-heading text-[11.5px] font-bold">
                rubrix-bot
              </span>
              <span className="bg-red/15 text-red rounded px-1.5 py-px text-[9.5px] font-extrabold">
                개선 필요
              </span>
            </div>
            <p className="text-text m-0 text-[11.5px] leading-relaxed">
              handleIntersect를 useCallback으로 고정하세요 - 매 렌더 observer
              재등록이 발생합니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BotAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'bg-blue-btn inline-flex flex-none items-center justify-center rounded-full font-extrabold text-white',
        className,
      )}
    >
      R
    </span>
  );
}
