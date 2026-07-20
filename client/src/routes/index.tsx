import { createFileRoute } from '@tanstack/react-router';
import Landings from './-landings/-index';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto max-w-360 px-10 pt-2">
      <Landings />
    </div>
  );
}
