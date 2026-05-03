import { useNavigate } from 'react-router-dom'
import { Button, ErrorMessage } from '@dropbroker/ui'
import { useBrowse } from '../hooks/useBrowse'
import { getApiError } from '../utils/errors'
import type { Property } from '../types/property'

const TYPES = ['1BHK', '2BHK', '3BHK', 'Studio', 'Villa']
const FURNISHED = ['furnished', 'semi', 'unfurnished']

function PropertyCard({ property, onClick }: { property: Property; onClick: () => void }) {
  return (
    <div className="property-card" onClick={onClick}>
      <div className="property-card-img">
        {property.primaryImage
          ? <img src={property.primaryImage} alt={property.title} />
          : <div className="property-card-img-placeholder">No image</div>
        }
      </div>
      <div className="property-card-body">
        <div className="property-card-price">₹{property.price.toLocaleString()}/mo</div>
        <div className="property-card-title">{property.title}</div>
        <div className="property-card-meta">{property.city}, {property.locality}</div>
        <div className="property-card-tags">
          <span className="property-card-tag">{property.type}</span>
          <span className="property-card-tag">{property.furnished}</span>
        </div>
      </div>
    </div>
  )
}

export default function Browse() {
  const navigate = useNavigate()
  const { properties, isLoading, error, filters, handleFilterChange, applyFilters, clearFilters } = useBrowse()

  return (
    <div className="ui-page-lg">
      <div className="ui-page-header">
        <div>
          <h1 className="ui-page-heading">Browse Properties</h1>
          <p className="ui-page-subtitle">{properties?.length ?? 0} properties found</p>
        </div>
      </div>

      <div className="browse-filters">
        <input
          className="ui-input"
          placeholder="City"
          value={filters.city}
          onChange={e => handleFilterChange('city', e.target.value)}
        />
        <div className="browse-filter-group">
          {TYPES.map(t => (
            <button
              key={t}
              className={`browse-filter-btn${filters.type === t ? ' active' : ''}`}
              onClick={() => handleFilterChange('type', filters.type === t ? '' : t)}
            >{t}</button>
          ))}
        </div>
        <div className="browse-filter-group">
          {FURNISHED.map(f => (
            <button
              key={f}
              className={`browse-filter-btn${filters.furnished === f ? ' active' : ''}`}
              onClick={() => handleFilterChange('furnished', filters.furnished === f ? '' : f)}
            >{f}</button>
          ))}
        </div>
        <div className="browse-filter-group">
          <input className="ui-input" placeholder="Min price" value={filters.min_price} onChange={e => handleFilterChange('min_price', e.target.value)} />
          <input className="ui-input" placeholder="Max price" value={filters.max_price} onChange={e => handleFilterChange('max_price', e.target.value)} />
        </div>
        <div className="browse-filter-group">
          <Button size="sm" onClick={applyFilters}>Apply</Button>
          <Button size="sm" variant="secondary" onClick={clearFilters}>Clear</Button>
        </div>
      </div>

      {error && <ErrorMessage>{getApiError(error)}</ErrorMessage>}
      {isLoading && <p className="ui-empty-state">Loading…</p>}

      <div className="property-grid">
        {properties?.map(p => (
          <PropertyCard key={p.id} property={p} onClick={() => navigate(`/tenant/browse/${p.id}`)} />
        ))}
      </div>
      {!isLoading && properties?.length === 0 && (
        <p className="ui-empty-state">No properties match your filters.</p>
      )}
    </div>
  )
}
