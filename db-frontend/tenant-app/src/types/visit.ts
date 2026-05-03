export type VisitStatus = 'pending' | 'approved' | 'rejected'

export interface Visit {
  id: string
  propertyId: string
  propertyTitle: string
  city: string
  locality: string
  requestedDate: string
  requestedTime: string
  message: string | null
  status: VisitStatus
  rejectionReason: string | null
  createdAt: string
}

export interface RequestVisitPayload {
  property_id: string
  requested_date: string
  requested_time: string
  message?: string
}
