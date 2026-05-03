import { useParams } from 'react-router-dom'
import { Button, ErrorMessage } from '@dropbroker/ui'
import { usePropertyDetail } from '../hooks/usePropertyDetail'
import { getApiError } from '../utils/errors'

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const {
    property, isLoading, error,
    isWishlisted, toggleWishlist, isWishlistPending,
    visitForm, handleVisitFormChange, handleVisitSubmit,
    isVisitPending, visitError, visitSuccess,
    goBack,
  } = usePropertyDetail(id!)

  if (isLoading) return <div className="ui-page-lg">Loading…</div>
  if (error) return <div className="ui-page-lg"><ErrorMessage>{getApiError(error)}</ErrorMessage></div>
  if (!property) return null

  const primaryImage = property.images?.find(i => i.isPrimary)?.url ?? property.images?.[0]?.url

  return (
    <div className="ui-page-lg">
      <button className="detail-back-btn" onClick={goBack}>← Back</button>

      <div className="detail-hero">
        {primaryImage
          ? <img className="detail-hero-img" src={primaryImage} alt={property.title} />
          : <div className="detail-hero-placeholder">No image</div>
        }
        {property.images?.length > 1 && (
          <div className="detail-thumbs">
            {property.images.slice(1).map(img => (
              <img key={img.id} className="detail-thumb" src={img.url} alt="" />
            ))}
          </div>
        )}
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-price">₹{property.price.toLocaleString()}/mo</div>
          <h1 className="detail-title">{property.title}</h1>
          <p className="detail-location">{property.city}, {property.locality}</p>
          <p className="detail-address">{property.address}</p>

          <div className="detail-tags">
            <span className="property-card-tag">{property.type}</span>
            <span className="property-card-tag">{property.furnished}</span>
            {property.parking && <span className="property-card-tag">Parking</span>}
          </div>

          <div className="detail-specs">
            {property.areaSqft && <div className="detail-spec"><span>Area</span>{property.areaSqft} sqft</div>}
            {property.floor != null && <div className="detail-spec"><span>Floor</span>{property.floor}{property.totalFloors ? ` / ${property.totalFloors}` : ''}</div>}
            {property.availableFrom && <div className="detail-spec"><span>Available</span>{property.availableFrom}</div>}
          </div>

          {property.description && (
            <div className="detail-section">
              <h3 className="detail-section-title">Description</h3>
              <p className="detail-description">{property.description}</p>
            </div>
          )}

          <div className="detail-section">
            <h3 className="detail-section-title">Owner</h3>
            <p className="detail-owner">{property.ownerName}</p>
            <p className="detail-owner">{property.ownerPhone}</p>
          </div>
        </div>

        <div className="detail-sidebar">
          <Button
            onClick={toggleWishlist}
            loading={isWishlistPending}
            variant={isWishlisted ? 'danger' : 'ghost'}
          >
            {isWishlisted ? '♥ Remove from Wishlist' : '♡ Save to Wishlist'}
          </Button>

          <div className="visit-form-card">
            <h3 className="detail-section-title">Schedule a Visit</h3>
            {visitSuccess && <p className="visit-success">Visit requested! We'll confirm shortly.</p>}
            {visitError && <ErrorMessage>{getApiError(visitError)}</ErrorMessage>}
            <form onSubmit={handleVisitSubmit}>
              <div className="ui-field">
                <label className="ui-label">Date</label>
                <input
                  type="date"
                  className="ui-input"
                  value={visitForm.requested_date}
                  onChange={e => handleVisitFormChange('requested_date', e.target.value)}
                  required
                />
              </div>
              <div className="ui-field">
                <label className="ui-label">Time</label>
                <input
                  type="time"
                  className="ui-input"
                  value={visitForm.requested_time}
                  onChange={e => handleVisitFormChange('requested_time', e.target.value)}
                  required
                />
              </div>
              <div className="ui-field">
                <label className="ui-label">Message (optional)</label>
                <textarea
                  className="ui-input"
                  rows={3}
                  value={visitForm.message}
                  onChange={e => handleVisitFormChange('message', e.target.value)}
                  placeholder="Any specific requirements..."
                />
              </div>
              <Button type="submit" loading={isVisitPending}>
                Request Visit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
