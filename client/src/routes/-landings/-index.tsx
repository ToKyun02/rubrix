import { cn } from '@/utils/cn';
import Evaluation from './-Evaluation';
import Footer from './-Footer';
import Hero from './-Hero';
import Result from './-Result';
import Tiers from './-Tiers';

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
      <Result />
      <Tiers />
      <Footer />
    </div>
  );
}
