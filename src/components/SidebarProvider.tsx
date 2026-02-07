'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { useStore } from '@tanstack/react-store'
import {
  hydrateSidebarStore,
  sidebarIsMiniStore,
  sidebarStore,
} from '@/lib/sidebar-store'
import type { SidebarMode } from '@/lib/sidebar'

type SidebarContextValue = {
  mode: SidebarMode
  isMini: boolean
  setMode: (mode: SidebarMode) => void
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    hydrateSidebarStore()
  }, [])

  const mode = useStore(sidebarStore, (state) => state.mode)
  const isMini = useStore(sidebarIsMiniStore)

  const setMode = useCallback((next: SidebarMode) => {
    sidebarStore.setState(() => ({ mode: next }))
  }, [])

  const toggle = useCallback(() => {
    sidebarStore.setState((prev) => ({
      mode: prev.mode === 'expanded' ? 'mini' : 'expanded',
    }))
  }, [])

  const value = useMemo<SidebarContextValue>(
    () => ({ mode, isMini, setMode, toggle }),
    [mode, isMini, setMode, toggle],
  )

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (ctx === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return ctx
}
