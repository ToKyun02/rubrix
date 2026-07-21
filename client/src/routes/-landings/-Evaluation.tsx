import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/composition-components/Card';
import Container from './-Container';

const CARDS = [
  {
    no: '01',
    title: 'GitHub에서 템플릿으로 시작',
    desc: '레포는 GitHub의 "Use this template"로 직접 만듭니다. Rubrix는 레포를 대신 만들지 않습니다.',
    preview: (
      <>
        <div className="text-text">Use this template ▾</div>
        <div className="text-green mt-1">✓ 내가 만든 레포 · minsu-kang/…</div>
      </>
    ),
  },
  {
    no: '02',
    title: '작업 후 PR 생성',
    desc: '평소처럼 브랜치에서 작업하고 PR을 올리면 자동 감지됩니다.',
    preview: (
      <>
        <div className="text-muted">
          $ git push origin feature/infinite-scroll
        </div>
        <div className="text-text mt-1">→ Pull Request #4 opened</div>
      </>
    ),
  },
  {
    no: '03',
    title: 'GitHub PR 코멘트 & Rubrix 점수',
    desc: 'AI 코멘트는 GitHub PR 라인에, 점수·회차 비교는 Rubrix 리포트에서 확인합니다.',
    preview: (
      <div className="flex items-baseline gap-2">
        <span className="text-heading text-2xl font-extrabold">87</span>
        <span className="text-muted text-[11px]">/100</span>
        <span className="text-red ml-auto text-[10px]">성능 최적화 -3</span>
      </div>
    ),
  },
];

export default function Evaluation() {
  return (
    <section>
      <Container>
        <h2 className="text-heading mb-10 text-[26px] font-extrabold tracking-tight">
          3단계로 끝나는 평가
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {CARDS.map((card) => (
            <Card key={card.no}>
              <CardContent className="p-6">
                <div className="text-blue mb-3.5 text-xs font-bold">
                  {card.no}
                </div>
                <div className="bg-bg border-subtle mb-4 rounded-md border p-3.5 text-[11px]">
                  {card.preview}
                </div>
                <CardTitle className="mb-1.5">{card.title}</CardTitle>
                <CardDescription className="text-[13px]">
                  {card.desc}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
