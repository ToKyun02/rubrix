import { Card, CardContent } from '@/composition-components/Card';
import { cn } from '@/utils/cn';
import Container from './-Container';

const TIERS = [
  {
    name: '브론즈',
    level: '기초 문법 · 단일 기능',
    desc: '정해진 명세를 따라 CRUD 한 화면을 완성할 수 있는 수준. 기본 문법과 API 호출이 가능합니다.',
    border: 'border-t-tier-bronze',
    dot: 'bg-tier-bronze',
    text: 'text-tier-bronze',
  },
  {
    name: '실버',
    level: '모듈 분리 · 기본 상태 관리',
    desc: '컴포넌트를 분리하고 로딩·에러 상태를 스스로 챙기는 수준. 간단한 전역 상태를 다룹니다.',
    border: 'border-t-tier-silver',
    dot: 'bg-tier-silver',
    text: 'text-tier-silver',
  },
  {
    name: '골드',
    level: '실무 주니어',
    desc: '서버 상태 관리와 캐싱, 성능을 고려한 설계가 가능한 수준. 엣지 케이스를 먼저 찾아 처리합니다.',
    border: 'border-t-tier-gold',
    dot: 'bg-tier-gold',
    text: 'text-tier-gold',
  },
  {
    name: '플래티넘',
    level: '시스템 설계',
    desc: '실시간 통신, 장애 대응 등 시스템 간 상호작용을 설계하는 수준. 복잡한 도메인을 모델링합니다.',
    border: 'border-t-tier-platinum',
    dot: 'bg-tier-platinum',
    text: 'text-tier-platinum',
  },
  {
    name: '다이아몬드',
    level: '아키텍처 리드',
    desc: '멱등성·확장성·트레이드오프를 근거로 설계를 설명하는 수준. 조직의 기술 방향을 이끕니다.',
    border: 'border-t-tier-diamond',
    dot: 'bg-tier-diamond',
    text: 'text-tier-diamond',
  },
];

export default function Tiers() {
  return (
    <section>
      <Container>
        <h2 className="text-heading mb-2 text-[26px] font-extrabold tracking-tight">
          티어로 보는 난이도
        </h2>
        <p className="text-muted mb-9 text-[14.5px]">
          모든 과제는 5개 티어로 분류됩니다. 지금 내 수준에 맞는 과제부터
          시작하세요.
        </p>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {TIERS.map((tier) => (
            <Card key={tier.name} className={cn('border-t-[3px]', tier.border)}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2.25">
                  <span
                    className={cn(
                      'size-2.75 flex-none rotate-45 rounded-xs',
                      tier.dot,
                    )}
                  />
                  <span className={cn('text-[15px] font-extrabold', tier.text)}>
                    {tier.name}
                  </span>
                </div>
                <div className="text-heading mb-1.5 text-[12.5px] font-bold">
                  {tier.level}
                </div>
                <div className="text-muted text-xs leading-relaxed">
                  {tier.desc}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
