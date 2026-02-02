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

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-lg font-semibold leading-none tracking-tight">
          Protected route
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          You only see this because you’re signed in. Session is enforced by
          server middleware.
        </p>
        {session?.user && (
          <p className="text-sm">
            Signed in as <strong>{session.user.email}</strong>
          </p>
        )}
      </div>
    </div>
  )
}
