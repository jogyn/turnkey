import { createFileRoute } from '@tanstack/react-router'
import { authMiddleware } from '@/lib/middleware'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/demo/protected')({
  component: ProtectedPage,
  server: {
    middleware: [authMiddleware],
  },
})

function ProtectedPage() {
  const { data: session } = authClient.useSession()
  const { data: activeOrg } = authClient.useActiveOrganization()

  return (
    <div className="min-h-screen flex justify-center py-14 px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/80 dark:ring-slate-700/80 overflow-hidden">
          <div className="p-6">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Protected route
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              You only see this because you’re signed in. Session is enforced by
              server middleware.
            </p>
            {session?.user && (
              <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
                Signed in as <strong className="font-medium text-slate-900 dark:text-white">{session.user.email}</strong>
              </p>
            )}
            {session?.user && activeOrg ? (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Active organization: <strong className="font-medium text-slate-900 dark:text-white">{activeOrg.name}</strong>
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  No active organization
                </p>
              )} 
          </div>
        </div>
      </div>
    </div>
  )
}
