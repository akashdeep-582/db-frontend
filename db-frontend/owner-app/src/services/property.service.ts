import api from '../api/axios'
import type { CreatePropertyPayload, Property } from '../types/property'

interface PropertyDTO {
  id: string
  owner_id: string
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
  status: 'pending' | 'approved' | 'rejected'
  primary_image: string | null
  created_at: string
}

interface CreatePropertyResponseDTO {
  property: PropertyDTO
}

interface ListMyPropertiesResponseDTO {
  properties: PropertyDTO[]
}

function mapProperty(dto: PropertyDTO): Property {
  return {
    id: dto.id,
    ownerId: dto.owner_id,
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
    primaryImage: dto.primary_image,
    createdAt: dto.created_at,
  }
}

export async function createProperty(payload: CreatePropertyPayload): Promise<Property> {
  const { data } = await api.post<CreatePropertyResponseDTO>('/api/properties', payload)
  return mapProperty(data.property)
}

export async function listMyProperties(): Promise<Property[]> {
  const { data } = await api.get<ListMyPropertiesResponseDTO>('/api/properties/my')
  return (data.properties ?? []).map(mapProperty)
}

export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/api/properties/${id}`)
}
