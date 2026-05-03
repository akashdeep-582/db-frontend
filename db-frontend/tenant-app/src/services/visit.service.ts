import api from '../api/axios'
import type { Visit, RequestVisitPayload } from '../types/visit'

interface VisitDTO {
  id: string
  property_id: string
  property_title: string
  city: string
  locality: string
  requested_date: string
  requested_time: string
  message: string | null
  status: Visit['status']
  rejection_reason: string | null
  created_at: string
}

interface GetVisitsResponseDTO {
  visits: VisitDTO[]
  count: number
}

function mapVisit(dto: VisitDTO): Visit {
  return {
    id: dto.id,
    propertyId: dto.property_id,
    propertyTitle: dto.property_title,
    city: dto.city,
    locality: dto.locality,
    requestedDate: dto.requested_date,
    requestedTime: dto.requested_time,
    message: dto.message,
    status: dto.status,
    rejectionReason: dto.rejection_reason,
    createdAt: dto.created_at,
  }
}

export async function getVisits(): Promise<Visit[]> {
  const { data } = await api.get<GetVisitsResponseDTO>('/api/visits')
  return (data.visits ?? []).map(mapVisit)
}

export async function requestVisit(payload: RequestVisitPayload): Promise<void> {
  await api.post('/api/visits', payload)
}
