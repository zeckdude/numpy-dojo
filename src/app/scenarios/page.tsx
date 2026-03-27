import type { Metadata } from 'next';
import { defaultOgImages, OG_IMAGE_PATH } from '@/lib/ogDefaultImage';
import { SCENARIOS_INDEX_DESCRIPTION, SCENARIOS_INDEX_TITLE } from '@/lib/shareCopy';
import { ScenariosIndexRedirect } from './ScenariosIndexRedirect';

export const metadata: Metadata = {
  title: SCENARIOS_INDEX_TITLE,
  description: SCENARIOS_INDEX_DESCRIPTION,
  openGraph: {
    title: SCENARIOS_INDEX_TITLE,
    description: SCENARIOS_INDEX_DESCRIPTION,
    url: '/scenarios',
    type: 'website',
    images: defaultOgImages(),
  },
  twitter: {
    card: 'summary_large_image',
    title: SCENARIOS_INDEX_TITLE,
    description: SCENARIOS_INDEX_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

export default function ScenariosIndexPage() {
  return <ScenariosIndexRedirect />;
}
