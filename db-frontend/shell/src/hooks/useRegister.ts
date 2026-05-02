import { useMutation } from '@tanstack/react-query'
import { register } from '../services/auth.service'

export function useRegister(onSuccess?: () => void) {
  return useMutation({
    mutationFn: register,
    onSuccess: () => onSuccess?.(),
  })
}
