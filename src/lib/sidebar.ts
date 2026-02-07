const SIDEBAR_STORAGE_KEY = 'app-sidebar-mode'

export type SidebarMode = 'mini' | 'expanded'

export function getStoredSidebarMode(): SidebarMode {
  if (typeof window === 'undefined') return 'expanded'
  const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
  if (stored === 'mini' || stored === 'expanded') return stored
  return 'expanded'
}

export function setStoredSidebarMode(mode: SidebarMode): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SIDEBAR_STORAGE_KEY, mode)
}
