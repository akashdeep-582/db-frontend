export type Role = 'tenant' | 'owner' | 'admin'

export interface User {
  email: string
  name: string
}

export interface AuthResult {
  token: string
  user: User
  role: Role
}
