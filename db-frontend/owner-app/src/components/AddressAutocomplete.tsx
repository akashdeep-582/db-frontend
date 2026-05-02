import { useRef } from 'react'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'

const LIBRARIES: ('places')[] = ['places']

export interface AddressResult {
  formattedAddress: string
  city: string
  locality: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  onSelect: (result: AddressResult) => void
  error?: string
}

export default function AddressAutocomplete({ value, onChange, onSelect, error }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
    libraries: LIBRARIES,
  })
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  if (!isLoaded) {
    return (
      <div className="ui-field">
        <label className="ui-field-label">Address</label>
        <input className="ui-field-input" placeholder="Loading…" disabled />
      </div>
    )
  }

  function handlePlaceChanged() {
    const place = autocompleteRef.current?.getPlace()
    if (!place?.address_components || !place.formatted_address) return

    let city = ''
    let locality = ''

    for (const component of place.address_components) {
      const types = component.types
      if (types.includes('locality')) city = component.long_name
      if (types.includes('sublocality_level_1') || types.includes('neighborhood'))
        locality = component.long_name
    }

    onChange(place.formatted_address)
    onSelect({ formattedAddress: place.formatted_address, city, locality })
  }

  return (
    <div className="ui-field">
      <label className="ui-field-label">Address</label>
      <Autocomplete
        onLoad={(a) => { autocompleteRef.current = a }}
        onPlaceChanged={handlePlaceChanged}
        options={{
          componentRestrictions: { country: 'in' },
          fields: ['address_components', 'formatted_address'],
        }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`ui-field-input${error ? ' ui-field-input--error' : ''}`}
          placeholder="Search full address…"
          type="text"
          autoComplete="off"
        />
      </Autocomplete>
      {error && <span className="ui-field-error">{error}</span>}
    </div>
  )
}
