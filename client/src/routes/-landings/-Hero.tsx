import Link from '@/atom-components/Link';
import {
  usePipelineDemo,
  type DemoState,
  type Tone,
} from '@/features/demo/pipeline/hooks/usePipelineDemo';
import { cn } from '@/utils/cn';
import { useEffect, useRef } from 'react';
import Container from './-Container';

export default function Hero() {
  return (
    <section>
      <Container
        className={cn('gap-4 space-y-4', 'md:flex md:flex-row md:items-center')}
      >
        <div className="flex flex-col gap-4 md:flex-1">
          <div className="text-blue text-xs font-semibold">
            AI CODE REVIEW · RUBRIC GRADING
          </div>
          <h1 className="text-heading text-2xl font-extrabold">
            PR을 올리면, 채점이 시작됩니다
          </h1>
          <p className="text-muted text-">
            실무형 과제를 Git 워크플로우 그대로 풀고, 당신이 놓친 것을 AI
            리뷰어가 라인 단위로 짚어줍니다.
          </p>
          <div className="flex flex-col gap-2 md:flex-row">
            <Link to="/login" variant="primary" size="lg">
              Github로 시작하기
            </Link>
            <Link to="/submissions" size="lg">
              과제 둘러보기
            </Link>
          </div>
        </div>

        <PipelineDemo />
      </Container>
    </section>
  );
}

const STEPS = ['코드 수집', '정적 분석', 'AI 평가', '리포트'];
type StepStatus = 'wait' | 'run' | 'done';
const BAR: Record<StepStatus, string> = {
  done: 'bg-green',
  run: 'bg-blue',
  wait: 'bg-subtle',
};
const LABEL: Record<StepStatus, string> = {
  done: 'text-green',
  run: 'text-blue',
  wait: 'text-muted-2',
};
const TONE: Record<Tone, string> = {
  ok: 'text-green',
  warn: 'text-yellow',
  info: 'text-muted',
};

function PipelineDemo() {
  const demo = usePipelineDemo();
  return (
    <div className="border-border bg-card overflow-hidden rounded-[10px] border shadow-[0_16px_48px_rgba(0,0,0,0.4)] md:flex-1">
      <TitleBar />
      <StepTrack {...demo} />
      <LogView logs={demo.logs} />
      <ScoreFooter score={demo.score} done={demo.done} />
    </div>
  );
}

function TitleBar() {
  return (
    <div className="border-subtle bg-bg flex items-center gap-2 border-b px-3.5 py-2.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="bg-border h-2.5 w-2.5 rounded-full" />
      ))}
      <span className="text-muted ml-1.5 text-[11px]">
        evaluation-pipeline · PR #4
      </span>
    </div>
  );
}

function StepTrack({ step, aiCount, done }: DemoState) {
  return (
    <div className="border-subtle flex flex-col gap-3 border-b-2 px-3.5 pt-3.5 md:flex-row">
      {STEPS.map((label, i) => {
        const status: StepStatus =
          done || step > i ? 'done' : step === i ? 'run' : 'wait';
        const text =
          i === 2 && status !== 'wait' ? `${label} ${aiCount}/6` : label;
        return (
          <div
            key={label}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div className={`h-0.75 w-full rounded-sm ${BAR[status]}`} />
            <span className={`text-[10.5px] font-semibold ${LABEL[status]}`}>
              {text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function LogView({ logs }: Pick<DemoState, 'logs'>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [logs]);
  return (
    <div
      ref={ref}
      className="h-45 overflow-y-auto px-4 py-3 text-[11.5px] leading-[1.9]"
    >
      {logs.map((lg, i) => (
        <div key={i} className={TONE[lg.tone]}>
          {lg.text}
        </div>
      ))}
      <span className="bg-blue inline-block h-3.25 w-1.75 animate-pulse align-middle" />
    </div>
  );
}

function ScoreFooter({ score, done }: Pick<DemoState, 'score' | 'done'>) {
  return (
    <div className="border-subtle flex h-20 items-baseline gap-2.5 border-t px-4 py-3.5">
      {done ? (
        <>
          <span className="text-heading text-[34px] font-extrabold">
            {score}
          </span>
          <span className="text-muted text-sm">/100</span>
          <span className="bg-green/15 text-green ml-auto rounded-full px-2.5 py-0.75 text-xs font-bold">
            평가 완료
          </span>
        </>
      ) : (
        <span className="text-muted animate-pulse text-[12.5px]">
          루브릭 기준으로 평가 중…
        </span>
      )}
    </div>
  );
}
