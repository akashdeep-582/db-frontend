import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listAdminProperties, updatePropertyStatus } from '../services/admin.service'
import type { PropertyStatus } from '../types/admin'

export function useAdminListings() {
  return useQuery({
    queryKey: ['admin', 'properties'],
    queryFn: listAdminProperties,
  })
}

export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PropertyStatus }) =>
      updatePropertyStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] }),
  })
}
