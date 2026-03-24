import { notFound } from 'next/navigation';
import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { SCENARIO_PATH_IDS, scenarioIndexFromId } from '@/lib/routes';

export function generateStaticParams() {
  return SCENARIO_PATH_IDS.map((id) => ({ id }));
}

export default function ScenarioPage({ params }: { params: { id: string } }) {
  if (scenarioIndexFromId(params.id) === null) notFound();
  return <NumPyDojoApp key={params.id} route={{ kind: 'scenario', id: params.id }} />;
}
