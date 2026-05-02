import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role, User } from '../types/auth'

interface AuthState {
  token: string | null
  user: User | null
  role: Role | null
  login: (token: string, user: User, role: Role) => void
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      login: (token, user, role) => set({ token, user, role }),
      logout: () => set({ token: null, user: null, role: null }),
    }),
    { name: 'auth' }
  )
)

export default useAuthStore
