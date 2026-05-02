import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PropertyType, FurnishedStatus, CreatePropertyPayload } from '../types/property'
import type { PostPropertyFormFields, PostPropertyFormErrors } from '../types/postProperty'
import { validatePostPropertyForm } from '../utils/validators/postProperty'
import { useCreateProperty } from './useCreateProperty'
import { useUploadImages } from './useUploadImages'

const INITIAL_FORM: PostPropertyFormFields = {
  title: '', city: '', locality: '', address: '', price: '',
  type: '', furnished: '', description: '', areaSqft: '',
  floor: '', totalFloors: '', parking: false, availableFrom: '',
}

const INITIAL_ERRORS: PostPropertyFormErrors = {
  title: '', city: '', locality: '', address: '', price: '', type: '', furnished: '',
}

export function usePostPropertyForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<PostPropertyFormFields>(INITIAL_FORM)
  const [errors, setErrors] = useState<PostPropertyFormErrors>(INITIAL_ERRORS)
  const [images, setImages] = useState<File[]>([])

  const createMutation = useCreateProperty()
  const { uploadImages, isUploading } = useUploadImages()

  const isPending = createMutation.isPending || isUploading
  const error = createMutation.error

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  function setField<K extends keyof PostPropertyFormFields>(key: K, value: PostPropertyFormFields[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validatePostPropertyForm(form)
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) return

    const payload: CreatePropertyPayload = {
      title: form.title.trim(),
      city: form.city.trim(),
      locality: form.locality.trim(),
      address: form.address.trim(),
      price: Number(form.price),
      type: form.type as PropertyType,
      furnished: form.furnished as FurnishedStatus,
      parking: form.parking,
      ...(form.description && { description: form.description.trim() }),
      ...(form.areaSqft && { area_sqft: Number(form.areaSqft) }),
      ...(form.floor && { floor: Number(form.floor) }),
      ...(form.totalFloors && { total_floors: Number(form.totalFloors) }),
      ...(form.availableFrom && { available_from: form.availableFrom }),
    }

    try {
      const property = await createMutation.mutateAsync(payload)
      await uploadImages(property.id, images)
      navigate(`/owner/listings?created=${property.id}`)
    } catch {
      // error surfaced via createMutation.error
    }
  }

  return { form, errors, images, setImages, isPending, error, handleChange, handleSubmit, setField }
}
