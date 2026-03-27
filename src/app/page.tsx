import type { Metadata } from 'next';
import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { getExistingWhyIllustrationSrcs } from '@/lib/illustrationPaths';

export const dynamic = 'force-dynamic';

/** Homepage `og:url` + canonical help LinkedIn/Facebook match the right URL. Images come from root layout. */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
};

export default function HomePage() {
  const existingWhyIllustrationSrcs = getExistingWhyIllustrationSrcs();
  return (
    <NumPyDojoApp route={{ kind: 'dashboard' }} existingWhyIllustrationSrcs={existingWhyIllustrationSrcs} />
  );
}
