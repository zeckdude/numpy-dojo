/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  readStoredTheme,
  resolveEffectiveTheme,
  saveStoredTheme,
  setDataTheme,
  THEME_STORAGE_KEY,
} from '../theme';

describe('theme', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('readStoredTheme returns null when unset', () => {
    expect(readStoredTheme()).toBeNull();
  });

  it('readStoredTheme reads light/dark', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(readStoredTheme()).toBe('light');
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(readStoredTheme()).toBe('dark');
  });

  it('migrates legacy system value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'system');
    expect(readStoredTheme()).toBeNull();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('resolveEffectiveTheme uses matchMedia when stored null', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    expect(resolveEffectiveTheme(null)).toBe('light');
  });

  it('saveStoredTheme persists', () => {
    saveStoredTheme('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('setDataTheme sets data-theme', () => {
    setDataTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
