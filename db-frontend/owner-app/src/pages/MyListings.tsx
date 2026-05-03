import { useNavigate } from 'react-router-dom'
import { Button, ErrorMessage } from '@dropbroker/ui'
import { useMyListings } from '../hooks/useMyListings'
import { getApiError } from '../utils/errors'
import type { Property } from '../types/property'

const STATUS_LABEL: Record<Property['status'], string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
}

function PropertyRow({ property, onDelete, isDeleting }: {
  property: Property
  onDelete: () => void
  isDeleting: boolean
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
        <div className="admin-row-meta">
          {property.furnished} · {property.area_sqft ? `${property.area_sqft} sqft` : ''}
        </div>
      </div>
      <div className="admin-row-status" data-status={property.status}>
        {STATUS_LABEL[property.status]}
      </div>
      <div className="admin-row-actions">
        <Button size="sm" variant="danger" onClick={onDelete} loading={isDeleting}>
          Delete
        </Button>
      </div>
    </div>
  )
}

export default function MyListings() {
  const navigate = useNavigate()
  const { properties, isLoading, error, handleDelete, isDeleting, deleteError } = useMyListings()

  if (isLoading) return <div className="ui-page-lg">Loading…</div>

  return (
    <div className="ui-page-lg">
      <div className="ui-page-header">
        <div>
          <h1 className="ui-page-heading">My Listings</h1>
          <p className="ui-page-subtitle">{properties?.length ?? 0} properties</p>
        </div>
        <Button onClick={() => navigate('/owner/post')}>+ Post Property</Button>
      </div>

      {error && <ErrorMessage>{getApiError(error)}</ErrorMessage>}
      {deleteError && <ErrorMessage>{getApiError(deleteError)}</ErrorMessage>}

      <div className="admin-list">
        {properties?.map(p => (
          <PropertyRow
            key={p.id}
            property={p}
            onDelete={() => handleDelete(p.id, p.title)}
            isDeleting={isDeleting}
          />
        ))}
        {properties?.length === 0 && (
          <p className="ui-empty-state">No listings yet. Post your first property!</p>
        )}
      </div>
    </div>
  )
}
