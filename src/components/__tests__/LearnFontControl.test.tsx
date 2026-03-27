import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LearnFontControl } from '../LearnFontControl';

const STORAGE_KEY = 'np_dojo_learn_fs';

describe('LearnFontControl', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.removeProperty('--learn-fs');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.style.removeProperty('--learn-fs');
  });

  it('opens popover, changes size, updates CSS var and localStorage', async () => {
    const user = userEvent.setup();
    render(<LearnFontControl />);

    await user.click(screen.getByTitle('Content font size'));
    await user.click(screen.getByRole('button', { name: /increase font size/i }));

    const fs = document.documentElement.style.getPropertyValue('--learn-fs').trim();
    expect(fs.endsWith('px')).toBe(true);
    const n = parseFloat(fs);
    expect(n).toBeGreaterThan(14);

    const stored = parseFloat(localStorage.getItem(STORAGE_KEY) ?? '0');
    expect(stored).toBe(n);
  });
});
