import { useMutation } from '@tanstack/react-query'
import { createProperty } from '../services/property.service'

export function useCreateProperty(onSuccess?: (id: string) => void) {
  return useMutation({
    mutationFn: createProperty,
    onSuccess: (property) => onSuccess?.(property.id),
  })
}
