import { notFound } from 'next/navigation';
import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { getExistingWhyIllustrationSrcs } from '@/lib/illustrationPaths';
import { SCENARIO_PATH_IDS, scenarioIndexFromId } from '@/lib/routes';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return SCENARIO_PATH_IDS.map((id) => ({ id }));
}

export default async function ScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (scenarioIndexFromId(id) === null) notFound();
  const existingWhyIllustrationSrcs = getExistingWhyIllustrationSrcs();
  return (
    <NumPyDojoApp
      route={{ kind: 'scenario', id }}
      existingWhyIllustrationSrcs={existingWhyIllustrationSrcs}
    />
  );
}
