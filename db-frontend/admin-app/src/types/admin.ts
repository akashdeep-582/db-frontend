export type PropertyStatus = 'pending' | 'approved' | 'rejected'
export type UserStatus = 'active' | 'inactive'

export interface AdminProperty {
  id: string
  title: string
  city: string
  locality: string
  address: string
  price: number
  type: string
  furnished: string
  status: PropertyStatus
  owner_id: string
  owner_name: string
  primary_image: string | null
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  full_name: string
  phone: string
  role: 'owner' | 'tenant' | 'admin'
  status: UserStatus
  created_at: string
}
