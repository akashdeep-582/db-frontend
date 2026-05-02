import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth.service'
import useAuthStore from '../store/authStore'
import { getDefaultRoute } from '../utils/routes'

export function useLogin(onSuccess?: () => void) {
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      loginStore(data.token, data.user, data.role)
      onSuccess?.()
      navigate(getDefaultRoute(data.role))
    },
  })
}
