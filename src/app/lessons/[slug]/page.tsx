import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { lessons } from '@/data/lessons';
import { getExistingWhyIllustrationSrcs } from '@/lib/illustrationPaths';
import { LESSON_PATH_SLUGS, lessonIndexFromSlug } from '@/lib/routes';
import { defaultOgImages, defaultTwitterImages } from '@/lib/ogDefaultImage';
import { lessonOgDescription, lessonShareTitle } from '@/lib/shareCopy';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return LESSON_PATH_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const idx = lessonIndexFromSlug(slug);
  if (idx === null) return {};
  const lesson = lessons[idx];
  const title = lessonShareTitle(lesson.title);
  const description = lessonOgDescription(lesson.title);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/lessons/${slug}`,
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
