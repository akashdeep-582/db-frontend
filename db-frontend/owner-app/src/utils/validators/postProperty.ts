import type { PostPropertyFormFields, PostPropertyFormErrors } from '../../types/postProperty'

export function validatePostPropertyForm(f: PostPropertyFormFields): PostPropertyFormErrors {
  const e: PostPropertyFormErrors = {
    title: '', city: '', locality: '', address: '', price: '', type: '', furnished: '',
  }
  if (!f.title.trim()) e.title = 'Title is required'
  if (!f.city.trim()) e.city = 'City is required'
  if (!f.locality.trim()) e.locality = 'Locality is required'
  if (!f.address.trim()) e.address = 'Address is required'
  if (!f.price || Number(f.price) <= 0) e.price = 'Enter a valid price'
  if (!f.type) e.type = 'Select a property type'
  if (!f.furnished) e.furnished = 'Select furnished status'
  return e
}
