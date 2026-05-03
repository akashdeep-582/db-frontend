import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listMyProperties, deleteProperty } from '../services/property.service'

export function useMyListings() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['owner', 'listings'],
    queryFn: listMyProperties,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['owner', 'listings'] }),
  })

  function handleDelete(id: string, title: string) {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(id)
    }
  }

  return {
    properties: query.data,
    isLoading: query.isLoading,
    error: query.error,
    handleDelete,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
