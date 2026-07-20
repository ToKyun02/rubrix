import { cn } from '@/utils/cn';
import Evaluation from './-Evaluation';
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
      <Evaluation />
    </div>
  );
}
