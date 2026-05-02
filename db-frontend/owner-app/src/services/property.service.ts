import api from '../api/axios'
import type { CreatePropertyPayload, Property } from '../types/property'

interface CreatePropertyResponseDTO {
  property: Property
}

function mapCreatePropertyResponse(dto: CreatePropertyResponseDTO): Property {
  return dto.property
}

export async function createProperty(payload: CreatePropertyPayload): Promise<Property> {
  const { data } = await api.post<CreatePropertyResponseDTO>('/properties', payload)
  return mapCreatePropertyResponse(data)
}
