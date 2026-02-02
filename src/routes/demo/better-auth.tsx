import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { useQueryClient } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { getOrgCollection } from '@/db-collections/orgs'

export const Route = createFileRoute('/demo/better-auth')({
  component: BetterAuthDemo,
})

function SignedInView() {
  const { data: session } = authClient.useSession()
  const { data: activeOrg } = authClient.useActiveOrganization()
  const queryClient = useQueryClient()
  const orgCollection = useMemo(() => getOrgCollection(queryClient), [queryClient])
  const { data: orgs } = useLiveQuery((q) =>
    q.from({ org: orgCollection }).select(({ org }) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
    })),
  )
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgSlug, setNewOrgSlug] = useState('')
  const [orgError, setOrgError] = useState('')
  const [orgLoading, setOrgLoading] = useState(false)
  const [deleteOrg, setDeleteOrg] = useState<{ id: string; name: string } | null>(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const invalidateOrgs = () => {
    queryClient.invalidateQueries({ queryKey: ['orgs'] })
  }

  // When signed in with orgs but no active org, set active to "Default" or first org
  useEffect(() => {
    if (!session || !orgs?.length || activeOrg) return
    const defaultOrg = orgs.find((o) => o.name === 'Default') ?? orgs[0]
    authClient.organization
      .setActive({ organizationId: defaultOrg.id })
      .then(() => invalidateOrgs())
  }, [session, orgs, activeOrg])

  const handleCreateOrg = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setOrgError('')
    setOrgLoading(true)
    try {
      const result = await authClient.organization.create({
        name: newOrgName,
        slug:
          newOrgSlug.trim() ||
          newOrgName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
      })
      if (result.error) {
        setOrgError(result.error.message ?? 'Failed to create organization')
      } else {
        setNewOrgName('')
        setNewOrgSlug('')
        invalidateOrgs()
      }
    } catch {
      setOrgError('Failed to create organization')
    } finally {
      setOrgLoading(false)
    }
  }

  const handleSetActive = async (organizationId: string) => {
    setOrgError('')
    try {
      await authClient.organization.setActive({ organizationId })
      invalidateOrgs()
    } catch {
      setOrgError('Failed to set active organization')
    }
  }

  const openDeleteModal = (org: { id: string; name: string }) => {
    setOrgError('')
    setDeleteOrg(org)
    setDeleteConfirmText('')
  }

  const closeDeleteModal = () => {
    setDeleteOrg(null)
    setDeleteConfirmText('')
  }

  const handleConfirmDelete = async () => {
    if (!deleteOrg || deleteConfirmText !== deleteOrg.name) return
    setOrgError('')
    setDeleteLoading(true)
    try {
      const result = await authClient.organization.delete({
        organizationId: deleteOrg.id,
      })
      if (result.error) {
        setOrgError(result.error.message ?? 'Failed to delete organization')
      } else {
        closeDeleteModal()
        invalidateOrgs()
      }
    } catch {
      setOrgError('Failed to delete organization')
    } finally {
      setDeleteLoading(false)
    }
  }

  const inputBase =
    'h-10 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 focus:border-transparent'
  const btnSecondary =
    'h-10 px-4 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50'

  return (
    <div className="min-h-screen flex justify-center py-14 px-4 bg-slate-50 dark:bg-slate-950">
      {/* Delete organization modal */}
      {deleteOrg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-org-title"
          aria-describedby="delete-org-description"
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeDeleteModal()
          }}
        >
          <button
            type="button"
            onClick={closeDeleteModal}
            className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/80"
            aria-label="Close"
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/80 dark:ring-slate-700/80 overflow-hidden">
            <div className="p-6">
              <h2
                id="delete-org-title"
                className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white"
              >
                Delete organization
              </h2>
              <div id="delete-org-description" className="mt-3 space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  This action <strong className="text-slate-900 dark:text-white">cannot be undone</strong>. All members, invitations, and organization data for{' '}
                  <strong className="text-slate-900 dark:text-white">{deleteOrg.name}</strong> will be permanently removed.
                </p>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 px-4 py-3 ring-1 ring-slate-200/80 dark:ring-slate-700/80 border-l-4 border-l-slate-400 dark:border-l-slate-500">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    Only the organization owner can delete it. If you leave or lose access, you will not be able to recover it.
                  </p>
                </div>
                <div className="pt-1">
                  <label
                    htmlFor="delete-org-confirm"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Type <span className="font-semibold text-slate-900 dark:text-white">{deleteOrg.name}</span> to confirm
                  </label>
                  <input
                    id="delete-org-confirm"
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder={deleteOrg.name}
                    className={inputBase}
                    autoComplete="off"
                    autoFocus
                  />
                </div>
                {orgError && (
                  <p className="text-xs text-red-600 dark:text-red-400">{orgError}</p>
                )}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className={`flex-1 ${btnSecondary} h-10 rounded-xl ring-1 ring-slate-200 dark:ring-slate-600`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteConfirmText !== deleteOrg.name || deleteLoading}
                  className="flex-1 h-10 rounded-xl text-sm font-medium bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? 'Deleting…' : 'Delete organization'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-6">
        {/* Profile */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/80 dark:ring-slate-700/80 overflow-hidden">
          <div className="p-6">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {session?.user?.email}
            </p>
            <div className="mt-5 flex items-center gap-4">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-600"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-base font-medium">
                  {session?.user?.name?.charAt(0).toUpperCase() ?? 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin */}
        {session?.user?.id && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/80 dark:ring-slate-700/80 overflow-hidden">
            <div className="p-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Admin (this account only)
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Add your user ID to{' '}
                <code className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-xs font-mono text-slate-700 dark:text-slate-300">
                  .env.local
                </code>{' '}
                to use admin features.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-100 dark:bg-slate-800/80 px-4 py-3 text-xs font-mono text-slate-700 dark:text-slate-300 ring-1 ring-slate-200/80 dark:ring-slate-700">
                BETTER_AUTH_ADMIN_USER_IDS={session.user.id}
              </pre>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Restart the dev server after updating.
              </p>
            </div>
          </div>
        )}

        {/* Organizations */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/80 dark:ring-slate-700/80 overflow-hidden">
          <div className="p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Organizations
            </h2>
            {activeOrg && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Active: {activeOrg.name}
              </p>
            )}
            <form onSubmit={handleCreateOrg} className="mt-4 grid gap-3">
              <input
                type="text"
                placeholder="Organization name"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                className={inputBase}
              />
              <input
                type="text"
                placeholder="Slug (optional)"
                value={newOrgSlug}
                onChange={(e) => setNewOrgSlug(e.target.value)}
                className={inputBase}
              />
              <button
                type="submit"
                disabled={orgLoading || !newOrgName.trim()}
                className="h-10 w-full rounded-xl text-sm font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                {orgLoading ? 'Creating…' : 'Create organization'}
              </button>
            </form>
            {orgError && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">{orgError}</p>
            )}
            {orgs && orgs.length > 0 && (
              <ul className="mt-5 space-y-2 border-t border-slate-200 dark:border-slate-700 pt-5">
                {orgs.map((org) => (
                  <li
                    key={org.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 px-4 py-2.5"
                  >
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate min-w-0">
                      {org.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSetActive(org.id)}
                        disabled={activeOrg?.id === org.id}
                        className={`${btnSecondary} h-8 px-3 text-xs rounded-lg`}
                      >
                        {activeOrg?.id === org.id ? 'Active' : 'Set active'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(org)}
                        className="h-8 px-3 text-xs font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label={`Delete ${org.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to="/demo/protected"
            className={`flex-1 ${btnSecondary} h-10 rounded-xl inline-flex items-center justify-center ring-1 ring-slate-200 dark:ring-slate-600`}
          >
            Protected route
          </Link>
          <button
            onClick={() => authClient.signOut()}
            className={`flex-1 ${btnSecondary} h-10 rounded-xl ring-1 ring-slate-200 dark:ring-slate-600`}
          >
            Sign out
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Built with{' '}
          <a
            href="https://better-auth.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            BETTER-AUTH
          </a>
        </p>
      </div>
    </div>
  )
}

function BetterAuthDemo() {
  const { data: session, isPending } = authClient.useSession()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700 dark:border-slate-700 dark:border-t-slate-300" />
      </div>
    )
  }

  if (session?.user) {
    return <SignedInView />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        })
        if (result.error) {
          setError(result.error.message || 'Sign up failed')
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        })
        if (result.error) {
          setError(result.error.message || 'Sign in failed')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const inputBase =
    'h-10 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="min-h-screen flex justify-center py-14 px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/80 dark:ring-slate-700/80 overflow-hidden">
          <div className="p-6">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {isSignUp ? 'Create an account' : 'Sign in'}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isSignUp
                ? 'Enter your information to create an account'
                : 'Enter your email to sign in'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              {isSignUp && (
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputBase}
                    required
                  />
                </div>
              )}

              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBase}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputBase}
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 dark:border-red-800/80 bg-red-50 dark:bg-red-900/20 px-4 py-2.5">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-10 w-full rounded-xl text-sm font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white dark:border-slate-600 dark:border-t-slate-900" />
                    <span>Please wait</span>
                  </span>
                ) : isSignUp ? (
                  'Create account'
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Built with{' '}
          <a
            href="https://better-auth.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            BETTER-AUTH
          </a>
        </p>
      </div>
    </div>
  )
}
