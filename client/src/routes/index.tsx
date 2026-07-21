import { createFileRoute } from '@tanstack/react-router';
import Landings from './-landings/-index';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return <Landings />;
}
