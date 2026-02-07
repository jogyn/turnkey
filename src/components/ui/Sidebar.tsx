import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  Home,
  Languages,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
  SquareFunction,
  StickyNote,
} from 'lucide-react'

import ParaglideLocaleSwitcher from './LocaleSwitcher'
import ThemeToggle from './ThemeToggle'
import BetterAuthHeader from '../../integrations/better-auth/header-user'
import { useSidebar } from '../SidebarProvider'

const linkBase =
  'flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 text-slate-800 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-800'
const linkActive =
  'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'

export default function Sidebar() {
  const { isMini, toggle } = useSidebar()
  const [groupedExpanded, setGroupedExpanded] = useState<Record<string, boolean>>({})

  const widthClass = isMini ? 'w-16' : 'w-64'

  return (
    <aside
      className={`shrink-0 flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700 transition-[width] duration-200 ease-out overflow-hidden ${widthClass}`}
      aria-label="Main navigation"
    >
      {/* Toggle: top of sidebar */}
      <div className="shrink-0 flex items-center justify-end p-3 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={toggle}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          aria-label={isMini ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isMini ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isMini ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>

      <nav className="flex-1 p-2 overflow-y-auto overflow-x-hidden min-h-0">
        <Link
          to="/"
          className={linkBase}
          activeProps={{ className: `${linkBase} ${linkActive}` }}
          title="Home"
        >
          <Home size={20} className="shrink-0" />
          {!isMini && <span className="font-medium truncate">Home</span>}
        </Link>

        <Link
          to="/demo/start/server-funcs"
          className={linkBase}
          activeProps={{ className: `${linkBase} ${linkActive}` }}
          title="Start - Server Functions"
        >
          <SquareFunction size={20} className="shrink-0" />
          {!isMini && <span className="font-medium truncate">Server Functions</span>}
        </Link>

        <Link
          to="/demo/start/api-request"
          className={linkBase}
          activeProps={{ className: `${linkBase} ${linkActive}` }}
          title="Start - API Request"
        >
          <Network size={20} className="shrink-0" />
          {!isMini && <span className="font-medium truncate">API Request</span>}
        </Link>

        {/* SSR group */}
        {!isMini ? (
          <>
            <div className="flex flex-row justify-between items-center mb-2">
              <Link
                to="/demo/start/ssr"
                className={`flex-1 min-w-0 ${linkBase}`}
                activeProps={{ className: `flex-1 ${linkBase} ${linkActive}` }}
              >
                <StickyNote size={20} className="shrink-0" />
                <span className="font-medium truncate">SSR Demos</span>
              </Link>
              <button
                type="button"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
                onClick={() =>
                  setGroupedExpanded((prev) => ({
                    ...prev,
                    StartSSRDemo: !prev.StartSSRDemo,
                  }))
                }
                aria-expanded={groupedExpanded.StartSSRDemo}
              >
                {groupedExpanded.StartSSRDemo ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>
            </div>
            {groupedExpanded.StartSSRDemo && (
              <div className="flex flex-col ml-2">
                <Link
                  to="/demo/start/ssr/spa-mode"
                  className={linkBase}
                  activeProps={{ className: `${linkBase} ${linkActive}` }}
                >
                  <StickyNote size={18} className="shrink-0" />
                  <span className="font-medium truncate">SPA Mode</span>
                </Link>
                <Link
                  to="/demo/start/ssr/full-ssr"
                  className={linkBase}
                  activeProps={{ className: `${linkBase} ${linkActive}` }}
                >
                  <StickyNote size={18} className="shrink-0" />
                  <span className="font-medium truncate">Full SSR</span>
                </Link>
                <Link
                  to="/demo/start/ssr/data-only"
                  className={linkBase}
                  activeProps={{ className: `${linkBase} ${linkActive}` }}
                >
                  <StickyNote size={18} className="shrink-0" />
                  <span className="font-medium truncate">Data Only</span>
                </Link>
              </div>
            )}
          </>
        ) : (
          <Link
            to="/demo/start/ssr"
            className={linkBase}
            activeProps={{ className: `${linkBase} ${linkActive}` }}
            title="SSR Demos"
          >
            <StickyNote size={20} className="shrink-0" />
          </Link>
        )}

        <Link
          to="/demo/i18n"
          className={linkBase}
          activeProps={{ className: `${linkBase} ${linkActive}` }}
          title="I18n example"
        >
          <Languages size={20} className="shrink-0" />
          {!isMini && <span className="font-medium truncate">I18n</span>}
        </Link>

        <Link
          to="/demo/protected"
          className={linkBase}
          activeProps={{ className: `${linkBase} ${linkActive}` }}
          title="Protected"
        >
          <Shield size={20} className="shrink-0" />
          {!isMini && <span className="font-medium truncate">Protected</span>}
        </Link>

        <Link
          to="/demo/better-auth"
          className={linkBase}
          activeProps={{ className: `${linkBase} ${linkActive}` }}
          title="Better Auth"
        >
          <Globe size={20} className="shrink-0" />
          {!isMini && <span className="font-medium truncate">Better Auth</span>}
        </Link>
      </nav>

      {/* Theme, locale, auth — compact in mini mode */}
      <div
        className={`shrink-0 border-t border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex flex-col gap-2 ${isMini ? 'p-2 items-center' : 'p-3'}`}
      >
        {isMini ? (
          <>
            <ThemeToggle compact />
            <ParaglideLocaleSwitcher compact />
            <BetterAuthHeader compact />
          </>
        ) : (
          <>
            <ThemeToggle />
            <ParaglideLocaleSwitcher />
            <BetterAuthHeader />
          </>
        )}
      </div>
    </aside>
  )
}
