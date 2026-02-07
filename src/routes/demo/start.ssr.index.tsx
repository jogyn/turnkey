import { createFileRoute, Link } from '@tanstack/react-router'
import { ScrollableContent } from '@/components/ScrollableContent'

export const Route = createFileRoute('/demo/start/ssr/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ScrollableContent>
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-2xl p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/80 dark:ring-slate-700/80 overflow-hidden">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-green-400 bg-clip-text text-transparent">
          SSR Demos
        </h1>
        <div className="flex flex-col gap-4">
          <Link
            to="/demo/start/ssr/spa-mode"
            className="text-2xl font-bold py-6 px-8 rounded-xl text-center shadow-lg transform transition-all hover:scale-[1.02] border-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white border-pink-500/50 dark:border-pink-400"
          >
            SPA Mode
          </Link>
          <Link
            to="/demo/start/ssr/full-ssr"
            className="text-2xl font-bold py-6 px-8 rounded-xl text-center shadow-lg transform transition-all hover:scale-[1.02] border-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white border-purple-500/50 dark:border-purple-400"
          >
            Full SSR
          </Link>
          <Link
            to="/demo/start/ssr/data-only"
            className="text-2xl font-bold py-6 px-8 rounded-xl text-center shadow-lg transform transition-all hover:scale-[1.02] border-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-green-500/50 dark:border-green-400"
          >
            Data Only
          </Link>
        </div>
      </div>
    </div>
    </ScrollableContent>
  )
}
