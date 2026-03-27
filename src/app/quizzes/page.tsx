import type { Metadata } from 'next';
import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { getExistingWhyIllustrationSrcs } from '@/lib/illustrationPaths';
import { defaultOgImages, OG_IMAGE_PATH } from '@/lib/ogDefaultImage';
import { QUIZ_OG_DESCRIPTION, QUIZ_SHARE_TITLE } from '@/lib/shareCopy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: QUIZ_SHARE_TITLE,
  description: QUIZ_OG_DESCRIPTION,
  openGraph: {
    title: QUIZ_SHARE_TITLE,
    description: QUIZ_OG_DESCRIPTION,
    url: '/quizzes',
    type: 'website',
    images: defaultOgImages(),
  },
  twitter: {
    card: 'summary_large_image',
    title: QUIZ_SHARE_TITLE,
    description: QUIZ_OG_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

export default function QuizzesPage() {
  const existingWhyIllustrationSrcs = getExistingWhyIllustrationSrcs();
  return (
    <NumPyDojoApp route={{ kind: 'quiz' }} existingWhyIllustrationSrcs={existingWhyIllustrationSrcs} />
  );
}
