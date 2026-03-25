import { NumPyDojoApp } from '@/components/NumPyDojoApp';
import { getExistingWhyIllustrationSrcs } from '@/lib/illustrationPaths';

export const dynamic = 'force-dynamic';

export default function QuizzesPage() {
  const existingWhyIllustrationSrcs = getExistingWhyIllustrationSrcs();
  return (
    <NumPyDojoApp route={{ kind: 'quiz' }} existingWhyIllustrationSrcs={existingWhyIllustrationSrcs} />
  );
}
