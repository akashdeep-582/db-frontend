import api from '../api/axios'
import type { Property, PropertyDetail, PropertyImage, BrowseFilters } from '../types/property'

interface PropertyImageDTO {
  id: string
  url: string
  is_primary: boolean
}

interface PropertyDTO {
  id: string
  title: string
  city: string
  locality: string
  address: string
  price: number
  type: string
  furnished: string
  description: string | null
  area_sqft: number | null
  floor: number | null
  total_floors: number | null
  parking: boolean
  available_from: string | null
  status: 'approved'
  owner_name: string
  primary_image: string | null
  created_at: string
}

interface PropertyDetailDTO extends PropertyDTO {
  owner_phone: string
  images: PropertyImageDTO[]
}

interface ListPropertiesResponseDTO {
  properties: PropertyDTO[]
  count: number
}

interface GetPropertyResponseDTO {
  property: PropertyDetailDTO
}

function mapPropertyImage(dto: PropertyImageDTO): PropertyImage {
  return {
    id: dto.id,
    url: dto.url,
    isPrimary: dto.is_primary,
  }
}

function mapProperty(dto: PropertyDTO): Property {
  return {
    id: dto.id,
    title: dto.title,
    city: dto.city,
    locality: dto.locality,
    address: dto.address,
    price: dto.price,
    type: dto.type as Property['type'],
    furnished: dto.furnished as Property['furnished'],
    description: dto.description,
    areaSqft: dto.area_sqft,
    floor: dto.floor,
    totalFloors: dto.total_floors,
    parking: dto.parking,
    availableFrom: dto.available_from,
    status: dto.status,
    ownerName: dto.owner_name,
    primaryImage: dto.primary_image,
    createdAt: dto.created_at,
  }
}

function mapPropertyDetail(dto: PropertyDetailDTO): PropertyDetail {
  return {
    ...mapProperty(dto),
    ownerPhone: dto.owner_phone,
    images: (dto.images ?? []).map(mapPropertyImage),
  }
}

export async function listProperties(filters: Partial<BrowseFilters>): Promise<Property[]> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v != null)
  )
  const { data } = await api.get<ListPropertiesResponseDTO>('/api/properties', { params })
  return (data.properties ?? []).map(mapProperty)
}

export async function getProperty(id: string): Promise<PropertyDetail> {
  const { data } = await api.get<GetPropertyResponseDTO>(`/api/properties/${id}`)
  return mapPropertyDetail(data.property)
}
