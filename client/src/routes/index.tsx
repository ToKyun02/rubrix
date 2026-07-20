import { Button } from '@/components/ui/Button';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="primary">primary</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="tertiary" disabled>
        tertinary
      </Button>
      <Button variant="ghost" disabled>
        ghost
      </Button>
    </div>
  );
}
