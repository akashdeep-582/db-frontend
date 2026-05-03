export type PropertyStatus = 'pending' | 'approved' | 'rejected'
export type UserStatus = 'active' | 'inactive'

export interface AdminProperty {
  id: string
  ownerId: string
  ownerName: string
  title: string
  city: string
  locality: string
  address: string
  price: number
  type: string
  furnished: string
  status: PropertyStatus
  primaryImage: string | null
  createdAt: string
}

export interface AdminUser {
  id: string
  email: string
  fullName: string
  phone: string
  role: 'owner' | 'tenant' | 'admin'
  status: UserStatus
  createdAt: string
}
