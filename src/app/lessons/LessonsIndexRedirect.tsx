'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { lessons } from '@/data/lessons';
import { loadSet } from '@/lib/storage';
import { lessonSlugAt } from '@/lib/routes';

export function LessonsIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    const completed = loadSet('np_dojo');
    let idx = lessons.length - 1;
    for (let i = 0; i < lessons.length; i++) {
      if (!completed.has(i)) {
        idx = i;
        break;
      }
    }
    router.replace('/lessons/' + lessonSlugAt(idx));
  }, [router]);

  return <div className="app app--dashboard" />;
}
