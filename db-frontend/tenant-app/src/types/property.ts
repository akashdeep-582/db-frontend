export type PropertyType = '1BHK' | '2BHK' | '3BHK' | 'Studio' | 'Villa'
export type FurnishedStatus = 'furnished' | 'semi' | 'unfurnished'

export interface PropertyImage {
  id: string
  url: string
  isPrimary: boolean
}

export interface Property {
  id: string
  title: string
  city: string
  locality: string
  address: string
  price: number
  type: PropertyType
  furnished: FurnishedStatus
  description: string | null
  areaSqft: number | null
  floor: number | null
  totalFloors: number | null
  parking: boolean
  availableFrom: string | null
  status: 'approved'
  ownerName: string
  primaryImage: string | null
  createdAt: string
}

export interface PropertyDetail extends Omit<Property, 'status'> {
  status: 'approved'
  ownerPhone: string
  images: PropertyImage[]
}

export interface BrowseFilters {
  city: string
  type: PropertyType | ''
  furnished: FurnishedStatus | ''
  min_price: string
  max_price: string
}
