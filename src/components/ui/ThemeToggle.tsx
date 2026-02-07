'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import type { UserTheme } from '@/lib/theme'

const THEMES: UserTheme[] = ['light', 'dark', 'system']

const config: Record<
  UserTheme,
  { label: string; icon: typeof Sun; className: string }
> = {
  light: { label: 'Light', icon: Sun, className: 'theme-option-light' },
  dark: { label: 'Dark', icon: Moon, className: 'theme-option-dark' },
  system: { label: 'System', icon: Monitor, className: 'theme-option-system' },
}

export default function ThemeToggle({ compact }: { compact?: boolean }) {
  const { userTheme, setTheme } = useTheme()

  const cycleTheme = () => {
    const idx = THEMES.indexOf(userTheme)
    const next = THEMES[(idx + 1) % THEMES.length]
    setTheme(next)
  }

  if (compact) {
    const { icon: Icon, className } = config[userTheme]
    return (
      <button
        type="button"
        onClick={cycleTheme}
        className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        aria-label={`Theme: ${config[userTheme].label}. Cycle theme.`}
      >
        <span data-theme-option={userTheme} className={className}>
          <Icon size={20} />
        </span>
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
        Theme
      </span>
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={cycleTheme}
          className="flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-left text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
          aria-label="Cycle theme"
        >
          {THEMES.map((value) => {
            const { label, icon: Icon, className } = config[value]
            return (
              <span
                key={value}
                data-theme-option={value}
                className={`${className} flex items-center gap-3 w-full -m-3 p-3 rounded-lg`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="font-medium">{label}</span>
              </span>
            )
          })}
        </button>
      </div>
    </div>
  )
}
