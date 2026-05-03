import type { Role } from '../types/auth'

const DEFAULT_ROUTES: Record<Role, string> = {
  admin: '/admin/listings',
  owner: '/owner/dashboard',
  tenant: '/tenant/browse',
}

export function getDefaultRoute(role: Role): string {
  return DEFAULT_ROUTES[role]
}
