import { Button, ErrorMessage } from '@dropbroker/ui'
import { useAdminListings, useUpdatePropertyStatus } from '../hooks/useAdminListings'
import { getApiError } from '../utils/errors'
import type { AdminProperty } from '../types/admin'

function PropertyRow({ property, onApprove, onReject, isPending }: {
  property: AdminProperty
  onApprove: () => void
  onReject: () => void
  isPending: boolean
}) {
  return (
    <div className="admin-row">
      <div className="admin-row-img">
        {property.primary_image
          ? <img src={property.primary_image} alt={property.title} />
          : <div className="admin-row-img-placeholder">No image</div>
        }
      </div>
      <div className="admin-row-body">
        <div className="admin-row-title">{property.title}</div>
        <div className="admin-row-meta">
          {property.city}, {property.locality} · {property.type} · ₹{property.price.toLocaleString()}/mo
        </div>
        <div className="admin-row-meta">Owner: {property.owner_name}</div>
      </div>
      <div className="admin-row-status" data-status={property.status}>
        {property.status}
      </div>
      {property.status === 'pending' && (
        <div className="admin-row-actions">
          <Button size="sm" onClick={onApprove} loading={isPending}>Approve</Button>
          <Button size="sm" variant="danger" onClick={onReject} loading={isPending}>Reject</Button>
        </div>
      )}
    </div>
  )
}

export default function Listings() {
  const { data: properties, isLoading, error } = useAdminListings()
  const { mutate, isPending, error: mutateError } = useUpdatePropertyStatus()

  if (isLoading) return <div className="ui-page">Loading…</div>

  return (
    <div className="ui-page" style={{ maxWidth: 860 }}>
      <h1 className="ui-page-heading">Property Listings</h1>
      <p className="ui-page-subtitle">{properties?.length ?? 0} properties found</p>

      <ErrorMessage>{mutateError ? getApiError(mutateError) : ''}</ErrorMessage>

      {error && <ErrorMessage>{getApiError(error)}</ErrorMessage>}

      <div className="admin-list">
        {properties?.map(p => (
          <PropertyRow
            key={p.id}
            property={p}
            isPending={isPending}
            onApprove={() => mutate({ id: p.id, status: 'approved' })}
            onReject={() => mutate({ id: p.id, status: 'rejected' })}
          />
        ))}
        {properties?.length === 0 && (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: 40 }}>No properties found</p>
        )}
      </div>
    </div>
  )
}
