import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { getExistingWhyIllustrationSrcs } from '@/lib/illustrationPaths';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const existingWhyIllustrationSrcs = getExistingWhyIllustrationSrcs();
  return (
    <NumPyDojoApp route={{ kind: 'dashboard' }} existingWhyIllustrationSrcs={existingWhyIllustrationSrcs} />
  );
}
