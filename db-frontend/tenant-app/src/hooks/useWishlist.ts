import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getWishlist, removeFromWishlist } from '../services/wishlist.service'

export function useWishlist() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist,
  })

  const removeMutation = useMutation({
    mutationFn: (propertyId: string) => removeFromWishlist(propertyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  return {
    items: query.data,
    isLoading: query.isLoading,
    error: query.error,
    removeItem: (propertyId: string) => removeMutation.mutate(propertyId),
    isRemoving: removeMutation.isPending,
  }
}
