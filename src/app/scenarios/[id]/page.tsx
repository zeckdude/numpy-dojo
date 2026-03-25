import { notFound } from 'next/navigation';
import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { getExistingWhyIllustrationSrcs } from '@/lib/illustrationPaths';
import { SCENARIO_PATH_IDS, scenarioIndexFromId } from '@/lib/routes';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return SCENARIO_PATH_IDS.map((id) => ({ id }));
}

export default function ScenarioPage({ params }: { params: { id: string } }) {
  if (scenarioIndexFromId(params.id) === null) notFound();
  const existingWhyIllustrationSrcs = getExistingWhyIllustrationSrcs();
  return (
    <NumPyDojoApp
      route={{ kind: 'scenario', id: params.id }}
      existingWhyIllustrationSrcs={existingWhyIllustrationSrcs}
    />
  );
}
