import { createFileRoute } from '@tanstack/react-router';
import { auth } from '@/lib/auth';

/**
 * GET /api/orgs — returns organizations for the current user (proxy to Better Auth).
 * Used by TanStack DB org collection. Returns 401 if not signed in.
 */
export const Route = createFileRoute('/api/orgs/$')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const sessionResult = await auth.api.getSession({
                    headers: request.headers,
                });
                const user =
                    sessionResult &&
                    typeof sessionResult === 'object' &&
                    'user' in sessionResult
                        ? (sessionResult as { user: unknown }).user
                        : null;
                if (!user) {
                    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                const url = new URL(request.url);
                const listUrl = new URL(
                    '/api/auth/organization/list',
                    `${url.origin}`,
                );
                const res = await fetch(listUrl.toString(), {
                    headers: request.headers,
                });
                const data = await res.json().catch(() => ({}));
                return new Response(JSON.stringify(data?.data ?? data ?? []), {
                    status: res.status,
                    headers: { 'Content-Type': 'application/json' },
                });
            },
        },
    },
});
