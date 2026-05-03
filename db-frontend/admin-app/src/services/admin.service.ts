import api from '../api/axios'
import type { AdminProperty, AdminUser, PropertyStatus, UserStatus } from '../types/admin'

interface AdminPropertyDTO {
  id: string
  owner_id: string
  owner_name: string
  title: string
  city: string
  locality: string
  address: string
  price: number
  type: string
  furnished: string
  status: PropertyStatus
  primary_image: string | null
  created_at: string
}

interface AdminUserDTO {
  id: string
  email: string
  full_name: string
  phone: string
  role: 'owner' | 'tenant' | 'admin'
  status: UserStatus
  created_at: string
}

interface ListPropertiesResponseDTO {
  properties: AdminPropertyDTO[]
  count: number
}

interface ListUsersResponseDTO {
  users: AdminUserDTO[]
  count: number
}

function mapAdminProperty(dto: AdminPropertyDTO): AdminProperty {
  return {
    id: dto.id,
    ownerId: dto.owner_id,
    ownerName: dto.owner_name,
    title: dto.title,
    city: dto.city,
    locality: dto.locality,
    address: dto.address,
    price: dto.price,
    type: dto.type,
    furnished: dto.furnished,
    status: dto.status,
    primaryImage: dto.primary_image,
    createdAt: dto.created_at,
  }
}

function mapAdminUser(dto: AdminUserDTO): AdminUser {
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.full_name,
    phone: dto.phone,
    role: dto.role,
    status: dto.status,
    createdAt: dto.created_at,
  }
}

export async function listAdminProperties(): Promise<AdminProperty[]> {
  const { data } = await api.get<ListPropertiesResponseDTO>('/api/admin/properties')
  return (data.properties ?? []).map(mapAdminProperty)
}

export async function updatePropertyStatus(id: string, status: PropertyStatus): Promise<void> {
  await api.patch(`/api/admin/properties/${id}`, { status })
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<ListUsersResponseDTO>('/api/admin/users')
  return (data.users ?? []).map(mapAdminUser)
}

export async function updateUserStatus(id: string, status: UserStatus): Promise<void> {
  await api.patch(`/api/admin/users/${id}`, { status })
}
