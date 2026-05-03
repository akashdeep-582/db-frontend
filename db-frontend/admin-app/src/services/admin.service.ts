import api from '../api/axios'
import type { AdminProperty, AdminUser, PropertyStatus, UserStatus } from '../types/admin'

interface ListPropertiesResponseDTO {
  properties: AdminProperty[]
  count: number
}

interface ListUsersResponseDTO {
  users: AdminUser[]
  count: number
}

export async function listAdminProperties(): Promise<AdminProperty[]> {
  const { data } = await api.get<ListPropertiesResponseDTO>('/api/admin/properties')
  return data.properties ?? []
}

export async function updatePropertyStatus(id: string, status: PropertyStatus): Promise<void> {
  await api.patch(`/api/admin/properties/${id}`, { status })
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<ListUsersResponseDTO>('/api/admin/users')
  return data.users ?? []
}

export async function updateUserStatus(id: string, status: UserStatus): Promise<void> {
  await api.patch(`/api/admin/users/${id}`, { status })
}
