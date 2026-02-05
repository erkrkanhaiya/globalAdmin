import { create } from 'zustand'

export type AuthUser = { 
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'viewer' | 'super_admin' | 'agent' | 'customer'
  avatar?: string
}

type AuthState = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (payload: { user: AuthUser; token: string }) => void
  logout: () => void
}

const TOKEN_KEY = 'admin_token_ecom'
const USER_KEY = 'admin_user_ecom'

function readInitialState(): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> {
  try {
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('admin_token_v1')
    const userRaw = localStorage.getItem(USER_KEY) || localStorage.getItem('admin_user_v1')
    const user = userRaw ? (JSON.parse(userRaw) as AuthUser) : null
    return { token, user, isAuthenticated: Boolean(token && user) }
  } catch {
    return { token: null, user: null, isAuthenticated: false }
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...readInitialState(),
  login: ({ user, token }) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem('admin_token_v1', token)
    localStorage.setItem('admin_user_v1', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem('admin_token_v1')
    localStorage.removeItem('admin_user_v1')
    localStorage.removeItem('selected_product')
    localStorage.removeItem('selected_product_slug')
    set({ user: null, token: null, isAuthenticated: false })
  }
}))
