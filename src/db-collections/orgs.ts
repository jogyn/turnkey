import { createCollection } from '@tanstack/react-db';
import { queryCollectionOptions } from '@tanstack/query-db-collection';
import type { QueryClient } from '@tanstack/react-query';

export interface OrgItem {
  id: string;
  name: string;
  slug: string;
  createdAt?: Date | string;
  logo?: string | null;
  metadata?: Record<string, unknown>;
}

function createOrgCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      queryKey: ['orgs'],
      queryFn: async (): Promise<OrgItem[]> => {
        const res = await fetch('/api/orgs', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch organizations');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      },
      getKey: (org) => org.id,
      queryClient,
    }),
  );
}

type OrgCollection = ReturnType<typeof createOrgCollection>;

let orgCollection: OrgCollection | null = null;

/**
 * Returns the org collection for TanStack DB. Pass the app's QueryClient (e.g. from useQueryClient).
 * Collection is created once and cached.
 */
export function getOrgCollection(queryClient: QueryClient): OrgCollection {
  if (!orgCollection) {
    orgCollection = createOrgCollection(queryClient);
  }
  return orgCollection;
}
