import { notFound } from 'next/navigation';
import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { LESSON_PATH_SLUGS, lessonIndexFromSlug } from '@/lib/routes';

export function generateStaticParams() {
  return LESSON_PATH_SLUGS.map((slug) => ({ slug }));
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  if (lessonIndexFromSlug(params.slug) === null) notFound();
  return <NumPyDojoApp key={params.slug} route={{ kind: 'lesson', slug: params.slug }} />;
}
