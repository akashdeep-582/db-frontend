import { useQuery } from '@tanstack/react-query'
import { getVisits } from '../services/visit.service'

export function useMyVisits() {
  const query = useQuery({
    queryKey: ['visits'],
    queryFn: getVisits,
  })

  return {
    visits: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}
