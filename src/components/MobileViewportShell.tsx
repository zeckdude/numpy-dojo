'use client';

import { useEffect } from 'react';

const MQ = '(max-width: 768px)';

function clampMainScroll() {
  const main = document.querySelector('main');
  if (!main) return;
  const max = Math.max(0, main.scrollHeight - main.clientHeight);
  if (main.scrollTop > max) main.scrollTop = max;
}

/**
 * iOS Safari: after the keyboard opens/closes, clamp `main` scroll so content above
 * sticky tabs stays reachable. (We avoid locking body height to visualViewport — that
 * interacted badly with code-pane min-heights and left a blank editor region.)
 */
export function MobileViewportShell() {
  useEffect(() => {
    const mq = window.matchMedia(MQ);
    let vvCleanup: (() => void) | undefined;

    const stopVv = () => {
      vvCleanup?.();
      vvCleanup = undefined;
    };

    const startVv = () => {
      stopVv();
      clampMainScroll();

      const vv = window.visualViewport;
      const onVv = () => {
        requestAnimationFrame(clampMainScroll);
      };

      vv?.addEventListener('resize', onVv);
      vv?.addEventListener('scroll', onVv);
      window.addEventListener('orientationchange', onVv);

      vvCleanup = () => {
        vv?.removeEventListener('resize', onVv);
        vv?.removeEventListener('scroll', onVv);
        window.removeEventListener('orientationchange', onVv);
      };
    };

    const sync = () => {
      if (mq.matches) startVv();
      else stopVv();
    };

    sync();
    mq.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      stopVv();
    };
  }, []);

  return null;
}
