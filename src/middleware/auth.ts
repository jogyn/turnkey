import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { auth } from '@/lib/auth'

/**
 * Auth middleware for TanStack Start.
 * Use on routes that require a signed-in user; redirects to the auth page if no session.
 * @see https://www.better-auth.com/docs/integrations/tanstack#middleware
 */
export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      throw redirect({ to: '/demo/better-auth' })
    }

    return await next()
  },
)
