import Link from '@/atom-components/Link';

export default function NotFound() {
  return (
    <div className="bg-bg flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-muted-2 text-6xl font-extrabold">404</p>
      <h1 className="text-heading text-xl font-extrabold">
        페이지를 찾을 수 없어요
      </h1>
      <p className="text-muted max-w-100 text-[13px]">
        주소가 잘못되었거나, 삭제되었거나, 아직 공개되지 않은 페이지예요.
      </p>
      <Link to="/assignments" size="lg" className="mt-2 px-5">
        과제 탐색으로 돌아가기
      </Link>
    </div>
  );
}
