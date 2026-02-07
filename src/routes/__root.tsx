import {
  HeadContent,
  ScriptOnce,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/ui/Header'
import Sidebar from '../components/ui/Sidebar'
import { ThemeProvider } from '../components/ThemeProvider'
import { SidebarProvider } from '../components/SidebarProvider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { getLocale } from '@/paraglide/runtime'
import { THEME_SCRIPT } from '@/lib/theme'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    // Other redirect strategies are possible; see
    // https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }
  },

  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Theme script: emitted once during SSR, runs before hydration to avoid FOUC. ScriptOnce appends ;document.currentScript.remove() */}
        <ScriptOnce>{THEME_SCRIPT}</ScriptOnce>
        <ThemeProvider>
          <div className="flex-1 min-h-0 flex flex-col min-w-0">
            <SidebarProvider>
              <Header />
              <div className="flex-1 min-h-0 flex min-w-0">
                <Sidebar />
                <div className="flex-1 min-h-0 flex flex-col min-w-0">
                  {children}
                </div>
              </div>
            </SidebarProvider>
          </div>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
        </ThemeProvider>
      </body>
    </html>
  )
}
