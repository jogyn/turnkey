import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="shrink-0 p-4 flex items-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border-b border-slate-200 dark:border-slate-700">
      <h1 className="text-xl font-semibold">
        <Link
          to="/"
          className="text-slate-900 dark:text-white hover:opacity-90 transition-opacity"
        >
          <span>TanStack</span>
          <span className="text-cyan-600 dark:text-cyan-400"> App</span>
        </Link>
      </h1>
    </header>
  )
}
