import { useMutation } from '@tanstack/react-query'
import { verify, resendCode } from '../services/auth.service'

export function useVerify(onSuccess?: () => void) {
  return useMutation({
    mutationFn: verify,
    onSuccess: () => onSuccess?.(),
  })
}

export function useResendCode() {
  return useMutation({ mutationFn: resendCode })
}
