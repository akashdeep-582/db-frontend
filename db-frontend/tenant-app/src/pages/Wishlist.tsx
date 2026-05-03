import { useNavigate } from 'react-router-dom'
import { Button, ErrorMessage } from '@dropbroker/ui'
import { useWishlist } from '../hooks/useWishlist'
import { getApiError } from '../utils/errors'
import type { WishlistItem } from '../types/wishlist'

function WishlistCard({ item, onRemove, isRemoving, onClick }: {
  item: WishlistItem
  onRemove: () => void
  isRemoving: boolean
  onClick: () => void
}) {
  return (
    <div className="property-card">
      <div className="property-card-img" onClick={onClick}>
        {item.primaryImage
          ? <img src={item.primaryImage} alt={item.title} />
          : <div className="property-card-img-placeholder">No image</div>
        }
      </div>
      <div className="property-card-body">
        <div className="property-card-price">₹{item.price.toLocaleString()}/mo</div>
        <div className="property-card-title" onClick={onClick}>{item.title}</div>
        <div className="property-card-meta">{item.city}, {item.locality}</div>
        <div className="property-card-tags">
          <span className="property-card-tag">{item.type}</span>
          <span className="property-card-tag">{item.furnished}</span>
        </div>
        <Button size="sm" variant="danger" onClick={onRemove} loading={isRemoving}>
          Remove
        </Button>
      </div>
    </div>
  )
}

export default function Wishlist() {
  const navigate = useNavigate()
  const { items, isLoading, error, removeItem, isRemoving } = useWishlist()

  if (isLoading) return <div className="ui-page-lg">Loading…</div>

  return (
    <div className="ui-page-lg">
      <div className="ui-page-header">
        <div>
          <h1 className="ui-page-heading">My Wishlist</h1>
          <p className="ui-page-subtitle">{items?.length ?? 0} saved properties</p>
        </div>
      </div>

      {error && <ErrorMessage>{getApiError(error)}</ErrorMessage>}

      <div className="property-grid">
        {items?.map(item => (
          <WishlistCard
            key={item.id}
            item={item}
            onRemove={() => removeItem(item.propertyId)}
            isRemoving={isRemoving}
            onClick={() => navigate(`/tenant/browse/${item.propertyId}`)}
          />
        ))}
      </div>
      {!isLoading && items?.length === 0 && (
        <p className="ui-empty-state">No saved properties yet. Browse and save properties you like!</p>
      )}
    </div>
  )
}
