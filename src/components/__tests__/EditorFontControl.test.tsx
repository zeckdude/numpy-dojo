import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EditorFontControl } from '../EditorFontControl';

const STORAGE_KEY = 'np_dojo_fs';

describe('EditorFontControl', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.removeProperty('--editor-fs');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.style.removeProperty('--editor-fs');
  });

  it('opens popover, changes size, updates CSS var and localStorage', async () => {
    const user = userEvent.setup();
    render(<EditorFontControl />);

    await user.click(screen.getByTitle('Editor font size'));
    await user.click(screen.getByRole('button', { name: /increase editor font size/i }));

    const fs = document.documentElement.style.getPropertyValue('--editor-fs').trim();
    expect(fs.endsWith('px')).toBe(true);
    const n = parseFloat(fs);
    expect(n).toBeGreaterThan(13.5);

    const stored = parseFloat(localStorage.getItem(STORAGE_KEY) ?? '0');
    expect(stored).toBe(n);
  });
});
