/**
 * Theme utilities for TanStack Start: UserTheme (choice) vs AppTheme (resolved).
 * Safe for SSR; use inline script in <head> to avoid FOUC (see __root.tsx).
 */

export type UserTheme = 'light' | 'dark' | 'system'
export type AppTheme = Exclude<UserTheme, 'system'>

const THEME_STORAGE_KEY = 'theme'
const USER_THEMES: UserTheme[] = ['light', 'dark', 'system']

function isValidUserTheme(value: string | null): value is UserTheme {
  return value !== null && USER_THEMES.includes(value as UserTheme)
}

/** Safe for SSR: returns 'system' on server; validates localStorage on client. */
export function getStoredUserTheme(): UserTheme {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isValidUserTheme(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

/** No-op on server; persists user choice on client. */
export function setStoredTheme(theme: UserTheme): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // ignore
  }
}

/** Resolves OS preference; returns 'light' on server. */
export function getSystemTheme(): AppTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * Applies theme to document: sets .light / .dark and optionally .system on <html>
 * so Tailwind dark variant and CSS-driven toggle work.
 */
export function applyThemeToDom(userTheme: UserTheme): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.remove('light', 'dark', 'system')
  const appTheme: AppTheme =
    userTheme === 'system' ? getSystemTheme() : userTheme
  root.classList.add(appTheme)
  if (userTheme === 'system') root.classList.add('system')
}

/**
 * Inline script for <head>: runs before first paint to avoid theme flash.
 * Must stay in sync with getStoredUserTheme / getSystemTheme / applyThemeToDom.
 */
export const THEME_SCRIPT = `(function(){
  var key = 'theme';
  var theme = localStorage.getItem(key);
  if (theme !== 'light' && theme !== 'dark' && theme !== 'system') theme = 'system';
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var resolved = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
  var root = document.documentElement;
  root.classList.remove('light','dark','system');
  root.classList.add(resolved);
  if (theme === 'system') root.classList.add('system');
})();`
