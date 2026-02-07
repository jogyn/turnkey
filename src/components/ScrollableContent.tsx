import type { ReactNode } from 'react'

/**
 * Wraps content in a region that fills the main area and scrolls when content overflows.
 * Use in the root layout for "all pages scroll under the header", or in a layout route
 * / individual page for per-route or per-page control.
 */
export function ScrollableContent({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 min-h-0 min-w-0 overflow-auto" role="main">
      {children}
    </main>
  )
}
