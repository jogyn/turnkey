import { authClient } from '@/lib/auth-client'
import { Link } from '@tanstack/react-router'

export default function BetterAuthHeader({ compact }: { compact?: boolean } = {}) {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
    )
  }

  if (session?.user) {
    if (compact) {
      return (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => authClient.signOut()}
            className="rounded-lg shrink-0 hover:opacity-90 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800"
            title="Sign out"
          >
            {session.user.image ? (
              <img
                src={session.user.image}
                alt=""
                className="h-8 w-8 rounded-lg"
              />
            ) : (
              <span className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                {session.user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </button>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-2">
        {session.user.image ? (
          <img src={session.user.image} alt="" className="h-8 w-8 rounded-lg" />
        ) : (
          <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {session.user.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <button
          onClick={() => authClient.signOut()}
          className="flex-1 h-9 px-4 text-sm font-medium rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
        >
          Sign out
        </button>
      </div>
    )
  }

  if (compact) {
    return (
      <Link
        to="/demo/better-auth"
        className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex"
        title="Sign in"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      </Link>
    )
  }

  return (
    <Link
      to="/demo/better-auth"
      className="h-9 px-4 text-sm font-medium rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors inline-flex items-center"
    >
      Sign in
    </Link>
  )
}
