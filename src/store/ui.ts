import { create } from 'zustand'

type UiState = {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  toggleSidebarCollapse: () => void
}

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleSidebarCollapse: () => set({ sidebarCollapsed: !get().sidebarCollapsed })
}))

