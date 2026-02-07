import { createFileRoute } from '@tanstack/react-router'
import logo from '../logo.svg'
import { m } from '@/paraglide/messages'
import LocaleSwitcher from '../components/ui/LocaleSwitcher'
import { ScrollableContent } from '../components/ScrollableContent'

export const Route = createFileRoute('/demo/i18n')({
  component: App,
})

function App() {
  return (
    <ScrollableContent>
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-center">
      <header className="flex flex-col items-center justify-center gap-4 text-[calc(10px+2vmin)]">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <p className="text-slate-900 dark:text-white">
          {m.example_message({ username: 'TanStack Router' })}
        </p>
        <a
          className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
          href="https://inlang.com/m/gerre34r/library-inlang-paraglideJs"
          target="_blank"
          rel="noopener noreferrer"
        >
          {m.learn_router()}
        </a>
        <div className="mt-3">
          <LocaleSwitcher />
        </div>
      </header>
    </div>
    </ScrollableContent>
  )
}
