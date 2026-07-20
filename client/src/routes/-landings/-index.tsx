import { cn } from '@/utils/cn';
import Container from './-Container';
import Hero from './-Hero';

export default function Landings() {
  return (
    <div
      className={cn(
        'divide-border divide-y',
        '[&>section]:py-10 [&>section]:md:py-16',
      )}
    >
      <Hero />
      <section>
        <Container>1</Container>
      </section>
    </div>
  );
}
