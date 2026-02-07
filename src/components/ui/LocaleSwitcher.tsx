'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Languages } from 'lucide-react'
import { getLocale, locales, setLocale } from '@/paraglide/runtime'
import { m } from '@/paraglide/messages'

const GAP = 4

/** Side the sidebar is on; popover opens toward the page (away from sidebar). */
type SidebarSide = 'left' | 'right'

export default function ParaglideLocaleSwitcher({
  compact,
  sidebarSide = 'left',
}: { compact?: boolean; sidebarSide?: SidebarSide } = {}) {
  const currentLocale = getLocale()
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const anchorRight = sidebarSide === 'left'

  useEffect(() => {
    if (!open || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const top = compact ? rect.top + rect.height / 2 : rect.top
    const left = anchorRight ? rect.right + GAP : rect.left - GAP
    setPosition({ top, left })
  }, [open, compact, anchorRight])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target)) return
      if (containerRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleSelect = (locale: string) => {
    setLocale(locale)
    setOpen(false)
  }

  const menuContent = open && position && (
    <div
      ref={containerRef}
      className="fixed py-1 min-w-[6rem] rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-lg z-[100]"
      role="menu"
      style={{
        ...(anchorRight
          ? { left: position.left }
          : { right: typeof window !== 'undefined' ? window.innerWidth - position.left : 0 }),
        top: position.top,
        transform: compact ? 'translateY(-50%)' : undefined,
      }}
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          role="menuitem"
          onClick={() => handleSelect(locale)}
          className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg ${
            locale === currentLocale
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )

  if (compact) {
    return (
      <>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label={m.language_label()}
          aria-expanded={open}
          aria-haspopup="true"
          title={`${m.language_label()}: ${currentLocale}`}
        >
          <Languages size={20} />
        </button>
        {menuContent && createPortal(menuContent, document.body)}
      </>
    )
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-2 w-full px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left"
        aria-label={m.language_label()}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {m.language_label()}
        </span>
        <span className="text-sm font-medium truncate">
          {currentLocale.toUpperCase()}
        </span>
        <Languages size={16} className="shrink-0 opacity-70" />
      </button>
      {menuContent && createPortal(menuContent, document.body)}
    </>
  )
}
