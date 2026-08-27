import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'FOUNDER' | 'EXPERT' | 'COMPANY' | 'FOUNDIC_TEAM' | 'ADMIN'

export interface User {
  id: string
  email: string
  role: UserRole
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (user: User, token: string, refreshToken: string) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, token, refreshToken) =>
        set({ user, token, refreshToken, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false }),

      setUser: (user) => set({ user }),
    }),
    {
      name: 'foundic-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
