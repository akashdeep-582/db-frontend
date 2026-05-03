import { ErrorMessage } from '@dropbroker/ui'
import { useMyVisits } from '../hooks/useMyVisits'
import { getApiError } from '../utils/errors'
import type { Visit } from '../types/visit'

const STATUS_LABEL: Record<Visit['status'], string> = {
  pending: 'Pending',
  approved: 'Confirmed',
  rejected: 'Rejected',
}

function VisitCard({ visit }: { visit: Visit }) {
  return (
    <div className="visit-card">
      <div className="visit-card-body">
        <div className="visit-card-title">{visit.propertyTitle}</div>
        <div className="visit-card-meta">{visit.city}, {visit.locality}</div>
        <div className="visit-card-meta">
          {visit.requestedDate} at {visit.requestedTime}
        </div>
        {visit.message && <div className="visit-card-message">"{visit.message}"</div>}
        {visit.rejectionReason && (
          <div className="visit-card-rejection">Reason: {visit.rejectionReason}</div>
        )}
      </div>
      <div className="admin-row-status" data-status={visit.status}>
        {STATUS_LABEL[visit.status]}
      </div>
    </div>
  )
}

export default function MyVisits() {
  const { visits, isLoading, error } = useMyVisits()

  if (isLoading) return <div className="ui-page-lg">Loading…</div>

  return (
    <div className="ui-page-lg">
      <div className="ui-page-header">
        <div>
          <h1 className="ui-page-heading">My Visits</h1>
          <p className="ui-page-subtitle">{visits?.length ?? 0} visits</p>
        </div>
      </div>

      {error && <ErrorMessage>{getApiError(error)}</ErrorMessage>}

      <div className="admin-list">
        {visits?.map(v => (
          <VisitCard key={v.id} visit={v} />
        ))}
        {!isLoading && visits?.length === 0 && (
          <p className="ui-empty-state">No visits yet. Browse properties and schedule a visit!</p>
        )}
      </div>
    </div>
  )
}
