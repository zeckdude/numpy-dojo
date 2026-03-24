'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { scenarios } from '@/data/scenarios';
import { loadJSON } from '@/lib/storage';

export default function ScenariosIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const done = new Set(loadJSON<string[]>('np_dojo_scenarios', []));
    let idx = scenarios.length - 1;
    for (let i = 0; i < scenarios.length; i++) {
      if (!done.has(scenarios[i].id)) {
        idx = i;
        break;
      }
    }
    router.replace('/scenarios/' + scenarios[idx].id);
  }, [router]);

  return <div className="app app--dashboard" />;
}
