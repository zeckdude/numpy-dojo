import { notFound } from 'next/navigation';
import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { getExistingWhyIllustrationSrcs } from '@/lib/illustrationPaths';
import { LESSON_PATH_SLUGS, lessonIndexFromSlug } from '@/lib/routes';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return LESSON_PATH_SLUGS.map((slug) => ({ slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (lessonIndexFromSlug(slug) === null) notFound();
  const existingWhyIllustrationSrcs = getExistingWhyIllustrationSrcs();
  return (
    <NumPyDojoApp
      route={{ kind: 'lesson', slug }}
      existingWhyIllustrationSrcs={existingWhyIllustrationSrcs}
    />
  );
}
