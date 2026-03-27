import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SplitPanes } from '../SplitPanes';
import { stubMatchMedia } from '../../test/matchMedia';

const STORAGE_KEY = 'np_dojo_split_pct';

describe('SplitPanes', () => {
  let restoreMq: () => void;

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    restoreMq = stubMatchMedia((q) => q.includes('min-width: 769px'));
  });

  afterEach(() => {
    restoreMq();
    localStorage.removeItem(STORAGE_KEY);
  });

  it('moves split with keyboard and persists percentage', async () => {
    const user = userEvent.setup();
    render(
      <SplitPanes
        left={<div>Learn panel</div>}
        right={<div>Code panel</div>}
      />
    );

    const gutter = screen.getByRole('separator', { name: /resize lesson and code/i });
    gutter.focus();
    await user.keyboard('{ArrowRight}');

    const pct = parseFloat(localStorage.getItem(STORAGE_KEY) ?? '0');
    expect(pct).toBeGreaterThan(50);
    expect(gutter.getAttribute('aria-valuenow')).toBe(String(Math.round(pct)));
  });
});
