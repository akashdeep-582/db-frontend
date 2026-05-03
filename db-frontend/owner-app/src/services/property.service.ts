import api from '../api/axios'
import type { CreatePropertyPayload, Property } from '../types/property'

interface CreatePropertyResponseDTO {
  property: Property
}

interface ListMyPropertiesResponseDTO {
  properties: Property[]
}

function mapCreatePropertyResponse(dto: CreatePropertyResponseDTO): Property {
  return dto.property
}

export async function createProperty(payload: CreatePropertyPayload): Promise<Property> {
  const { data } = await api.post<CreatePropertyResponseDTO>('/api/properties', payload)
  return mapCreatePropertyResponse(data)
}

export async function listMyProperties(): Promise<Property[]> {
  const { data } = await api.get<ListMyPropertiesResponseDTO>('/api/properties/my')
  return data.properties ?? []
}

export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/api/properties/${id}`)
}
