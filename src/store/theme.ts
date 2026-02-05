import { create } from 'zustand'

type ThemeMode = 'light' | 'dark'

type ThemeState = {
  mode: ThemeMode
  toggle: () => void
  setMode: (m: ThemeMode) => void
}

const THEME_KEY = 'admin_theme_mode'

function readMode(): ThemeMode {
  try {
    if (typeof window === 'undefined' || !localStorage) return 'light'
    const saved = localStorage.getItem(THEME_KEY) as ThemeMode | null
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: readMode(),
  toggle: () => {
    const next = get().mode === 'light' ? 'dark' : 'light'
    localStorage.setItem(THEME_KEY, next)
    set({ mode: next })
  },
  setMode: (m) => {
    localStorage.setItem(THEME_KEY, m)
    set({ mode: m })
  }
}))

