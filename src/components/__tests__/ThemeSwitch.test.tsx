import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeSwitch } from '../ThemeSwitch';
import { THEME_STORAGE_KEY } from '../../lib/theme';
import { stubMatchMedia } from '../../test/matchMedia';

vi.mock('../../lib/analytics', () => ({
  track: vi.fn(),
}));

describe('ThemeSwitch', () => {
  let restoreMq: () => void;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    restoreMq = stubMatchMedia((q) => q.includes('prefers-color-scheme: light') && false);
  });

  afterEach(() => {
    restoreMq();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('opens menu and sets light theme on document and localStorage', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch />);

    await user.click(screen.getByRole('button', { name: /color theme/i }));
    await user.click(screen.getByRole('menuitem', { name: /light/i }));

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('opens menu and sets dark theme', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch />);

    await user.click(screen.getByRole('button', { name: /color theme/i }));
    await user.click(screen.getByRole('menuitem', { name: /dark/i }));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });
});
