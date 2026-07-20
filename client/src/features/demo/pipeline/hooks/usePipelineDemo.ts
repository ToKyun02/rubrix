import { useEffect, useRef, useState } from 'react';

export type Tone = 'ok' | 'warn' | 'info';
export type DemoState = {
  logs: { text: string; tone: Tone }[];
  step: number;
  aiCount: number;
  score: number;
  done: boolean;
};

type DemoEvent =
  | { log: string; tone?: Tone }
  | { step: number }
  | { ai: number }
  | { finish: true };

const SCENARIO: [number, DemoEvent][] = [
  [
    250,
    { log: '→ PR #4 감지: feature/infinite-scroll @ 3f2a9c1', tone: 'info' },
  ],
  [850, { log: '✓ 파일 24개 수집 완료' }],
  [950, { step: 1 }],
  [1450, { log: '✓ ESLint 통과 (경고 2)' }],
  [2000, { log: '△ 테스트 12/14 통과', tone: 'warn' }],
  [2300, { step: 2 }],
  ...[
    '기능 완성도',
    '상태 관리',
    '컴포넌트 구조',
    '에러·로딩',
    '성능',
    '컨벤션',
  ].flatMap((item, i): [number, DemoEvent][] => [
    [2600 + i * 520, { log: `✓ AI 평가: ${item}` }],
    [2600 + i * 520, { ai: i + 1 }],
  ]),
  [5900, { step: 3 }],
  [5900, { log: '✓ 리포트 생성 완료' }],
  [6300, { finish: true }],
];

const INITIAL: DemoState = {
  logs: [],
  step: 0,
  aiCount: 0,
  score: 0,
  done: false,
};
const FINAL_SCORE = 87;
const COUNT_UP_START = 6300;
const LOOP_MS = 10800;

export function usePipelineDemo(): DemoState {
  const [state, setState] = useState(INITIAL);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const at = (ms: number, fn: () => void) =>
      timers.current.push(setTimeout(fn, ms));

    const apply = (e: DemoEvent) =>
      setState((s) => {
        if ('log' in e)
          return {
            ...s,
            logs: [...s.logs, { text: e.log, tone: e.tone ?? 'ok' }],
          };
        if ('step' in e) return { ...s, step: e.step };
        if ('ai' in e) return { ...s, aiCount: e.ai };
        return { ...s, done: true };
      });

    const run = () => {
      setState(INITIAL);
      SCENARIO.forEach(([ms, e]) => at(ms, () => apply(e)));
      for (let k = 0; k <= 26; k++)
        at(COUNT_UP_START + k * 32, () =>
          setState((s) => ({
            ...s,
            score: Math.round((FINAL_SCORE * k) / 26),
          })),
        );
      at(LOOP_MS, run);
    };

    run();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return state;
}
