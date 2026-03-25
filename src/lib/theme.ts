export const THEME_STORAGE_KEY = 'np_dojo_theme';

/** Saved only after the user picks Light or Dark; `null` = follow OS. */
export type StoredTheme = 'light' | 'dark';

export function readStoredTheme(): StoredTheme | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === 'light' || v === 'dark') return v;
    if (v === 'system') {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function saveStoredTheme(theme: StoredTheme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function resolveEffectiveTheme(stored: StoredTheme | null): 'light' | 'dark' {
  if (stored) return stored;
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function setDataTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
}
