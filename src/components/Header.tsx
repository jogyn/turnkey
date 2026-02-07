import { Link } from '@tanstack/react-router'

import ParaglideLocaleSwitcher from './ui/LocaleSwitcher.tsx'
import ThemeToggle from './ui/ThemeToggle.tsx'

import BetterAuthHeader from '../integrations/better-auth/header-user.tsx'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Home,
  Languages,
  Menu,
  Network,
  Shield,
  SquareFunction,
  StickyNote,
  X,
} from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

  // Shared palette: light = slate-50/100 + slate-900 text; dark = slate-900/800 (sidebar dark as basis)
  const linkBase =
    'flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 text-slate-800 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-800'
  const linkActive =
    'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'

  return (
    <>
      {/* Header: same base as sidebar in both modes; shrink-0 so it stays fixed height in flex layout */}
      <header className="shrink-0 p-4 flex items-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link
            to="/"
            className="text-slate-900 dark:text-white hover:opacity-90 transition-opacity"
          >
            <span>TanStack</span>
            <span className="text-cyan-600 dark:text-cyan-400"> App</span>
          </Link>
        </h1>
      </header>

      {/* Sidebar: dark = slate-900 (basis); light = slate-50 to match header */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white shadow-xl border-r border-slate-200 dark:border-slate-700 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={linkBase}
            activeProps={{ className: `${linkBase} ${linkActive}` }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {/* Demo Links Start */}

          <Link
            to="/demo/start/server-funcs"
            onClick={() => setIsOpen(false)}
            className={linkBase}
            activeProps={{ className: `${linkBase} ${linkActive}` }}
          >
            <SquareFunction size={20} />
            <span className="font-medium">Start - Server Functions</span>
          </Link>

          <Link
            to="/demo/start/api-request"
            onClick={() => setIsOpen(false)}
            className={linkBase}
            activeProps={{ className: `${linkBase} ${linkActive}` }}
          >
            <Network size={20} />
            <span className="font-medium">Start - API Request</span>
          </Link>

          <div className="flex flex-row justify-between">
            <Link
              to="/demo/start/ssr"
              onClick={() => setIsOpen(false)}
              className={`flex-1 ${linkBase}`}
              activeProps={{ className: `flex-1 ${linkBase} ${linkActive}` }}
            >
              <StickyNote size={20} />
              <span className="font-medium">Start - SSR Demos</span>
            </Link>
            <button
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() =>
                setGroupedExpanded((prev) => ({
                  ...prev,
                  StartSSRDemo: !prev.StartSSRDemo,
                }))
              }
            >
              {groupedExpanded.StartSSRDemo ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          </div>
          {groupedExpanded.StartSSRDemo && (
            <div className="flex flex-col ml-4">
              <Link
                to="/demo/start/ssr/spa-mode"
                onClick={() => setIsOpen(false)}
                className={linkBase}
                activeProps={{ className: `${linkBase} ${linkActive}` }}
              >
                <StickyNote size={20} />
                <span className="font-medium">SPA Mode</span>
              </Link>

              <Link
                to="/demo/start/ssr/full-ssr"
                onClick={() => setIsOpen(false)}
                className={linkBase}
                activeProps={{ className: `${linkBase} ${linkActive}` }}
              >
                <StickyNote size={20} />
                <span className="font-medium">Full SSR</span>
              </Link>

              <Link
                to="/demo/start/ssr/data-only"
                onClick={() => setIsOpen(false)}
                className={linkBase}
                activeProps={{ className: `${linkBase} ${linkActive}` }}
              >
                <StickyNote size={20} />
                <span className="font-medium">Data Only</span>
              </Link>
            </div>
          )}

          <Link
            to="/demo/i18n"
            onClick={() => setIsOpen(false)}
            className={linkBase}
            activeProps={{ className: `${linkBase} ${linkActive}` }}
          >
            <Languages size={20} />
            <span className="font-medium">I18n example</span>
          </Link>

          <Link
            to="/demo/protected"
            onClick={() => setIsOpen(false)}
            className={linkBase}
            activeProps={{ className: `${linkBase} ${linkActive}` }}
          >
            <Shield size={20} />
            <span className="font-medium">Protected</span>
          </Link>

          <Link
            to="/demo/better-auth"
            onClick={() => setIsOpen(false)}
            className={linkBase}
            activeProps={{ className: `${linkBase} ${linkActive}` }}
          >
            <Globe size={20} />
            <span className="font-medium">Better Auth</span>
          </Link>

          {/* Demo Links End */}
        </nav>

        {/* Theme/locale container: same dark basis (slate-800); light = slate-100 so it’s distinct */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex flex-col gap-2">
          <ThemeToggle />
          <ParaglideLocaleSwitcher />

          <BetterAuthHeader />
        </div>
      </aside>
    </>
  )
}
