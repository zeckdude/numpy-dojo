import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { scenarios } from '@/data/scenarios';
import { getExistingWhyIllustrationSrcs } from '@/lib/illustrationPaths';
import { htmlToPlainText } from '@/lib/htmlPlainText';
import { SCENARIO_PATH_IDS, scenarioIndexFromId } from '@/lib/routes';
import { defaultOgImages, defaultTwitterImages } from '@/lib/ogDefaultImage';
import { scenarioOgDescription, scenarioShareTitle } from '@/lib/shareCopy';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return SCENARIO_PATH_IDS.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const idx = scenarioIndexFromId(id);
  if (idx === null) return {};
  const scenario = scenarios[idx];
  const title = scenarioShareTitle(scenario.title);
  const description = scenarioOgDescription(scenario.title, htmlToPlainText(scenario.context));
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/scenarios/${id}`,
      type: 'article',
      images: defaultOgImages(),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: defaultTwitterImages(),
    },
  };
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
