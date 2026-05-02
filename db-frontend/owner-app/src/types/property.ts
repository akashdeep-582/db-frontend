export type PropertyType = '1BHK' | '2BHK' | '3BHK' | 'Studio' | 'Villa'
export type FurnishedStatus = 'furnished' | 'semi' | 'unfurnished'

export interface CreatePropertyPayload {
  title: string
  city: string
  locality: string
  address: string
  price: number
  type: PropertyType
  furnished: FurnishedStatus
  description?: string
  area_sqft?: number
  floor?: number
  total_floors?: number
  parking?: boolean
  available_from?: string
}

export interface Property extends CreatePropertyPayload {
  id: string
  owner_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
