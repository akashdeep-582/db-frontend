import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const url = error.config?.url ?? ''
      // Only force-logout on 401s from protected endpoints.
      // Auth endpoints (/auth/*) return 401 for bad credentials — that's
      // a normal error the component handles, not a session expiry.
      if (status === 401 && !url.includes('/auth/')) {
        useAuthStore.getState().logout()
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export default api
