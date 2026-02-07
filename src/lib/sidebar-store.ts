import { Derived, Store } from '@tanstack/store'
import type { SidebarMode } from './sidebar'
import { getStoredSidebarMode, setStoredSidebarMode } from './sidebar'

/**
 * TanStack Store pattern in this app:
 * - One Store per feature/domain (not per field). Put multiple related fields in one state object.
 * - Use useStore(store, selector) to subscribe to a single field and avoid extra re-renders.
 * - Use Derived only for computed values you want to subscribe to (e.g. isMini from mode).
 */

const initialState: { mode: SidebarMode } = { mode: 'expanded' }

/**
 * Source of truth for sidebar mode. Persisted to localStorage via subscribe.
 * Hydrate from storage on client mount by calling hydrateSidebarStore().
 */
export const sidebarStore = new Store(initialState)

/** Derived: true when sidebar is in mini (collapsed) mode. Use for UI that only cares about isMini. */
export const sidebarIsMiniStore = new Derived({
  fn: () => sidebarStore.state.mode === 'mini',
  deps: [sidebarStore],
})
sidebarIsMiniStore.mount()

/** Persist mode to localStorage whenever the store changes */
sidebarStore.subscribe(() => {
  setStoredSidebarMode(sidebarStore.state.mode)
})

/** Call once on client mount to restore mode from localStorage (avoids hydration mismatch). */
export function hydrateSidebarStore(): void {
  const stored = getStoredSidebarMode()
  if (stored !== sidebarStore.state.mode) {
    sidebarStore.setState(() => ({ mode: stored }))
  }
}
