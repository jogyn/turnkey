'use client'

import { useEffect, useRef, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

const THEME_KEY = 'theme'
type Theme = 'light' | 'dark' | 'system'

function getStoredTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'system'
  const t = localStorage.getItem(THEME_KEY)
  if (t === 'light' || t === 'dark' || t === 'system') return t
  return 'system'
}

function prefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const useDark = theme === 'dark' || (theme === 'system' && prefersDark())
  if (useDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const isInitialMount = useRef(true)

  // Sync state from localStorage after mount
  useEffect(() => {
    setTheme(getStoredTheme())
  }, [])

  // Apply theme and persist (skip first run so we don't overwrite script)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    localStorage.setItem(THEME_KEY, theme)
    applyTheme(theme)
  }, [theme])

  // When theme is 'system', react to OS preference changes
  useEffect(() => {
    if (theme !== 'system') return
    const m = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    m.addEventListener('change', handler)
    return () => m.removeEventListener('change', handler)
  }, [theme])

  const options: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="flex flex-col gap-1">
      <span className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
        Theme
      </span>
      <div className="flex flex-col gap-0.5">
        {options.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-left ${
              theme === value
                ? 'bg-gray-700 text-white'
                : 'hover:bg-gray-800 text-gray-200'
            }`}
            aria-label={`Use ${label} theme`}
            aria-pressed={theme === value}
          >
            <Icon size={20} className="shrink-0" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
