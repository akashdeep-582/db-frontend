import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? '' })

api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('auth')
    const token = stored ? JSON.parse(stored)?.state?.token : null
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {
    // ignore
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('auth')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
