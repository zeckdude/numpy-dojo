import type { Metadata } from 'next';
import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { getExistingWhyIllustrationSrcs } from '@/lib/illustrationPaths';
import { defaultOgImages } from '@/lib/ogDefaultImage';

export const dynamic = 'force-dynamic';

/**
 * Homepage `og:url` + canonical. Child `openGraph` replaces the layout’s entire openGraph in Next.js
 * (no deep merge), so we must repeat `images` here or crawlers lose `og:image` / dimensions.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/', images: defaultOgImages() },
};

export default function HomePage() {
  const existingWhyIllustrationSrcs = getExistingWhyIllustrationSrcs();
  return (
    <NumPyDojoApp route={{ kind: 'dashboard' }} existingWhyIllustrationSrcs={existingWhyIllustrationSrcs} />
  );
}
