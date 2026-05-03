import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listAdminUsers, updateUserStatus } from '../services/admin.service'
import type { UserStatus } from '../types/admin'

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: listAdminUsers,
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      updateUserStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}
