'use client';

import { useEffect } from 'react';

const VV_VAR = '--vv-height';
const MQ = '(max-width: 768px)';

function applyVisualViewportHeight() {
  const vv = window.visualViewport;
  if (!vv) return;
  document.documentElement.style.setProperty(VV_VAR, `${Math.round(vv.height)}px`);
}

function clampMainScroll() {
  const main = document.querySelector('main');
  if (!main) return;
  const max = Math.max(0, main.scrollHeight - main.clientHeight);
  if (main.scrollTop > max) main.scrollTop = max;
}

/**
 * iOS Safari: keep shell height in sync with visualViewport when the keyboard
 * opens/closes, and clamp main scroll so lesson content above sticky tabs stays reachable.
 */
export function MobileViewportShell() {
  useEffect(() => {
    const mq = window.matchMedia(MQ);
    let vvCleanup: (() => void) | undefined;

    const stopVv = () => {
      vvCleanup?.();
      vvCleanup = undefined;
      document.documentElement.style.removeProperty(VV_VAR);
    };

    const startVv = () => {
      stopVv();
      applyVisualViewportHeight();
      clampMainScroll();

      const vv = window.visualViewport;
      const onVv = () => {
        applyVisualViewportHeight();
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
