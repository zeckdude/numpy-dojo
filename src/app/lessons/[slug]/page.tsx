import { notFound } from 'next/navigation';
import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { getExistingWhyIllustrationSrcs } from '@/lib/illustrationPaths';
import { LESSON_PATH_SLUGS, lessonIndexFromSlug } from '@/lib/routes';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return LESSON_PATH_SLUGS.map((slug) => ({ slug }));
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  if (lessonIndexFromSlug(params.slug) === null) notFound();
  const existingWhyIllustrationSrcs = getExistingWhyIllustrationSrcs();
  return (
    <NumPyDojoApp
      key={params.slug}
      route={{ kind: 'lesson', slug: params.slug }}
      existingWhyIllustrationSrcs={existingWhyIllustrationSrcs}
    />
  );
}
