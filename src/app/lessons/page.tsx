import type { Metadata } from 'next';
import { defaultOgImages, defaultTwitterImages } from '@/lib/ogDefaultImage';
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
    images: defaultTwitterImages(),
  },
};

export default function LessonsIndexPage() {
  return <LessonsIndexRedirect />;
}
