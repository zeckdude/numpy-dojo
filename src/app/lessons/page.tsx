import type { Metadata } from 'next';
import { defaultOgImages, OG_IMAGE_PATH } from '@/lib/ogDefaultImage';
import { LESSONS_INDEX_DESCRIPTION, LESSONS_INDEX_TITLE } from '@/lib/shareCopy';
import { LessonsIndexRedirect } from './LessonsIndexRedirect';

export const metadata: Metadata = {
  title: LESSONS_INDEX_TITLE,
  description: LESSONS_INDEX_DESCRIPTION,
  openGraph: {
    title: LESSONS_INDEX_TITLE,
    description: LESSONS_INDEX_DESCRIPTION,
    url: '/lessons',
    type: 'website',
    images: defaultOgImages(),
  },
  twitter: {
    card: 'summary_large_image',
    title: LESSONS_INDEX_TITLE,
    description: LESSONS_INDEX_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

export default function LessonsIndexPage() {
  return <LessonsIndexRedirect />;
}
