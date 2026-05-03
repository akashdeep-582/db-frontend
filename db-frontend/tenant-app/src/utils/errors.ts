import axios from 'axios'

export function getApiError(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string })?.message ?? fallback
  }
  return fallback
}
