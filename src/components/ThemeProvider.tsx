'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  applyThemeToDom,
  getStoredUserTheme,
  getSystemTheme,
  setStoredTheme,
  type AppTheme,
  type UserTheme,
} from '@/lib/theme'

type ThemeContextValue = {
  userTheme: UserTheme
  appTheme: AppTheme
  setTheme: (theme: UserTheme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [userTheme, setUserTheme] = useState<UserTheme>('system')

  // Sync from storage after mount so SSR and client share same initial state (no hydration mismatch)
  useEffect(() => {
    setUserTheme(getStoredUserTheme())
  }, [])

  const appTheme: AppTheme =
    userTheme === 'system' ? getSystemTheme() : userTheme

  const setTheme = useCallback((newTheme: UserTheme) => {
    setUserTheme(newTheme)
    setStoredTheme(newTheme)
    applyThemeToDom(newTheme)
  }, [])

  // When userTheme is 'system', react to OS preference changes
  useEffect(() => {
    if (userTheme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyThemeToDom('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [userTheme])

  return (
    <ThemeContext.Provider
      value={{ userTheme, appTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (ctx === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
