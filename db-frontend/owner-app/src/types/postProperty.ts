import type { PropertyType, FurnishedStatus } from './property'

export interface PostPropertyFormFields {
  title: string
  city: string
  locality: string
  address: string
  price: string
  type: PropertyType | ''
  furnished: FurnishedStatus | ''
  description: string
  areaSqft: string
  floor: string
  totalFloors: string
  parking: boolean
  availableFrom: string
}

export interface PostPropertyFormErrors {
  title: string
  city: string
  locality: string
  address: string
  price: string
  type: string
  furnished: string
}
