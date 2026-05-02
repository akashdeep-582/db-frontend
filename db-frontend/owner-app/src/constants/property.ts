import type { ToggleOption } from '@dropbroker/ui'

export const PROPERTY_TYPE_OPTIONS: ToggleOption[] = [
  { value: '1BHK', label: '1 BHK' },
  { value: '2BHK', label: '2 BHK' },
  { value: '3BHK', label: '3 BHK' },
  { value: 'Studio', label: 'Studio' },
  { value: 'Villa', label: 'Villa' },
]

export const FURNISHED_OPTIONS: ToggleOption[] = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi', label: 'Semi' },
  { value: 'unfurnished', label: 'Unfurnished' },
]
